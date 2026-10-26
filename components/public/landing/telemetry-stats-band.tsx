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
    num: "2,400+\u00A0km",
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
 * Architectural Telemetry Bento Grid:
 * High-density tactical data monument delivering immediate quantitative proof
 * with monospace display figures, live gateway map, and 60-day uptime audit.
 */
export function TelemetryStatsBand() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      aria-label="Corridor Telemetry and Performance Metrics"
      data-slot="telemetry-dashboard"
      className="relative w-full border-y border-border/90 bg-muted/20 py-16 transition-colors sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-12">
        {/* Architectural Bento Header Bar */}
        <div className="mb-6 flex flex-col justify-between gap-3 border-b border-border/80 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5 font-sans text-xs text-foreground font-semibold">
            <span className="relative flex size-2 shrink-0 rounded-none">
              <span className="absolute inline-flex h-full w-full motion-safe:animate-ping motion-reduce:hidden rounded-none bg-status-delivered opacity-75" />
              <span className="relative inline-flex size-2 rounded-none bg-status-delivered" />
            </span>
            <span>Live Corridor Telemetry</span>
            <span className="text-muted-foreground select-none">/</span>
            <span className="text-muted-foreground font-normal">Active Operations Benchmarks</span>
          </div>
          <div className="font-sans text-xs text-muted-foreground flex items-center gap-2">
            <span className="size-1.5 rounded-none bg-primary" />
            <span>Optical Reconciled Ledger (Q4 Audit)</span>
          </div>
        </div>

        {/* Master Telemetry Bento Grid */}
        <div className="grid grid-cols-1 gap-px border border-border/80 bg-border/80 shadow-xs lg:grid-cols-12">
          {/* Top 4 KPI Tiles: 4-Columns spanning the full 12 cols (3 cols each on desktop) */}
          {TELEMETRY_METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: motionDurations.editorial,
                delay: Math.min(idx, 5) * 0.04,
                ease: motionEasings.editorial,
              }}
              className="group relative flex flex-col justify-between bg-card p-5 sm:p-6 lg:col-span-3 hover:bg-muted/30 transition-colors duration-200"
            >
              {/* Top Sub-Chip Row */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5 text-xs">
                <span className="font-mono font-semibold text-muted-foreground">
                  {metric.code}
                </span>
                <span className={cn("flex items-center gap-1.5 font-sans font-medium text-xs", metric.statusColor)}>
                  <span className="size-1.5 rounded-none bg-current" aria-hidden="true" />
                  {metric.status}
                </span>
              </div>

              {/* Massive Numeric Monument */}
              <div className="my-3 sm:my-4">
                <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground transition-transform duration-200 group-hover:translate-x-0.5 tabular-nums">
                  {metric.num}
                </div>
                <h3 className="mt-8 mb-1.5 font-sans text-sm font-semibold tracking-tight text-foreground">
                  {metric.label}
                </h3>
              </div>

              {/* Technical Precision Explainer */}
              <div className="border-t border-border/60 pt-2">
                <p className="font-sans text-xs leading-relaxed text-muted-foreground font-normal text-pretty">
                  {metric.detail}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Bento Center-Left: 90-Day Gateway Dotted Map (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: motionDurations.editorial, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 sm:px-6 py-3.5 bg-muted/20">
              <div>
                <span className="font-sans text-xs font-semibold text-primary">
                  Gateway Availability Matrix
                </span>
                <h4 className="mt-0.5 font-sans text-sm sm:text-base font-semibold text-foreground">
                  Delhi &amp; Imphal Airport Ramp Radar
                </h4>
              </div>
              <span className="font-mono text-xs tabular-nums text-status-delivered font-semibold bg-status-delivered/10 border border-status-delivered/30 px-2 py-0.5 rounded-none">
                99.8% Combined
              </span>
            </div>
            <div
              className="relative flex-1 p-5 sm:p-6 bg-muted/10 font-sans flex flex-col justify-between"
              aria-label="Corridor gateway telemetry showing DEL to IMF station availability"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-border/80 bg-card p-3.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <span className="font-sans text-xs text-primary font-bold">DEL / T2 RAMP</span>
                    <span className="text-status-delivered font-bold">99.7%</span>
                  </div>
                  <div className="mt-2.5 font-mono text-lg font-bold text-foreground">
                    Gate 4 Clear
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Next: 6E-6124 (T-140m)
                  </p>
                </div>

                <div className="border border-border/80 bg-card p-3.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <span className="font-sans text-xs text-info font-bold">GAU / TRANSIT</span>
                    <span className="text-status-delivered font-bold">99.4%</span>
                  </div>
                  <div className="mt-2.5 font-mono text-lg font-bold text-foreground">
                    Air Feeder Ready
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Inter-modal crossdock
                  </p>
                </div>

                <div className="border border-border/80 bg-card p-3.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <span className="font-sans text-xs text-foreground font-bold">IMF / TULIHAL</span>
                    <span className="text-status-delivered font-bold">98.7%</span>
                  </div>
                  <div className="mt-2.5 font-mono text-lg font-bold text-foreground">
                    Dock 2 Receiving
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last-mile active
                  </p>
                </div>
              </div>

              {/* Highway Arterial Linehaul Live Bar */}
              <div className="mt-4 border border-border/80 bg-card p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-foreground">NH-27 Arterial Linehaul Status</div>
                  <div className="text-muted-foreground mt-0.5">Delhi to Guwahati to Imphal Surface Convoys under GPS E-Seal</div>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-sans">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                    2,400 km Monitored
                  </span>
                  <span className="text-xs font-semibold text-status-delivered">
                    48h SLA Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Center-Right: Terminal Gateway Uptime & Capacity Ledger (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: motionDurations.editorial, delay: 0.16 }}
            className="lg:col-span-5 flex flex-col justify-between bg-card divide-y divide-border/60"
          >
            {/* Top Half: Terminal Uptime Ledger */}
            <div className="p-5 sm:p-6 bg-card space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-sans text-xs font-semibold text-primary">
                  Gateway Uptime Ledger
                </span>
                <span className="font-sans text-xs text-muted-foreground font-medium">
                  60-Day SLA Standard
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-foreground">DEL Terminal 2 Ramp</div>
                    <div className="text-muted-foreground font-sans">Scheduled Commercial Flight Allocation</div>
                  </div>
                  <span className="font-mono text-sm font-bold text-status-delivered tabular-nums">
                    99.6%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-foreground">IMF Tulihal Station</div>
                    <div className="text-muted-foreground font-sans">Regional Delivery Terminal</div>
                  </div>
                  <span className="font-mono text-sm font-bold text-status-delivered tabular-nums">
                    98.7%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-foreground">NH-27 Arterial Linehaul</div>
                    <div className="text-muted-foreground font-sans">National Highway Transit Convoys</div>
                  </div>
                  <span className="font-mono text-sm font-bold text-status-delivered tabular-nums">
                    99.4%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Half: Capacity Utilization & Daily Lift */}
            <div className="p-5 sm:p-6 bg-card/60 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="font-sans text-xs font-semibold text-info">
                    Capacity Allocation
                  </span>
                  <h4 className="mt-0.5 font-sans text-sm font-semibold text-foreground">
                    Corridor Daily Freight Volume
                  </h4>
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-info/10 text-info border border-info/20">
                  48.5 MT Lift
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-sans">
                <div className="border border-border/80 bg-background p-2.5">
                  <div className="font-mono text-base font-bold text-foreground tabular-nums">
                    28 MT
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Air Belly-Hold
                  </div>
                </div>
                <div className="border border-border/80 bg-background p-2.5">
                  <div className="font-mono text-base font-bold text-foreground tabular-nums">
                    16 MT
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Surface Linehaul
                  </div>
                </div>
                <div className="border border-border/80 bg-background p-2.5">
                  <div className="font-mono text-base font-bold text-foreground tabular-nums">
                    4.5 MT
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Pharma Custody
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
