import { handlers } from "@/auth"
import * as Sentry from "@sentry/nextjs"
import { NextRequest, NextResponse } from "next/server"

function createAuthRouteErrorResponse(method: "GET" | "POST", error: unknown) {
  Sentry.captureException(error, {
    tags: {
      area: "auth_route",
      method,
    },
  })

  return NextResponse.json(
    { message: "Authentication service unavailable" },
    { status: 500 }
  )
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    await props.params
    return await handlers.GET(req)
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
    return await handlers.POST(req)
  } catch (error) {
    return createAuthRouteErrorResponse("POST", error)
  }
}
