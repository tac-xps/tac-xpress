// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Integrations
  integrations: [
    Sentry.replayIntegration(),

    Sentry.browserTracingIntegration(),
  ],

  // Tracing — 100% in dev, lower in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // Session Replay — capture 10% of sessions, 100% on error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Structured logs
  enableLogs: true,

  // AI telemetry — stream gen_ai spans as standalone items
  streamGenAiSpans: true,

  // PII — enables prompt/response capture for AI Conversations view
  sendDefaultPii: true,

  // Environment & release tagging
  environment: process.env.NODE_ENV ?? "development",
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
