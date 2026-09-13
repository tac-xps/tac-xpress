"use client"

import { Button } from "@/components/ui/button"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  RefreshCwIcon,
  SendIcon,
} from "lucide-react"
import { useSendInvoiceWhatsApp } from "./use-send-invoice-whatsapp"
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
  const { sendInvoice, isSending } = useSendInvoiceWhatsApp()

  const handleSend = async () => {
    if (!phone) {
      toast.error("No phone number available for this customer.")
      return
    }
    sendInvoice({ invoiceId, phone })
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
        disabled={isSending || status === "sent"}
        onClick={handleSend}
        aria-label={
          status === "sent"
            ? "Invoice already sent"
            : "Send invoice via WhatsApp"
        }
        title={status === "sent" ? "Already sent" : "Send via WhatsApp"}
      >
        {isSending ? (
          <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : status === "sent" ? (
          <CheckCircle2Icon className="text-success mr-2 h-4 w-4" />
        ) : status === "failed" ? (
          <AlertCircleIcon className="mr-2 h-4 w-4 text-destructive" />
        ) : (
          <SendIcon className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        )}
        <span className="md:not-sr-only">
          {isSending ? "Sending..." : "Send"}
        </span>
      </Button>
    </div>
  )
}
