import { handlers } from "@/auth"
import * as Sentry from "@sentry/nextjs"
import { NextRequest, NextResponse } from "next/server"

// Next.js 16 + Turbopack: req.nextUrl has a different internal representation that
// causes @auth/core to fail to resolve the action segment (e.g. /session, /providers)
// from the URL pathname, returning a Next.js 404 HTML page instead of JSON.
//
// Fix: reconstruct a plain Request from req.url (the raw string URL, not req.nextUrl)
// so that @auth/core's URL parsing works correctly.
//
// See: https://github.com/nextauthjs/next-auth/issues/10568

/**
 * Normalizes a NextRequest into a standard Fetch API Request using the raw URL string.
 * This circumvents Next.js 16 App Router / Turbopack nextUrl segmentation quirks in @auth/core.
 *
 * @param req - Incoming Next.js request.
 * @returns Standard fetch Request compatible with NextAuth handlers.
 */
function buildAuthRequest(req: NextRequest): Request {
  return new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    // @ts-expect-error - duplex is needed for streaming body in Node.js
    duplex: req.method !== "GET" && req.method !== "HEAD" ? "half" : undefined,
  })
}

/**
 * Logs authentication routing exceptions to Sentry and produces standardized HTTP 500 error responses.
 *
 * @param method - The HTTP method ("GET" or "POST").
 * @param error - The captured exception.
 * @returns JSON error response.
 */
function createAuthRouteErrorResponse(method: "GET" | "POST", error: unknown) {
  Sentry.captureException(error, {
    tags: {
      area: "auth_route",
      method,
    },
  })

  // For GET, return valid JSON (null body) so client useSession/getSession
  // does not crash with ClientFetchError or invalid JSON parsing error,
  // but use 500 status so monitoring catches the failure.
  if (method === "GET") {
    return NextResponse.json(null, { status: 500 })
  }

  return NextResponse.json(
    { error: "Authentication service unavailable" },
    { status: 500 }
  )
}

/**
 * Handles incoming Auth.js GET requests including session verification and CSRF token retrieval.
 *
 * @param req - Incoming NextRequest.
 * @param props - Next.js route segment props with asynchronous params.
 * @returns Response from NextAuth or HTTP 500 error response.
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    // Await params to satisfy Next.js 16's async params contract,
    // then pass a clean Request to bypass Turbopack's nextUrl quirk.
    await props.params
    return await (handlers.GET as any)(buildAuthRequest(req))
  } catch (error) {
    return createAuthRouteErrorResponse("GET", error)
  }
}

/**
 * Handles incoming Auth.js POST requests including credentials authentication and signout.
 *
 * @param req - Incoming NextRequest.
 * @param props - Next.js route segment props with asynchronous params.
 * @returns Response from NextAuth or HTTP 500 error response.
 */
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    await props.params
    return await (handlers.POST as any)(buildAuthRequest(req))
  } catch (error) {
    return createAuthRouteErrorResponse("POST", error)
  }
}
