import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getInvoiceDetails } from "../actions"
import { useSendInvoiceWhatsApp } from "../use-send-invoice-whatsapp"

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
  const [whatsappSent, setWhatsappSent] = useState(false)
  const { sendInvoice, isSending } = useSendInvoiceWhatsApp({
    successMessage: "Invoice sent via WhatsApp!",
    onSuccess: () => setWhatsappSent(true),
  })

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
    sendInvoice({ invoiceId, phone })
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
