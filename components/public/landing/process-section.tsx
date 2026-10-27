"use client"

import React, { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  AnimatePresence,
} from "motion/react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  motionSprings,
  motionEasings,
  motionDurations,
} from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"
import { CheckCircle2, ShieldCheck, Clock, Terminal, ArrowRight, CornerDownRight } from "lucide-react"
import { Badge } from "@/components/reui/badge"

const STEPS = [
  {
    num: "01",
    label: "INTAKE",
    title: "Consignment Intake",
    lead: "Route & dimensional audit.",
    color: "text-primary",
    activeBorder: "border-primary",
    badge: "border-primary/40 bg-primary/10 text-primary",
    description:
      "Register corridor route, piece counts, and dimensions for instant freight billing.",
  },
  {
    num: "02",
    label: "CLEARANCE",
    title: "Statutory Booking",
    lead: "Air Waybill generation.",
    color: "text-info",
    activeBorder: "border-info",
    badge: "border-info/40 bg-info/10 text-info",
    description:
      "Issue 10-digit Air Waybills with verified E-Way bills and security checks.",
  },
  {
    num: "03",
    label: "LINEHAUL",
    title: "Arterial Transit",
    lead: "Scheduled movement.",
    color: "text-status-pending",
    activeBorder: "border-status-pending",
    badge: "border-status-pending/40 bg-status-pending/10 text-status-pending",
    description:
      "Flight belly-hold departures and sealed highway fleets with gate checkpoint scans.",
  },
  {
    num: "04",
    label: "HANDOVER",
    title: "Custodial Delivery",
    lead: "Verified sign-off.",
    color: "text-status-delivered",
    activeBorder: "border-status-delivered",
    badge: "border-status-delivered/40 bg-status-delivered/10 text-status-delivered",
    description:
      "Terminal unloading with physical condition audit and digital proof of delivery.",
  },
]

interface StepTelemetryData {
  phase: string
  phaseName: string
  gateway: string
  corridor: string
  timestamp: string
  statusBadge: string
  badgeVariant: "default" | "outline" | "info-light" | "warning-light" | "success-light"
  metrics: Array<{ label: string; value: string; hint: string }>
  auditItems: Array<{ label: string; detail: string }>
  payloadLedger: {
    event: string
    reference: string
    carrier: string
    checkpoint: string
    timestamp: string
    tamperSeal: string
    securityClearance: string
  }
}

const STEP_TELEMETRY: StepTelemetryData[] = [
  {
    phase: "01",
    phaseName: "Consignment Intake & Dimension Audit",
    gateway: "DEL IGI Cargo Terminal 2",
    corridor: "DEL to IMF (Direct Express)",
    timestamp: "08:30 IST",
    statusBadge: "OPTICAL AUDIT CLEARED",
    badgeVariant: "info-light",
    metrics: [
      { label: "Consignment Weight", value: "740 KG Gross", hint: "18 Cartons / Palletized" },
      { label: "Volumetric Ratio", value: "cm³ / 5000", hint: "IATA Air Standard" },
      { label: "Barcode Scan", value: "Verified 18/18", hint: "Optical gate reconciliation" },
      { label: "Origin Acceptance", value: "Gate 4 Dock", hint: "Direct commercial ramp" },
    ],
    auditItems: [
      { label: "Dimensional Laser Profile", detail: "60 × 40 × 45 cm carton uniformity confirmed" },
      { label: "Tare & Net Reconciled", detail: "Gross 740 kg matches booking manifest" },
      { label: "BCAS Security Gate 4", detail: "Screening clearance tag issued" },
    ],
    payloadLedger: {
      event: "consignment.intake.completed",
      reference: "TAC-2409-18472",
      carrier: "TAC Express Surface Feeder",
      checkpoint: "DEL-T2-INTAKE-DOCK-4",
      timestamp: "2026-10-26T08:30:00+05:30",
      tamperSeal: "SEAL-DEL-8910-OK",
      securityClearance: "BCAS-T2-CLEARED",
    },
  },
  {
    phase: "02",
    phaseName: "Statutory Booking & Air Waybill Clearance",
    gateway: "BCAS Screening & Customs Desk",
    corridor: "DEL to IMF (Statutory Belly-Hold)",
    timestamp: "11:45 IST",
    statusBadge: "STATUTORY MANIFEST ISSUED",
    badgeVariant: "info-light",
    metrics: [
      { label: "Air Waybill Number", value: "TAC-2409-18472", hint: "Statutory 10-digit carriage" },
      { label: "GST E-Way Bill", value: "2410-8912-3490", hint: "18% GST itemized ledger" },
      { label: "Screening Gate", value: "Dual X-Ray Pass", hint: "BCAS Security Gate 4" },
      { label: "Belly-Hold Allotment", value: "Flight 6E-2419", hint: "Guaranteed cargo capacity" },
    ],
    auditItems: [
      { label: "Statutory 10-Digit AWB", detail: "Commercial carriage agreement validated" },
      { label: "GST E-Way Matching", detail: "Part A & Part B statutory reconciliation" },
      { label: "Dangerous Goods Check", detail: "IATA Section II non-restricted confirmation" },
    ],
    payloadLedger: {
      event: "manifest.clearance.authorized",
      reference: "TAC-2409-18472",
      carrier: "TAC Express Aviation Ops",
      checkpoint: "BCAS-RAMP-GATE-4",
      timestamp: "2026-10-26T11:45:00+05:30",
      tamperSeal: "BCAS-SEC-2409-CLEAR",
      securityClearance: "BCAS-CARGO-DEPT-APPROVED",
    },
  },
  {
    phase: "03",
    phaseName: "Arterial Transit & Ramp Checkpoint",
    gateway: "DEL Runway 28 to IMF Apron",
    corridor: "DEL to IMF (Scheduled Linehaul)",
    timestamp: "14:15 IST",
    statusBadge: "IN ARTERIAL TRANSIT",
    badgeVariant: "warning-light",
    metrics: [
      { label: "Linehaul Manifest", value: "Flight 6E-2419", hint: "Departed DEL Runway 28" },
      { label: "Active GPS E-Seal", value: "ES-9921-DEL", hint: "Continuous telemetry lock" },
      { label: "Corridor Waypoint", value: "Waypoint 3 En Route", hint: "Scheduled ETA 18:30 IST" },
      { label: "Ambient Environment", value: "21°C / Normal G", hint: "Cargo compartment monitored" },
    ],
    auditItems: [
      { label: "Runway Departure Scan", detail: "Linehaul flight belly-hold departed 14:15 IST" },
      { label: "GPS E-Seal Integrity", detail: "Zero tamper events across arterial corridor" },
      { label: "Waypoint Beacon Sync", detail: "Radio transponder verified by station control" },
    ],
    payloadLedger: {
      event: "linehaul.departure.scanned",
      reference: "TAC-2409-18472",
      carrier: "Linehaul Flight 6E-2419",
      checkpoint: "DEL-RWY28-DEPARTURE",
      timestamp: "2026-10-26T14:15:00+05:30",
      tamperSeal: "GPS-SEAL-ES9921-ACTIVE",
      securityClearance: "RUNWAY-DISPATCH-VERIFIED",
    },
  },
  {
    phase: "04",
    phaseName: "Custodial Delivery & Proof of Delivery",
    gateway: "IMF Tulihal Cargo Station",
    corridor: "Bir Tikendrajit Airport Desk",
    timestamp: "18:30 IST",
    statusBadge: "CUSTODIAL HANDOVER SIGNED",
    badgeVariant: "success-light",
    metrics: [
      { label: "Receiving Terminal", value: "IMF Air Cargo Desk", hint: "Bir Tikendrajit Airport" },
      { label: "Consignee Sign-off", value: "Digital Signature", hint: "Verified consignee identity" },
      { label: "Geotag Handover", value: "24.7600 N, 93.8967 E", hint: "Tamper-proof GPS coordinates" },
      { label: "Custodial Audit", value: "Chain Completed", hint: "Immediate digital POD record" },
    ],
    auditItems: [
      { label: "Terminal Unloading Scan", detail: "Condition audit verified with zero carton damage" },
      { label: "Physical Identity Validation", detail: "Government ID and delivery pin matched" },
      { label: "Electronic Sign-off Captured", detail: "Digital proof of delivery archived to ledger" },
    ],
    payloadLedger: {
      event: "consignment.custody.delivered",
      reference: "TAC-2409-18472",
      carrier: "IMF Destination Delivery Desk",
      checkpoint: "IMF-CARGO-BAY-3",
      timestamp: "2026-10-26T18:30:00+05:30",
      tamperSeal: "SEAL-VERIFIED-UNBROKEN",
      securityClearance: "POD-SIGNATURE-RECORDED",
    },
  },
]

/**
 * Process section: The signature motion centerpiece of TAC-XPRESS.
 * Showcases the 4-stage freight journey driven by the Living Cargo Line
 * with calibrated desktop scroll progression and interactive custody console.
 */
export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [activeStep, setActiveStep] = useState<number>(0)

  // Track progress through the section content without an artificial spacer.
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth scroll progression via calibrated spring
  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  // Synchronize active step with scroll progress
  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      if (latest < 0.28) {
        setActiveStep(0)
      } else if (latest < 0.55) {
        setActiveStep(1)
      } else if (latest < 0.82) {
        setActiveStep(2)
      } else {
        setActiveStep(3)
      }
    })
  }, [smoothProgress])

  // Subtle velocity responsiveness for cargo line marker elongation
  const scrollVelocity = useVelocity(scrollY)
  const velocityScaleX = useTransform(scrollVelocity, [-1200, 0, 1200], [1.6, 1.0, 1.6], {
    clamp: true,
  })

  const currentTelemetry = STEP_TELEMETRY[activeStep]

  return (
    <EditorialContainer
      id="journey-chapter"
      aria-labelledby="process-heading"
      className="p-0 border-b border-border/80 bg-background"
    >
      <div ref={containerRef} className="relative w-full">
        <div className="flex w-full flex-col justify-between py-12 sm:py-16 lg:sticky lg:top-20 lg:py-14">
          {/* Top Row: Section Header */}
          <div
            className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h2
                id="process-heading"
                className="text-section text-foreground text-balance"
              >
                <span className="font-medium text-foreground/80">Four steps. </span>
                <span className="font-semibold text-foreground">
                  One clear journey<span className="font-semibold text-primary">.</span>
                </span>
              </h2>
            </div>
            <div className="max-w-md md:text-right space-y-1.5">
              <p className="text-sm sm:text-base font-medium text-foreground leading-snug">
                Continuous chain-of-custody.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
                Four operational phases guarantee statutory booking, ramp clearance, arterial dispatch, and signed handover.
              </p>
            </div>
          </div>

          {/* Middle Stage: 4-Step Architectural Journey Cards */}
          <div
            role="tablist"
            aria-label="Shipment Journey Steps"
            data-slot="process-stepper"
            className="my-8 sm:my-10 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx
              const isPassed = activeStep > idx

              return (
                <motion.div
                  key={step.num}
                  role="tab"
                  tabIndex={0}
                  aria-selected={isActive}
                  aria-controls="custody-console-panel"
                  onClick={() => setActiveStep(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveStep(idx)
                    }
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: isActive ? 1.0 : 0.985,
                        }
                  }
                  transition={{
                    duration: 0.2,
                    delay: Math.min(idx, 5) * 0.05,
                    ease: motionEasings.editorial,
                    scale: motionSprings.springTactile,
                  }}
                  className={cn(
                    "relative overflow-hidden flex flex-col justify-between border p-5 sm:p-6 transition-colors cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] rounded-none",
                    isActive
                      ? cn(step.activeBorder, "bg-card shadow-sm ring-1 ring-border/80")
                      : isPassed
                      ? "border-border/80 bg-card hover:border-border"
                      : "border-border/60 bg-card hover:border-border/80"
                  )}
                >
                  {isActive && (
                    <BorderBeam
                      size={60}
                      duration={6}
                      colorFrom={
                        idx === 0
                          ? "var(--color-primary)"
                          : idx === 1
                          ? "var(--color-info)"
                          : idx === 2
                          ? "var(--color-status-pending)"
                          : "var(--color-status-delivered)"
                      }
                      colorTo="transparent"
                      borderWidth={1}
                    />
                  )}
                  <div>
                    {/* Step Identifier */}
                    <div className="flex items-start justify-between">
                      <span
                        className={cn(
                          "font-mono text-3xl font-semibold tracking-tight transition-colors select-none sm:text-4xl",
                          isActive ? step.color : "text-foreground/20 group-hover:text-foreground/40"
                        )}
                      >
                        {step.num}
                      </span>
                      <span
                        className={cn(
                          "rounded-none px-2 py-0.5 font-sans text-xs font-semibold transition-colors",
                          isActive
                            ? step.badge
                            : "border border-border/70 bg-muted/30 text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3
                      className={cn(
                        "mt-4 font-heading text-lg font-semibold tracking-tight transition-colors text-balance sm:text-xl",
                        isActive ? step.color : "text-foreground"
                      )}
                    >
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="mt-2 text-sm text-foreground/90 font-medium leading-snug">
                      {step.lead}
                    </p>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
                      {step.description}
                    </p>
                  </div>

                  {/* Active Step Indicator Accent */}
                  <div className="mt-6 border-t border-border/60 pt-3">
                    <div className="flex items-center gap-2 font-sans text-xs">
                      <span
                        className={cn(
                          "size-1.5 rounded-none transition-colors",
                          isActive
                            ? idx === 0
                              ? "bg-primary"
                              : idx === 1
                              ? "bg-info"
                              : idx === 2
                              ? "bg-status-pending"
                              : "bg-status-delivered"
                            : isPassed
                            ? "bg-status-delivered"
                            : "bg-muted-foreground/40"
                        )}
                      />
                      <span
                        className={cn(
                          "transition-colors",
                          isActive
                            ? cn(step.color, "font-semibold")
                            : "text-muted-foreground font-medium"
                        )}
                      >
                        {isActive ? "Active Phase" : isPassed ? "Completed" : "Queued"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Synchronized High-Density Continuous Custody Console */}
          <div
            id="custody-console-panel"
            role="tabpanel"
            aria-label="Continuous Custody Telemetry Console"
            data-slot="continuous-custody-console"
            className="my-4 border-l-2 border-l-primary border-t border-r border-b border-border/80 bg-card p-5 sm:p-7 shadow-sm rounded-none"
          >
            {/* Console Header Bar */}
            <div className="flex flex-col gap-4 border-b border-border/80 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="size-2 bg-primary rounded-none" aria-hidden="true" />
                  <h3 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                    Continuous Custody Telemetry
                  </h3>
                  <Badge variant={currentTelemetry.badgeVariant} className="font-mono text-xs rounded-none">
                    {currentTelemetry.statusBadge}
                  </Badge>
                </div>
                <p className="mt-1 font-sans text-xs text-muted-foreground">
                  Statutory gate checkpoint records, optical reconciliation, and webhook payloads.
                </p>
              </div>

              {/* Console Step Switcher Pills */}
              <div
                role="tablist"
                aria-label="Operational Phase Selector"
                className="flex flex-wrap items-center gap-1 border border-border/80 bg-muted/30 p-1 rounded-none"
              >
                {STEPS.map((s, idx) => (
                  <button
                    key={s.num}
                    id={`console-tab-${s.num}`}
                    role="tab"
                    aria-selected={activeStep === idx}
                    aria-controls="custody-console-panel"
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "px-2.5 py-1 font-sans text-xs font-medium transition-colors cursor-pointer rounded-none focus-visible:ring-1 focus-visible:ring-primary outline-none",
                      activeStep === idx
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Phase {s.num}
                  </button>
                ))}
              </div>
            </div>

            {/* Console Body: Dual-Pane Telemetry Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: motionDurations.fast }}
                className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12"
              >
                {/* Left Pane: Primary Operational Parameters (7 cols) */}
                <div className="space-y-6 lg:col-span-7">
                  {/* Phase Identity & Route Header */}
                  <div className="border border-border/80 bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs text-primary font-semibold">
                        Phase {currentTelemetry.phase} / 04
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {currentTelemetry.timestamp}
                      </span>
                    </div>
                    <div className="mt-2 font-heading text-lg font-semibold text-foreground">
                      {currentTelemetry.phaseName}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 font-sans text-xs text-muted-foreground">
                      <span>Gateway: <strong className="text-foreground font-medium">{currentTelemetry.gateway}</strong></span>
                      <span className="text-border">|</span>
                      <span>Corridor: <strong className="text-foreground font-medium">{currentTelemetry.corridor}</strong></span>
                    </div>
                  </div>

                  {/* 4-Grid Telemetry Metrics */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {currentTelemetry.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="border border-border/70 bg-background p-3.5 space-y-1"
                      >
                        <span className="block font-sans text-xs text-muted-foreground">
                          {metric.label}
                        </span>
                        <span className="block font-mono text-sm font-semibold text-foreground tabular-nums">
                          {metric.value}
                        </span>
                        <span className="block font-sans text-xs text-muted-foreground/80">
                          {metric.hint}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Statutory Audit Checklist */}
                  <div className="border border-border/80 bg-background p-4 space-y-2.5">
                    <div className="flex items-center gap-2 font-sans text-xs font-semibold text-foreground">
                      <ShieldCheck className="size-4 text-status-delivered" />
                      <span>Statutory Custody Checks</span>
                    </div>
                    <ul className="space-y-2 font-sans text-xs">
                      {currentTelemetry.auditItems.map((item) => (
                        <li key={item.label} className="flex items-start gap-2.5">
                          <CheckCircle2 className="size-3.5 text-status-delivered shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-foreground">{item.label}: </span>
                            <span className="text-muted-foreground">{item.detail}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Pane: Live Telemetry Event Ledger / Webhook Payload (5 cols) */}
                <div className="flex flex-col justify-between border border-border/80 bg-muted/30 p-4 sm:p-5 lg:col-span-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/70 pb-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="size-4 text-primary" />
                        <span className="font-mono text-xs font-semibold text-foreground">
                          live_telemetry_event.json
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-status-delivered font-semibold">
                        200 OK
                      </span>
                    </div>

                    {/* Formatted Code Block */}
                    <pre
                      tabIndex={0}
                      aria-label="Live telemetry event payload"
                      className="mt-3 overflow-x-auto p-3 bg-background border border-border/70 font-mono text-xs leading-relaxed text-foreground/90 select-all focus-visible:ring-1 focus-visible:ring-primary outline-none"
                    >
                      <code>
{`{
  "event": "${currentTelemetry.payloadLedger.event}",
  "reference": "${currentTelemetry.payloadLedger.reference}",
  "carrier": "${currentTelemetry.payloadLedger.carrier}",
  "checkpoint": "${currentTelemetry.payloadLedger.checkpoint}",
  "timestamp": "${currentTelemetry.payloadLedger.timestamp}",
  "tamper_seal": "${currentTelemetry.payloadLedger.tamperSeal}",
  "security_status": "${currentTelemetry.payloadLedger.securityClearance}"
}`}
                      </code>
                    </pre>
                  </div>

                  {/* Tamper Seal & Escalation Desk Footer */}
                  <div className="border-t border-border/70 pt-3 flex flex-wrap items-center justify-between gap-2 font-sans text-xs">
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 bg-status-delivered rounded-none" />
                      <span className="text-muted-foreground">Digital Chain of Custody</span>
                    </div>
                    <span className="font-mono font-medium text-primary">
                      AWB: TAC-2409-18472
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Stage: The Living Cargo Line Continuous Progress Track */}
          <div className="relative border-t border-border/80 pt-6">
            <div className="relative flex w-full items-center justify-between">
              {/* Background 1px Stone Track */}
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/80" />

              {/* Active Quiet Primary Line Linked to Scroll */}
              <motion.div
                style={{
                  scaleX: shouldReduceMotion ? 1 : smoothProgress,
                  transformOrigin: "left",
                }}
                className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary"
              />

              {/* Waypoint Milestones */}
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx
                const isPassed = activeStep >= idx

                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className="relative z-10 flex flex-col items-center cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <div className="flex size-4 items-center justify-center rounded-none bg-background">
                      <motion.div
                        style={
                          shouldReduceMotion
                            ? undefined
                            : { scaleX: velocityScaleX }
                        }
                        className={cn(
                          "size-2 rounded-none transition-colors duration-200",
                          isPassed ? "bg-primary" : "border border-border bg-muted"
                        )}
                      />
                    </div>
                    <div className="mt-2 font-mono text-xs">
                      <span
                        className={cn(
                          "font-semibold transition-colors",
                          isActive ? step.color : "text-muted-foreground"
                        )}
                      >
                        {step.num}
                      </span>{" "}
                      <span
                        className={cn(
                          "sr-only transition-colors sm:not-sr-only",
                          isActive ? "text-foreground font-medium" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
