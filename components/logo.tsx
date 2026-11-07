"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * TAC-XPRESS Brand Mark: The Velocity Spear X
 *
 * Real-World Express Logistics & Cargo Fleet Identity:
 * - 100% Industrial Straight-Line Geometry: Zero curved lines, zero roundness (strict rounded-none).
 * - Distinctive "X" Velocity Geometry: Interlocking tactical cargo chevron wings
 *   (Origin Ground Linehaul & Ascending Air Cargo) forming the iconic "X" of XPRESS.
 * - Precision Delivery Spear: An integrated forward delivery arrow slicing cleanly
 *   through the horizontal axis, projecting velocity, precision routing, and point-to-point dispatch.
 * - Continuous Kinetic Loop: Smooth, mechanical forward arrow glide powered by Motion
 *   (motion/react) with prefers-reduced-motion fallback and print silence.
 * - High Contrast: Engineered with dual-tone tactical cobalt & electric sky accents
 *   that pop on both dark and light modes.
 */

export interface LogoMarkProps extends React.ComponentProps<"svg"> {
  animated?: boolean
}

export const LogoMark = ({
  className,
  animated = true,
  ...props
}: LogoMarkProps) => {
  const shouldReduceMotion = useReducedMotion()
  const isAnimated = animated && !shouldReduceMotion

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={cn(
        "size-8 shrink-0 aspect-square text-primary",
        className
      )}
      {...props}
    >
      {/* ── Left Wing: Tactical Intake Arms (Origin Linehaul Hub) ── */}
      {isAnimated ? (
        <motion.g
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Top Left Intake Blade */}
          <polygon
            points="4,5 14,5 21,14.5 12,14.5"
            fill="currentColor"
            opacity="0.92"
          />
          {/* Bottom Left Intake Blade */}
          <polygon
            points="4,31 14,31 21,21.5 12,21.5"
            fill="currentColor"
            opacity="0.92"
          />
        </motion.g>
      ) : (
        <g>
          <polygon
            points="4,5 14,5 21,14.5 12,14.5"
            fill="currentColor"
            opacity="0.92"
          />
          <polygon
            points="4,31 14,31 21,21.5 12,21.5"
            fill="currentColor"
            opacity="0.92"
          />
        </g>
      )}

      {/* ── Right Wing: Express Forward Blades (Destination Air/Surface Hub) ── */}
      {isAnimated ? (
        <motion.g
          animate={{ opacity: [1, 0.85, 1] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Top Right Ascending Air Vector */}
          <polygon
            points="25,5 34,5 28.5,13.5 19.5,13.5"
            fill="currentColor"
            opacity="0.75"
          />
          {/* Bottom Right Surface Linehaul Vector */}
          <polygon
            points="25,31 34,31 28.5,22.5 19.5,22.5"
            fill="currentColor"
            opacity="0.75"
          />
        </motion.g>
      ) : (
        <g>
          <polygon
            points="25,5 34,5 28.5,13.5 19.5,13.5"
            fill="currentColor"
            opacity="0.75"
          />
          <polygon
            points="25,31 34,31 28.5,22.5 19.5,22.5"
            fill="currentColor"
            opacity="0.75"
          />
        </g>
      )}

      {/* ── The Piercing Express Delivery Spear (Forward Velocity Vector) ── */}
      {isAnimated ? (
        <motion.g
          animate={{
            x: [0, 2, 0],
            opacity: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Background Contrast Relief Mask (Ensures crisp separation on any surface) */}
          <polygon
            points="1,13.5 21,13.5 21,8.5 35.5,18 21,27.5 21,22.5 1,22.5 4.5,18"
            fill="var(--background)"
            opacity="0.95"
          />
          {/* High-Contrast Express Spear Shaft & Arrowhead */}
          <polygon
            points="2,15 22,15 22,10 35,18 22,26 22,21 2,21 5.5,18"
            fill="var(--foreground)"
          />
          {/* Kinetic Core Accent Channel */}
          <polygon
            points="12,16.5 20,16.5 22.5,18 20,19.5 12,19.5 14.5,18"
            fill="currentColor"
            opacity="0.65"
          />
        </motion.g>
      ) : (
        <g>
          <polygon
            points="1,13.5 21,13.5 21,8.5 35.5,18 21,27.5 21,22.5 1,22.5 4.5,18"
            fill="var(--background)"
            opacity="0.95"
          />
          <polygon
            points="2,15 22,15 22,10 35,18 22,26 22,21 2,21 5.5,18"
            fill="var(--foreground)"
          />
          <polygon
            points="12,16.5 20,16.5 22.5,18 20,19.5 12,19.5 14.5,18"
            fill="currentColor"
            opacity="0.65"
          />
        </g>
      )}
    </svg>
  )
}

export interface LogoProps extends React.ComponentProps<"div"> {
  showWordmark?: boolean
  showSubtitle?: boolean
  subtitle?: string
  iconClassName?: string
  animated?: boolean
}

export const Logo = ({
  className,
  showWordmark = true,
  showSubtitle = false,
  subtitle = "EXPRESS FREIGHT NETWORK",
  iconClassName,
  animated = true,
  ...props
}: LogoProps) => (
  <div
    className={cn(
      "group inline-flex items-center gap-2.5 select-none",
      className
    )}
    {...props}
  >
    <LogoMark
      animated={animated}
      className={cn(
        "size-8 shrink-0 text-primary transition-transform duration-200 group-hover:scale-105",
        iconClassName
      )}
    />
    <span className="sr-only">TAC-XPRESS</span>
    {showWordmark && (
      <span
        aria-hidden="true"
        className="inline-flex flex-col leading-none"
      >
        <span className="inline-flex items-baseline font-heading tracking-tight">
          <span className="text-[1.125rem] font-black tracking-tight uppercase text-foreground">
            TAC
          </span>
          <span className="inline-block w-[2.5px] h-[1em] bg-primary mx-1.5 -skew-x-[14deg] select-none self-center" />
          <span className="text-[1.125rem] font-black tracking-wide uppercase text-primary">
            XPRESS
          </span>
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-mono font-bold tracking-[0.16em] text-muted-foreground uppercase mt-1">
            {subtitle}
          </span>
        )}
      </span>
    )}
  </div>
)
