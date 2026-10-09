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
import { Building2, Route, MapPin } from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { motionSprings } from "@/lib/motion/motion.theme"

const NETWORK_ANNOTATIONS = [
  {
    icon: Building2,
    tag: "Warehouse Terminal",
    title: "Delhi Central Consolidation (DEL)",
    role: "National Consolidation & Air Manifest Terminal",
    details:
      "High-throughput sorting facility servicing daily commercial flight departures and regional inter-state linehaul fleets.",
  },
  {
    icon: Route,
    tag: "Arterial Transit",
    title: "National Freight Corridors",
    role: "Dedicated Linehaul Highway Network",
    details:
      "Dedicated commercial freight routes optimized for cargo transit speed, safety, and all-weather operational continuity.",
  },
  {
    icon: MapPin,
    tag: "Destination Hub",
    title: "Imphal Regional Station (IMF)",
    role: "Northeast Gateway Distribution & Delivery Station",
    details:
      "Direct terminal receiving scheduled air and surface consignments for rapid regional distribution across Manipur and neighboring corridors.",
  },
]

/**
 * Network topology section presenting strategic hub stations, national arterial corridors,
 * and regional gateway infrastructure with parallax city depth.
 */
export function NetworkSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Track scroll through the network section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  // Two-layer Nordic city-depth effect:
  // Outer frame moves y: 4px -> -4px
  // Inner image counter-moves y: -2px -> +2px, scale: 1.00 -> 1.025
  const outerY = useTransform(smoothProgress, [0, 1], [4, -4])
  const innerY = useTransform(smoothProgress, [0, 1], [-2, 2])
  const imageScale = useTransform(smoothProgress, [0, 1], [1.0, 1.025])

  return (
    <EditorialContainer
      id="network"
      aria-labelledby="network-heading"
      className="py-12 sm:py-20 lg:py-24"
    >
      <div ref={containerRef} className="space-y-10 lg:space-y-14">
        {/* Header */}
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionEyebrow className="mb-4">Physical Network Architecture</SectionEyebrow>
            <h2
              id="network-heading"
              style={{ fontSize: "var(--type-display)" }}
              className="font-heading font-medium tracking-tight text-foreground leading-[1.04] text-balance"
            >
              Connected by more
              <br />
              <span className="text-muted-foreground/90">than a destination.</span>
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty">
              Real physical infrastructure: dedicated airport ramps, sorting bays, trained
              handlers, and verified arterial linehaul corridors.
            </p>
          </div>
        </div>

        {/* Master Editorial Visual: Adaptive aspect ratio without forced vertical crop on mobile */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: outerY }}
          className="relative overflow-hidden border border-border/80 bg-card shadow-sm"
        >
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : { y: innerY, scale: imageScale }
            }
            className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden sm:min-h-[400px] lg:min-h-[500px]"
          >
            <Image
              src="/images/logistics/network.webp"
              alt="IGI Air Cargo terminal apron with cargo container dollies, ULD pallets, and linehaul transport"
              fill
              className="object-cover select-none"
              sizes="(min-width: 1360px) 1264px, 100vw"
            />
          </motion.div>
          <div className="flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
            <span>Air Cargo Master Apron · Physical Gateways</span>
            <span className="hidden sm:inline">Continuous Infrastructure Verification</span>
          </div>
        </motion.div>

        {/* Informational Annotations: Warehouse -> Transit -> Destination */}
        <div className="grid grid-cols-1 divide-y divide-border/80 border-y border-border/80 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {NETWORK_ANNOTATIONS.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.tag}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col justify-between p-5 sm:p-7 lg:p-8 transition-colors duration-200 hover:bg-muted/20"
              >
                <div>
                  <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-none bg-primary" aria-hidden="true" />
                    <Icon className="size-4 text-primary" />
                    <span className="uppercase tracking-wider font-semibold text-primary">
                      {item.tag}
                    </span>
                  </div>
                  <h3
                    style={{ fontSize: "var(--type-sub)" }}
                    className="mt-3 font-heading font-medium tracking-tight text-foreground"
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {item.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.details}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-3 font-mono text-[11px] text-muted-foreground">
                  <span>Continuous Linehaul Custody</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </EditorialContainer>
  )
}
