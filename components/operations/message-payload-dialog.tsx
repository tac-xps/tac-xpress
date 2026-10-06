"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Code, Copy, Check, MessageSquare, AlertCircle } from "lucide-react"
import { toast } from "sonner"

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
  const [copied, setCopied] = useState(false)

  const payloadString = message.providerPayload
    ? JSON.stringify(message.providerPayload, null, 2)
    : message.body
      ? JSON.stringify({ message: message.body, template: message.templateName }, null, 2)
      : null

  const copyPayload = () => {
    if (!payloadString) return
    navigator.clipboard.writeText(payloadString)
    setCopied(true)
    toast.success("Payload copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="default">Provider Accepted</Badge>
      case "delivered":
        return <Badge variant="success">Delivered</Badge>
      case "read":
        return <Badge variant="secondary">Read</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Code className="mr-1.5 size-3" /> Inspect
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <DialogTitle className="text-base font-bold">Message Details</DialogTitle>
            </div>
            {getStatusBadge(message.status)}
          </div>
          <DialogDescription className="font-mono text-xs">
            ID: {message.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Rate limit & telemetry pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 border border-border/40 bg-muted/20 p-2.5 text-xs">
            <span className="text-muted-foreground">Relay Status:</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-micro font-mono">
                Relay Limit: 80 req/min
              </Badge>
              <Badge variant="success" className="text-micro">
                Healthy
              </Badge>
            </div>
          </div>

          {/* Key metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-none border border-border/40 p-2.5">
              <span className="text-muted-foreground block text-micro uppercase tracking-wider font-semibold">
                Recipient Phone
              </span>
              <span className="font-mono font-medium text-foreground">
                •••• {message.phone.slice(-4)}
              </span>
            </div>
            <div className="rounded-none border border-border/40 p-2.5">
              <span className="text-muted-foreground block text-micro uppercase tracking-wider font-semibold">
                Template
              </span>
              <span className="font-medium text-foreground">
                {message.templateName || "Freeform Message"}
              </span>
            </div>
            {message.relatedAwb && (
              <div className="rounded-none border border-border/40 p-2.5">
                <span className="text-muted-foreground block text-micro uppercase tracking-wider font-semibold">
                  Related AWB
                </span>
                <span className="font-mono font-medium text-foreground">
                  {message.relatedAwb}
                </span>
              </div>
            )}
            {message.templateLanguage && (
              <div className="rounded-none border border-border/40 p-2.5">
                <span className="text-muted-foreground block text-micro uppercase tracking-wider font-semibold">
                  Language Code
                </span>
                <span className="font-mono font-medium text-foreground">
                  {message.templateLanguage}
                </span>
              </div>
            )}
          </div>

          {/* Failure Alert if failed */}
          {message.failureReason && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Delivery Error</AlertTitle>
              <AlertDescription className="text-xs font-mono">
                {message.failureReason}
              </AlertDescription>
            </Alert>
          )}

          {/* Message Body */}
          {message.body && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Message Body
              </span>
              <div className="rounded-none border border-border/40 bg-muted/10 p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                {message.body}
              </div>
            </div>
          )}

          {/* Provider Payload */}
          {payloadString && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Provider Payload (JSON)
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={copyPayload}
                >
                  {copied ? (
                    <Check className="mr-1.5 size-3 text-success" />
                  ) : (
                    <Copy className="mr-1.5 size-3" />
                  )}
                  {copied ? "Copied" : "Copy JSON"}
                </Button>
              </div>
              <pre className="max-h-60 overflow-x-auto rounded-none border border-border/40 bg-muted/40 p-3 font-mono text-xs text-foreground">
                {payloadString}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
