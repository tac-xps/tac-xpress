import arcjet, {
  createMiddleware,
  detectBot,
  shield,
  slidingWindow,
} from "@arcjet/next"
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
} from "next/server"
import NextAuth, { type Session } from "next-auth"
import { authConfig } from "@/auth.config"

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

  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isCustomerRoute =
    pathname.startsWith("/tracking") || pathname.startsWith("/contact")

  // 1. Unauthenticated Perimeter Protection
  if (!isLoggedIn && (isDashboardRoute || isCustomerRoute)) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl))
  }

  // 2. Authenticated Dashboard RBAC
  if (isLoggedIn && isDashboardRoute && userRole === "customer") {
    return NextResponse.redirect(new URL("/tracking", req.nextUrl))
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
    return NextResponse.redirect(new URL("/tracking", req.nextUrl))
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-invoke-path", pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

const authMiddleware = auth(
  handleAuthenticatedRequest
) as unknown as NextMiddleware

const ajMiddleware = createMiddleware(aj, authMiddleware)

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

  // Only allow bypass when the signing secret is properly configured
  if (
    process.env.INVOICE_PDF_SIGNING_SECRET &&
    request.nextUrl.pathname.startsWith("/invoice/")
  ) {
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(process.env.INVOICE_PDF_SIGNING_SECRET)
    )
    const expectedBypassToken = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    if (request.headers.get("x-puppeteer-bypass") === expectedBypassToken) {
      return authMiddleware(request, event)
    }
  }

  // Bypass Arcjet entirely in local development if no real key is provided
  if (
    process.env.NODE_ENV === "development" &&
    (!process.env.ARCJET_KEY || process.env.ARCJET_KEY === "ajkey_placeholder")
  ) {
    // Manually invoke the NextAuth wrapper when skipping Arcjet
    return authMiddleware(request, event)
  }

  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.ARCJET_KEY || process.env.ARCJET_KEY === "ajkey_placeholder")
  ) {
    return NextResponse.json(
      { error: "Security perimeter is not configured." },
      { status: 503 }
    )
  }

  // Next.js Server Actions pass a "Next-Action" header.
  // Arcjet Shield in middleware may fail to parse large multipart/form-data bodies from Server Actions.
  // We bypass the global Arcjet middleware for these to prevent ERRORs.
  if (request.method === "POST" && request.headers.has("next-action")) {
    return authMiddleware(request, event)
  }

  return ajMiddleware(request, event)
}

export const config = {
  matcher: [
    // Exclude auth, cron, webhooks, public API routes, and Next.js internals from middleware
    "/((?!api/auth|api/cron|api/webhooks|api/public|_next/static|_next/image|favicon.ico|monitoring).*)",
  ],
}
