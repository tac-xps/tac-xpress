import React from "react"
import { cn } from "@/lib/utils"

interface HeroStatusBadgeProps {
  label: string
  variant?: "primary" | "default"
  /** Tailwind delay class e.g. "delay-700" — staggers the pulse so badges don't all fire together */
  pulseDelay?: string
  className?: string
}

/**
 * Floating telemetry badge component for the TAC-XPRESS hero section.
 *
 * Nordic Lagom principles:
 * - Square geometry (no border-radius)
 * - Clear operational signal with pulsing status dot (staggered via pulseDelay)
 * - Full semantic token usage — no hardcoded colors
 */
export function HeroStatusBadge({
  label,
  variant = "default",
  pulseDelay,
  className,
}: HeroStatusBadgeProps) {
  const isPrimary = variant === "primary"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs font-medium tracking-wide select-none shadow-sm",
        isPrimary
          ? "bg-primary text-primary-foreground border border-primary/80 shadow-primary/20"
          : "bg-card text-card-foreground border border-border",
        className
      )}
      role="status"
    >
      <span
        className={cn(
          "size-1.5 rounded-full shrink-0 animate-pulse",
          isPrimary ? "bg-primary-foreground" : "bg-primary",
          pulseDelay
        )}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  )
}
