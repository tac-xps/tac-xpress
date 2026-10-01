"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { Check, Truck, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AnimatedParcelProps {
  status?: string
  className?: string
  size?: number
}

/**
 * Animated SVG parcel icon engineered with Motion:
 * - Isometric 3D box SVG with progressive path drawing on mount.
 * - Continuous breathable floating levitation with synchronized dynamic contact shadow.
 * - Tactile cursor hover (spring elevation + tilt) and press reaction.
 * - Status-aware celebration micro-badge (Delivered / In-Transit / Pending).
 * - Animated tape seam glint.
 * - WCAG prefers-reduced-motion compliance via useReducedMotion.
 */
export function AnimatedParcel({
  status = "delivered",
  className,
  size = 128,
}: AnimatedParcelProps) {
  const shouldReduceMotion = useReducedMotion()
  const normalizedStatus = status.toLowerCase()
  const isDelivered = normalizedStatus.includes("deliver")
  const isInTransit =
    normalizedStatus.includes("transit") ||
    normalizedStatus.includes("hub") ||
    normalizedStatus.includes("out-for-delivery") ||
    normalizedStatus.includes("picked")

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none cursor-pointer group",
        className
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Animated cargo parcel, status: ${status}`}
    >
      {/* Ground Contact Shadow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-3.5 w-24 rounded-full bg-primary/20 blur-[2px]"
        initial={shouldReduceMotion ? { opacity: 0.25 } : { opacity: 0, scale: 0.7 }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.25, scaleX: 1, scaleY: 1 }
            : {
                opacity: [0.35, 0.16, 0.35],
                scaleX: [1, 0.82, 1],
                scaleY: [1, 0.7, 1],
                transition: {
                  repeat: Infinity,
                  duration: 3.6,
                  ease: "easeInOut",
                },
              }
        }
      />

      {/* Floating Levitation Wrapper */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.85 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
            : {
                opacity: 1,
                y: [0, -8, 0],
                rotate: [0, -1.2, 1.2, 0],
                transition: {
                  opacity: { duration: 0.4 },
                  y: { repeat: Infinity, duration: 3.6, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 3.6, ease: "easeInOut" },
                },
              }
        }
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -12,
                scale: 1.06,
                rotate: -2.5,
                transition: { type: "spring", stiffness: 350, damping: 15 },
              }
        }
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94, y: -2 }}
      >
        {/* The SVG Parcel */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-32 w-32 text-primary/85 drop-shadow-md transition-colors group-hover:text-primary"
        >
          {/* Subtle Isometric Facet fills for tactile 3D volume */}
          <motion.polygon
            points="12,2.27 20.71,7 12,12 3.29,7"
            fill="currentColor"
            fillOpacity={0.07}
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          />
          <motion.polygon
            points="3.29,7 12,12 12,21.73 3.29,16.73"
            fill="currentColor"
            fillOpacity={0.035}
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          />
          <motion.polygon
            points="12,12 20.71,7 20.71,16.73 12,21.73"
            fill="currentColor"
            fillOpacity={0.09}
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          />

          {/* Outer isometric cube path */}
          <motion.path
            d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Center vertical seam */}
          <motion.path
            d="M12 22V12"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Top flap creases */}
          <motion.polyline
            points="3.29 7 12 12 20.71 7"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Top diagonal packaging tape */}
          <motion.path
            d="m7.5 4.27 9 5.15"
            strokeWidth={1.8}
            className="stroke-primary"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Tape Glint Particle traveling across the sealed seam */}
          {!shouldReduceMotion && (
            <motion.circle
              r={0.9}
              fill="currentColor"
              className="text-primary-foreground/90 filter drop-shadow-[0_0_2px_currentColor]"
              animate={{
                cx: [7.5, 16.5, 16.5, 7.5],
                cy: [4.27, 9.42, 9.42, 4.27],
                opacity: [0, 0.95, 0, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                times: [0, 0.35, 0.4, 1],
                delay: 1.2,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.svg>

        {/* Status Accent Badge in the upper-right corner */}
        {isDelivered && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : { scale: 0, opacity: 0, rotate: -25 }
            }
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 380, damping: 16 }}
            className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-status-delivered text-status-delivered-foreground shadow-md ring-2 ring-card"
            title="Shipment Delivered"
          >
            <Check className="size-4 stroke-[2.75]" />
            {!shouldReduceMotion && (
              <motion.span
                className="absolute inset-0 rounded-full ring-2 ring-status-delivered"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
              />
            )}
          </motion.div>
        )}

        {isInTransit && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : { scale: 0, opacity: 0, rotate: -25 }
            }
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 380, damping: 16 }}
            className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-card"
            title="In Transit"
          >
            <Truck className="size-3.5" />
            {!shouldReduceMotion && (
              <motion.span
                className="absolute inset-0 rounded-full ring-2 ring-primary"
                animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        )}

        {!isDelivered && !isInTransit && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 350, damping: 18 }}
            className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-sm ring-2 ring-card"
            title="Status: Pending"
          >
            <Clock className="size-3.5" />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
