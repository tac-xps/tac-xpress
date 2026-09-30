"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

/**
 * Lightweight, zero-runtime-cost button wrapper for public hero and marketing CTAs.
 * Replaces physics-based mousemove tracking to eliminate CPU overhead and layout recalculations.
 */
export function MagneticButton({
  children,
  className,
  onClick,
}: MagneticButtonProps) {
  return (
    <div
      className={cn("inline-block transition-transform active:scale-[0.98]", className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

