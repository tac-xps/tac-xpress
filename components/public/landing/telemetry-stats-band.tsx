"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { motionDurations, motionEasings } from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

const TELEMETRY_METRICS = [
  {
    num: "< 24h",
    label: "Air Linehaul Transit",
    detail: "Delhi (DEL) to Imphal (IMF) belly-hold delivery window",
    code: "DEL ⇄ IMF",
    status: "Priority",
    statusColor: "text-primary",
  },
  {
    num: "99.4%",
    label: "On-Time Ramp SLA",
    detail: "Contracted commercial flight departure and ramp handling compliance",
    code: "RAMP SLA",
    status: "Verified",
    statusColor: "text-status-delivered",
  },
  {
    num: "2,400+ km",
    label: "Monitored Linehaul",
    detail: "Dedicated arterial highway corridor connecting capital hubs",
    code: "CORRIDOR",
    status: "Active",
    statusColor: "text-info",
  },
  {
    num: "100%",
    label: "Optical Reconciliation",
    detail: "Statutory Air Waybill (AWB) barcode custody verification at every gate",
    code: "AWB AUDIT",
    status: "Audited",
    statusColor: "text-status-delivered",
  },
] as const

/**
 * Architectural Telemetry Stats Band:
 * Full-width high-contrast tactical data band delivering immediate quantitative proof
 * with massive monospace display figures, tactical telemetry chips, and sharp industrial grid boundaries.
 */
export function TelemetryStatsBand() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-label="Corridor Telemetry and Performance Metrics"
      className="relative w-full border-y border-border/90 bg-muted/30 py-10 sm:py-14 lg:py-16 transition-colors"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-12">
        {/* Architectural Header Bar */}
        <div className="mb-8 flex flex-col justify-between gap-3 border-b border-border/80 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase text-foreground font-semibold">
            <span className="relative flex size-2 shrink-0 rounded-none">
              <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-none bg-status-delivered opacity-75" />
              <span className="relative inline-flex size-2 rounded-none bg-status-delivered" />
            </span>
            <span>Live Corridor Telemetry</span>
            <span className="text-muted-foreground select-none">/</span>
            <span className="text-muted-foreground font-normal">Contracted Operational Benchmarks</span>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            Optical Reconciled Ledger, Q4 Audit
          </div>
        </div>

        {/* 4-Column Monolithic Number Grid */}
        <div className="grid grid-cols-1 divide-y divide-border/80 border border-border/80 bg-card shadow-xs sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          {TELEMETRY_METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: motionDurations.editorial,
                delay: idx * 0.08,
                ease: motionEasings.editorial,
              }}
              className="group relative flex flex-col justify-between p-6 sm:p-7 lg:p-8 hover:bg-muted/15 transition-colors duration-200"
            >
              {/* Top Sub-Chip Row */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 font-mono text-[11px]">
                <span className="font-bold text-muted-foreground uppercase">
                  {metric.code}
                </span>
                <span className={cn("font-bold uppercase flex items-center gap-1.5", metric.statusColor)}>
                  <span className="size-1.5 rounded-none bg-current" aria-hidden="true" />
                  {metric.status}
                </span>
              </div>

              {/* Massive Numeric Monument */}
              <div className="my-5 sm:my-6">
                <div className="font-mono text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-foreground transition-transform duration-200 group-hover:translate-x-0.5 tabular-nums">
                  {metric.num}
                </div>
                <h3 className="mt-3 font-sans text-sm sm:text-base font-bold tracking-tight text-foreground">
                  {metric.label}
                </h3>
              </div>

              {/* Technical Precision Explainer */}
              <div className="border-t border-border/60 pt-3">
                <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-muted-foreground font-normal text-pretty">
                  {metric.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
