"use client"

import React, { useRef } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  type MotionValue,
} from "motion/react"
import { cn } from "@/lib/utils"
import { motionSprings } from "@/lib/motion/motion.theme"

export interface CargoStep {
  number: string
  label: string
}

export const DEFAULT_CARGO_STEPS: CargoStep[] = [
  { number: "01", label: "BOOK" },
  { number: "02", label: "CONFIRM" },
  { number: "03", label: "MOVE" },
  { number: "04", label: "TRACK" },
]

interface LivingCargoLineProps {
  className?: string
  steps?: CargoStep[]
  progress?: MotionValue<number>
  activeStep?: number
  variant?: "stepper" | "rule" | "waypoint"
  showVelocityMarker?: boolean
}

/**
 * Living Cargo Line — The Signature Motion System of TAC-XPRESS
 *
 * Visual States:
 * - Idle: Thin 1px Stone rule
 * - Active: Quiet Indigo progress line
 * - Completed: Solid Indigo waypoint marker
 *
 * Elongates marker subtly during rapid scroll via `useVelocity`.
 */
export function LivingCargoLine({
  className,
  steps = DEFAULT_CARGO_STEPS,
  progress,
  activeStep,
  variant = "stepper",
  showVelocityMarker = true,
}: LivingCargoLineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Internal scroll tracker if no external progress MotionValue is passed
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Smooth scroll progression
  const effectiveProgress = progress ?? scrollYProgress
  const smoothProgress = useSpring(effectiveProgress, motionSprings.springScroll)

  // Scroll velocity calculation for marker elongation
  const scrollVelocity = useVelocity(scrollY)
  const markerScaleX = useTransform(scrollVelocity, [-1200, 0, 1200], [1.8, 1.0, 1.8], {
    clamp: true,
  })

  // Stepper representation
  if (variant === "stepper") {
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className={cn("w-full select-none py-3", className)}
      >
        <div className="relative flex w-full items-center justify-between">
          {/* Background Stone Rail (Idle state: 1px) */}
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/80" />

          {/* Active Quiet Indigo Progress Track */}
          <motion.div
            style={{
              scaleX: shouldReduceMotion ? 1 : smoothProgress,
              transformOrigin: "left",
            }}
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary transition-opacity"
          />

          {/* Progress Waypoint Steps */}
          {steps.map((step, idx) => {
            const stepThreshold = idx / (steps.length - 1)
            const isCompleted = activeStep !== undefined ? activeStep >= idx : false

            return (
              <div key={step.number} className="relative z-10 flex flex-col items-center">
                {/* Waypoint Dot */}
                <div
                  className={cn(
                    "flex size-3 items-center justify-center rounded-none bg-background transition-colors duration-200",
                    isCompleted
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <motion.div
                    style={
                      showVelocityMarker && isCompleted && !shouldReduceMotion
                        ? { scaleX: markerScaleX }
                        : undefined
                    }
                    className={cn(
                      "size-1.5 rounded-none transition-colors duration-200",
                      isCompleted ? "bg-primary" : "border border-border bg-muted/60"
                    )}
                  />
                </div>

                {/* Step Metadata */}
                <div className="mt-2 flex items-center gap-1 font-mono text-[10px] tracking-widest">
                  <span
                    className={cn(
                      "font-semibold transition-colors duration-200",
                      isCompleted ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.number}
                  </span>
                  <span
                    className={cn(
                      "transition-colors duration-200",
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Simple continuous rule variant
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("relative h-px w-full overflow-hidden bg-border/80", className)}
    >
      <motion.div
        style={{
          scaleX: shouldReduceMotion ? 1 : smoothProgress,
          transformOrigin: "left",
        }}
        className="h-full w-full bg-primary"
      />
    </div>
  )
}
