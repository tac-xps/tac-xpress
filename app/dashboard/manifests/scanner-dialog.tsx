"use client"

import { useEffect, useState } from "react"
import { scanShipmentAction } from "./actions"
import { toast } from "sonner"
import { Loader2, QrCode } from "lucide-react"
import type { Html5QrcodeScanner } from "html5-qrcode"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ScannerDialog({ manifestId }: { manifestId: string }) {
  const [open, setOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null
    let timer: NodeJS.Timeout

    if (open) {
      timer = setTimeout(async () => {
        const element = document.getElementById("reader-manifest")
        if (!element) return

        const { Html5QrcodeScanner } = await import("html5-qrcode")

        scanner = new Html5QrcodeScanner(
          "reader-manifest",
          { fps: 10, qrbox: { width: 250, height: 150 } },
          /* verbose= */ false
        )

        scanner.render(
          async (decodedText) => {
            // Pause scanning while processing
            scanner?.pause(true)
            setIsScanning(true)

            const result = await scanShipmentAction({
              manifestId,
              awbNumber: decodedText,
            })

            if (result?.success) {
              toast.success(`Added AWB: ${decodedText}`)
            } else {
              toast.error(result?.error || "Failed to add shipment")
            }

            setIsScanning(false)
            // Resume scanning after 1.5 seconds to avoid multi-scans
            setTimeout(() => {
              scanner?.resume()
            }, 1500)
          },
          (error) => {
            // ignore scan failures
          }
        )
      }, 100)
    }

    return () => {
      clearTimeout(timer)
      if (scanner) {
        scanner.clear().catch(console.error)
      }
    }
  }, [open, manifestId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="mr-2 h-4 w-4" />
          Scan AWB
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>
            Hold the AWB barcode up to the camera to add it to this manifest.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div id="reader-manifest" className="w-full overflow-hidden border" />
          {isScanning && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
