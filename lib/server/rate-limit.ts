import arcjet, { createRemoteClient, slidingWindow } from "@arcjet/next"
import * as Sentry from "@sentry/nextjs"

function createLimiter(max: number, interval: `${number}m` | `${number}h` | `${number}s` = "1m") {
  return arcjet({
    key: process.env.ARCJET_KEY || "ajkey_placeholder",
    client:
      typeof createRemoteClient === "function"
        ? createRemoteClient({ timeout: 2500 })
        : undefined,
    rules: [slidingWindow({ mode: "LIVE", interval, max })],
  })
}

// Public invoice PDF — Chromium render, keep strict (20/m per IP)
export const invoicePdfLimiter = createLimiter(20, "1m")
// Fleet telemetry POST — per-device updates
export const fleetTelemetryLimiter = createLimiter(60, "1m")
// WhatsApp / Carrier webhooks — HMAC verified but still rate limited (sized for provider bursts)
export const webhookLimiter = createLimiter(600, "1m")

export function isArcjetBypassed(): boolean {
  return (
    (process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test" ||
      process.env.E2E_TEST_BYPASS_ENABLED === "true") &&
    (!process.env.ARCJET_KEY ||
      /placeholder|dummy|example|invalid/i.test(process.env.ARCJET_KEY))
  )
}

function isArcjetMisconfigured(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    (!process.env.ARCJET_KEY || /placeholder|dummy|example/i.test(process.env.ARCJET_KEY))
  )
}

export async function enforceRateLimit(
  request: Request,
  limiter: ReturnType<typeof createLimiter>,
  area: string
): Promise<Response | null> {
  if (isArcjetBypassed()) return null
  if (isArcjetMisconfigured()) {
    return Response.json({ error: "Security perimeter is not configured." }, { status: 503 })
  }
  try {
    const decision = await limiter.protect(request)
    if (decision.isDenied()) {
      const rateLimited = decision.reason.isRateLimit()
      return Response.json(
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
    if (decision.isErrored() || decision.results.some((r) => r.conclusion === "ERROR")) {
      const reasonMessage =
        decision.reason && typeof decision.reason === "object" && "message" in decision.reason
          ? String((decision.reason as { message?: unknown }).message ?? "")
          : ""
      const isTransientTimeout =
        reasonMessage.includes("deadline_exceeded") ||
        reasonMessage.includes("timed out") ||
        reasonMessage.includes("timeout")

      if (isTransientTimeout) {
        Sentry.captureMessage("Rate-limit protection timed out; failing open", {
          level: "warning",
          tags: { area },
          extra: { decisionId: decision.id, reason: reasonMessage },
        })
        return null
      }

      Sentry.captureMessage("Rate-limit protection could not complete", {
        level: "error",
        tags: { area },
        extra: { decisionId: decision.id },
      })
      return Response.json(
        { error: "Request protection is temporarily unavailable." },
        { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "30" } }
      )
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    const isTransientTimeout =
      errorMsg.includes("deadline_exceeded") ||
      errorMsg.includes("timed out") ||
      errorMsg.includes("timeout")

    if (isTransientTimeout) {
      Sentry.captureMessage("Rate-limit protection network timed out; failing open", {
        level: "warning",
        tags: { area },
        extra: { error: errorMsg },
      })
      return null
    }

    Sentry.captureException(error, { tags: { area } })
    return Response.json(
      { error: "Request protection is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "30" } }
    )
  }
  return null
}
