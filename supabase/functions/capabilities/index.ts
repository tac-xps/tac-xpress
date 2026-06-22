import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { jwtVerify, SignJWT } from "https://esm.sh/jose@5"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || ""
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const CAPABILITY_SECRET =
  Deno.env.get("CAPABILITY_SECRET") || "local-dev-capability-secret"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function evaluateCapabilities(userId: string, orgId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("role, org_id")
    .eq("id", userId)
    .single()

  if (!user || user.org_id !== orgId) {
    return { capabilities: [], orgId: null, role: null }
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
    ownedShipments?.map((s: any) => `shipment:${s.id}:owner`) || []

  return {
    capabilities: [...capabilities, ...ownershipCapabilities],
    orgId: user.org_id,
    userId,
    role: user.role,
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) throw new Error("Missing Authorization header")

    const token = authHeader.replace("Bearer ", "")

    // We will normally verify NextAuth JWT here, but for now we decode it or use Supabase session
    // This expects the token to be verifiable by CAPABILITY_SECRET or Supabase JWT secret
    const JWT_SECRET = Deno.env.get("SUPABASE_JWT_SECRET") || CAPABILITY_SECRET
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )

    const userId = payload.sub as string
    const orgId = payload.org_id as string

    if (!userId || !orgId) throw new Error("Invalid session payload")

    const { capabilities, role } = await evaluateCapabilities(userId, orgId)

    const capabilityToken = await new SignJWT({
      capabilities,
      org_id: orgId,
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
        orgId,
        role,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
})
