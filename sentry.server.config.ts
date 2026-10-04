// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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

  beforeSend(event) {
    const errorType = event.exception?.values?.[0]?.type ?? "";
    const errorValue = event.exception?.values?.[0]?.value ?? "";

    // Filter out client-side disconnects during SSR streaming
    if (
      errorValue.includes("The destination stream closed early") ||
      errorValue.includes("ECONNRESET")
    ) {
      return null;
    }

    // Filter out expected auth failures (wrong password/email)
    if (
      errorValue.includes("Invalid login credentials") ||
      errorType === "AuthApiError"
    ) {
      return null;
    }

    const url = event.request?.url ?? "";
    if (url.includes("/api/webhooks")) {
      event.tags = { ...event.tags, area: "webhooks" };
    } else if (url.includes("/dashboard/invoices")) {
      event.tags = { ...event.tags, area: "invoices" };
    } else if (url.includes("/dashboard/shipments")) {
      event.tags = { ...event.tags, area: "shipments" };
    } else if (url.includes("/dashboard")) {
      event.tags = { ...event.tags, area: "dashboard" };
    }

    if (errorValue.includes("Failed query")) {
      event.tags = { ...event.tags, type: "database" };
    }

    return event;
  },
});
