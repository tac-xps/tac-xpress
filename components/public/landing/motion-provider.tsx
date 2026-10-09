"use client"

import * as React from "react"
import { MotionConfig } from "motion/react"

/**
 * Client wrapper providing centralized MotionConfig for reduced motion preferences.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
