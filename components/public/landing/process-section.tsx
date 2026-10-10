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
import {
  motionSprings,
  motionDurations,
  motionEasings,
  editorialReveal,
} from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    num: "01",
    label: "INTAKE",
    title: "Consignment Intake",
    lead: "Route & dimensional registration.",
    color: "text-primary",
    activeBorder: "border-primary",
    badge: "border-primary/40 bg-primary/10 text-primary",
    description:
      "Register corridor origin, destination, piece counts, and volumetric weight to generate immediate GST-itemized freight estimates.",
  },
  {
    num: "02",
    label: "CLEARANCE",
    title: "Statutory Booking",
    lead: "Air Waybill generation.",
    color: "text-info",
    activeBorder: "border-info",
    badge: "border-info/40 bg-info/10 text-info",
    description:
      "Issue unique 10-digit Air Waybill (AWB) documents with mandatory E-Way bill verification, consignor declarations, and security audit.",
  },
  {
    num: "03",
    label: "LINEHAUL",
    title: "Arterial Transit",
    lead: "Scheduled gateway movement.",
    color: "text-status-pending",
    activeBorder: "border-status-pending",
    badge: "border-status-pending/40 bg-status-pending/10 text-status-pending",
    description:
      "Cargo departs via commercial flight belly-hold space or sealed container highway fleets with optical gate checkpoint scans.",
  },
  {
    num: "04",
    label: "HANDOVER",
    title: "Custodial Delivery",
    lead: "Verified destination sign-off.",
    color: "text-status-delivered",
    activeBorder: "border-status-delivered",
    badge: "border-status-delivered/40 bg-status-delivered/10 text-status-delivered",
    description:
      "Consignment is unloaded at the regional destination terminal with physical package condition audit and digital proof of delivery.",
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
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: motionDurations.editorial,
              ease: motionEasings.editorial,
            }}
            className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between"
          >
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
            <p className="max-w-md text-lead md:text-right text-muted-foreground leading-relaxed font-normal">
              Continuous chain-of-custody. Four coordinated operational phases guarantee transparent statutory intake, manifest security clearance, linehaul dispatch, and signed destination handover.
            </p>
          </motion.div>

          {/* Middle Stage: 4-Step Architectural Journey Cards */}
          <div className="my-8 sm:my-10 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx
              const isPassed = activeStep > idx

              return (
                  <motion.div
                    key={step.num}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: isActive ? 1.0 : 0.985,
                            opacity: isActive ? 1 : 0.88,
                          }
                    }
                    transition={{
                      duration: motionDurations.reveal,
                      delay: idx * 0.08,
                      ease: motionEasings.editorial,
                      scale: motionSprings.springTactile,
                    }}
                    className={cn(
                      "relative overflow-hidden flex flex-col justify-between border p-5 sm:p-6 transition-colors duration-300",
                      isActive
                        ? cn(step.activeBorder, "bg-card shadow-sm")
                        : isPassed
                        ? "border-border/80 bg-card"
                        : "border-border/60 bg-card/60"
                    )}
                  >
                    {isActive && (
                      <BorderBeam
                        size={60}
                        duration={6}
                        colorFrom={
                          idx === 0
                            ? "var(--color-primary)"
                            : idx === 1
                            ? "var(--color-info)"
                            : idx === 2
                            ? "var(--color-status-pending)"
                            : "var(--color-status-delivered)"
                        }
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
                            isActive ? cn(step.color, "font-bold") : "text-muted-foreground"
                          )}
                        >
                          {step.num}
                        </span>
                        <span
                          className={cn(
                            "rounded-none px-2 py-0.5 font-sans text-xs uppercase tracking-wider font-semibold transition-colors",
                            isActive
                              ? step.badge
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
                          isActive ? step.color : "text-foreground"
                        )}
                      >
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      <p className="mt-2.5 text-body-editorial text-muted-foreground leading-relaxed font-normal">
                        {step.lead} {step.description}
                      </p>
                    </div>

                    {/* Active Step Indicator Accent */}
                    <div className="mt-6 border-t border-border/60 pt-3">
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
                        <span
                          className={cn(
                            "size-1.5 transition-colors",
                            isActive
                              ? idx === 0
                                ? "bg-primary"
                                : idx === 1
                                ? "bg-info"
                                : idx === 2
                                ? "bg-status-pending"
                                : "bg-status-delivered"
                              : isPassed
                              ? "bg-status-delivered"
                              : "bg-muted-foreground/40"
                          )}
                        />
                        <span
                          className={cn(
                            "transition-colors",
                            isActive
                              ? cn(step.color, "font-semibold")
                              : "text-muted-foreground font-medium"
                          )}
                        >
                          {isActive ? "Active step" : isPassed ? "Completed" : "Queued"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
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
                      <div className="mt-2 font-mono text-xs tracking-wider">
                        <span
                          className={cn(
                            "font-semibold transition-colors",
                            isActive ? step.color : "text-muted-foreground"
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
