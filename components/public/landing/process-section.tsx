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

  // Dynamic step thresholds for desktop stage
  const step0Opacity = useTransform(smoothProgress, [0, 0.22, 0.3], [1, 1, 0.4])
  const step1Opacity = useTransform(smoothProgress, [0.2, 0.28, 0.48, 0.55], [0.4, 1, 1, 0.4])
  const step2Opacity = useTransform(smoothProgress, [0.45, 0.53, 0.73, 0.8], [0.4, 1, 1, 0.4])
  const step3Opacity = useTransform(smoothProgress, [0.7, 0.78, 1], [0.4, 1, 1])

  // Illustration focal crop & subtle perspective shift across the 4 steps
  const imageScale = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [1.0, 1.03, 1.04, 1.01])
  const imageY = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [0, -6, -12, -8])

  return (
    <EditorialContainer
      id="journey-chapter"
      aria-labelledby="process-heading"
      className="p-0 border-b border-border/80 bg-background"
    >
      {/* ========================================================
          DESKTOP: The Motion Centerpiece (Sticky Storytelling Stage)
          ======================================================== */}
      <div
        ref={containerRef}
        className="relative hidden min-h-[240vh] w-full lg:block"
      >
        <div className="sticky top-20 flex min-h-[calc(100vh-5rem)] w-full flex-col justify-between py-12">
          {/* Top Row: Section Header */}
          <div className="flex items-end justify-between border-b border-border/80 pb-6">
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
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground font-normal text-pretty text-right">
              Scroll controls the Living Cargo Line, step progression, and custodial milestone resolution.
            </p>
          </div>

          {/* Middle Stage: Split Visual & Editorial Narrative */}
          <div className="my-8 grid grid-cols-12 items-center gap-12">
            {/* Left: Step Narrative Cards with Scroll-Linked Visibility */}
            <div className="col-span-5 space-y-6">
              {STEPS.map((step, idx) => {
                const opacities = [step0Opacity, step1Opacity, step2Opacity, step3Opacity]
                const stepOpacity = shouldReduceMotion ? 1 : opacities[idx]

                return (
                  <motion.div
                    key={step.num}
                    style={{ opacity: stepOpacity }}
                    className="border-l-2 border-primary/40 pl-5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <span className="font-semibold text-primary">{step.num}</span>
                      <span className="uppercase tracking-wider text-muted-foreground">
                        {step.label}
                      </span>
                    </div>
                    <h3 className="mt-1 font-heading text-xl font-medium tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Right: Architectural Illustration with Focal Transition */}
            <div className="col-span-7">
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
                    className="object-cover select-none"
                    sizes="(min-width: 1280px) 720px, 50vw"
                  />
                </motion.div>
                <div className="flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
                  <span>Corridor Custodial Continuum</span>
                  <span>Living Cargo Line Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Rail: The Living Cargo Line Signature Stepper */}
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
              {STEPS.map((step, idx) => (
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

      {/* ========================================================
          MOBILE: Clean Vertical Narrative (Zero Sticky Obstruction)
          ======================================================== */}
      <div className="space-y-10 py-10 sm:py-16 lg:hidden">
        <div>
          <SectionEyebrow className="mb-3">03 Journey · Process</SectionEyebrow>
          <h2
            style={{ fontSize: "var(--type-section)" }}
            className="font-heading font-medium tracking-tight text-foreground leading-[1.06] text-balance"
          >
            Four steps.
            <br />
            <span className="text-muted-foreground/90">One clear journey.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A linear custodial chain designed for zero ambiguity.
          </p>
        </div>

        {/* Mobile Vertical Cargo Line & Steps */}
        <div className="relative ml-2 space-y-8 border-l border-primary/40 pl-5">
          {STEPS.map((step) => (
            <div key={step.num} className="relative">
              <span className="absolute -left-[27px] top-1 size-3 rounded-full border-2 border-primary bg-background" />
              <div className="font-mono text-xs font-semibold text-primary">
                {step.num} · {step.label}
              </div>
              <h3
                style={{ fontSize: "var(--type-sub)" }}
                className="mt-1 font-heading font-medium tracking-tight text-foreground"
              >
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </EditorialContainer>
  )
}
