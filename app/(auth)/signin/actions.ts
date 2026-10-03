"use server"

import { signIn } from "@/auth"
import { AuthError, CredentialsSignin } from "next-auth"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { db } from "@/lib/db"
import { users, userMfa, userPasskeys } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { isStaffRole } from "@/lib/auth/roles"
import { createMfaChallengeToken } from "@/lib/auth/mfa/challenge-token"
import { headers } from "next/headers"
import { allowCredentialAttempt } from "@/lib/auth/credential-rate-limit"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginActionResult =
  | { error: string; mfaRequired?: false }
  | {
      mfaRequired: true
      challengeToken: string
      methods: ("totp" | "passkey")[]
    }
  | undefined

export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<LoginActionResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const password = formData.get("password") as string

  const parsed = loginSchema.safeParse({ email, password })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 1. Check for E2E Test Bypass
  const isE2eBypass =
    process.env.NODE_ENV !== "production" &&
    process.env.E2E_TEST_BYPASS_ENABLED === "true" &&
    email.endsWith("@test.tacexpress.app") &&
    process.env.E2E_TEST_USER_PASSWORD &&
    password === process.env.E2E_TEST_USER_PASSWORD

  if (
    !isE2eBypass &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Apply credential rate limiting before calling Supabase authentication
    let headerList: Headers | undefined
    try {
      headerList = await headers()
    } catch {
      // Ignored when invoked outside Next.js request context (e.g. unit tests)
    }
    const syntheticReq = new Request("https://tacexpress.internal/signin", {
      headers: headerList,
    })

    try {
      await allowCredentialAttempt(syntheticReq, email)
    } catch (rateErr) {
      if (rateErr instanceof CredentialsSignin) {
        if (rateErr.code === "rate_limited") {
          return { error: "Too many sign-in attempts. Please try again later." }
        }
        if (rateErr.code === "protection_unavailable") {
          return {
            error: "Sign-in is temporarily unavailable. Please try again shortly.",
          }
        }
      }
      return { error: "Too many sign-in attempts. Please try again later." }
    }

    // 2. Pre-verify credentials against Supabase before issuing NextAuth session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return { error: "Invalid email or password." }
    }

    const userId = data.user.id

    // 3. Verify user exists in database and has staff authorization
    const dbUsers = await db.select().from(users).where(eq(users.id, userId))
    let dbUser = dbUsers[0]

    if (!dbUser) {
      const byEmail = await db.select().from(users).where(eq(users.email, email))
      dbUser = byEmail[0]
    }

    if (!dbUser || dbUser.deletedAt || !isStaffRole(dbUser.role)) {
      return { error: "Staff workspace access not provisioned for this account." }
    }

    // 4. Check for active MFA enrollment (TOTP or Passkeys)
    const mfaRecord = await db.query.userMfa.findFirst({
      where: eq(userMfa.userId, dbUser.id),
    })

    const passkeys = await db
      .select()
      .from(userPasskeys)
      .where(eq(userPasskeys.userId, dbUser.id))

    const hasTotp = Boolean(mfaRecord?.totpEnabled)
    const hasPasskey = passkeys.length > 0

    if (hasTotp || hasPasskey) {
      const methods: ("totp" | "passkey")[] = []
      if (hasPasskey) methods.push("passkey")
      if (hasTotp) methods.push("totp")

      const challengeToken = await createMfaChallengeToken({
        userId: dbUser.id,
        email: dbUser.email || email,
        role: dbUser.role || "staff",
        methods,
      })

      return {
        mfaRequired: true,
        challengeToken,
        methods,
      }
    }
  }

  // 5. If no MFA required, proceed with standard NextAuth credentials sign in
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      if (error.code === "rate_limited") {
        return { error: "Too many sign-in attempts. Please try again later." }
      }
      if (error.code === "protection_unavailable") {
        return {
          error:
            "Sign-in is temporarily unavailable. Please try again shortly.",
        }
      }
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "An unexpected error occurred." }
      }
    }
    throw error // Rethrow Next.js redirect errors
  }
}
