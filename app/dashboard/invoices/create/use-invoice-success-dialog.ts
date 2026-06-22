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
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isSending, startSend] = useTransition()
  const [whatsappSent, setWhatsappSent] = useState(false)

  useEffect(() => {
    if (open && !data) {
      setLoading(true)
      getInvoiceDetails({ shipmentId }).then((res) => {
        setData(res?.data ?? null)
        setLoading(false)
      })
    }
  }, [open, shipmentId, data])

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
          return "Invoice sent via WhatsApp!"
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
