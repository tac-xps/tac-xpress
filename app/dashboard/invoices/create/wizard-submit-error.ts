// Classifies the `onError` payload of `createWizardInvoiceAction` into a toast
// message and a cause. An empty `serverError` does not mean an unknown error:
// it can be a schema validation failure or an error thrown on the client.

import { isAuthErrorMessage } from "@/lib/auth/auth-error-message"
import { firstValidationMessage } from "../send-invoice-result"

export type WizardSubmitError = {
  serverError?: string
  validationErrors?: unknown
  thrownError?: Error
}

export type WizardSubmitErrorCause =
  | "auth"
  | "server"
  | "validation"
  | "client"
  | "unknown"

const INVALID_INPUT_ERROR =
  "Some invoice details are not valid. Check each step and try again."
const CLIENT_ERROR =
  "We could not reach the server. Reload the page and try again."
const UNKNOWN_ERROR = "The invoice was not created. Please try again."

function invalidFields(errors: unknown): string[] {
  if (!errors || typeof errors !== "object") {
    return []
  }
  return Object.keys(errors).filter((key) => key !== "_errors")
}

export function resolveWizardSubmitError(error: WizardSubmitError): {
  cause: WizardSubmitErrorCause
  message: string
  invalidFields: string[]
} {
  if (error.serverError) {
    return {
      cause: isAuthErrorMessage(error.serverError) ? "auth" : "server",
      message: error.serverError,
      invalidFields: [],
    }
  }
  if (error.validationErrors) {
    const fields = invalidFields(error.validationErrors)
    const detail = firstValidationMessage(error.validationErrors)
    return {
      cause: "validation",
      message: detail ? `${INVALID_INPUT_ERROR} (${detail})` : INVALID_INPUT_ERROR,
      invalidFields: fields,
    }
  }
  if (error.thrownError) {
    return { cause: "client", message: CLIENT_ERROR, invalidFields: [] }
  }
  return { cause: "unknown", message: UNKNOWN_ERROR, invalidFields: [] }
}
