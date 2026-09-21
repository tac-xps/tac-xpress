import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/next"
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
} from "next/server"
import NextAuth, { type Session } from "next-auth"
import { authConfig } from "@/auth.config"
import { isStaffRole } from "@/lib/auth/roles"
import { verifyDocumentToken } from "@/lib/auth/document-token"
import * as Sentry from "@sentry/nextjs"

const { auth } = NextAuth(authConfig)

type AuthenticatedRequest = NextRequest & {
  auth: Session | null
}

export const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder", // Provide key in .env.local
  rules: [
    // Protect against common attacks (SQLi, XSS, etc)
    shield({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
    }),
    // Block automated clients/bots except search engines (disabled in dev to prevent missing user-agent errors)
    ...(process.env.NODE_ENV === "development"
      ? []
      : [
          detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE"],
          }),
        ]),
    // Rate limit to 100 requests per minute
    slidingWindow({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
      interval: "1m",
      max: 100,
    }),
  ],
})

// Wrap Arcjet around NextAuth
function handleAuthenticatedRequest(req: AuthenticatedRequest) {
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role || "customer"
  const pathname = req.nextUrl.pathname

  const isDashboardRoute = ["/dashboard", "/driver", "/portal"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  // 1. Unauthenticated Perimeter Protection
  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl))
  }

  // 2. Authenticated Dashboard RBAC
  if (isLoggedIn && isDashboardRoute && !isStaffRole(userRole)) {
    return NextResponse.redirect(
      new URL("/signin?reason=staff-only", req.nextUrl)
    )
  }

  // 3. Post-Login Redirection & Auth Route Locking
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/signin", req.nextUrl))
  }

  // Handle legacy onboarding routes explicitly at the edge, including typos!
  if (pathname.includes("onboading") || pathname.includes("onboarding")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  if (isLoggedIn && pathname === "/signin") {
    if (userRole === "admin" || userRole === "staff") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }
    // Non-staff sessions stay on sign-in, without a redirect loop.
  }

  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  })
}

const authMiddleware = auth(
  handleAuthenticatedRequest
) as unknown as NextMiddleware

// Multipart actions still need a rate limit even when Shield cannot parse a body.
const actionLimiter = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  rules: [slidingWindow({ mode: "LIVE", interval: "1m", max: 100 })],
})

function isSensitiveRequest(request: NextRequest) {
  return (
    !["GET", "HEAD"].includes(request.method) ||
    /^\/(?:api|dashboard|portal|driver|invoice)(?:\/|$)/.test(
      request.nextUrl.pathname
    )
  )
}

function protectionUnavailable() {
  return NextResponse.json(
    { error: "Request protection is temporarily unavailable." },
    {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "30" },
    }
  )
}

async function enforceRequestProtection(request: NextRequest) {
  const actionRequest =
    request.method === "POST" && request.headers.has("next-action")
  try {
    const decision = await (actionRequest ? actionLimiter : aj).protect(request)
    if (decision.isDenied()) {
      const rateLimited = decision.reason.isRateLimit()
      return NextResponse.json(
        { error: rateLimited ? "Too many requests." : "Request denied." },
        {
          status: rateLimited ? 429 : 403,
          headers: {
            "Cache-Control": "no-store",
            ...(rateLimited ? { "Retry-After": "60" } : {}),
          },
        }
      )
    }
    // The SDK considers ERROR allowed by default. Partial rule errors must not
    // silently bypass protection for private records or mutations either.
    if (
      decision.isErrored() ||
      decision.results.some((result) => result.conclusion === "ERROR")
    ) {
      Sentry.captureMessage("Request protection could not complete", {
        level: "error",
        tags: { area: "request_protection" },
        extra: { decisionId: decision.id },
      })
      if (isSensitiveRequest(request)) return protectionUnavailable()
    }
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "request_protection" } })
    if (isSensitiveRequest(request)) return protectionUnavailable()
  }
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  // Edge Block: Physically hide the test routes if bypass is not explicitly enabled
  if (request.nextUrl.pathname.startsWith("/e2e-auth")) {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.E2E_TEST_BYPASS_ENABLED !== "true"
    ) {
      return NextResponse.rewrite(new URL("/404", request.url))
    }
  }

  // Verified worker tokens bypass bot detection; document pages validate them again.
  const documentId = request.nextUrl.pathname.match(
    /^\/invoice\/([^/]+)(?:\/label)?$/
  )?.[1]
  if (
    documentId &&
    verifyDocumentToken(
      request.headers.get("x-internal-document-token"),
      documentId,
      "render"
    )
  )
    return authMiddleware(request, event)

  // Bypass Arcjet entirely in local development if no real key is provided
  if (
    process.env.NODE_ENV === "development" &&
    (!process.env.ARCJET_KEY ||
      /placeholder|dummy|example/i.test(process.env.ARCJET_KEY))
  ) {
    // Manually invoke the NextAuth wrapper when skipping Arcjet
    return authMiddleware(request, event)
  }

  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.ARCJET_KEY ||
      /placeholder|dummy|example/i.test(process.env.ARCJET_KEY))
  ) {
    return NextResponse.json(
      { error: "Security perimeter is not configured." },
      { status: 503 }
    )
  }

  const protectionResponse = await enforceRequestProtection(request)
  return protectionResponse ?? authMiddleware(request, event)
}

export const config = {
  matcher: [
    // Exclude auth, cron, webhooks, public API routes, PostHog ingest, and Next.js internals from middleware
    "/((?!api/auth|api/cron|api/webhooks|api/public|ingest|_next/static|_next/image|favicon.ico|monitoring).*)",
  ],
}
