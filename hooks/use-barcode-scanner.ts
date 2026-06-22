"use client"

import { useEffect, useRef } from "react"

interface UseBarcodeScannerProps {
  onScan: (barcode: string) => void
  enabled?: boolean
  timeoutMs?: number // Max time between keystrokes to be considered a scan (usually < 50ms for hardware scanners)
}

export function useBarcodeScanner({
  onScan,
  enabled = true,
  timeoutMs = 150, // Increased to 150ms to support 2.4GHz wireless scanners (like Helett HT20) which have slower inter-character delays
}: UseBarcodeScannerProps) {
  const buffer = useRef<string>("")
  const lastKeyTime = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is actively typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      const currentTime = performance.now()

      if (e.key === "Enter") {
        if (buffer.current.length > 3) {
          // Trigger scan callback with the current buffer
          onScan(buffer.current)
        }
        // Always clear the buffer on Enter
        buffer.current = ""
        lastKeyTime.current = 0
        return
      }

      // Ignore modifier keys but update the timer so the gap between Shift and the next character doesn't cause a timeout
      if (
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta"
      ) {
        lastKeyTime.current = currentTime
        return
      }

      // If it's a regular character (length 1)
      if (e.key.length === 1) {
        const timeDiff = currentTime - lastKeyTime.current

        // If time between keystrokes is larger than timeout, it's likely manual typing.
        // Start a new buffer instead of appending.
        if (timeDiff > timeoutMs && buffer.current.length > 0) {
          buffer.current = e.key
        } else {
          // Otherwise append to current buffer
          buffer.current += e.key
        }

        lastKeyTime.current = currentTime
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onScan, enabled, timeoutMs])
}
