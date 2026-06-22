import { supabaseAdmin } from "@/lib/supabase/clients"
import { headers } from "next/headers"

/**
 * Validates whether the current environment physically permits the E2E bypass.
 * Uses multiple independent environment-level guards.
 */
const isTestBypassEnabled = async () => {
  if (process.env.NODE_ENV === "production") return false

  // Guard 1: Explicit env var must be exactly 'true'
  if (process.env.E2E_TEST_BYPASS_ENABLED !== "true") return false

  // Guard 2: Secret must be present (prevents accidental enablement)
  if (!process.env.E2E_TEST_SECRET) return false

  // Guard 3: Must be in a test context OR local development
  // (Allows developers to test manually without TestSprite/Playwright)
  if (
    process.env.TEST_SPRITE_SESSION !== "active" &&
    process.env.PLAYWRIGHT_TEST !== "true" &&
    process.env.NODE_ENV !== "development"
  ) {
    return false
  }

  // Guard 6: IP Restriction - must be local loopback
  const headersList = await headers()
  const forwardedFor = headersList.get("x-forwarded-for")
  const ipAddress = forwardedFor
    ? (forwardedFor.split(",").pop()?.trim() ?? "127.0.0.1")
    : "127.0.0.1"

  if (
    ipAddress !== "127.0.0.1" &&
    ipAddress !== "::1" &&
    ipAddress !== "::ffff:127.0.0.1"
  ) {
    return false
  }

  return true
}

export async function e2eBypassSignIn(email: string, secret: string) {
  // 1. Evaluate environment & IP-level dead-code guards
  if (!(await isTestBypassEnabled())) {
    throw new Error("Authentication failed")
  }

  // 2. Guard 4: Validate the injected test secret
  if (secret !== process.env.E2E_TEST_SECRET) {
    throw new Error("Authentication failed")
  }

  // 3. Guard 5: Email must be a test-only domain
  if (!email.endsWith("@test.tacexpress.app")) {
    throw new Error("Authentication failed")
  }

  // 4. Real auth with pre-seeded password
  const testPassword = process.env.E2E_TEST_USER_PASSWORD
  if (!testPassword) {
    throw new Error("Test authentication not configured")
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.signInWithPassword({
      email,
      password: testPassword,
    })

  if (authError || !authData.session) {
    throw new Error("Authentication failed: " + authError?.message)
  }

  return authData.session
}
