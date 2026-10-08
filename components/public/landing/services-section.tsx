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
import { Plane, Truck, PackageCheck } from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { LivingCargoLine } from "./living-cargo-line"
import { motionSprings } from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

const SERVICES = [
  {
    icon: Plane,
    num: "01",
    title: "Air Cargo",
    tagline: "Shorter transit windows for priority freight.",
    description:
      "Scheduled commercial departures connecting New Delhi and Northeast regional hubs. Ideal for critical inventory, medical supplies, and urgent commercial consignments subject to statutory civil aviation standards.",
    specs: ["24–48h gateway transit", "Statutory Air Waybill (AWB)", "Priority ramp transfer"],
  },
  {
    icon: Truck,
    num: "02",
    title: "Surface Cargo",
    tagline: "Cost-optimized movement for bulk shipments.",
    description:
      "Dependable arterial highway transport engineered for heavier pallet loads, industrial cartons, and planned restocking. Full linehaul tracking with verified transit checkpoints along national corridors.",
    specs: ["Economical multi-ton freight", "Pallet & carton security", "National corridor tracking"],
  },
  {
    icon: PackageCheck,
    num: "03",
    title: "Door-to-Door",
    tagline: "Direct custodial care from origin to threshold.",
    description:
      "Complete chain-of-custody pickup from your warehouse or store directly to the recipient's premises. Optical barcode verification at every handover eliminates blind spots and handover ambiguity.",
    specs: ["Origin dock collection", "Last-mile station delivery", "Digital proof-of-delivery"],
  },
]

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
      aria-labelledby="services-heading"
      className="py-12 sm:py-20 lg:py-24"
    >
      <div className="flex flex-col space-y-10 lg:space-y-14">
        {/* Section Header */}
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionEyebrow className="mb-4">Services &amp; Modalities</SectionEyebrow>
            <h2
              id="services-heading"
              style={{ fontSize: "var(--type-section)" }}
              className="font-heading font-medium tracking-tight text-foreground leading-[1.06] text-balance"
            >
              Your cargo.
              <br />
              <span className="text-muted-foreground/90">The right journey.</span>
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-normal text-pretty">
              Three distinct logistics modes structured around consignment urgency, cargo
              profile, and destination corridor requirements.
            </p>
          </div>
        </div>

        {/* Master Editorial Image: Official Scroll Image Reveal (journey.webp) */}
        <div className="relative overflow-hidden border border-border/80 bg-card shadow-sm">
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
              style={shouldReduceMotion ? undefined : { objectPosition }}
              className="relative h-full w-full"
            >
              <Image
                src="/images/logistics/journey.webp"
                alt="Panoramic multi-modal logistics corridor across modern Indian metropolis with arterial expressway, container linehaul, rapid rail, and ascending aircraft"
                fill
                priority={false}
                className="object-cover select-none transition-all duration-500 ease-out"
                sizes="(min-width: 1360px) 1264px, 100vw"
              />
            </motion.div>
          </motion.div>

          {/* Architectural caption bar */}
          <div className="flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
            <span>Arterial Linehaul · Commercial Aviation</span>
            <span className="hidden sm:inline">Delhi NCR Corridor · Northeast Expressways</span>
          </div>
        </div>

        {/* Signature Connector Cargo Line */}
        <LivingCargoLine variant="rule" />

        {/* Three Service Modalities with Waypoint Activation on Scroll */}
        <div className="grid grid-cols-1 divide-y divide-border/80 border-y border-border/80 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon
            return (
              <div
                key={srv.num}
                className="group flex flex-col justify-between p-5 sm:p-7 lg:p-8 transition-colors duration-300 hover:bg-muted/20"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-primary">{srv.num}</span>
                    <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <h3
                    style={{ fontSize: "var(--type-sub)" }}
                    className="mt-4 font-heading font-medium tracking-tight text-foreground transition-colors group-hover:text-primary"
                  >
                    {srv.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {srv.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 border-t border-border/60 pt-4">
                  <ul className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
                    {srv.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2">
                        <span className="size-1 rounded-none bg-primary/60 transition-colors group-hover:bg-primary" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </EditorialContainer>
  )
}
