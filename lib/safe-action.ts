import { createSafeActionClient } from "next-safe-action"
import * as Sentry from "@sentry/nextjs"

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    Sentry.captureException(e)
    return "An unexpected error occurred"
  },
})
