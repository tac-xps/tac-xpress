// Classifies the result of the `sendInvoiceViaWhatsApp` action into a single
// error message, or `null` when the send truly succeeded. A missing `data`, a
// `validationErrors` payload, a `fetchError`, or an empty result all count as
// failures — only `data.success === true` is treated as a real success.

export type SendInvoiceActionResult =
  | {
      data?: { success?: boolean; error?: string } | null
      serverError?: string
      validationErrors?: unknown
      fetchError?: string
    }
  | null
  | undefined

const GENERIC_SEND_ERROR = "Failed to send WhatsApp message"
const UNREACHABLE_ERROR = "We could not reach the server. Please try again."
const INCOMPLETE_ERROR =
  "WhatsApp delivery did not complete. Please try again."
const INVALID_INPUT_ERROR =
  "Please check the invoice details and try again."

function firstValidationMessage(errors: unknown): string | undefined {
  if (!errors || typeof errors !== "object") {
    return undefined
  }

  // The formatted `validationErrors` shape is one level deep: a top-level
  // `_errors` array plus one `{ _errors }` object per field.
  for (const value of Object.values(errors as Record<string, unknown>)) {
    const list = Array.isArray(value)
      ? value
      : (value as { _errors?: unknown[] })?._errors
    if (Array.isArray(list) && typeof list[0] === "string") {
      return list[0]
    }
  }

  return undefined
}

export function resolveSendInvoiceError(
  res: SendInvoiceActionResult
): string | null {
  if (!res || res.fetchError) {
    return UNREACHABLE_ERROR
  }
  if (res.serverError) {
    return res.serverError
  }
  if (res.validationErrors) {
    return firstValidationMessage(res.validationErrors) || INVALID_INPUT_ERROR
  }
  if (!res.data) {
    return INCOMPLETE_ERROR
  }
  if (!res.data.success) {
    return res.data.error || GENERIC_SEND_ERROR
  }

  return null
}
