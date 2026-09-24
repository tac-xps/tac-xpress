"use client"

import React, { useRef, useEffect } from "react"
import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

/**
 * Reusable magnetic button component powered by Framer Motion.
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

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  useEffect(() => {
    const el = containerRef.current
    if (!el || shouldReduceMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      x.set(deltaX)
      y.set(deltaY)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [strength, shouldReduceMotion, x, y])

  return (
    <motion.div
      ref={containerRef}
      className={className}
      onClick={onClick}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  )
}
