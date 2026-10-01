"use client"

import React, { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import isChromatic from "chromatic/isChromatic"
import type { AnimationItem } from "lottie-web"
import { cn } from "@/lib/utils"

interface HeroLottieAirplaneProps {
  className?: string
}

/**
 * Animated hero cargo linehaul airplane using public/lottie/small_3d_airplane_animation.json.
 * Engineered with:
 * - Pure Lottie JSON 3D airplane animation with spinning propeller and passing cloudscape.
 * - Dynamic import of lottie-web for clean client-side SVG rendering.
 * - WCAG 2.1 compliance (respects prefers-reduced-motion, proper ARIA label).
 * - Full memory leak prevention (animation instance destruction on unmount).
 */
export function HeroLottieAirplane({ className }: HeroLottieAirplaneProps) {
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
        path: "/lottie/small_3d_airplane_animation.json",
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
            anim.goToAndStop(30, true)
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
        "relative w-full aspect-square max-w-md sm:max-w-lg lg:max-w-xl mx-auto flex items-center justify-center select-none",
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
        aria-label="TAC-XPRESS commercial air cargo transport airplane animation"
        role="img"
      />
    </div>
  )
}
