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

function buildAuthRequest(req: NextRequest): Request {
  return new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    // @ts-expect-error - duplex is needed for streaming body in Node.js
    duplex: req.method !== "GET" && req.method !== "HEAD" ? "half" : undefined,
  })
}

function createAuthRouteErrorResponse(method: "GET" | "POST", error: unknown) {
  Sentry.captureException(error, {
    tags: {
      area: "auth_route",
      method,
    },
  })

  return NextResponse.json(
    { error: "Authentication service unavailable" },
    { status: 500 }
  )
}

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
