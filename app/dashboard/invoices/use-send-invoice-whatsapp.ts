import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"

import { sendInvoiceViaWhatsApp } from "./actions"
import { resolveSendInvoiceError } from "./send-invoice-result"

// Single client-side entry point for sending an invoice over WhatsApp. Every
// caller shares the same result handling, so a validation failure or an empty
// result surfaces the real reason instead of a false "sent" toast.
export function useSendInvoiceWhatsApp(options?: {
  successMessage?: string
  onSuccess?: () => void
}) {
  const { executeAsync, isExecuting } = useAction(sendInvoiceViaWhatsApp)

  const sendInvoice = ({
    invoiceId,
    phone,
  }: {
    invoiceId: string
    phone: string
  }) => {
    const promise = executeAsync({ invoiceId, phone }).then((res) => {
      const error = resolveSendInvoiceError(res)
      if (error) {
        throw new Error(error)
      }
      return res
    })

    toast.promise(promise, {
      loading: "Sending invoice via WhatsApp...",
      success: () => {
        options?.onSuccess?.()
        return options?.successMessage ?? "WhatsApp message sent successfully!"
      },
      error: (err) =>
        err instanceof Error ? err.message : "Failed to send WhatsApp message",
    })
  }

  return { sendInvoice, isSending: isExecuting }
}
