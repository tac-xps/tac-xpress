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
import { BorderBeam } from "@/components/ui/border-beam"
import {
  motionSprings,
  motionDurations,
  motionEasings,
} from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

const NETWORK_ANNOTATIONS = [
  {
    icon: Building2,
    tag: "Warehouse Terminal",
    title: "Delhi Central Consolidation (DEL)",
    role: "National Consolidation & Air Manifest Terminal",
    lead: "Air gateway sortation.",
    details:
      "High-throughput sorting facility servicing daily commercial flight departures and regional inter-state linehaul fleets.",
    footer: "Air Gateway Hub · Direct AWB Manifest",
    color: "text-primary",
    badge: "border-primary/30 bg-primary/10 text-primary",
    dot: "bg-primary",
    hoverBorder: "hover:border-t-primary",
  },
  {
    icon: Route,
    tag: "Arterial Transit",
    title: "National Freight Corridors",
    role: "Dedicated Linehaul Highway Network",
    lead: "Dedicated arterial lanes.",
    details:
      "Dedicated commercial freight routes optimized for cargo transit speed, safety, and all-weather operational continuity.",
    footer: "Arterial Corridor · Monitored Transit",
    color: "text-info",
    badge: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
    hoverBorder: "hover:border-t-info",
  },
  {
    icon: MapPin,
    tag: "Destination Hub",
    title: "Imphal Regional Station (IMF)",
    role: "Northeast Gateway Distribution & Delivery Station",
    lead: "Regional gateway delivery.",
    details:
      "Direct terminal receiving scheduled air and surface consignments for rapid regional distribution across Manipur and neighboring corridors.",
    footer: "Regional Gateway · Proof-of-Delivery Desk",
    color: "text-status-delivered",
    badge: "border-status-delivered/30 bg-status-delivered/10 text-status-delivered",
    dot: "bg-status-delivered",
    hoverBorder: "hover:border-t-status-delivered",
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
      className="py-12 sm:py-20 lg:py-24 bg-muted/15"
    >
      <div ref={containerRef} className="space-y-10 lg:space-y-14">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionDurations.editorial,
            ease: motionEasings.editorial,
          }}
          className="grid grid-cols-1 items-end gap-6 md:grid-cols-12"
        >
          <div className="md:col-span-8">
            <SectionEyebrow className="mb-4">Network · Corridor Architecture</SectionEyebrow>
            <h2
              id="network-heading"
              className="text-section text-foreground"
            >
              Connected across the journey.
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-lead max-w-[55ch] text-muted-foreground leading-relaxed font-normal">
              Dedicated freight infrastructure. High-density sortation facilities, scheduled flight allocations, and regional gateway reconciliation ensure uninterrupted custody.
            </p>
          </div>
        </motion.div>

        {/* Master Editorial Visual: Adaptive aspect ratio without forced vertical crop on mobile */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: outerY }}
          className="relative overflow-hidden border border-border/80 bg-card shadow-sm"
        >
          <BorderBeam size={120} duration={14} colorFrom="var(--color-primary)" colorTo="transparent" borderWidth={1} />
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
          <div className="flex items-center justify-between border-t border-border/80 bg-background px-4 py-2.5 font-mono text-xs tracking-wider uppercase text-muted-foreground">
            <span className="font-medium">Air Cargo Master Apron · Physical Gateways</span>
            <span className="hidden sm:inline font-medium">Continuous Infrastructure Verification</span>
          </div>
        </motion.div>

        {/* Informational Annotations: Warehouse -> Transit -> Destination */}
        <div className="grid grid-cols-1 divide-y divide-border/80 border border-border/80 bg-card/60 shadow-xs lg:grid-cols-3 lg:divide-x lg:divide-y-0">
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
                className={cn(
                  "group flex flex-col justify-between p-5 sm:p-7 lg:p-8 border-t-2 border-t-transparent transition-all duration-200 hover:bg-muted/30",
                  item.hoverBorder
                )}
              >
                <div>
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <span className={cn("size-1.5 rounded-none", item.dot)} aria-hidden="true" />
                    <Icon className={cn("size-4", item.color)} />
                    <span className={cn("uppercase tracking-wider font-semibold", item.color)}>
                      {item.tag}
                    </span>
                  </div>
                  <h3
                    style={{ fontSize: "var(--type-sub)" }}
                    className="mt-3 font-heading font-semibold tracking-[-0.015em] text-foreground"
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1 font-sans text-xs font-medium text-muted-foreground">
                    {item.role}
                  </p>
                  <p className="mt-3 text-body-editorial text-muted-foreground leading-relaxed font-normal">
                    {item.lead} {item.details}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-3 font-mono text-xs text-muted-foreground flex items-center justify-between">
                  <span className="font-medium">{item.footer}</span>
                  <span className={cn("size-1.5 rounded-none", item.dot)} aria-hidden="true" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </EditorialContainer>
  )
}
