"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Code,
  Copy,
  Check,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  CheckCheck,
} from "lucide-react"
import { toast } from "sonner"
import { RichTextRenderer } from "@/components/ui/rich-text-renderer"

export interface MessagePayloadData {
  id: string
  phone: string
  body?: string | null
  status: string
  templateName?: string | null
  templateLanguage?: string | null
  relatedAwb?: string | null
  relatedInvoiceId?: string | null
  failureReason?: string | null
  providerPayload?: unknown | null
  createdAt?: string | Date | null
}

interface MessagePayloadDialogProps {
  message: MessagePayloadData
}

export function MessagePayloadDialog({ message }: MessagePayloadDialogProps) {
  const [copiedPayload, setCopiedPayload] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const payloadString = message.providerPayload
    ? JSON.stringify(message.providerPayload, null, 2)
    : message.body
      ? JSON.stringify({ message: message.body, template: message.templateName }, null, 2)
      : null

  const copyPayload = async () => {
    if (!payloadString) return
    try {
      await navigator.clipboard.writeText(payloadString)
      setCopiedPayload(true)
      toast.success("Provider payload copied to clipboard")
      setTimeout(() => setCopiedPayload(false), 2000)
    } catch {
      toast.error("Failed to copy payload")
    }
  }

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(label)
      toast.success(`${label} copied`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`)
    }
  }

  const formattedDate = message.createdAt
    ? new Date(message.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge
            variant="outline"
            className="border-success/30 bg-success/10 text-success font-mono text-xs gap-1.5"
          >
            <span className="size-1.5 rounded-none bg-success animate-pulse" />
            Provider Accepted
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="delivered" className="font-mono text-xs gap-1.5">
            <CheckCircle2 className="size-3" />
            Delivered
          </Badge>
        )
      case "read":
        return (
          <Badge variant="secondary" className="font-mono text-xs gap-1.5">
            <CheckCheck className="size-3 text-info" />
            Read
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="font-mono text-xs gap-1.5">
            <AlertCircle className="size-3" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="font-mono text-xs">
            {status}
          </Badge>
        )
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2.5 font-mono text-xs gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Code className="size-3 text-muted-foreground" /> Inspect
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-border/80 shadow-2xl">
        {/* Header Well */}
        <DialogHeader className="border-b border-border/70 bg-card px-5 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-none bg-primary/10 text-primary border border-primary/20">
                <MessageSquare className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                  Message Dispatch Telemetry
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                  <span>WhatsApp Cloud API</span>
                  {formattedDate && (
                    <>
                      <span>•</span>
                      <span className="font-mono">{formattedDate}</span>
                    </>
                  )}
                </DialogDescription>
              </div>
            </div>
            <div>{getStatusBadge(message.status)}</div>
          </div>

          {/* Message UUID Pill */}
          <div className="mt-3 flex items-center justify-between rounded-none border border-border/60 bg-muted/30 px-3 py-1.5 font-mono text-xs text-muted-foreground">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/80 shrink-0">
                DISPATCH ID:
              </span>
              <span className="text-foreground text-xs font-mono truncate select-all">
                {message.id}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyText(message.id, "Dispatch ID")}
              className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Copy UUID"
            >
              {copiedField === "Dispatch ID" ? (
                <>
                  <Check className="size-3 text-success" />
                  <span className="text-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-sm">
          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Recipient Phone */}
            <div className="rounded-none border border-border/60 bg-card p-3 space-y-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                Recipient Phone
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-medium text-foreground text-xs">
                  •••• {message.phone.slice(-4)}
                </span>
                <button
                  type="button"
                  onClick={() => copyText(message.phone, "Phone number")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy full phone"
                >
                  {copiedField === "Phone number" ? (
                    <Check className="size-3 text-success" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Template */}
            <div className="rounded-none border border-border/60 bg-card p-3 space-y-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                Template
              </span>
              <span
                className="font-mono font-medium text-foreground text-xs truncate block"
                title={message.templateName || "Freeform Message"}
              >
                {message.templateName || "Freeform"}
              </span>
            </div>

            {/* Related AWB */}
            <div className="rounded-none border border-border/60 bg-card p-3 space-y-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                Consignment AWB
              </span>
              {message.relatedAwb ? (
                <Link
                  href={`/track?awb=${encodeURIComponent(message.relatedAwb)}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 font-mono font-medium text-primary hover:underline text-xs"
                >
                  <span className="truncate">{message.relatedAwb}</span>
                  <ExternalLink className="size-2.5 opacity-70 shrink-0" />
                </Link>
              ) : (
                <span className="font-mono text-muted-foreground text-xs">-</span>
              )}
            </div>

            {/* Language / Related Invoice */}
            <div className="rounded-none border border-border/60 bg-card p-3 space-y-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                {message.relatedInvoiceId ? "Invoice Ref" : "Language"}
              </span>
              {message.relatedInvoiceId ? (
                <Link
                  href={`/invoice/${message.relatedInvoiceId}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 font-mono font-medium text-primary hover:underline text-xs"
                >
                  <span>#{message.relatedInvoiceId.slice(0, 8)}</span>
                  <ExternalLink className="size-2.5 opacity-70 shrink-0" />
                </Link>
              ) : (
                <span className="font-mono font-medium text-foreground text-xs">
                  {message.templateLanguage || "en_US"}
                </span>
              )}
            </div>
          </div>

          {/* Failure Alert if failed */}
          {message.failureReason && (
            <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
              <AlertCircle className="size-4 text-destructive" />
              <AlertTitle className="text-xs font-semibold uppercase tracking-wider">
                Delivery Dispatch Failure
              </AlertTitle>
              <AlertDescription className="text-xs font-mono leading-relaxed mt-1 text-destructive/90">
                {message.failureReason}
              </AlertDescription>
            </Alert>
          )}

          {/* Outbound WhatsApp Message Preview */}
          {message.body && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-none bg-success" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    WhatsApp Message Preview
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => copyText(message.body!, "Message text")}
                >
                  {copiedField === "Message text" ? (
                    <>
                      <Check className="mr-1 size-3 text-success" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 size-3" /> Copy text
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-none border border-success/25 bg-success/[0.04] p-4 border-l-4 border-l-success shadow-xs">
                <div className="font-sans text-xs leading-relaxed text-foreground select-text whitespace-pre-wrap">
                  <RichTextRenderer content={message.body} />
                </div>
              </div>
            </div>
          )}

          {/* Provider Payload (JSON) */}
          {payloadString && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Provider Payload (JSON)
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs font-mono gap-1.5"
                  onClick={copyPayload}
                >
                  {copiedPayload ? (
                    <>
                      <Check className="size-3 text-success" />
                      <span className="text-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </Button>
              </div>
              <div className="relative rounded-none border border-border/60 bg-muted/60 dark:bg-black/80 overflow-hidden shadow-inner">
                <pre className="max-h-64 overflow-x-auto p-4 font-mono text-xs text-foreground leading-relaxed">
                  {payloadString}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Footer */}
        <div className="border-t border-border/70 bg-muted/40 px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Audited dispatch record</span>
          </div>
          <div className="flex items-center gap-2">
            {message.relatedInvoiceId && (
              <Button asChild variant="outline" size="sm" className="h-8 text-xs font-medium">
                <Link href={`/invoice/${message.relatedInvoiceId}`} target="_blank">
                  <ExternalLink className="mr-1.5 size-3" /> View Invoice
                </Link>
              </Button>
            )}
            <DialogClose asChild>
              <Button size="sm" className="h-8 px-4 text-xs font-medium">
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
