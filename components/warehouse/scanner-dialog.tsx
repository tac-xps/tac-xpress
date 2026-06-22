"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScanLine, Loader2, PackageCheck, AlertCircle } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { scanShipmentAction } from "@/app/dashboard/warehouse/actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ScannerDialogProps {
  children?: React.ReactNode
}

export function ScannerDialog({ children }: ScannerDialogProps) {
  const [open, setOpen] = useState(false)
  const [awb, setAwb] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // To display last scanned status
  const [lastScan, setLastScan] = useState<{
    awbNumber: string
    success: boolean
    message: string
  } | null>(null)

  const { executeAsync, isExecuting } = useAction(scanShipmentAction, {
    onSuccess: ({ data }) => {
      if (data?.success && data.shipment) {
        toast.success(`AWB ${data.shipment.awbNumber} processed successfully!`)
        setLastScan({
          awbNumber: data.shipment.awbNumber,
          success: true,
          message: `Processed. Status: ${data.shipment.status}`,
        })
      } else {
        const err = data && "error" in data ? data.error : "Failed to scan"
        toast.error(err)
        setLastScan({
          awbNumber: awb,
          success: false,
          message: err as string,
        })
      }
      setAwb("")
      // Keep focus on input for the next scan
      setTimeout(() => inputRef.current?.focus(), 10)
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "An error occurred during scan")
      setLastScan({
        awbNumber: awb,
        success: false,
        message: error.serverError || "Server error",
      })
      setAwb("")
      setTimeout(() => inputRef.current?.focus(), 10)
    },
  })

  // Auto-focus when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setAwb("")
      setLastScan(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!awb.trim() || isExecuting) return
    await executeAsync({ awbNumber: awb.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="border-border/50 bg-background">
            <ScanLine className="mr-2 size-4" />
            Barcode Scan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-border/60 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ScanLine className="size-5 text-primary" />
            Scan Shipment
          </DialogTitle>
          <DialogDescription>
            Use a barcode scanner or manually type the AWB number. Physical
            scanners will automatically submit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Input
              ref={inputRef}
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Awaiting scan input..."
              className="h-16 border-primary/20 bg-muted/50 text-center font-mono text-2xl tracking-widest focus-visible:ring-primary/50"
              disabled={isExecuting}
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-lg"
            disabled={!awb.trim() || isExecuting}
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" /> Processing...
              </>
            ) : (
              "Process Scan"
            )}
          </Button>
        </form>

        {lastScan && (
          <div
            className={cn(
              "mt-2 flex animate-in items-start gap-3 rounded-lg p-4 fade-in slide-in-from-bottom-2",
              lastScan.success
                ? "text-trend-positive bg-primary/10"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {lastScan.success ? (
              <PackageCheck className="mt-0.5 size-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 size-5 shrink-0" />
            )}
            <div className="flex flex-col">
              <span className="font-bold tracking-tight">
                {lastScan.awbNumber}
              </span>
              <span className="text-sm opacity-90">{lastScan.message}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
