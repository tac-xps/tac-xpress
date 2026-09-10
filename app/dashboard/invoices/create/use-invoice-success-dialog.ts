import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getInvoiceDetails, sendInvoiceViaWhatsApp } from "../actions"

export function useInvoiceSuccessDialog({
  shipmentId,
  invoiceId,
  consignorPhone,
  open,
  onOpenChange,
}: {
  shipmentId: string
  invoiceId: string
  consignorPhone?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [result, setResult] = useState<{ id: string; value: any } | null>(null)
  const data = result?.id === shipmentId ? result.value : null
  const loading = open && result?.id !== shipmentId
  const [isSending, startSend] = useTransition()
  const [whatsappSent, setWhatsappSent] = useState(false)

  useEffect(() => {
    if (!open) return
    let current = true
    getInvoiceDetails({ shipmentId }).then(res => {
      if (current) setResult({ id: shipmentId, value: res?.data ?? null })
    }).catch(() => {
      if (current) { setResult({ id: shipmentId, value: null }); toast.error("Invoice details could not be loaded.") }
    })
    return () => { current = false }
  }, [open, shipmentId])

  const handleClose = () => {
    onOpenChange(false)
    router.push("/dashboard/invoices")
  }

  const handleSendWhatsApp = () => {
    const phone = consignorPhone || data?.shipment?.consignorPhone
    if (!phone) {
      toast.error("No phone number available for the consignor.")
      return
    }
    startSend(async () => {
      const sendPromise = sendInvoiceViaWhatsApp({ invoiceId, phone }).then(
        (result) => {
          const actionData = result?.data
          if (!actionData?.success) {
            const actionError =
              actionData && "error" in actionData ? actionData.error : undefined
            throw new Error(
              actionError ||
                result?.serverError ||
                "Failed to send WhatsApp message"
            )
          }
          return actionData
        }
      )

      toast.promise(sendPromise, {
        loading: "Sending invoice via WhatsApp...",
        success: () => {
          setWhatsappSent(true)
          return "Invoice accepted by WhatsApp provider."
        },
        error: (err) => err.message,
      })

      try {
        await sendPromise
      } catch (e) {
        // error is handled by toast
      }
    })
  }

  return {
    data,
    loading,
    isSending,
    whatsappSent,
    handleClose,
    handleSendWhatsApp,
  }
}
