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
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { motionDurations, motionSprings } from "@/lib/motion/motion.theme"

const CARE_ROWS = [
  {
    stage: "01",
    label: "Packaging",
    detail: "Double-wall corrugated cartons with impact-dampening interior cushioning.",
  },
  {
    stage: "02",
    label: "Handling",
    detail: "Strict weight distribution rules, pallet securement, and specialized orientation.",
  },
  {
    stage: "03",
    label: "Documentation",
    detail: "Statutory GST invoices, E-Way bills, and airway manifests audited before dispatch.",
  },
  {
    stage: "04",
    label: "Delivery",
    detail: "Digital recipient signature, physical condition verification, and instant consignor receipt.",
  },
]

export function CareSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  // Subtle focal crop shift on Brand-and-Care.webp as user scrolls through care points
  const imageScale = useTransform(smoothProgress, [0.1, 0.7], [1.02, 1.0])
  const imageY = useTransform(smoothProgress, [0.1, 0.7], [4, -4])

  return (
    <EditorialContainer
      id="delivery-chapter"
      aria-labelledby="care-heading"
      className="py-12 sm:py-20 lg:py-24"
    >
      <div ref={containerRef} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Focused Master Illustration (Brand-and-Care.webp) */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden border border-border/80 bg-card shadow-sm">
            <motion.div
              style={
                shouldReduceMotion
                  ? undefined
                  : { scale: imageScale, y: imageY }
              }
              className="relative aspect-4/3 w-full overflow-hidden"
            >
              <Image
                src="/images/logistics/Brand-and-Care.webp"
                alt="Contemporary Asian logistics courier delivering sealed consignment directly to client at commercial entrance"
                fill
                className="object-cover select-none"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </motion.div>
            <div className="flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Direct Custodial Handover</span>
              <span className="hidden sm:inline">Physical Signature Receipt</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Focus & Restrained Horizontal Line Reveals */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <SectionEyebrow className="mb-4">
            04 Delivery · Quality of Custody
          </SectionEyebrow>
          <h2
            id="care-heading"
            style={{ fontSize: "var(--type-section)" }}
            className="font-heading font-medium tracking-tight text-foreground leading-[1.06] text-balance"
          >
            Care begins
            <br />
            <span className="text-muted-foreground/90">with the details.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground font-normal text-pretty">
            Cargo is not simply freight in motion; it is trust in physical form. Every
            handover is measured by the discipline of each operational step.
          </p>

          {/* Four Care Rows: Fine Horizontal Rule Reveals */}
          <div className="mt-10 space-y-5">
            {CARE_ROWS.map((row, idx) => (
              <motion.div
                key={row.label}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: motionDurations.reveal,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border-t border-border/80 pt-3.5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {row.stage}
                    </span>
                    <h3 className="font-heading text-base font-medium text-foreground">
                      {row.label}
                    </h3>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-muted-foreground sm:max-w-md sm:text-right">
                    {row.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
