"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BackgroundJob } from "@/lib/db/schema"
import { Copy, Check, AlertOctagon, Terminal } from "lucide-react"
import { toast } from "sonner"

export interface JobDetailDialogProps {
  job: BackgroundJob | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobDetailDialog({
  job,
  open,
  onOpenChange,
}: JobDetailDialogProps) {
  const [copiedError, setCopiedError] = useState(false)
  const [copiedPayload, setCopiedPayload] = useState(false)

  if (!job) return null

  const handleCopy = async (text: string, isError: boolean) => {
    try {
      await navigator.clipboard.writeText(text)
      if (isError) {
        setCopiedError(true)
        setTimeout(() => setCopiedError(false), 2000)
      } else {
        setCopiedPayload(true)
        setTimeout(() => setCopiedPayload(false), 2000)
      }
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="job-detail-dialog"
        className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
      >
        <DialogHeader className="px-6 py-3.5 border-b border-border/80 bg-muted/20 flex flex-row items-center justify-between gap-4 space-y-0 shrink-0 pr-14">
          <div>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertOctagon className="size-4 text-destructive shrink-0" />
              <span>Failed Job: {job.kind}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5 font-mono">
              ID: {job.id}
            </DialogDescription>
          </div>
          <Badge variant="destructive" className="capitalize text-[10px]">
            {job.status}
          </Badge>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 pb-8 space-y-5 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 rounded-none border border-border/80 bg-card p-3 sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground block">Attempts</span>
              <span className="font-semibold text-foreground mt-0.5 block font-mono">
                {job.attempts}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Available</span>
              <span className="font-semibold text-foreground mt-0.5 block whitespace-nowrap">
                {format(new Date(job.availableAt), "dd MMM, HH:mm")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Created</span>
              <span className="font-semibold text-foreground mt-0.5 block whitespace-nowrap">
                {format(new Date(job.createdAt), "dd MMM, HH:mm")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Dedupe Key</span>
              <span className="font-mono text-foreground mt-0.5 block truncate" title={job.dedupeKey ?? ""}>
                {job.dedupeKey || "—"}
              </span>
            </div>
          </div>

          {/* Error Message & Stack Trace */}
          {job.lastError && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-destructive flex items-center gap-1.5">
                  <Terminal className="size-3.5" />
                  Failure Error Output
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(job.lastError!, true)}
                  className="h-6 px-2 text-[11px] gap-1"
                >
                  {copiedError ? <Check className="size-3 text-status-delivered" /> : <Copy className="size-3" />}
                  Copy Error
                </Button>
              </div>
              <pre className="max-h-56 overflow-auto rounded-none border border-destructive/30 bg-destructive/5 p-3 font-mono text-[11px] leading-relaxed text-destructive whitespace-pre-wrap select-all">
                {job.lastError}
              </pre>
            </div>
          )}

          {/* Job Payload */}
          {Boolean(job.payload) && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Job Payload JSON</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(JSON.stringify(job.payload, null, 2), false)}
                  className="h-6 px-2 text-[11px] gap-1"
                >
                  {copiedPayload ? <Check className="size-3 text-status-delivered" /> : <Copy className="size-3" />}
                  Copy JSON
                </Button>
              </div>
              <pre className="max-h-56 overflow-auto rounded-none border border-border/80 bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap select-all">
                {JSON.stringify(job.payload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
