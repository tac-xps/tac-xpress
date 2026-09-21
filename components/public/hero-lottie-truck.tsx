"use client"

import React, { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import isChromatic from "chromatic/isChromatic"
import type { AnimationItem } from "lottie-web"
import { cn } from "@/lib/utils"

interface HeroLottieTruckProps {
  className?: string
}

export function HeroLottieTruck({ className }: HeroLottieTruckProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<AnimationItem | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    let isMounted = true

    // Dynamically load lottie-web for clean client-side rendering
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
          setIsLoaded(true)
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
    <div className={cn("relative w-full aspect-[4/3] flex items-center justify-center select-none", className)}>
      {/* Subtle ambient lighting behind vector illustration in dark & light mode */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-radial from-primary/10 via-transparent to-transparent blur-2xl opacity-80 dark:opacity-40 scale-110"
        aria-hidden="true"
      />
      
      {/* Lottie SVG Container */}
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full flex items-center justify-center transition-opacity duration-500 [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-sm dark:[&>svg]:drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        aria-label="TAC-XPRESS commercial cargo transport truck"
        role="img"
      />
    </div>
  )
}
