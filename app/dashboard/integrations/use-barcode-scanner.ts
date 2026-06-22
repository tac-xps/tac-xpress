import { useState, useEffect } from "react"
import type { Html5QrcodeScanner } from "html5-qrcode"
import * as Sentry from "@sentry/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useBarcodeScanner(elementId: string = "reader-integration") {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scannerError, setScannerError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null
    let timer: NodeJS.Timeout

    timer = setTimeout(async () => {
      const element = document.getElementById(elementId)
      if (!element) {
        setScannerError("Scanner element not found in DOM.")
        return
      }

      try {
        const { Html5QrcodeScanner } = await import("html5-qrcode")
        scanner = new Html5QrcodeScanner(
          elementId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        )

        scanner.render(
          (decodedText) => {
            setScanResult(decodedText)
            scanner
              ?.clear()
              .then(() => {
                toast.success(`Scanned AWB: ${decodedText}`)
                router.push(
                  `/dashboard/tracking?awb=${encodeURIComponent(decodedText)}`
                )
              })
              .catch((err) => {
                Sentry.captureException(err)
              })
          },
          (_errorMessage) => {
            // Per-frame scan misses are expected and not errors
          }
        )
      } catch (err) {
        Sentry.captureException(err)
        setScannerError(
          "Failed to initialize barcode scanner. Please check camera permissions."
        )
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      scanner?.clear().catch((err) => {
        Sentry.captureException(err)
      })
    }
  }, [router, elementId])

  return {
    scanResult,
    scannerError,
  }
}
