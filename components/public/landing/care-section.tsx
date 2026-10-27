"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { motionDurations, motionEasings } from "@/lib/motion/motion.theme"

const CARE_STANDARDS = [
  {
    stage: "01",
    label: "Packaging",
    lead: "Shock mitigation.",
    detail:
      "Double-wall corrugated cartons with weather-sealed wrap protect all freight consignments.",
  },
  {
    stage: "02",
    label: "Handling",
    lead: "Weight distribution.",
    detail:
      "Precision pallet securement and center-of-gravity stabilization throughout linehaul transit.",
  },
  {
    stage: "03",
    label: "Documentation",
    lead: "Statutory audit.",
    detail:
      "Ten-digit Air Waybills, GST invoices, and E-Way bills audited before dispatch release.",
  },
  {
    stage: "04",
    label: "Handover",
    lead: "Signature verify.",
    detail:
      "Consignee identity check and real-time electronic proof-of-delivery capture.",
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
      className="py-10 sm:py-16 lg:py-20"
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Editorial Statement (S5: whileInView entrance) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionDurations.editorial,
            ease: motionEasings.editorial,
          }}
          className="lg:col-span-5"
        >
          <h2
            id="care-heading"
            className="text-section text-foreground text-balance"
          >
            <span className="font-medium text-foreground/80">Care begins </span>
            <span className="font-semibold text-foreground">
              with the details<span className="font-semibold text-primary">.</span>
            </span>
          </h2>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed font-normal text-pretty max-w-[50ch]">
            Standardized corrugated packaging, weatherproof barcode labeling, and multi-checkpoint custodial audits protect consignments across every transfer.
          </p>

          <div className="mt-8 flex items-center gap-6 border-t border-border/80 pt-6">
            <div>
              <div className="font-heading text-subhead font-medium tracking-tight text-foreground">
                Continuous Linehaul
              </div>
              <p className="mt-1 font-sans text-xs text-muted-foreground font-medium">
                Verified custodial chain
              </p>
            </div>
            <div className="h-8 w-px bg-border/80" />
            <div>
              <div className="font-heading text-subhead font-medium tracking-tight text-foreground">
                Digital POD
              </div>
              <p className="mt-1 font-sans text-xs text-muted-foreground font-medium">
                Physical signature capture
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Four Operational Standards with Tonal Card Backing */}
        <div data-slot="care-standards" className="border border-border/80 bg-card/60 divide-y divide-border/70 lg:col-span-7">
          {CARE_STANDARDS.map((std, idx) => {
            const stageColors = [
              "text-primary",
              "text-info",
              "text-status-pending",
              "text-status-delivered",
            ]
            const stageColor = stageColors[idx % stageColors.length]

            return (
              <motion.div
                key={std.stage}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: motionDurations.reveal,
                  delay: Math.min(idx, 5) * 0.05,
                  ease: motionEasings.editorial,
                }}
                className="p-5 sm:p-6 group transition-colors hover:bg-muted/20"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-semibold ${stageColor}`}>
                      {std.stage}
                    </span>
                    <h3 className="font-heading text-subhead font-medium tracking-tight text-foreground">
                      {std.label}
                    </h3>
                  </div>
                  <p className="max-w-md text-body-editorial">
                    <span className="font-medium text-foreground mr-1.5">{std.lead}</span>
                    {std.detail}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </EditorialContainer>
  )
}
