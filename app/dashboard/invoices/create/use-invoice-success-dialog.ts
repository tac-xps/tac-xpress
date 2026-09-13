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
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [whatsappSent, setWhatsappSent] = useState(false)
  const { sendInvoice, isSending } = useSendInvoiceWhatsApp({
    successMessage: "Invoice sent via WhatsApp!",
    onSuccess: () => setWhatsappSent(true),
  })

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
