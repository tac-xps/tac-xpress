"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react"
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner"
import { ScannerResultModal } from "./scanner-result-modal"
import { getScannedShipmentDetails } from "@/app/actions/scanner-actions"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"

interface ScannerContextType {
  lastScannedCode: string | null
  setOverrideHandler: (
    handler: ((code: string) => Promise<boolean>) | null
  ) => void
}

const ScannerContext = createContext<ScannerContextType>({
  lastScannedCode: null,
  setOverrideHandler: () => {},
})

let sharedAudioContext: any = null

// Utility for zero-latency audio feedback using Web Audio API
export const playScanBeep = (success = true) => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    if (!sharedAudioContext) {
      sharedAudioContext = new AudioContextClass()
    }
    const ctx = sharedAudioContext
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = success ? "sine" : "sawtooth"
    osc.frequency.value = success ? 800 : 250 // High pitch for success, low buzz for error

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + (success ? 0.1 : 0.3)
    )

    osc.start()
    osc.stop(ctx.currentTime + (success ? 0.1 : 0.3))
  } catch (e) {
    // Ignore audio context errors silently
  }
}

export function ScannerProvider({ children }: { children: ReactNode }) {
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shipmentData, setShipmentData] = useState<any>(null)
  const [overrideHandler, setOverrideHandlerState] = useState<
    ((code: string) => Promise<boolean>) | null
  >(null)

  const setOverrideHandler = useCallback(
    (handler: ((code: string) => Promise<boolean>) | null) => {
      setOverrideHandlerState(() => handler)
    },
    []
  )

  const handleScan = async (barcode: string) => {
    // Basic sanitization and normalization for barcodes
    let rawCode = barcode.trim()
    let code = rawCode.toUpperCase()

    // Extract AWB from full URL QR codes (e.g. from generated shipping labels)
    if (
      rawCode.toLowerCase().startsWith("http") ||
      rawCode.toLowerCase().includes("tacxpress.in")
    ) {
      try {
        const urlStr = rawCode.toLowerCase().startsWith("http")
          ? rawCode
          : `https://${rawCode}`
        const url = new URL(urlStr)
        // URL params are case sensitive, check both
        const awbParam =
          url.searchParams.get("awb") ||
          url.searchParams.get("AWB") ||
          url.searchParams.get("id")
        if (awbParam) {
          code = awbParam.toUpperCase()
        } else {
          // Fallback to regex matching AWB format
          const match = rawCode.match(/AWB-[A-Za-z0-9]+/i)
          if (match) code = match[0].toUpperCase()
        }
      } catch (e) {
        // Ignore URL parsing errors
        const match = rawCode.match(/AWB-[A-Za-z0-9]+/i)
        if (match) code = match[0].toUpperCase()
      }
    }

    // Ignore very short accidental scans
    if (code.length < 5) return

    setLastScannedCode(code)

    // Context-Aware Routing: If an active page registered a handler, let it process the scan.
    if (overrideHandler) {
      try {
        const success = await overrideHandler(code)
        playScanBeep(success)
      } catch (error) {
        Sentry.captureException(error, {
          tags: { feature: "scanner", stage: "override-handler" },
        })
        playScanBeep(false)
      }
      return
    }

    // Fallback: Default Global Dashboard Modal logic
    const toastId = toast.loading(`Scanning barcode: ${code}...`)

    try {
      const result = await getScannedShipmentDetails(code)

      if (result.success && result.data) {
        playScanBeep(true)
        toast.success(`Shipment found: ${result.data.awbNumber}`, {
          id: toastId,
        })
        setShipmentData(result.data)
        setIsModalOpen(true)
      } else {
        toast.error(result.error || "Shipment not found for this barcode", {
          id: toastId,
        })
        playScanBeep(false) // Extra buzz on API error
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { feature: "scanner", stage: "lookup" },
      })
      toast.error("Failed to process scan", { id: toastId })
      playScanBeep(false)
    }
  }

  // Hook into the global window keydown events for rapid scanner input
  useBarcodeScanner({
    onScan: handleScan,
    enabled: true, // Always enabled globally on the dashboard
    timeoutMs: 150, // 150ms supports 2.4GHz wireless scanners like Helett HT20
  })

  const handleStatusUpdate = async () => {
    if (lastScannedCode) {
      try {
        const result = await getScannedShipmentDetails(lastScannedCode)
        if (result.success && result.data) {
          setShipmentData(result.data)
        }
      } catch (error) {
        Sentry.captureException(error, {
          tags: { feature: "scanner", stage: "status-update" },
        })
      }
    }
  }

  return (
    <ScannerContext.Provider value={{ lastScannedCode, setOverrideHandler }}>
      {children}
      <ScannerResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shipmentData={shipmentData}
        onStatusUpdate={handleStatusUpdate}
      />
    </ScannerContext.Provider>
  )
}

export const useScannerContext = () => useContext(ScannerContext)
