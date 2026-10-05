import { describe, it, expect } from "vitest"
import { resolveWizardSubmitError } from "../app/dashboard/invoices/create/wizard-submit-error"

describe("resolveWizardSubmitError", () => {
  it("shows the first schema message and lists the invalid fields", () => {
    const result = resolveWizardSubmitError({
      validationErrors: {
        _errors: [],
        consignorName: { _errors: ["Name must be at least 3 characters"] },
        weightKg: { _errors: ["Weight must be positive"] },
      },
    })
    expect(result.cause).toBe("validation")
    expect(result.message).toContain("Name must be at least 3 characters")
    expect(result.message).not.toBe("An unexpected error occurred")
    expect(result.invalidFields).toEqual(["consignorName", "weightKg"])
  })

  it("shows a reload message for an error thrown on the client", () => {
    const result = resolveWizardSubmitError({
      thrownError: new Error("Failed to fetch"),
    })
    expect(result.cause).toBe("client")
    expect(result.message).toMatch(/reload the page/i)
  })

  it("passes auth messages through and marks them as auth", () => {
    const serverError = "You do not have permission to perform this action."
    expect(resolveWizardSubmitError({ serverError })).toEqual({
      cause: "auth",
      message: serverError,
      invalidFields: [],
    })
  })

  it("marks other server errors as server", () => {
    const result = resolveWizardSubmitError({
      serverError: "An unexpected error occurred",
    })
    expect(result.cause).toBe("server")
  })

  it("does not use the generic server text for an empty payload", () => {
    const result = resolveWizardSubmitError({})
    expect(result.cause).toBe("unknown")
    expect(result.message).not.toBe("An unexpected error occurred")
  })
})
