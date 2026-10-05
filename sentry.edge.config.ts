// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Tracing: sample 20% in production, 100% in development for debugging.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Do not send user PII by default; enable only for explicitly allowlisted events.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  ignoreErrors: [
    "The destination stream closed early.",
    "Invalid login credentials",
    "NEXT_REDIRECT",
    "NEXT_NOT_FOUND",
  ],
});
