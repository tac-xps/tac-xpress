// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

const enableReplay = process.env.NEXT_PUBLIC_SENTRY_REPLAY_ENABLED === "true"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Tracing
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  tracePropagationTargets: ["localhost", /^\//],
  integrations: [
    Sentry.browserTracingIntegration(),
    ...(enableReplay
      ? [
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ]
      : []),
  ],

  // Replays — capture 10% of sessions, 100% of error sessions
  replaysSessionSampleRate: enableReplay ? 0.1 : 0,
  replaysOnErrorSampleRate: enableReplay ? 0.5 : 0,

  // Environment & release tagging
  environment: process.env.NODE_ENV ?? "development",

  beforeSend(event) {
    const url = event.request?.url ?? ""

    // --- Tag by feature area ---
    if (url.includes("/api/webhooks")) {
      event.tags = { ...event.tags, area: "webhooks" }
    } else if (url.includes("/dashboard/invoices")) {
      event.tags = { ...event.tags, area: "invoices" }
    } else if (url.includes("/dashboard/shipments")) {
      event.tags = { ...event.tags, area: "shipments" }
    } else if (url.includes("/dashboard/manifests")) {
      event.tags = { ...event.tags, area: "manifests" }
    } else if (url.includes("/dashboard/customers")) {
      event.tags = { ...event.tags, area: "customers" }
    } else if (url.includes("/dashboard/dispatch")) {
      event.tags = { ...event.tags, area: "dispatch" }
    } else if (url.includes("/dashboard/fleet")) {
      event.tags = { ...event.tags, area: "fleet" }
    } else if (url.includes("/dashboard/warehouse")) {
      event.tags = { ...event.tags, area: "warehouse" }
    } else if (url.includes("/dashboard")) {
      event.tags = { ...event.tags, area: "dashboard" }
    } else if (url.includes("/invoice")) {
      event.tags = { ...event.tags, area: "invoice" }
    } else if (url.includes("/track")) {
      event.tags = { ...event.tags, area: "tracking" }
    } else if (url.includes("/signin") || url.includes("/api/auth")) {
      event.tags = { ...event.tags, area: "auth" }
    }

    // --- Tag by error type ---
    const errorType = event.exception?.values?.[0]?.type ?? ""
    const errorValue = event.exception?.values?.[0]?.value ?? ""

    if (
      errorType.includes("ZodError") ||
      errorValue.includes("Zod") ||
      errorValue.includes("not a Zod schema")
    ) {
      event.tags = { ...event.tags, type: "validation" }
    } else if (errorType === "ReferenceError") {
      event.tags = { ...event.tags, type: "reference" }
    } else if (errorType === "TypeError") {
      event.tags = { ...event.tags, type: "type" }
    } else if (errorValue.includes("Failed query")) {
      event.tags = { ...event.tags, type: "database" }
    } else if (
      errorValue.includes("Unauthorized") ||
      errorValue.includes("CallbackRouteError")
    ) {
      event.tags = { ...event.tags, area: "auth", type: "auth" }
    }

    return event
  },
})
