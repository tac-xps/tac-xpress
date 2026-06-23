import { createClient } from "@supabase/supabase-js"
import { jwtVerify, SignJWT } from "jose"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || ""
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const CAPABILITY_SECRET = Deno.env.get("CAPABILITY_SECRET")
if (!CAPABILITY_SECRET) throw new Error("Missing CAPABILITY_SECRET")

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function evaluateCapabilities(userId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single()

  if (!user) {
    return { capabilities: [], role: null }
  }

  const capabilities: string[] = ["org:member"]

  if (user.role === "manager")
    capabilities.push("org:manager", "warehouse:manager")
  if (user.role === "admin")
    capabilities.push("org:admin", "org:manager", "warehouse:manager")
  if (user.role === "operator") capabilities.push("warehouse:operator")

  const { data: ownedShipments } = await supabase
    .from("shipments")
    .select("id")
    .eq("created_by", userId)

  const ownershipCapabilities =
    ownedShipments?.map((s: { id: string }) => `shipment:${s.id}:owner`) || []

  return {
    capabilities: [...capabilities, ...ownershipCapabilities],
    userId,
    role: user.role,
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) throw new Error("Missing Authorization header")

    const token = authHeader.replace("Bearer ", "")

    // We will normally verify NextAuth JWT here, but for now we decode it or use Supabase session
    // This expects the token to be verifiable by CAPABILITY_SECRET or Supabase JWT secret
    const JWT_SECRET = Deno.env.get("SUPABASE_JWT_SECRET")
    if (!JWT_SECRET) throw new Error("Missing SUPABASE_JWT_SECRET")
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )

    const userId = payload.sub as string

    if (!userId) throw new Error("Invalid session payload")

    const { capabilities, role } = await evaluateCapabilities(userId)

    const capabilityToken = await new SignJWT({
      capabilities,
      user_id: userId,
      role,
      iat: Math.floor(Date.now() / 1000),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("5m")
      .sign(new TextEncoder().encode(CAPABILITY_SECRET))

    return new Response(
      JSON.stringify({
        capabilities,
        token: capabilityToken,
        role,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 401,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })
  }
})
