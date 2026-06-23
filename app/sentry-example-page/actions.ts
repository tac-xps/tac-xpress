"use server";

import * as Sentry from "@sentry/nextjs";

class SentryExampleServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SentryExampleServerActionError";
  }
}

export async function testSentryServerAction() {
  Sentry.logger.info("Sentry example server action called");
  throw new SentryExampleServerActionError("This error is raised inside a Next.js Server Action.");
}
