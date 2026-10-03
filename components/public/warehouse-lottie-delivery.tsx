"use client"

import React, { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import isChromatic from "chromatic/isChromatic"
import type { AnimationItem } from "lottie-web"
import { cn } from "@/lib/utils"

interface WarehouseLottieDeliveryProps {
  className?: string
}

/**
 * Multimodal freight hub & warehouse delivery animation using public/lottie/warehouse_delivery.json.
 * Engineered with:
 * - Pure Lottie JSON animation depicting trucks, trains, forklifts, and warehouse dispatch.
 * - Dynamic import of lottie-web for clean client-side SVG rendering.
 * - WCAG 2.1 compliance (respects prefers-reduced-motion, accessible ARIA label).
 * - Full memory leak prevention (animation instance destroyed on unmount).
 * - Soft Nordic Fjord container framing and seamless SSR placeholder.
 */
export function WarehouseLottieDelivery({ className }: WarehouseLottieDeliveryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<AnimationItem | null>(null)
  const [isLottieReady, setIsLottieReady] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    let isMounted = true

    // Dynamically load lottie-web to optimize client bundle
    import("lottie-web").then((lottieModule) => {
      if (!isMounted || !containerRef.current) return

      const lottie = lottieModule.default || lottieModule

      if (animRef.current) {
        animRef.current.destroy()
      }

      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: !shouldReduceMotion && !isChromatic(),
        autoplay: !shouldReduceMotion && !isChromatic(),
        path: "/lottie/warehouse_delivery.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
        },
      })

      animRef.current = anim

      anim.addEventListener("DOMLoaded", () => {
        if (isMounted) {
          setIsLottieReady(true)
          if (shouldReduceMotion || isChromatic()) {
            anim.goToAndStop(20, true)
          }
        }
      })
    })

    return () => {
      isMounted = false
      if (animRef.current) {
        animRef.current.destroy()
        animRef.current = null
      }
    }
  }, [shouldReduceMotion])

  return (
    <div
      className={cn(
        "relative w-full aspect-[5/3] rounded-none border border-border/60 bg-card/60 backdrop-blur-xs overflow-hidden flex items-center justify-center select-none shadow-xs",
        className
      )}
    >
      {/* Background ambient gradient highlighting the multimodal logistics hub */}
      <div
        className="absolute inset-0 bg-radial from-primary/[0.04] via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Animated Lottie SVG Container */}
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full flex items-center justify-center transition-opacity duration-500 ease-out [&>svg]:w-full [&>svg]:h-full p-2 sm:p-4",
          isLottieReady ? "opacity-100" : "opacity-0"
        )}
        aria-label="TAC-XPRESS multimodal freight hub and warehouse delivery animation"
        role="img"
      />

      {/* Loading state placeholder to prevent layout shift */}
      {!isLottieReady && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted/20 animate-pulse"
          aria-hidden="true"
        >
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
      )}
    </div>
  )
}
