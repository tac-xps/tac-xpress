"use client"

import React, { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import isChromatic from "chromatic/isChromatic"
import type { AnimationItem } from "lottie-web"
import { cn } from "@/lib/utils"

interface HeroLottieTruckProps {
  className?: string
}

/**
 * Animated hero cargo linehaul truck using public/lottie/Truck.json.
 * Engineered with:
 * - Pure Lottie JSON animation (no static image overlays).
 * - Dynamic import of lottie-web for clean client-side SVG rendering.
 * - WCAG 2.1 compliance (respects prefers-reduced-motion, proper ARIA label).
 * - Full memory leak prevention (animation instance destruction on unmount).
 */
export function HeroLottieTruck({ className }: HeroLottieTruckProps) {
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
        path: "/lottie/Truck.json",
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
            anim.goToAndStop(15, true)
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
        "relative w-full aspect-[4/3] flex items-center justify-center select-none",
        className
      )}
    >
      {/* Animated Lottie SVG Container */}
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full flex items-center justify-center transition-opacity duration-500 ease-out [&>svg]:w-full [&>svg]:h-full drop-shadow-md",
          isLottieReady ? "opacity-100" : "opacity-0"
        )}
        aria-label="TAC-XPRESS commercial cargo transport truck animation"
        role="img"
      />
    </div>
  )
}

