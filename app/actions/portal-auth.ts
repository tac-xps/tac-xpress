"use server"

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { supabasePublic } from "@/lib/supabase/clients"
import { redirect } from "next/navigation"

function getPortalSessionSecret() {
  if (process.env.PORTAL_SESSION_SECRET) {
    return process.env.PORTAL_SESSION_SECRET
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing PORTAL_SESSION_SECRET")
  }

  return "local-portal-session-secret"
}

function getSecretKey() {
  return new TextEncoder().encode(getPortalSessionSecret())
}

// CTO condition: 24-hour sessions (down from 7 days). Freight data is sensitive.
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours
const SESSION_DURATION_STR = "24h"

import arcjet, { slidingWindow } from "@arcjet/next"

const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  characteristics: ["ip.src", "email"],
  rules: [
    slidingWindow({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
      interval: "15m",
      max: 5,
    }),
  ],
})

async function checkRateLimit(email: string) {
  const req = new Request(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", { headers: await cookies().then(() => headers()) })
  const decision = await aj.protect(req, { email: email.toLowerCase() })
  return { allowed: !decision.isDenied() }
}

export type PortalSessionPayload = {
  email: string
  awb_number: string
  expiresAt: number
}

export async function createPortalSession(email: string, awb: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  const payload: PortalSessionPayload = {
    email,
    awb_number: awb,
    expiresAt: expiresAt.getTime(),
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION_STR)
    .sign(getSecretKey())

  const cookieStore = await cookies()
  cookieStore.set("portal_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
}

export async function verifyPortalSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("portal_session")?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as PortalSessionPayload
  } catch {
    return null
  }
}

export async function deletePortalSession() {
  const cookieStore = await cookies()
  // Overwrite with expired cookie + cache-control so browser purges immediately
  cookieStore.set("portal_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export async function logoutPortal() {
  await deletePortalSession()
  redirect("/portal")
}

export async function authenticatePortalAccess(formData: FormData) {
  const awb = (formData.get("awb_number") as string)?.trim()
  const email = (formData.get("email") as string)?.trim().toLowerCase()

  if (!awb || !email) {
    return { error: "AWB Number and Email are required" }
  }

  // CTO condition: rate limit before hitting the database
  const { allowed } = await checkRateLimit(email)
  if (!allowed) {
    return {
      error: "Too many attempts. Please try again in 15 minutes.",
    }
  }

  // Verify the AWB matches the email in Supabase.
  // We intentionally return identical error messages for "not found" and "email mismatch"
  // to prevent email/AWB enumeration (CTO requirement).
  const { data: shipment, error } = await supabasePublic
    .from("shipments")
    .select("id, awb_number, customer_email")
    .eq("awb_number", awb.toUpperCase())
    .single()

  if (error || !shipment || shipment.customer_email?.toLowerCase() !== email) {
    return {
      error: "No shipment found matching that AWB and Email combination",
    }
  }

  await createPortalSession(email, awb.toUpperCase())
  return { success: true }
}
