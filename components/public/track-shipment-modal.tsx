"use client"

import * as React from "react"
import { useTransition, useState, useEffect } from "react"
import { Search, Loader2, ArrowUpRight } from "lucide-react"
import { trackAwb } from "@/app/actions/tracking"
import type { TrackingResult } from "@/types/tracking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TrackingDialogBody } from "@/components/public/track-dialog-form"

interface TrackShipmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialAwb?: string
}

export function TrackShipmentModal({
  open,
  onOpenChange,
  initialAwb = "",
}: TrackShipmentModalProps) {
  const [awb, setAwb] = useState(initialAwb)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const performSearch = (awbToSearch: string) => {
    const clean = awbToSearch.trim().toUpperCase()
    if (!clean) return
    setError(null)
    setResult(null)
    startTransition(async () => {
      const fd = new FormData()
      fd.set("awb_number", clean)
      const res = await trackAwb(fd)
      if (res.error) {
        setError(res.error)
      } else if (res.success && res.data) {
        setResult(res.data as TrackingResult)
      }
    })
  }

  const searchedAwbRef = React.useRef<string | null>(null)

  useEffect(() => {
    if (initialAwb && open && searchedAwbRef.current !== initialAwb) {
      searchedAwbRef.current = initialAwb
      const clean = initialAwb.trim().toUpperCase()
      if (clean) {
        startTransition(async () => {
          const fd = new FormData()
          fd.set("awb_number", clean)
          const res = await trackAwb(fd)
          if (res.error) {
            setError(res.error)
          } else if (res.success && res.data) {
            setResult(res.data as TrackingResult)
          }
        })
      }
    }
  }, [initialAwb, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(awb)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl w-full max-h-[90svh] overflow-y-auto p-0 gap-0 rounded-none border-border">
        <DialogHeader className="p-6 border-b border-border bg-card">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            Track Consignment
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Direct telemetry for New Delhi ⇄ Imphal corridor consignments.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="awb-modal"
                aria-label="AWB number"
                value={awb}
                onChange={(e) => setAwb(e.target.value.toUpperCase())}
                placeholder="Enter AWB number (e.g. TAC-DEL-948210)..."
                className="pl-9 font-mono text-xs uppercase rounded-none h-10 border-border"
                maxLength={40}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 px-4 rounded-none font-medium text-xs bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Track shipment <ArrowUpRight className="ml-1 size-3.5" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Sample AWBs */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">Sample AWBs:</span>
            {["TAC-DEL-948210", "TAC-IMF-102948", "TAC-DEL-839201"].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setAwb(sample)
                  performSearch(sample)
                }}
                className="border border-border/80 bg-muted/40 hover:bg-muted px-2 py-0.5 font-mono text-[10px] text-foreground transition-colors rounded-none cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </DialogHeader>

        {error && (
          <div role="alert" className="p-6 border-b border-border/80 bg-destructive/5 text-sm">
            <p className="font-semibold text-destructive">We could not retrieve this shipment</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Check the number on your receipt or contact our operations team for active consignments.
            </p>
          </div>
        )}

        {result && (
          <TrackingDialogBody result={result} />
        )}
      </DialogContent>
    </Dialog>
  )
}
