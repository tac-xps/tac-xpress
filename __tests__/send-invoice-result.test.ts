import { describe, it, expect } from "vitest"
import { resolveSendInvoiceError } from "../app/dashboard/invoices/send-invoice-result"

describe("resolveSendInvoiceError", () => {
  it("returns null only for a real success", () => {
    expect(resolveSendInvoiceError({ data: { success: true } })).toBeNull()
  })

  it("treats a phone validation failure as a failure with its message", () => {
    expect(
      resolveSendInvoiceError({
        validationErrors: {
          phone: { _errors: ["Phone number is required"] },
        },
      })
    ).toBe("Phone number is required")
  })

  it("treats a missing data payload as a failure", () => {
    expect(resolveSendInvoiceError({})).not.toBeNull()
  })

  it("treats an empty result as a failure", () => {
    expect(resolveSendInvoiceError(undefined)).not.toBeNull()
    expect(resolveSendInvoiceError(null)).not.toBeNull()
  })

  it("surfaces the server error", () => {
    expect(
      resolveSendInvoiceError({ serverError: "An unexpected error occurred" })
    ).toBe("An unexpected error occurred")
  })

  it("surfaces the action error message", () => {
    expect(
      resolveSendInvoiceError({
        data: { success: false, error: "WhatsApp delivery is currently disabled." },
      })
    ).toBe("WhatsApp delivery is currently disabled.")
  })

  it("treats a fetch error as unreachable", () => {
    expect(
      resolveSendInvoiceError({ fetchError: "Failed to fetch" })
    ).not.toBeNull()
  })
})
