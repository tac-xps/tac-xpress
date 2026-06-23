"use server"

import { supabaseAdmin } from "@/lib/supabase/clients"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import * as Sentry from "@sentry/nextjs"

import arcjet, { slidingWindow } from "@arcjet/next"

const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  characteristics: ["email"], // Rate limit based on custom email characteristic
  rules: [
    slidingWindow({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
      interval: "15m",
      max: 3,
    }),
  ],
})

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "support@tac-xpress.app"

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

async function checkAuthEmailRateLimit(action: string, email: string) {
  const req = new Request(getAppUrl(), { headers: await headers() })
  const decision = await aj.protect(req, { email: `${action}:${email.toLowerCase()}` })
  return !decision.isDenied()
}

async function sendAuthLinkEmail({
  to,
  actionLink,
  intent,
}: {
  to: string
  actionLink: string
  intent: "register" | "login"
}) {
  if (!RESEND_API_KEY) {
    Sentry.captureMessage("RESEND_API_KEY missing for auth email", {
      level: "error",
      tags: { area: "auth", type: "email_config" },
    })
    return { error: "Unable to send the sign-in email. Please try again." }
  }

  const isRegister = intent === "register"
  const subject = isRegister
    ? "Finish creating your TAC-XPRESS account"
    : "Sign in to TAC-XPRESS"
  const cta = isRegister ? "Create Account" : "Sign In"
  const intro = isRegister
    ? "Use the secure link below to finish creating your TAC-XPRESS account."
    : "Use the secure link below to sign in to your TAC-XPRESS portal."

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        from: `TAC-XPRESS <${FROM_EMAIL}>`,
        to,
        subject,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h1 style="font-size:20px;margin:0 0 12px">TAC-XPRESS Portal</h1>
            <p>${intro}</p>
            <p>
              <a href="${actionLink}" style="display:inline-block;background:#111827;color:#fff;padding:10px 16px;text-decoration:none;font-weight:600">
                ${cta}
              </a>
            </p>
            <p style="font-size:12px;color:#6b7280">If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
        text: `${intro}\n\n${actionLink}\n\nIf you did not request this, you can safely ignore this email.`,
      }),
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "")
      Sentry.captureMessage("Auth email delivery failed", {
        level: "error",
        tags: { area: "auth", type: "email_delivery" },
        extra: { status: response.status, body: errorBody },
      })
      return { error: "Unable to send the sign-in email. Please try again." }
    }

    return { success: true }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "auth", type: "email_delivery_network_error" },
    })
    return { error: "Unable to send the sign-in email. Please try again." }
  }
}

// ---------------------------------------------------------------------------
// Registration (passwordless email)
// ---------------------------------------------------------------------------
export async function registerWithEmail(email: string, fullName: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName = fullName.trim()

  if (!normalizedEmail || !normalizedName) {
    return { error: "Email and full name are required." }
  }

  if (!(await checkAuthEmailRateLimit("register", normalizedEmail))) {
    return { error: "Too many requests. Please try again in 15 minutes." }
  }

  const appUrl = getAppUrl()
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "signup",
    email: normalizedEmail,
    password: crypto.randomUUID(),
    options: {
      redirectTo: `${appUrl}/auth/callback?next=/portal`,
      data: { full_name: normalizedName },
    },
  })

  if (error) {
    Sentry.captureException(error, {
      tags: { area: "auth", type: "signup_link_generation" },
    })
    return { error: "Unable to create a sign-in link. Please try again." }
  }

  if (data.user) {
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: data.user.id,
        full_name: normalizedName,
        email_notifications: true,
      })

    if (profileError) {
      Sentry.captureException(profileError, {
        tags: { area: "auth", type: "profile_upsert" },
      })
    }
  }

  const actionLink = data.properties?.action_link
  if (!actionLink) {
    Sentry.captureMessage("Supabase signup link missing action_link", {
      level: "error",
      tags: { area: "auth", type: "link_generation" },
    })
    return { error: "Unable to create a sign-in link. Please try again." }
  }

  const emailResult = await sendAuthLinkEmail({
    to: normalizedEmail,
    actionLink,
    intent: "register",
  })
  if (emailResult.error) return { error: emailResult.error }

  return {
    success: true,
    message:
      "Check your email. We sent you a secure link to finish signing in.",
  }
}

// ---------------------------------------------------------------------------
// Magic Link (passwordless login)
// ---------------------------------------------------------------------------
export async function sendMagicLink(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    return { error: "Email is required." }
  }

  if (!(await checkAuthEmailRateLimit("login", normalizedEmail))) {
    return { error: "Too many requests. Please try again in 15 minutes." }
  }

  const appUrl = getAppUrl()
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: normalizedEmail,
    options: { redirectTo: `${appUrl}/auth/callback?next=/portal` },
  })

  if (error) {
    Sentry.captureException(error, {
      tags: { area: "auth", type: "magic_link_generation" },
    })
    return { error: "Unable to create a sign-in link. Please try again." }
  }

  const actionLink = data.properties?.action_link
  if (!actionLink) {
    Sentry.captureMessage("Supabase magic link missing action_link", {
      level: "error",
      tags: { area: "auth", type: "link_generation" },
    })
    return { error: "Unable to create a sign-in link. Please try again." }
  }

  const emailResult = await sendAuthLinkEmail({
    to: normalizedEmail,
    actionLink,
    intent: "login",
  })
  if (emailResult.error) return { error: emailResult.error }

  return {
    success: true,
    message: "If this email is registered, a magic link is on the way.",
  }
}

// ---------------------------------------------------------------------------
// Get current user from session cookie
// ---------------------------------------------------------------------------
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("sb-access-token")?.value
  const refreshToken = cookieStore.get("sb-refresh-token")?.value

  if (!accessToken && !refreshToken) return null

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken)
    if (error || !user) return null
    return user
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Get user profile
// ---------------------------------------------------------------------------
export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) return null
  return data
}

// ---------------------------------------------------------------------------
// Logout (clears Supabase session cookies)
// ---------------------------------------------------------------------------
export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.set("sb-access-token", "", { maxAge: 0, path: "/" })
  cookieStore.set("sb-refresh-token", "", { maxAge: 0, path: "/" })
  redirect("/")
}
