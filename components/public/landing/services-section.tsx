"use client"

import React, { useRef } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react"
import Link from "next/link"
import { Plane, Truck, PackageCheck, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { LivingCargoLine } from "./living-cargo-line"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  motionSprings,
  motionDurations,
  motionEasings,
} from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"
import CardFlip from "@/components/kokonutui/card-flip"

const MotionImage = motion.create(Image)

const SERVICES = [
  {
    icon: Plane,
    num: "01",
    title: "Air cargo",
    href: "/services/air-cargo",
    action: "View air cargo specifications",
    tagline: "24 to 48h Air Gateway",
    lead: "Scheduled air freight.",
    color: "text-primary",
    description: "Priority belly-hold space connecting Delhi with Northeast airports under statutory AWB processing.",
    specs: [
      { label: "Transit", value: "24 to 48h Gateway" },
      { label: "Carriage", value: "Statutory AWB" },
    ],
    regulatory: [
      { label: "Divisor", value: "cm³ / 5000" },
      { label: "Cutoff", value: "T-180m Departure" },
    ],
  },
  {
    icon: Truck,
    num: "02",
    title: "Surface cargo",
    href: "/services/surface-cargo",
    action: "View surface cargo specifications",
    tagline: "National Arterial Linehaul",
    lead: "Arterial express highway.",
    color: "text-info",
    description: "Express highway linehaul for palletized consignments with sealed container security and checkpoint scans.",
    specs: [
      { label: "Freight", value: "Palletized Axle" },
      { label: "Security", value: "GPS E-Seal" },
    ],
    regulatory: [
      { label: "Divisor", value: "cm³ / 4000" },
      { label: "Documentation", value: "E-Way Bill" },
    ],
  },
  {
    icon: PackageCheck,
    num: "03",
    title: "Door-to-door",
    href: "/shipping-guide",
    action: "Read the shipping guide",
    tagline: "Unified Custody Chain",
    lead: "Single accountable chain.",
    color: "text-status-delivered",
    description: "Direct intake from origin dock to final delivery with verified custodial custody and digital proof of delivery.",
    specs: [
      { label: "Intake", value: "Dock Intake" },
      { label: "Sign-off", value: "Geotagged POD" },
    ],
    regulatory: [
      { label: "Custody", value: "Barcode Docket" },
      { label: "SLA", value: "Real-time Sync" },
    ],
  },
]

/**
 * Services showcase section displaying core multi-modal freight offerings
 * with scroll-driven cinematic corridor panorama revealing transit corridors.
 */
export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Track scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  // Motion Official "Scroll Image Reveal" (clipPath & subtle scale settle)
  // inset(top right bottom left) expands from horizontal margins as section enters
  const clipInsetX = useTransform(smoothProgress, [0.15, 0.45], [8, 0])
  const imageClipPath = useTransform(
    clipInsetX,
    (val) => `inset(0% ${val}% 0% ${val}%)`
  )
  const imageScale = useTransform(smoothProgress, [0.15, 0.55], [1.02, 1.0])
  const imageOpacity = useTransform(smoothProgress, [0.1, 0.35], [0.94, 1.0])

  // Subtle focal shift: Air (upper/aircraft) -> Surface (center highway) -> Door (lower corridor)
  const objectPosition = useTransform(
    smoothProgress,
    [0.3, 0.6, 0.9],
    ["center 40%", "center 50%", "center 60%"]
  )

  // Active waypoint state based on scroll progress
  const activeWaypoint = useTransform(smoothProgress, [0.35, 0.6, 0.85], [0, 1, 2])

  return (
    <EditorialContainer
      ref={containerRef}
      id="services"
      as="div"
      aria-labelledby="services-heading"
      className="bg-muted/15 py-10 sm:py-16 lg:py-20"
    >
      <div className="flex flex-col space-y-10 lg:space-y-14">
        {/* Section Header: S1 entrance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionDurations.editorial,
            ease: motionEasings.editorial,
          }}
          className="grid grid-cols-1 items-end gap-6 md:grid-cols-12"
        >
          <div className="md:col-span-8">
            <h2
              id="services-heading"
              className="text-section text-foreground text-balance"
            >
              <span className="font-medium text-foreground/80">Your cargo. </span>
              <span className="font-semibold text-foreground">
                The right journey<span className="font-semibold text-primary">.</span>
              </span>
            </h2>
            <p className="mt-2 text-xs font-sans text-muted-foreground font-medium">Services &amp; Modalities</p>
          </div>
          <div className="md:col-span-4">
            <p className="text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
              High-priority commercial aviation and arterial linehaul matched to payload dimensions and destination cutoffs.
            </p>
          </div>
        </motion.div>

        {/* Master Editorial Image: Official Scroll Image Reveal (journey.webp) */}
        <div className="relative overflow-hidden border border-border/80 bg-card shadow-sm">
          <BorderBeam size={100} duration={14} colorFrom="var(--color-primary)" colorTo="transparent" borderWidth={1} />
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : {
                    clipPath: imageClipPath,
                    scale: imageScale,
                    opacity: imageOpacity,
                  }
            }
            className="relative aspect-16/9 w-full overflow-hidden"
          >
            <motion.div
              className="relative h-full w-full"
            >
              <MotionImage
                src="/images/corridor-ink/journey-modal.png"
                alt="Panoramic multi-modal logistics corridor across modern Indian metropolis with arterial expressway, container linehaul, rapid rail, and ascending aircraft"
                fill
                priority={true}
                loading="eager"
                style={{ objectPosition }}
                className="object-cover select-none motion-reduce:transform-none motion-reduce:transition-none"
                sizes="(min-width: 1360px) 1264px, 100vw"
              />
            </motion.div>
          </motion.div>

          {/* Architectural caption bar */}
          <div className="flex items-center justify-between border-t border-border/80 bg-background px-4 py-2.5 font-sans text-xs text-foreground/80">
            <span className="font-medium text-foreground">Arterial Linehaul &amp; Commercial Aviation</span>
            <span className="hidden sm:inline text-muted-foreground font-medium">Delhi NCR Corridor to Northeast Expressways</span>
          </div>
        </div>

        {/* Signature Connector Cargo Line */}
        <LivingCargoLine variant="rule" />

        {/* Three Service Modalities with Kokonut UI 3D CardFlip */}
        <div data-slot="service-cards" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon

            const frontFace = (
              <div className="flex h-full flex-col bg-card text-foreground overflow-hidden">
                {/* Accent Header Strip */}
                <div className="relative flex items-center justify-between border-b border-border/70 bg-muted/30 px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={cn("font-mono text-sm font-black tracking-tight tabular-nums shrink-0", srv.color)}>
                      {srv.num}
                    </span>
                    <span className="font-sans text-xs font-medium text-muted-foreground truncate">
                      {srv.tagline}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    {/* Title with inline icon */}
                    <div className="relative mb-3">
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("size-5 shrink-0", srv.color)} />
                        <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                          {srv.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-foreground/90 leading-snug">
                        {srv.lead}
                      </p>
                    </div>

                    {/* Accent rule */}
                    <div className={cn("mb-3 h-px w-10", srv.color.replace("text-", "bg-"))} />

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                      {srv.description}
                    </p>
                  </div>

                  {/* Spec table */}
                  <div className="mt-5 border-t border-border/70 pt-4">
                    <div className="space-y-2.5">
                      {srv.specs.map((spec) => (
                        <div key={spec.label} className="flex items-center justify-between text-xs">
                          <span className="font-sans text-muted-foreground">{spec.label}</span>
                          <span className="font-mono font-semibold text-foreground tabular-nums">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                      <span className="font-sans text-xs text-muted-foreground/70">
                        Flip for compliance rules
                      </span>
                      <span className={cn("font-sans text-xs font-bold", srv.color)}>
                        ↻ Rules
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )

            const backFace = (
              <div className="flex h-full flex-col bg-card text-foreground overflow-hidden">
                {/* Back header strip: darker tint */}
                <div className={cn(
                  "flex items-center justify-between border-b border-border/70 px-5 py-3.5 bg-muted/50"
                )}>
                  <div className="flex items-center gap-2.5">
                    <span className={cn("size-2 shrink-0 rounded-none bg-current", srv.color)} />
                    <span className="font-sans text-xs font-bold text-foreground">
                      Technical Carriage Specs
                    </span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {srv.num} / 03
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-foreground leading-tight">
                      {srv.title}
                    </h4>
                    <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                      Statutory regulations / Corridor dimensions
                    </p>

                    <div className="mt-5 space-y-3">
                      {srv.regulatory.map((rule) => (
                        <div
                          key={rule.label}
                          className={cn(
                            "border-l-2 pl-3 py-0.5",
                            srv.color.replace("text-", "border-")
                          )}
                        >
                          <div className="font-sans text-xs text-muted-foreground">
                            {rule.label}
                          </div>
                          <div className="font-mono text-xs font-semibold text-foreground tabular-nums mt-0.5">
                            {rule.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/70">
                    <Button
                      asChild
                      className="w-full rounded-none font-semibold text-xs tracking-tight focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] disabled:opacity-50 h-11 px-4"
                    >
                      <Link href={srv.href}>
                        <span>{srv.action}</span>
                        <ArrowUpRight className="ml-1.5 size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )

            return (
              <motion.div
                key={srv.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: motionDurations.reveal,
                  delay: Math.min(idx, 5) * 0.05,
                  ease: motionEasings.editorial,
                }}
                className="w-full flex justify-center"
              >
                <CardFlip
                  front={frontFace}
                  back={backFace}
                  label={`${srv.title} details`}
                  className="w-full min-h-[460px] aspect-auto shadow-sm"
                  faceClassName="border border-border/90 bg-card rounded-none"
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </EditorialContainer>
  )
}
