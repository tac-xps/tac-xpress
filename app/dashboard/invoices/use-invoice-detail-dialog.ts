import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import {
  sendInvoiceViaWhatsApp,
  deleteInvoiceAction,
  updateInvoiceAction,
} from "./actions"
import { updateInvoiceSchema, type UpdateInvoiceValues } from "./validations"

export function useInvoiceDetailDialog(invoice: {
  id: string
  status: string
  amount: number
  advancePaid?: number | null
  customerPhone?: string | null
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

  const { executeAsync: sendInvoiceAsync, isExecuting: isSending } = useAction(
    sendInvoiceViaWhatsApp
  )

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

  const handleSend = async () => {
    if (!invoice.customerPhone) {
      toast.error("No phone number available for this customer.")
      return
    }
    const promise = sendInvoiceAsync({
      invoiceId: invoice.id,
      phone: invoice.customerPhone,
    }).then((res) => {
      if (res?.data && !res.data.success) {
        throw new Error(
          (res.data as any).error || "Failed to send WhatsApp message"
        )
      }
      if (res?.serverError) {
        throw new Error(res.serverError || "An unexpected error occurred")
      }
      return res
    })

    toast.promise(promise, {
      loading: "Sending invoice via WhatsApp...",
      success: "WhatsApp message sent successfully!",
      error: (err) => err.message,
    })
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
