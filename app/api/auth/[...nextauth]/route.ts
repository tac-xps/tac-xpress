import { handlers } from "@/auth"
import * as Sentry from "@sentry/nextjs"
import { NextRequest, NextResponse } from "next/server"

// Next.js 16 passes `params` as a Promise in `props`. NextAuth v5 beta.31 evaluates it synchronously,
// causing it to fail to resolve the action (like /session) and returning a 404 HTML page.
// We must await the params first and pass a synchronous object to NextAuth.

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
    const params = await props.params
    return await (handlers.GET as any)(req, { params })
  } catch (error) {
    return createAuthRouteErrorResponse("GET", error)
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    const params = await props.params
    return await (handlers.POST as any)(req, { params })
  } catch (error) {
    return createAuthRouteErrorResponse("POST", error)
  }
}
