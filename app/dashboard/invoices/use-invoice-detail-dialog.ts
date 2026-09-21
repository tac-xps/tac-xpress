import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import { deleteInvoiceAction, updateInvoiceAction } from "./actions"
import { useSendInvoiceWhatsApp } from "./use-send-invoice-whatsapp"
import { updateInvoiceSchema, type UpdateInvoiceValues } from "./validations"

export function useInvoiceDetailDialog(invoice: {
  id: string
  status: string
  amount: number
  advancePaid?: number | null
  customerPhone?: string | null
  consignorPhone?: string | null
  consigneePhone?: string | null
  pdfUrl?: string | null
}) {
  const [open, setOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { executeAsync: deleteInvoiceAsync, isExecuting: isDeleting } =
    useAction(deleteInvoiceAction, {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Invoice deleted")
          setOpen(false)
          setShowDeleteDialog(false)
        } else {
          const actionError = data && "error" in data ? data.error : undefined
          toast.error(actionError || "Failed to delete invoice")
          setShowDeleteDialog(false)
        }
      },
      onError: ({ error }) => {
        toast.error(error.serverError || "An unexpected error occurred")
        setShowDeleteDialog(false)
      },
    })

  const { sendInvoice, isSending } = useSendInvoiceWhatsApp()

  const { executeAsync: updateInvoiceAsync, isExecuting: isUpdating } =
    useAction(updateInvoiceAction, {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Invoice updated successfully")
          setOpen(false)
        } else {
          const actionError = data && "error" in data ? data.error : undefined
          toast.error(actionError || "Failed to update invoice")
        }
      },
      onError: ({ error }) => {
        toast.error(error.serverError || "An unexpected error occurred")
      },
    })

  const form = useForm<UpdateInvoiceValues>({
    resolver: zodResolver(updateInvoiceSchema as any),
    defaultValues: {
      id: invoice.id,
      status: invoice.status as "unpaid" | "paid",
      amount: invoice.amount / 100,
      advancePaid: (invoice.advancePaid || 0) / 100,
    },
  })

  const handleDelete = async () => {
    await deleteInvoiceAsync({ id: invoice.id })
  }

  const targetPhone =
    invoice.customerPhone || invoice.consignorPhone || invoice.consigneePhone

  const handleSend = async () => {
    if (invoice.status === "void") {
      toast.error(
        "Cannot dispatch WhatsApp invoice: this invoice has been voided. Re-issue an active invoice first."
      )
      return
    }
    if (!targetPhone) {
      toast.error("No phone number available for this customer or shipment.")
      return
    }
    sendInvoice({ invoiceId: invoice.id, phone: targetPhone })
  }

  const onSubmit = async (data: UpdateInvoiceValues) => {
    const amountInPaise = Math.round(data.amount * 100)
    const advanceInPaise = Math.round(data.advancePaid * 100)
    const balanceInPaise = amountInPaise - advanceInPaise

    const status = balanceInPaise <= 0 ? "paid" : "unpaid"

    await updateInvoiceAsync({
      id: data.id,
      amount: amountInPaise,
      advancePaid: advanceInPaise,
      balanceDue: balanceInPaise,
      status: status as "unpaid" | "paid",
    })
  }

  return {
    open,
    setOpen,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    isSending,
    isUpdating,
    form,
    handleDelete,
    handleSend,
    onSubmit,
  }
}
