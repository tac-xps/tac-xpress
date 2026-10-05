"use client"

import React, { useEffect, useRef, useSyncExternalStore } from "react"
import { useSpring, useTransform, motion, useReducedMotion } from "motion/react"

export interface AnimatedCounterProps {
  /** Target numeric value to animate to */
  value: number
  /** Optional prefix (e.g. "₹") */
  prefix?: string
  /** Optional suffix (e.g. "%", " kg") */
  suffix?: string
  /** Decimal places to round to (default: 0) */
  decimals?: number
  /** Custom formatter function (default: en-IN comma grouping) */
  formatValue?: (val: number) => string
  /** Custom className for the counter span */
  className?: string
  /** Spring stiffness (default: 200) */
  stiffness?: number
  /** Spring damping (default: 30) */
  damping?: number
}

function defaultFormat(val: number, decimals: number): string {
  return val.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

const emptySubscribe = () => () => {}

/**
 * AnimatedCounter: High-performance spring-interpolated numeric roll-up.
 * Renders server-side formatted value cleanly for hydration safety,
 * then smoothly animates to new values on the client using Motion v12.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatValue,
  className = "",
  stiffness = 220,
  damping = 30,
}: AnimatedCounterProps) {
  const shouldReduceMotion = useReducedMotion()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const isFirstRender = useRef(true)

  const spring = useSpring(value, {
    stiffness,
    damping,
  })

  // Format value into text
  const display = useTransform(spring, (latest) => {
    const formatter = formatValue || ((v: number) => defaultFormat(v, decimals))
    return `${prefix}${formatter(latest)}${suffix}`
  })

  useEffect(() => {
    if (shouldReduceMotion) {
      spring.jump(value)
      return
    }

    if (isFirstRender.current) {
      isFirstRender.current = false
      // Animate from 0 to value on first appearance
      spring.set(0)
      spring.set(value)
    } else {
      spring.set(value)
    }
  }, [value, spring, shouldReduceMotion])

  // SSR fallback
  if (!mounted || shouldReduceMotion) {
    const formatter = formatValue || ((v: number) => defaultFormat(v, decimals))
    return (
      <span className={className}>
        {prefix}
        {formatter(value)}
        {suffix}
      </span>
    )
  }

  return <motion.span className={className}>{display}</motion.span>
}
