import { describe, it, expect, vi, beforeEach } from "vitest"

const { sentryCapture, posthogCapture } = vi.hoisted(() => ({
  sentryCapture: vi.fn(),
  posthogCapture: vi.fn(),
}))
vi.mock("@sentry/nextjs", () => ({ captureException: sentryCapture }))
vi.mock("posthog-js", () => ({ default: { captureException: posthogCapture } }))

import {
  captureWizardError,
  InvoiceWizardError,
} from "../app/dashboard/invoices/create/capture-wizard-error"

describe("captureWizardError", () => {
  beforeEach(() => {
    sentryCapture.mockClear()
    posthogCapture.mockClear()
  })

  it("wraps a returned error message in a typed exception", () => {
    captureWizardError("submit_rejected", "Failed to create invoice")
    const [exception, properties] = posthogCapture.mock.calls[0]
    expect(exception).toBeInstanceOf(InvoiceWizardError)
    expect(exception.name).toBe("InvoiceWizardError")
    expect(exception.message).toBe(
      "Invoice wizard submit_rejected failed: Failed to create invoice"
    )
    expect(properties).toEqual({ invoice_wizard_error_type: "submit_rejected" })
    expect(sentryCapture).toHaveBeenCalledWith(exception, {
      tags: { invoice_wizard_error: "submit_rejected" },
      extra: {},
    })
  })

  it("sends a thrown error as is, with the extra properties", () => {
    const thrown = new TypeError("Failed to fetch")
    captureWizardError("customer_create", thrown, { customer_role: "consignee" })
    expect(posthogCapture).toHaveBeenCalledWith(thrown, {
      invoice_wizard_error_type: "customer_create",
      customer_role: "consignee",
    })
  })

  it("keeps auth messages out of error tracking", () => {
    captureWizardError(
      "pincode_lookup",
      "You do not have permission to perform this action."
    )
    expect(posthogCapture).not.toHaveBeenCalled()
    expect(sentryCapture).not.toHaveBeenCalled()
  })
})
