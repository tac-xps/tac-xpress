"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, ExternalLink, Loader2, RotateCw, AlertCircle, X } from "lucide-react"

interface ManifestPrintDialogProps {
  manifestId: string
  referenceId: string
  status?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManifestPrintDialog({
  manifestId,
  referenceId,
  status = "draft",
  open,
  onOpenChange,
}: ManifestPrintDialogProps) {
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleRefresh = () => setRefreshIndex((k) => k + 1)

  useEffect(() => {
    if (!open || !manifestId) return

    let ignore = false

    async function fetchDoc() {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const res = await fetch(`/api/manifests/${manifestId}/print?autoprint=false`, {
          cache: "no-store",
        })
        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status}`)
        }
        const html = await res.text()
        if (!ignore) {
          setHtmlContent(html)
        }
      } catch (err) {
        if (!ignore) {
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to load manifest document"
          )
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void fetchDoc()

    return () => {
      ignore = true
      setHtmlContent("")
      setErrorMessage(null)
    }
  }, [open, manifestId, refreshIndex])

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus()
      iframeRef.current.contentWindow.print()
    } else {
      window.open(`/api/manifests/${manifestId}/print`, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[92vh] max-h-[94vh] w-[95vw] sm:max-w-4xl lg:max-w-5xl flex-col p-0 overflow-hidden rounded-none border border-border bg-background shadow-2xl"
      >
        {/* Header Toolbar */}
        <DialogHeader className="flex flex-shrink-0 flex-row items-center justify-between border-b border-border/60 px-5 py-3.5 bg-background gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-none border border-border bg-muted">
              <Printer className="size-4.5 text-foreground" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-sm sm:text-base font-bold tracking-tight">
                  Manifest Print Preview
                </DialogTitle>
                <Badge
                  variant="outline"
                  className="rounded-none font-mono text-[11px] font-semibold uppercase px-1.5 py-0.5"
                >
                  {referenceId}
                </Badge>
                <Badge
                  variant={status === "finalized" ? "default" : "secondary"}
                  className="rounded-none text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                >
                  {status}
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground truncate">
                Official Line-Haul Dispatch Documentation • Direct print preview
              </DialogDescription>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh preview"
              className="h-8 w-8 p-0 rounded-none"
            >
              <RotateCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh preview</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="h-8 rounded-none px-2.5 text-xs font-medium"
            >
              <a
                href={`/api/manifests/${manifestId}/print`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-1.5 size-3.5" />
                <span className="hidden sm:inline">Open in </span>New Tab
              </a>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              disabled={isLoading || !!errorMessage || !htmlContent}
              className="rounded-none h-8 px-3.5 text-xs font-semibold"
            >
              <Printer className="mr-1.5 size-3.5" />
              Print Document
            </Button>

            <div className="h-4 w-px bg-border mx-1 shrink-0" />

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Close dialog"
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Preview Canvas */}
        <div className="relative flex-1 min-h-0 bg-muted/40 p-2 sm:p-5 flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-4xl h-full bg-card shadow-xl border border-border/80 flex flex-col overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-xs">
                <Loader2 className="size-6 animate-spin text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  Rendering printable manifest...
                </span>
              </div>
            )}

            {errorMessage ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-3 bg-background">
                <AlertCircle className="size-8 text-destructive" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Unable to load print preview
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {errorMessage}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="rounded-none text-xs"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                sandbox="allow-modals allow-same-origin"
                title={`Print preview for manifest ${referenceId}`}
                className="w-full flex-1 border-0 bg-card"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
