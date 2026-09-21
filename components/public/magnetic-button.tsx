"use client"

import React, { useRef, useEffect } from "react"
import gsap from "gsap"
import { useReducedMotion } from "motion/react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

/**
 * Reusable magnetic button component powered by GSAP.
 * Provides micro-physics cursor attraction with elastic snap-back.
 * Adheres to WCAG: automatically disabled when prefers-reduced-motion is active.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.25,
  onClick,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (!el || shouldReduceMotion) return

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power2.out" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power2.out" })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      xTo(deltaX)
      yTo(deltaY)
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: "elastic.out(1, 0.4)",
      })
    }

    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
      gsap.killTweensOf(el)
    }
  }, [strength, shouldReduceMotion])

  return (
    <div
      ref={containerRef}
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
