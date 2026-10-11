import * as Sentry from "@sentry/nextjs"
import { EventEmitter } from "events"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")

    // The default EventEmitter max listeners is 10. A single slow HTTP
    // response (Sentry transaction, NextAuth JWT, abort signal, etc.)
    // can accumulate >10 `close` listeners before the request resolves,
    // triggering a spurious MaxListenersExceededWarning. 25 covers the
    // worst-case burst while still surfacing genuine leaks at higher counts.
    EventEmitter.defaultMaxListeners = 50
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}

export const onRequestError = Sentry.captureRequestError
