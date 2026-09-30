"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
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
 * - Instant SSR poster image to eliminate hero content voids on initial paint.
 * - Dynamic import of lottie-web for clean client-side SVG rendering.
 * - Graceful cross-fade once Lottie DOMLoaded event fires.
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
      {/* Subtle ambient radial glow behind truck in dark & light mode */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-radial from-primary/15 via-transparent to-transparent blur-3xl opacity-70 dark:opacity-40 scale-110"
        aria-hidden="true"
      />

      {/* Immediate SSR poster image — prevents initial paint void before Lottie hydrates */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-out",
          isLottieReady ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        aria-hidden={isLottieReady}
      >
        <Image
          src="/images/hero/hero-blender-truck-dark.png"
          alt="TAC-XPRESS commercial cargo transport truck"
          width={800}
          height={600}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="w-full h-auto object-contain drop-shadow-sm dark:drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
        />
      </div>

      {/* Animated Lottie SVG Container */}
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full flex items-center justify-center transition-opacity duration-700 ease-out [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-sm dark:[&>svg]:drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]",
          isLottieReady ? "opacity-100" : "opacity-0"
        )}
        aria-label="TAC-XPRESS commercial cargo transport truck animation"
        role="img"
      />
    </div>
  )
}
