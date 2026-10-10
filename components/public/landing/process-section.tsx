"use client"

import React, { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { BorderBeam } from "@/components/ui/border-beam"
import { motionSprings } from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    num: "01",
    label: "BOOK",
    title: "Book",
    description: "Share the details of your shipment.",
  },
  {
    num: "02",
    label: "CONFIRM",
    title: "Confirm",
    description: "Review the booking details and next steps.",
  },
  {
    num: "03",
    label: "MOVE",
    title: "Move",
    description: "Your cargo travels through the selected service.",
  },
  {
    num: "04",
    label: "TRACK",
    title: "Track",
    description: "Check the latest recorded milestone.",
  },
]

/**
 * Process section — The signature motion centerpiece of TAC-XPRESS.
 * Showcases the 4-stage freight journey driven by the Living Cargo Line
 * with calibrated desktop scroll progression and compact mobile flow.
 */
export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [activeStep, setActiveStep] = useState<number>(0)

  // Primary scroll tracker with controlled 150vh travel distance
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth scroll progression via calibrated spring
  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  // Synchronize active step with scroll progress
  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      if (latest < 0.28) {
        setActiveStep(0)
      } else if (latest < 0.55) {
        setActiveStep(1)
      } else if (latest < 0.82) {
        setActiveStep(2)
      } else {
        setActiveStep(3)
      }
    })
  }, [smoothProgress])

  // Subtle velocity responsiveness for cargo line marker elongation
  const scrollVelocity = useVelocity(scrollY)
  const velocityScaleX = useTransform(scrollVelocity, [-1200, 0, 1200], [1.6, 1.0, 1.6], {
    clamp: true,
  })

  return (
    <EditorialContainer
      id="journey-chapter"
      aria-labelledby="process-heading"
      className="p-0 border-b border-border/80 bg-background"
    >
      <div
        ref={containerRef}
        className="relative w-full lg:min-h-[150vh]"
      >
        <div className="flex w-full flex-col justify-between py-12 sm:py-16 lg:sticky lg:top-20 lg:py-14">
          {/* Top Row: Section Header */}
          <div className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionEyebrow className="mb-3">
                Living Cargo Line · Dispatch Lifecycle
              </SectionEyebrow>
              <h2
                id="process-heading"
                className="text-section text-foreground"
              >
                Four steps. One clear journey.
              </h2>
            </div>
            <p className="max-w-md text-lead md:text-right">
              From consignment booking to handover.
            </p>
          </div>

          {/* Middle Stage: 4-Step Architectural Journey Cards */}
          <div className="my-8 sm:my-10 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx
              const isPassed = activeStep > idx

              return (
                <div
                  key={step.num}
                  className={cn(
                    "relative overflow-hidden flex flex-col justify-between border p-5 sm:p-6 transition-all duration-300",
                    isActive
                      ? "border-primary bg-primary/5 shadow-xs"
                      : isPassed
                      ? "border-border/80 bg-card"
                      : "border-border/60 bg-card/60"
                  )}
                >
                  {isActive && (
                    <BorderBeam
                      size={60}
                      duration={6}
                      colorFrom="var(--color-primary)"
                      colorTo="transparent"
                      borderWidth={1}
                    />
                  )}
                  <div>
                    {/* Step Identifier */}
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span
                        className={cn(
                          "font-semibold transition-colors",
                          isActive ? "text-primary font-bold" : "text-muted-foreground"
                        )}
                      >
                        {step.num}
                      </span>
                      <span
                        className={cn(
                          "rounded-none px-2 py-0.5 font-sans text-[10px] uppercase tracking-wider font-semibold transition-colors",
                          isActive
                            ? "border border-primary/30 bg-primary/10 text-primary"
                            : "border border-border/60 bg-muted/40 text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3
                      style={{ fontSize: "var(--type-sub)" }}
                      className={cn(
                        "mt-4 font-heading font-semibold tracking-[-0.015em] transition-colors",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                    >
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="mt-2 text-body-editorial">
                      {step.description}
                    </p>
                  </div>

                  {/* Active Step Indicator Accent */}
                  <div className="mt-6 border-t border-border/60 pt-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                      <span
                        className={cn(
                          "size-1.5 transition-colors",
                          isActive
                            ? "bg-primary"
                            : isPassed
                            ? "bg-status-delivered"
                            : "bg-muted-foreground/40"
                        )}
                      />
                      <span
                        className={cn(
                          "transition-colors",
                          isActive
                            ? "text-primary font-semibold"
                            : "text-muted-foreground font-medium"
                        )}
                      >
                        {isActive ? "Active step" : isPassed ? "Completed" : "Queued"}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Stage: The Living Cargo Line Continuous Progress Track */}
          <div className="relative border-t border-border/80 pt-6">
            <div className="relative flex w-full items-center justify-between">
              {/* Background 1px Stone Track */}
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/80" />

              {/* Active Quiet Indigo Line Linked to Scroll */}
              <motion.div
                style={{
                  scaleX: shouldReduceMotion ? 1 : smoothProgress,
                  transformOrigin: "left",
                }}
                className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary"
              />

              {/* Waypoint Milestones */}
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx
                const isPassed = activeStep >= idx

                return (
                  <div key={step.num} className="relative z-10 flex flex-col items-center">
                    <div className="flex size-4 items-center justify-center rounded-none bg-background">
                      <motion.div
                        style={
                          shouldReduceMotion
                            ? undefined
                            : { scaleX: velocityScaleX }
                        }
                        className={cn(
                          "size-2 rounded-none transition-colors duration-200",
                          isPassed ? "bg-primary" : "border border-border bg-muted"
                        )}
                      />
                    </div>
                    <div className="mt-2 font-mono text-[11px] tracking-wider">
                      <span
                        className={cn(
                          "font-semibold transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {step.num}
                      </span>{" "}
                      <span
                        className={cn(
                          "transition-colors",
                          isActive ? "text-foreground font-medium" : "text-muted-foreground"
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
        </div>
      </div>
    </EditorialContainer>
  )
}
