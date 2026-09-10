import { createSafeActionClient } from "next-safe-action"
import * as Sentry from "@sentry/nextjs"
import { requireDashboardAction } from "./auth/guards"

export const actionClient = createSafeActionClient({
  handleServerError(e) {
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
