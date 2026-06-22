"use client"

import createGlobe from "cobe"
import { useEffect, useRef } from "react"

export function CobeGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    let globe: ReturnType<typeof createGlobe> | null = null
    let rafId = 0
    let phi = 1.0

    const init = () => {
      const side = canvas.offsetWidth
      if (side === 0 || globe) {
        return
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: side,
        height: side,
        phi: 1.0,
        theta: 0.1,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16_000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [1, 0.5, 0], // primary color
        glowColor: [1, 1, 1],
        markers: [
          { location: [28.6139, 77.209], size: 0.08 }, // New Delhi
          { location: [24.817, 93.9368], size: 0.08 }, // Imphal
        ],
      })

      const loop = () => {
        globe?.update({ phi })
        phi += 0.003
        rafId = requestAnimationFrame(loop)
      }
      loop()
    }

    let ro: ResizeObserver | null = null

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      ro = new ResizeObserver((entries) => {
        if (
          entries[0]?.contentRect.width &&
          entries[0]?.contentRect.width > 0
        ) {
          ro?.disconnect()
          ro = null
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      ro?.disconnect()
      cancelAnimationFrame(rafId)
      globe?.destroy()
    }
  }, [])

  return (
    <canvas
      className={`aspect-square size-[600px] max-w-full ${className ?? ""}`}
      ref={canvasRef}
    />
  )
}
