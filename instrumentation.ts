import { EventEmitter } from "events"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // The default EventEmitter max listeners is 10. A single slow HTTP
    // response can accumulate listeners before resolving.
    EventEmitter.defaultMaxListeners = 50
  }

  // Avoid bundling and running Sentry auto-instrumentation in dev unless opted in
  if (process.env.NODE_ENV === "production" || process.env.SENTRY_DEV_ENABLE === "true") {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("./sentry.server.config")
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("./sentry.edge.config")
    }
  }
}

export const onRequestError = async (
  err: unknown,
  request: unknown,
  context: unknown
) => {
  if (process.env.NODE_ENV === "production" || process.env.SENTRY_DEV_ENABLE === "true") {
    const { captureRequestError } = await import("@sentry/nextjs")
    return captureRequestError(err as any, request as any, context as any)
  }
}
