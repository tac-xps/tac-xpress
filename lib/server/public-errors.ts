import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return typeof error === "string" ? error : "Unknown error"
}

export function capturePublicError(
  error: unknown,
  context: {
    area: string
    extras?: Record<string, unknown>
    level?: "error" | "warning" | "info"
  }
) {
  Sentry.captureException(error, {
    level: context.level ?? "error",
    tags: {
      area: context.area,
      surface: "public",
    },
    extra: context.extras,
  })
}

export function createPublicErrorResponse(
  message: string,
  status = 500,
  init?: ResponseInit
) {
  return NextResponse.json(
    { success: false, error: message },
    { ...init, status }
  )
}
