import { createSafeActionClient } from "next-safe-action"
import * as Sentry from "@sentry/nextjs"
import { requireDashboardAction } from "./auth/guards"

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (
      e.message.includes("permission") ||
      e.message.includes("signed in") ||
      e.message.includes("Unauthorized") ||
      e.message.includes("Forbidden")
    ) {
      return e.message
    }
    Sentry.captureException(e)
    return "An unexpected error occurred"
  },
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) {
    throw new Error(authResult.response.error)
  }
  return next({ ctx: { session: authResult.session } })
})
