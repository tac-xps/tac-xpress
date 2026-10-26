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
  motionEasings,
} from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"
import PageFlip from "@/components/kokonutui/page-flip"

const STEPS = [
  {
    num: "01",
    label: "INTAKE",
    title: "Consignment Intake",
    lead: "Route & dimensional audit.",
    color: "text-primary",
    activeBorder: "border-primary",
    badge: "border-primary/40 bg-primary/10 text-primary",
    description:
      "Register corridor route, piece counts, and dimensions for instant freight billing.",
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
      "Issue 10-digit Air Waybills with verified E-Way bills and security checks.",
  },
  {
    num: "03",
    label: "LINEHAUL",
    title: "Arterial Transit",
    lead: "Scheduled movement.",
    color: "text-status-pending",
    activeBorder: "border-status-pending",
    badge: "border-status-pending/40 bg-status-pending/10 text-status-pending",
    description:
      "Flight belly-hold departures and sealed highway fleets with gate checkpoint scans.",
  },
  {
    num: "04",
    label: "HANDOVER",
    title: "Custodial Delivery",
    lead: "Verified sign-off.",
    color: "text-status-delivered",
    activeBorder: "border-status-delivered",
    badge: "border-status-delivered/40 bg-status-delivered/10 text-status-delivered",
    description:
      "Terminal unloading with physical condition audit and digital proof of delivery.",
  },
]

/**
 * Process section: The signature motion centerpiece of TAC-XPRESS.
 * Showcases the 4-stage freight journey driven by the Living Cargo Line
 * with calibrated desktop scroll progression and compact mobile flow.
 */
export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [activeStep, setActiveStep] = useState<number>(0)

  // Track progress through the section content without an artificial spacer.
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
      <div ref={containerRef} className="relative w-full">
        <div className="flex w-full flex-col justify-between py-12 sm:py-16 lg:sticky lg:top-20 lg:py-14">
          {/* Top Row: Section Header */}
          <div
            className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h2
                id="process-heading"
                className="text-section text-foreground text-balance"
              >
                <span className="font-medium text-foreground/80">Four steps. </span>
                <span className="font-semibold text-foreground">
                  One clear journey<span className="font-semibold text-primary">.</span>
                </span>
              </h2>
            </div>
            <div className="max-w-md md:text-right space-y-1.5">
              <p className="text-sm sm:text-base font-medium text-foreground leading-snug">
                Continuous chain-of-custody.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
                Four operational phases guarantee statutory booking, ramp clearance, arterial dispatch, and signed handover.
              </p>
            </div>
          </div>

          {/* Middle Stage: 4-Step Architectural Journey Cards */}
          <div data-slot="process-stepper" className="my-8 sm:my-10 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx
              const isPassed = activeStep > idx

              return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: isActive ? 1.0 : 0.985,
                          }
                    }
                    transition={{
                      duration: 0.2,
                      delay: Math.min(idx, 5) * 0.05,
                      ease: motionEasings.editorial,
                      scale: motionSprings.springTactile,
                    }}
                    className={cn(
                      "relative overflow-hidden flex flex-col justify-between border p-5 sm:p-6 transition-colors",
                      isActive
                        ? cn(step.activeBorder, "bg-card shadow-sm")
                        : isPassed
                        ? "border-border/80 bg-card"
                        : "border-border/60 bg-card"
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
                      <div className="flex items-start justify-between">
                        <span
                          className={cn(
                            "font-mono text-3xl font-semibold tracking-tight transition-colors select-none sm:text-4xl",
                            isActive ? step.color : "text-foreground/20 group-hover:text-foreground/40"
                          )}
                        >
                          {step.num}
                        </span>
                        <span
                          className={cn(
                            "rounded-none px-2 py-0.5 font-sans text-xs font-semibold transition-colors",
                            isActive
                              ? step.badge
                              : "border border-border/70 bg-muted/30 text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* Step Title */}
                      <h3
                        className={cn(
                          "mt-4 font-heading text-lg font-semibold tracking-tight transition-colors text-balance sm:text-xl",
                          isActive ? step.color : "text-foreground"
                        )}
                      >
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      <p className="mt-2 text-sm text-foreground/90 font-medium leading-snug">
                        {step.lead}
                      </p>
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
                        {step.description}
                      </p>
                    </div>

                    {/* Active Step Indicator Accent */}
                    <div className="mt-6 border-t border-border/60 pt-3">
                      <div className="flex items-center gap-2 font-sans text-xs">
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
                              ? cn(step.color, "font-medium")
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

            {/* Illustrated shipment record for the four-stage process. */}
            <div
              data-slot="shipment-manifest-preview"
              className="my-8 border-l-2 border-l-info border-t border-r border-b border-border/80 bg-card p-6 shadow-sm rounded-none"
            >
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-md">
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                    One record. Every handoff.
                  </h3>
                  <div className="mt-1.5 flex items-center gap-2 font-sans text-xs text-info font-medium">
                    <span className="size-1.5 bg-info rounded-none" />
                    Cargo journey record
                  </div>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
                    Turn through booking, statutory checks, transit scans and verified delivery.
                  </p>
                </div>

                <div className="w-full xl:max-w-xl">
                  <PageFlip
                    ariaLabel="Illustrated cargo journey record"
                    className="mx-auto"
                    pages={[
                      <div key="cover" className="flex size-full flex-col justify-between border border-border p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2 font-mono text-xs">
                          <span className="font-semibold">TAC-XPRESS</span>
                          <span className="text-muted-foreground">Journey record</span>
                        </div>
                        <div>
                          <p className="font-mono text-xs font-medium tracking-wider text-primary">DEL <span aria-hidden="true">/</span> IMF</p>
                          <h4 className="mt-2 max-w-48 font-heading text-xl font-semibold leading-tight tracking-tight text-balance">One clear cargo journey.</h4>
                          <p className="mt-2 max-w-64 text-sm leading-relaxed text-muted-foreground">The shipment record, from booking to handover.</p>
                        </div>
                        <p className="border-t border-border pt-2 font-mono text-xs text-muted-foreground">Illustrative record</p>
                      </div>,
                      <div key="booking" className="flex size-full flex-col p-4 sm:p-5">
                        <p className="font-mono text-xs uppercase tracking-wider text-info">01 / Intake</p>
                        <h4 className="mt-2 font-heading text-lg font-semibold leading-tight tracking-tight">Booking details</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">The shipment is registered before dispatch.</p>
                        <dl className="mt-4 grid gap-3 text-sm">
                          <div className="border-t border-border pt-2">
                            <dt className="text-xs text-muted-foreground">Route</dt>
                            <dd className="mt-0.5 font-medium">Origin and destination recorded</dd>
                          </div>
                          <div className="border-t border-border pt-2">
                            <dt className="text-xs text-muted-foreground">Cargo</dt>
                            <dd className="mt-0.5 font-medium">Pieces and chargeable weight logged</dd>
                          </div>
                        </dl>
                      </div>,
                      <div key="clearance" className="flex size-full flex-col p-4 sm:p-5">
                        <p className="font-mono text-xs uppercase tracking-wider text-info">02 / Clearance</p>
                        <h4 className="mt-2 font-heading text-lg font-semibold leading-tight tracking-tight">AWB and checks</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Required records are checked before linehaul.</p>
                        <ul className="mt-4 flex flex-col gap-3 text-sm">
                          <li className="border-t border-border pt-2">
                            <span className="block text-xs text-muted-foreground">Air Waybill</span>
                            Unique shipment record issued
                          </li>
                          <li className="border-t border-border pt-2">
                            <span className="block text-xs text-muted-foreground">Compliance</span>
                            E-Way bill and screening reviewed
                          </li>
                        </ul>
                      </div>,
                      <div key="handover" className="flex size-full flex-col p-4 sm:p-5">
                        <p className="font-mono text-xs uppercase tracking-wider text-info">03–04 / Transit & handover</p>
                        <h4 className="mt-2 font-heading text-lg font-semibold leading-tight tracking-tight">Custody stays visible</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Gateway scans trace movement between terminals.</p>
                        <div className="mt-4 border-t border-border pt-2 text-sm">
                          <span className="block text-xs text-muted-foreground">Delivery record</span>
                          Condition check and proof of delivery
                        </div>
                      </div>,
                    ]}
                  />
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Tap or drag a page, or use the arrows.
                  </p>
                </div>
              </div>
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
                      <div className="mt-2 font-mono text-xs">
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
                            "sr-only transition-colors sm:not-sr-only",
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
