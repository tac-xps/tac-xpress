"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "motion/react"
import { Clock, Plane, ShieldCheck } from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  motionSprings,
  motionDurations,
  motionEasings,
} from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

interface TerminalHub {
  id: string
  code: string
  city: string
  name: string
  role: string
  nextCutoff: string
  flightConnection: string
  rampSla: string
  capacity: string
  capacityPercent: number
  securityGate: string
  status: "OPEN - ACCEPTING" | "STAGED - BOARDING" | "SCHEDULED"
  statusColor: string
  summary: string
  specs: { label: string; value: string }[]
}

const TERMINAL_HUBS: TerminalHub[] = [
  {
    id: "del",
    code: "DEL",
    city: "New Delhi",
    name: "DEL Central Air Cargo Consolidation",
    role: "National Consolidation & Air Manifest Gateway",
    nextCutoff: "T-180m (11:15 IST)",
    flightConnection: "6E-2419 Linehaul Departure 14:15 IST",
    rampSla: "99.9% Ramp Transfer Compliance",
    capacity: "42.5 MT Lifted Daily",
    capacityPercent: 78,
    securityGate: "BCAS Gate 4 / Dual X-Ray Cleared",
    status: "OPEN - ACCEPTING",
    statusColor: "text-status-delivered border-status-delivered/40 bg-status-delivered/10",
    summary:
      "Primary national consolidation gateway at IGI Airport Terminal 2. Receives commercial belly-hold cargo with direct apron access and express road intake.",
    specs: [
      { label: "Volumetric Divisor", value: "cm³ / 5000" },
      { label: "Statutory Cutoff", value: "180 min prior to takeoff" },
      { label: "Dangerous Goods", value: "IATA Section II / UN 3480" },
      { label: "Gate Clearance", value: "Optical Barcode Reconciliation" },
    ],
  },
  {
    id: "imf",
    code: "IMF",
    city: "Imphal",
    name: "IMF Tulihal Regional Delivery Station",
    role: "Northeast Direct Gateway & Proof-of-Delivery Desk",
    nextCutoff: "Inbound Handover 18:30 IST",
    flightConnection: "Direct Flight Intake from DEL / CCU",
    rampSla: "Same-Day Station Sortation SLA",
    capacity: "18.2 MT Regional Handling",
    capacityPercent: 64,
    securityGate: "Apron Bay 3 / Tamper-Evident Sign-off",
    status: "STAGED - BOARDING",
    statusColor: "text-primary border-primary/40 bg-primary/10",
    summary:
      "Direct inbound air and surface terminal receiving scheduled cargo for rapid regional distribution across Manipur and neighboring Northeast hubs.",
    specs: [
      { label: "Delivery Protocol", value: "Digital Proof-of-Delivery" },
      { label: "Geotag Verification", value: "Mandatory Destination Handover" },
      { label: "Local Dispatch", value: "Same-Day Metro Delivery Desk" },
      { label: "Escalation Desk", value: "Immediate Exception Routing" },
    ],
  },
  {
    id: "gau",
    code: "GAU",
    city: "Guwahati",
    name: "GAU Borjhar Arterial Trunk Gateway",
    role: "Brahmaputra Valley Surface Linehaul Depot",
    nextCutoff: "Nightly Departure 21:00 IST",
    flightConnection: "NH-27 Arterial Linehaul Fleet (Multi-Ton)",
    rampSla: "99.4% Scheduled Dispatch Compliance",
    capacity: "68.0 MT Surface Throughput",
    capacityPercent: 86,
    securityGate: "High-Cube Container GPS Seals",
    status: "SCHEDULED",
    statusColor: "text-info border-info/40 bg-info/10",
    summary:
      "Arterial highway trunk depot managing heavy palletized cargo, regional inter-modal container staging, and long-haul surface transit routes.",
    specs: [
      { label: "Corridor Type", value: "Dedicated NH-27 Express Lanes" },
      { label: "Vehicle Custody", value: "Optical GPS Tamper-Evident Seal" },
      { label: "Volumetric Ratio", value: "cm³ / 4000 (Road Linehaul)" },
      { label: "Documentation", value: "E-Way Bill & GST Invoice Match" },
    ],
  },
]

/**
 * Network topology section presenting strategic hub stations, national arterial corridors,
 * and regional gateway infrastructure with dark tactical operations console layout.
 */
export function NetworkSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [selectedHubId, setSelectedHubId] = useState<string>("del")

  const selectedHub = TERMINAL_HUBS.find((h) => h.id === selectedHubId) ?? TERMINAL_HUBS[0]

  // Track scroll through the network section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  const outerY = useTransform(smoothProgress, [0, 1], [4, -4])
  const innerY = useTransform(smoothProgress, [0, 1], [-2, 2])
  const imageScale = useTransform(smoothProgress, [0, 1], [1.0, 1.025])

  return (
    <EditorialContainer
      id="network"
      as="div"
      aria-labelledby="network-heading"
      className="dark bg-background text-foreground border-y border-border py-10 sm:py-16 lg:py-20 transition-colors"
    >
      <div ref={containerRef} className="space-y-10 lg:space-y-14">
        {/* Header */}
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
              id="network-heading"
              className="text-section text-foreground text-balance"
            >
              <span className="font-medium text-muted-foreground">Strategic terminals. </span>
              <span className="font-semibold text-foreground">
                Active departure cutoffs<span className="font-semibold text-primary">.</span>
              </span>
            </h2>
          </div>
          <div className="md:col-span-4">
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-medium text-foreground leading-snug">
                Verified corridor infrastructure.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
                Commercial aviation gateways and high-cube surface depots operating under strict statutory ramp handover deadlines.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Master Editorial Visual with Dark Technical Frame */}
        <motion.div
          style={{ y: outerY }}
          className="relative overflow-hidden border border-border bg-card shadow-sm"
        >
          <BorderBeam size={120} duration={14} colorFrom="var(--color-primary)" colorTo="transparent" borderWidth={1} />
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : { y: innerY, scale: imageScale }
            }
            className="relative aspect-16/9 w-full overflow-hidden sm:aspect-21/9 sm:min-h-[300px] lg:min-h-[380px]"
          >
            <Image
              src="/images/corridor-ink/cinema-network.png"
              alt="IGI Air Cargo terminal apron with cargo container dollies, ULD pallets, and linehaul transport"
              fill
              className="object-cover select-none brightness-90 contrast-105"
              sizes="(min-width: 1360px) 1264px, 100vw"
            />
          </motion.div>
          <div className="flex items-center justify-between border-t border-border bg-background px-4 py-2.5 font-sans text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-none bg-status-delivered" aria-hidden="true" />
              <span className="text-foreground font-medium">Apron Gateways &amp; Live Telemetry</span>
            </span>
            <span className="hidden sm:inline font-sans text-xs text-muted-foreground">
              BCAS Gate 4, Runway 28 Linehaul
            </span>
          </div>
        </motion.div>

        {/* Interactive Hub Schedule & Cutoff Planner Console */}
        <div data-slot="terminal-console" className="border border-border bg-card/90 shadow-sm">
          {/* Console Header / Selector Bar */}
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x border-b border-border" role="tablist" aria-label="Terminal Hub Schedules">
            {TERMINAL_HUBS.map((hub) => {
              const isSelected = hub.id === selectedHubId
              return (
                <button
                  key={hub.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedHubId(hub.id)}
                  className={cn(
                    "flex flex-col items-start p-4 sm:p-5 text-left transition-colors cursor-pointer rounded-none outline-none focus-visible:ring-1 focus-visible:ring-primary active:bg-muted/60 disabled:opacity-50 disabled:cursor-not-allowed",
                    isSelected
                      ? "bg-background border-t-2 border-t-primary"
                      : "bg-card/60 hover:bg-muted/40 border-t-2 border-t-transparent"
                  )}
                >
                  <div className="flex w-full items-center justify-between text-xs">
                    <span className={cn(
                      "font-semibold",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}>
                      <span className="font-mono">{hub.code}</span> ({hub.city})
                    </span>
                    <span className={cn("px-2 py-0.5 text-xs font-medium rounded-none border", hub.statusColor)}>
                      {hub.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-foreground">
                    {hub.name}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                    <Clock className="size-3 text-primary shrink-0" />
                    <span>Cutoff: <strong className="font-mono font-medium text-foreground">{hub.nextCutoff}</strong></span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Terminal Detail Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedHub.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Hub Summary & Linehaul Connection (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                    {selectedHub.name}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-2 font-sans text-xs text-primary font-medium">
                    <Plane className="size-3.5" />
                    <span>{selectedHub.role}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/80 leading-relaxed font-normal">
                    {selectedHub.summary}
                  </p>
                </div>

                <div className="border border-border bg-background/70 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-muted-foreground">Scheduled Connection</span>
                    <span className="font-mono font-semibold text-foreground">{selectedHub.flightConnection}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans border-t border-border/80 pt-2.5">
                    <span className="text-muted-foreground">Security &amp; Gate</span>
                    <span className="font-semibold text-status-delivered">{selectedHub.securityGate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans border-t border-border/80 pt-2.5">
                    <span className="text-muted-foreground">Target Ramp SLA</span>
                    <span className="font-mono font-semibold text-primary">{selectedHub.rampSla}</span>
                  </div>
                </div>

                {/* Capacity Allocation Meter */}
                <div className="space-y-1.5 font-sans text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Capacity Allocated ({selectedHub.capacity})</span>
                    <span className="font-mono text-foreground font-semibold">{selectedHub.capacityPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-none overflow-hidden">
                    <div
                      className="h-full bg-primary transition-colors duration-500 rounded-none"
                      style={{ width: `${selectedHub.capacityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Statutory Carriage Specs (5 cols) */}
              <div className="lg:col-span-5 border border-border bg-background p-5 space-y-4">
                <div className="flex items-center gap-2 font-sans text-xs font-semibold text-foreground border-b border-border pb-3">
                  <ShieldCheck className="size-4 text-status-delivered" />
                  <span>Terminal Compliance Matrix</span>
                </div>
                <div className="space-y-3">
                  {selectedHub.specs.map((spec) => (
                    <div key={spec.label} className="border-l-2 border-primary/60 pl-3 py-0.5">
                      <div className="font-sans text-xs text-muted-foreground">
                        {spec.label}
                      </div>
                      <div className="font-mono text-xs font-semibold text-foreground mt-0.5">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between font-sans text-xs text-muted-foreground">
                  <span>Dispatch Line: <span className="font-mono">+91 98561 73829</span></span>
                  <span className="text-primary font-semibold">Live Apron Desk</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </EditorialContainer>
  )
}
