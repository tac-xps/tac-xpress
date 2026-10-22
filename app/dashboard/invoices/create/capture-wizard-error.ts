// Sends an invoice wizard failure to Sentry and PostHog error tracking.
// `type` names the failing step, so each step groups as its own issue.
// Auth messages stay out of error tracking, as in `wizard-submit-error.ts`.

import * as Sentry from "@sentry/nextjs"
import posthog from "posthog-js"
import { isAuthErrorMessage } from "@/lib/auth/auth-error-message"

export type WizardErrorType =
  | "submit"
  | "submit_rejected"
  | "pincode_lookup"
  | "customer_create"
  | "invoice_details"

export class InvoiceWizardError extends Error {
  constructor(type: WizardErrorType, detail: string) {
    super(`Invoice wizard ${type} failed: ${detail}`)
    this.name = "InvoiceWizardError"
  }
}

export function captureWizardError(
  type: WizardErrorType,
  error: unknown,
  properties: Record<string, unknown> = {}
) {
  if (typeof error === "string" && isAuthErrorMessage(error)) {
    return
  }
  const exception =
    error instanceof Error
      ? error
      : new InvoiceWizardError(type, String(error || "no error detail"))
  Sentry.captureException(exception, {
    tags: { invoice_wizard_error: type },
    extra: properties,
  })
  posthog.captureException(exception, {
    invoice_wizard_error_type: type,
    ...properties,
  })
}
