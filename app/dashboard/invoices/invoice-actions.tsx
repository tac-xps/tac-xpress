"use client"

import { useAction } from "next-safe-action/hooks"
import { Button } from "@/components/ui/button"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  RefreshCwIcon,
  SendIcon,
} from "lucide-react"
import { sendInvoiceViaWhatsApp } from "./actions"
import { toast } from "sonner"
import Link from "next/link"
import { EyeIcon } from "lucide-react"

interface InvoiceActionsProps {
  invoiceId: string
  phone: string | null
  pdfUrl: string | null
  status: "pending" | "sent" | "failed"
}

export function InvoiceActions({
  invoiceId,
  phone,
  pdfUrl,
  status,
}: InvoiceActionsProps) {
  const { executeAsync, isExecuting } = useAction(sendInvoiceViaWhatsApp)

  const handleSend = async () => {
    if (!phone) {
      toast.error("No phone number available for this customer.")
      return
    }

    const promise = executeAsync({ invoiceId, phone }).then((res) => {
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

  return (
    <div className="flex items-center justify-end gap-2">
      {pdfUrl && (
        <Button
          aria-label="View invoice PDF"
          asChild
          size="sm"
          title="View invoice PDF"
          variant="outline"
        >
          <Link href={pdfUrl} rel="noreferrer" target="_blank">
            <EyeIcon className="h-4 w-4" />
            <span className="sr-only ml-2 md:not-sr-only">View</span>
          </Link>
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="group relative overflow-hidden"
        disabled={isExecuting || status === "sent"}
        onClick={handleSend}
        aria-label={
          status === "sent"
            ? "Invoice already sent"
            : "Send invoice via WhatsApp"
        }
        title={status === "sent" ? "Already sent" : "Send via WhatsApp"}
      >
        {isExecuting ? (
          <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : status === "sent" ? (
          <CheckCircle2Icon className="mr-2 h-4 w-4 text-success" />
        ) : status === "failed" ? (
          <AlertCircleIcon className="mr-2 h-4 w-4 text-destructive" />
        ) : (
          <SendIcon className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        )}
        <span className="md:not-sr-only">
          {isExecuting ? "Sending..." : "Send"}
        </span>
      </Button>
    </div>
  )
}
