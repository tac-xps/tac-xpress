"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { NumberTicker } from "@/components/ui/number-ticker"
import { motionDurations } from "@/lib/motion/motion.theme"

const CARE_STANDARDS = [
  {
    stage: "01",
    label: "Packaging",
    detail: "Double-wall corrugated cartons with impact-dampening interior cushioning for fragile and sensitive cargo.",
  },
  {
    stage: "02",
    label: "Handling",
    detail: "Strict weight distribution rules, pallet securement, and orientation controls throughout linehaul transit.",
  },
  {
    stage: "03",
    label: "Documentation",
    detail: "Statutory GST invoices, E-Way bills, and airway carriage documentation audited prior to corridor dispatch.",
  },
  {
    stage: "04",
    label: "Handover",
    detail: "Recipient signature verification, package condition sign-off, and instantaneous digital proof-of-delivery.",
  },
]

/**
 * Custody and care section presenting operational packaging, handling,
 * and handover standards with clean editorial rules and generous breathing room.
 */
export function CareSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <EditorialContainer
      id="delivery-chapter"
      aria-labelledby="care-heading"
      className="py-14 sm:py-20 lg:py-28"
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Editorial Statement */}
        <div className="lg:col-span-5">
          <SectionEyebrow className="mb-4">
            Custody &amp; Handling Standards
          </SectionEyebrow>
          <h2
            id="care-heading"
            className="text-section text-foreground"
          >
            Care begins with the details.
          </h2>
          <p className="mt-5 text-lead max-w-[50ch]">
            Clear documentation. Careful handling. Help when you need it.
          </p>

          <div className="mt-8 flex items-center gap-6 border-t border-border/80 pt-6">
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground flex items-baseline">
                <NumberTicker value={99.4} decimalPlaces={1} />
                <span className="text-primary font-mono text-xl sm:text-2xl font-bold ml-0.5">%</span>
              </div>
              <p className="mt-1 font-sans text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Safe Custody Rate
              </p>
            </div>
            <div className="h-8 w-px bg-border/80" />
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground flex items-baseline">
                <NumberTicker value={100} />
                <span className="text-primary font-mono text-xl sm:text-2xl font-bold ml-0.5">%</span>
              </div>
              <p className="mt-1 font-sans text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Digital POD Capture
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-border/80 pt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>Verified Custody Chain · Zero Handling Ambiguity</span>
          </div>
        </div>

        {/* Right Column: Four Operational Standards with Thin Hairlines */}
        <div className="divide-y divide-border/80 border-y border-border/80 lg:col-span-7">
          {CARE_STANDARDS.map((std, idx) => (
            <motion.div
              key={std.stage}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: motionDurations.reveal,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="py-5 sm:py-6 first:pt-4 last:pb-4 group transition-colors hover:bg-muted/10"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {std.stage}
                  </span>
                  <h3 className="font-heading text-lg font-semibold tracking-[-0.015em] text-foreground">
                    {std.label}
                  </h3>
                </div>
                <p className="max-w-md text-body-editorial">
                  {std.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </EditorialContainer>
  )
}
