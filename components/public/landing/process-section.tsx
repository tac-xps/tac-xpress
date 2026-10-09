"use client"

import React, { useRef } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { motionSprings } from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    num: "01",
    label: "BOOK",
    title: "Consignment Intake & Registration",
    subtitle: "Share consignment details",
    description:
      "Specify collection address, destination hub, piece count, volumetric dimensions, and gross weight with requested delivery schedule.",
    focalDescription: "Collection dock intake with verified package geometry and airway documentation.",
  },
  {
    num: "02",
    label: "CONFIRM",
    title: "Space Allocation & Rate Finalization",
    subtitle: "Verify lane & statutory requirements",
    description:
      "Our dispatch controllers verify flight or road cargo space, compute transparent itemized GST pricing, and issue your booking confirmation.",
    focalDescription: "Gateway capacity verified with scheduled airline linehaul departure slots.",
  },
  {
    num: "03",
    label: "MOVE",
    title: "Secure Arterial Linehaul Transit",
    subtitle: "Secure linehaul transit",
    description:
      "Consignments enter our arterial corridor with tamper-evident sealing, weather protection, and continuous custodial chain oversight.",
    focalDescription: "Arterial transit along dedicated high-speed highway corridors and air lanes.",
  },
  {
    num: "04",
    label: "TRACK",
    title: "Milestone Logging & Handover",
    subtitle: "Follow verified milestones",
    description:
      "Trace optical physical barcode events online through our public console until signed proof-of-delivery handover is achieved.",
    focalDescription: "Destination station sorting followed by verified recipient signature handover.",
  },
]

/**
 * Process section presenting the 4-stage freight journey with scroll-synced
 * progressive step highlights and focal waypoint indicators.
 */
export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Primary scroll tracker across the taller storytelling stage
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth scroll progression via calibrated spring
  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  // Subtle velocity responsiveness for cargo line marker elongation
  const scrollVelocity = useVelocity(scrollY)
  const velocityScaleX = useTransform(scrollVelocity, [-1200, 0, 1200], [1.7, 1.0, 1.7], {
    clamp: true,
  })

  // Illustration focal crop & subtle perspective shift across the 4 steps
  const imageScale = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [1.0, 1.03, 1.04, 1.01])
  const imageY = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [0, -6, -12, -8])

  return (
    <EditorialContainer
      id="journey-chapter"
      aria-labelledby="process-heading"
      className="p-0 border-b border-border/80 bg-background"
    >
      <div
        ref={containerRef}
        className="relative w-full lg:min-h-[240vh]"
      >
        <div className="flex w-full flex-col justify-between py-10 sm:py-16 lg:sticky lg:top-20 lg:min-h-[calc(100vh-5rem)] lg:py-12">
          {/* Top Row: Section Header */}
          <div className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionEyebrow className="mb-3">
                03 Journey · Primary Motion Centerpiece
              </SectionEyebrow>
              <h2
                id="process-heading"
                style={{ fontSize: "var(--type-section)" }}
                className="font-heading font-medium tracking-tight text-foreground leading-[1.06] text-balance"
              >
                Four steps. One clear journey.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground font-normal text-pretty md:text-right">
              Scroll controls the Living Cargo Line, step progression, and custodial milestone resolution.
            </p>
          </div>

          {/* Middle Stage: Split Visual & Editorial Narrative */}
          <div className="my-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Step Narrative Cards */}
            <div className="order-2 space-y-6 lg:order-1 lg:col-span-5">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="border-l-2 border-primary/60 pl-5 transition-colors"
                >
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <span className="font-semibold text-primary">{step.num}</span>
                    <span className="uppercase tracking-wider text-muted-foreground font-medium">
                      {step.label}
                    </span>
                  </div>
                  <h3 className="mt-1 font-heading text-xl font-medium tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Architectural Illustration with Focal Transition (Single Image in DOM, visible on all screens) */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="relative overflow-hidden border border-border/80 bg-card shadow-sm">
                <motion.div
                  style={
                    shouldReduceMotion
                      ? undefined
                      : { scale: imageScale, y: imageY }
                  }
                  className="relative aspect-16/10 w-full overflow-hidden"
                >
                  <Image
                    src="/images/logistics/journey.webp"
                    alt="Living Logistics Corridor illustration detailing multi-modal progression"
                    fill
                    className="object-cover select-none motion-reduce:transform-none motion-reduce:transition-none"
                    sizes="(min-width: 1280px) 720px, 100vw"
                  />
                </motion.div>
                <div className="flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
                  <span>Corridor Custodial Continuum</span>
                  <span>Living Cargo Line Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Rail: The Living Cargo Line Signature Stepper (Desktop Only) */}
          <div className="relative hidden border-t border-border/80 pt-6 lg:block">
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
              {STEPS.map((step) => (
                <div key={step.num} className="relative z-10 flex flex-col items-center">
                  <div className="flex size-4 items-center justify-center rounded-full bg-background">
                    <motion.div
                      style={
                        shouldReduceMotion
                          ? undefined
                          : { scaleX: velocityScaleX }
                      }
                      className="size-2 rounded-full bg-primary"
                    />
                  </div>
                  <div className="mt-2 font-mono text-[11px] tracking-wider">
                    <span className="font-semibold text-primary">{step.num}</span>{" "}
                    <span className="text-foreground">{step.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
