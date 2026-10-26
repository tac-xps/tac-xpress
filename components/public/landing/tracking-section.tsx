"use client"

import React, { useState, useTransition } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import {
  Search,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/reui/badge"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  StepperNav,
} from "@/components/reui/stepper"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { BorderBeam } from "@/components/ui/border-beam"
import BoardingPass, {
  type Flight,
  type BoardingPassLabels,
  type FlightStatus,
} from "@/components/kokonutui/boarding-pass"
import { cn } from "@/lib/utils"
import {
  motionDurations,
  motionEasings,
  tactileInteraction,
} from "@/lib/motion/motion.theme"
import SignaturePad from "@/components/kokonutui/signature-pad"
import CurrencyTransfer from "@/components/kokonutui/currency-transfer"
import ReceiptPrinter from "@/components/kokonutui/receipt-printer"

const CARGO_LABELS: BoardingPassLabels = {
  field1: "Gate",
  field2: "Loading",
  field3: "Payload",
  field4: "Bay",
  footerLabel: "Consignee / Destination Hub",
}

interface SampleMilestone {
  title: string
  location: string
  timestamp: string
  status: "completed" | "current" | "upcoming"
}

const SAMPLE_MILESTONES: SampleMilestone[] = [
  {
    title: "Consignment Lodged & Scanned",
    location: "IGI Airport Cargo Terminal, Delhi",
    timestamp: "Oct 08, 08:30 IST",
    status: "completed",
  },
  {
    title: "Security & Statutory Clearance",
    location: "BCAS Security Gate 4, Terminal 2",
    timestamp: "Oct 08, 11:45 IST",
    status: "completed",
  },
  {
    title: "Manifest Departure: Linehaul Flight 6E-2419",
    location: "Departed DEL Runway 28",
    timestamp: "Oct 08, 14:15 IST",
    status: "current",
  },
  {
    title: "Regional Inbound Arrival & Sorting",
    location: "Bir Tikendrajit Airport Hub, Imphal",
    timestamp: "Expected Oct 08, 18:30 IST",
    status: "upcoming",
  },
  {
    title: "Final Custodial Handover & Signature",
    location: "Commercial Destination Desk",
    timestamp: "Expected Oct 09, 10:00 IST",
    status: "upcoming",
  },
]

/** 1-based step index of the current active milestone in sample data */
const SAMPLE_ACTIVE_STEP = SAMPLE_MILESTONES.findIndex((m) => m.status === "current") + 1

interface RadarBeaconNodeProps {
  shouldReduceMotion: boolean
}

/**
 * Radar Beacon Node: Dual concentric expanding pulse for the active transit waypoint.
 * Strictly animated via GPU-composited transform scale and opacity.
 */
function RadarBeaconNode({ shouldReduceMotion }: RadarBeaconNodeProps) {
  if (shouldReduceMotion) {
    return (
      <div className="relative flex size-4 items-center justify-center" aria-hidden="true">
        <span className="size-2 rounded-none bg-status-transit ring-2 ring-status-transit/30" />
      </div>
    )
  }

  return (
    <div className="relative flex size-4 items-center justify-center" aria-hidden="true">
      {/* Outer expanding radar wave ring 1 */}
      <motion.span
        className="absolute size-4 rounded-none border border-status-transit/60"
        initial={{ scale: 0.7, opacity: 0.8 }}
        animate={{ scale: [0.7, 2.1], opacity: [0.8, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      {/* Outer expanding radar wave ring 2 (phase offset) */}
      <motion.span
        className="absolute size-4 rounded-none border border-status-transit/40"
        initial={{ scale: 0.7, opacity: 0.8 }}
        animate={{ scale: [0.7, 2.1], opacity: [0.8, 0] }}
        transition={{
          duration: 2.2,
          delay: 1.1,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      {/* Core beacon dot with subtle breathing luminosity */}
      <motion.span
        className="relative size-2 rounded-none bg-status-transit"
        animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

interface TravelingConnectorBeamProps {
  shouldReduceMotion: boolean
}

/**
 * Linehaul Photon Transit: Downward continuous particle stream between completed and active waypoints.
 */
function TravelingConnectorBeam({ shouldReduceMotion }: TravelingConnectorBeamProps) {
  if (shouldReduceMotion) {
    return (
      <div
        className="my-1 h-6 w-px bg-gradient-to-b from-status-delivered/60 to-status-transit/60"
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className="relative my-1 h-6 w-px overflow-visible bg-border/60"
      aria-hidden="true"
    >
      {/* Linehaul static trace rail */}
      <div className="absolute inset-0 bg-gradient-to-b from-status-delivered/60 to-status-transit/40" />

      {/* Traveling photon packet moving continuously along the corridor line */}
      <motion.div
        className="absolute -left-[1px] h-2.5 w-[3px] rounded-none bg-status-transit shadow-[0_0_6px_var(--color-status-transit)]"
        initial={{ y: -2, opacity: 0 }}
        animate={{
          y: [-2, 24],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

interface MilestoneProgressRailProps {
  completedSteps: number
  totalSteps: number
  shouldReduceMotion: boolean
}

/**
 * Milestone Progress Rail with Ambient Shimmer highlight.
 */
function MilestoneProgressRail({
  completedSteps,
  totalSteps,
  shouldReduceMotion,
}: MilestoneProgressRailProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((completedSteps / totalSteps) * 100)))

  return (
    <div className="mb-6 space-y-2 select-none" aria-hidden="true">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-sans font-medium">
          <span className="size-1.5 rounded-none bg-primary" />
          Milestone Fulfillment
        </span>
        <span className="font-mono font-semibold tabular-nums text-foreground">
          {percentage}% (Phase {completedSteps} of {totalSteps})
        </span>
      </div>

      {/* Rail track */}
      <div className="relative h-1.5 w-full overflow-hidden bg-muted/80 border border-border/70">
        {/* Filled bar */}
        <motion.div
          className="relative h-full bg-primary"
          initial={false}
          animate={{ width: `${percentage}%` }}
          style={{ width: `${percentage}%` }}
          transition={{
            duration: motionDurations.editorial,
            ease: motionEasings.editorial,
          }}
        >
          {/* Ambient looping shimmer highlight across the filled rail */}
          <motion.div
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent motion-reduce:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "400%"] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

/**
 * Radar Sync Dot: Looping radar ping for optical gate audit trail.
 */
function RadarSyncDot() {
  return (
    <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
      <span className="absolute inset-0 rounded-none bg-status-delivered/40 motion-safe:animate-ping motion-reduce:hidden" />
      <span className="relative size-1.5 rounded-none bg-status-delivered" />
    </span>
  )
}

/* ─── Sample Milestone Stepper (ReUI) ───────────────────────────── */

interface SampleMilestoneStepperProps {
  shouldReduceMotion: boolean
}

/**
 * Renders the sample milestone data using ReUI Stepper primitives
 * in vertical orientation. Display-only (no interactive step navigation).
 */
function SampleMilestoneStepper({ shouldReduceMotion }: SampleMilestoneStepperProps) {
  return (
    <Stepper
      value={SAMPLE_ACTIVE_STEP}
      orientation="vertical"
      indicators={{
        completed: <CheckCircle2 className="size-4 text-status-delivered" />,
        active: <RadarBeaconNode shouldReduceMotion={!!shouldReduceMotion} />,
        inactive: <Circle className="size-4 text-border" />,
      }}
    >
      <StepperNav className="gap-0">
        {SAMPLE_MILESTONES.map((item, index) => {
          const stepNumber = index + 1
          const isCurrent = item.status === "current"
          const isCompleted = item.status === "completed"
          const isLastCompleted =
            isCompleted &&
            index < SAMPLE_MILESTONES.length - 1 &&
            SAMPLE_MILESTONES[index + 1].status === "current"

          return (
            <StepperItem
              key={item.title}
              step={stepNumber}
              completed={isCompleted}
              className={`!flex-row !items-start gap-3.5 !justify-start ${
                isCurrent ? "relative rounded-none bg-primary/[0.03] -mx-2 px-2 py-1.5" : ""
              }`}
            >
              {/* Indicator column: icon + connector */}
              <div className="mt-0.5 flex flex-col items-center shrink-0">
                <StepperIndicator
                  className="!size-auto !bg-transparent !text-inherit !rounded-none !border-0 !overflow-visible"
                />
                {index < SAMPLE_MILESTONES.length - 1 && (
                  isLastCompleted ? (
                    <TravelingConnectorBeam shouldReduceMotion={!!shouldReduceMotion} />
                  ) : (
                    <StepperSeparator
                      className={`!m-0 my-1 !h-6 !w-px !flex-none ${
                        isCompleted ? "!bg-status-delivered/50" : "!bg-border/60"
                      }`}
                    />
                  )
                )}
              </div>

              {/* Content column: title + timestamp + location */}
              <div className="flex-1 pb-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <StepperTitle
                    className={`!text-sm ${
                      isCurrent
                        ? "text-foreground !font-semibold"
                        : isCompleted
                          ? "text-foreground !font-medium"
                          : "text-muted-foreground !font-normal"
                    }`}
                  >
                    {item.title}
                  </StepperTitle>
                  <span
                    className={`border px-2 py-0.5 font-mono text-xs font-medium tabular-nums ${
                      isCurrent
                        ? "border-primary/40 bg-primary/[0.06] text-foreground font-semibold"
                        : "border-border/70 bg-muted/60 text-foreground/90"
                    }`}
                  >
                    {item.timestamp}
                  </span>
                </div>
                <StepperDescription className="mt-1 !text-xs sm:!text-sm">
                  {item.location}
                </StepperDescription>
              </div>
            </StepperItem>
          )
        })}
      </StepperNav>
    </Stepper>
  )
}

/* ─── Live Data Milestone Stepper (ReUI) ────────────────────────── */

interface LiveMilestoneStepperProps {
  events: Array<{
    id?: string
    status?: string
    location?: string
    description?: string
    event_time?: string
  }>
  overallStatus: string
  shouldReduceMotion: boolean
}

/**
 * Renders live API milestone data using ReUI Stepper primitives.
 */
function LiveMilestoneStepper({ events, overallStatus, shouldReduceMotion }: LiveMilestoneStepperProps) {
  const isDelivered = overallStatus === "delivered"
  // Active step: first event (most recent) unless delivered, then all completed
  const activeStep = isDelivered ? events.length + 1 : 1

  return (
    <Stepper
      value={activeStep}
      orientation="vertical"
      indicators={{
        completed: <CheckCircle2 className="size-4 text-status-delivered" />,
        active: <RadarBeaconNode shouldReduceMotion={!!shouldReduceMotion} />,
        inactive: <Circle className="size-4 text-border" />,
      }}
    >
      <StepperNav className="gap-0">
        {events.map((evt, index) => {
          const stepNumber = index + 1
          const isCompleted = isDelivered || index > 0
          const isCurrent = !isDelivered && index === 0

          return (
            <div
              key={evt.id || index}
              className="milestone-row flex items-start gap-3.5 text-xs"
            >
              <StepperItem
                step={stepNumber}
                completed={isCompleted}
                className="!flex-row !items-start gap-3.5 !justify-start"
              >
                {/* Indicator column */}
                <div className="mt-0.5 flex flex-col items-center shrink-0">
                  <StepperIndicator
                    className="!size-auto !bg-transparent !text-inherit !rounded-none !border-0 !overflow-visible"
                  />
                  {index < events.length - 1 && (
                    <StepperSeparator className="!m-0 my-1 !h-6 !w-px !flex-none !bg-border/60" />
                  )}
                </div>

                {/* Content column */}
                <div className="flex-1 pb-1 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <StepperTitle className="!text-sm !font-medium text-foreground">
                      {evt.description || evt.status || "Milestone Scan"}
                    </StepperTitle>
                    {evt.event_time && (
                      <span className="border border-border/70 bg-muted/60 px-2 py-0.5 font-mono text-xs text-foreground/90 font-medium tabular-nums">
                        {new Date(evt.event_time).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <StepperDescription className="mt-1 !text-xs sm:!text-sm">
                    {evt.location || "Gateway Hub"}
                  </StepperDescription>
                </div>
              </StepperItem>
            </div>
          )
        })}
      </StepperNav>
    </Stepper>
  )
}

/**
 * Public shipment tracking console supporting interactive AWB query,
 * live gateway milestone telemetry, and fallback sample demonstration data.
 */
export function TrackingSection() {
  const [awbInput, setAwbInput] = useState<string>("TAC-2409-18472")
  const [activeAwb, setActiveAwb] = useState<string>("TAC-2409-18472")
  const [isSample, setIsSample] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [liveData, setLiveData] = useState<{
    status: string
    origin: string
    destination: string
    service: string
    events: Array<{
      id?: string
      status?: string
      location?: string
      description?: string
      event_time?: string
    }>
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const shouldReduceMotion = useReducedMotion()
  const [trackingView, setTrackingView] = useState<"awb" | "milestones" | "pod" | "calculator" | "docket">("awb")
  const [podSigned, setPodSigned] = useState<boolean>(false)

  const currentFlight: Flight = {
    airline: "TAC Express Air Cargo",
    number: activeAwb,
    from: {
      code: liveData?.origin ? liveData.origin.slice(0, 3).toUpperCase() : "DEL",
      city: liveData?.origin ? `${liveData.origin} Cargo Terminal` : "Delhi Cargo Terminal 3",
      time: "06:15",
    },
    to: {
      code: liveData?.destination ? liveData.destination.slice(0, 3).toUpperCase() : "IMF",
      city: liveData?.destination ? `${liveData.destination} Air Cargo` : "Imphal Tulihal Air Cargo",
      time: "09:30",
    },
    date: isSample ? "Daily Linehaul" : "Scheduled Flight",
    gate: "BAY 14",
    boards: "05:40",
    seat: isSample ? "740 KG" : "Statutory Manifest",
    group: "AIR-01",
    passenger: isSample ? "Imphal Distribution Hub" : "Consignee Cargo Station",
    status: (liveData?.status?.toLowerCase().includes("deliver")
      ? "delivered"
      : liveData?.status?.toLowerCase().includes("transit")
      ? "in-transit"
      : "on-time") as FlightStatus,
    note: isSample
      ? "Commercial belly-hold space secured / BCAS scan cleared"
      : `Consignment ${activeAwb} verified in transit`,
  }

  const handleTrackSubmit = (e: React.FormEvent) => {
    const trimmed = awbInput.trim().toUpperCase()
    if (!trimmed) {
      e.preventDefault()
      return
    }

    if (trimmed === "TAC-2409-18472") {
      e.preventDefault()
      setActiveAwb(trimmed)
      setIsSample(true)
      setLiveData(null)
      setErrorMessage(null)
      return
    }

    // Allow native GET form submission to /track?awb=...
  }

  const handleResetToSample = () => {
    setAwbInput("TAC-2409-18472")
    setActiveAwb("TAC-2409-18472")
    setIsSample(true)
    setLiveData(null)
    setErrorMessage(null)
  }

  return (
    <EditorialContainer
      id="visibility-chapter"
      aria-labelledby="tracking-heading"
      className="bg-muted/30 py-12 sm:py-16 lg:py-20"
    >
      <div id="shipment-desk" data-slot="workbench" className="space-y-12 lg:space-y-16">
        {/* Section Header: S1 entrance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionDurations.editorial,
            ease: motionEasings.editorial,
          }}
          className="max-w-2xl space-y-5"
        >
          <h2
            id="tracking-heading"
            className="text-section text-foreground tracking-tight text-balance"
          >
            <span className="block font-medium text-foreground/80">A single reference.</span>
            <span className="block font-semibold text-foreground">
              Complete telemetry<span className="font-semibold text-primary">.</span>
            </span>
          </h2>
          <div className="space-y-3 max-w-[54ch]">
            <p className="text-base font-medium text-foreground leading-snug tracking-tight text-pretty">
              Real-time custody tracking across airport gates and cross-dock hubs.
            </p>
            <div className="flex flex-wrap items-center gap-2 font-sans text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 border border-border/80 bg-muted/40 px-2 py-0.5 text-foreground font-semibold rounded-none">
                <span className="size-1.5 bg-status-delivered rounded-none" aria-hidden="true" />
                Live custody audit
              </span>
              <span className="border border-border/60 bg-muted/20 px-2 py-0.5 text-xs rounded-none">
                Optical scan reconciliation
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
              Query statutory <span className="font-mono text-foreground font-semibold bg-muted/50 px-1 py-0.5 border border-border/70 text-xs rounded-none">Air Waybill (AWB)</span> or surface consignment numbers to review gate intake scans, ramp transfers, and scheduled departure manifests in real time.
            </p>
          </div>
          {/* Anchored baseline divider */}
          <div className="flex items-center gap-3 pt-2" aria-hidden="true">
            <div className="h-px w-16 bg-primary" />
            <div className="h-px flex-1 max-w-48 bg-border" />
          </div>
        </motion.div>

        {/* S3: Staggered two-column layout entrance */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Search Form & Consignment Profile (lg:col-span-5) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: motionDurations.reveal,
              ease: motionEasings.editorial,
            }}
            className="space-y-6 lg:col-span-5"
          >
            <div className="relative border-l-2 border-l-primary border-t border-r border-b border-border/80 bg-card p-5 sm:p-7 shadow-sm hover:shadow-md transition-colors duration-200">
              <BorderBeam size={60} duration={8} colorFrom="var(--color-primary)" colorTo="transparent" borderWidth={1} />
              <form
                action="/track"
                method="get"
                aria-label="Track your shipment"
                onSubmit={handleTrackSubmit}
                className="space-y-4"
              >
                <label
                  htmlFor="home-awb"
                  className="block font-sans text-xs text-muted-foreground font-medium"
                >
                  AWB / shipment reference
                </label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none z-10" />
                  <Input
                    id="home-awb"
                    name="awb"
                    aria-label="AWB / shipment reference"
                    value={awbInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setAwbInput(e.target.value)}
                    placeholder="Enter shipment number"
                    className="h-11 border border-input bg-card pl-10 pr-3 font-mono text-base sm:text-sm text-foreground uppercase placeholder:normal-case focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 bg-primary px-6 font-sans text-xs font-semibold tracking-[-0.01em] text-primary-foreground hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      "Track shipment"
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={handleResetToSample}
                    className="font-sans text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    Reset sample
                  </button>
                </div>

                {/* Instant Sample Waybills */}
                <div className="pt-2">
                  <span className="block font-sans text-xs text-muted-foreground font-semibold mb-1.5">
                    Test Live Consignments:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { awb: "TAC-2409-18472", label: "DEL to IMF (Air)" },
                      { awb: "TAC-510294-GAU", label: "DEL to GAU (Surface)" },
                      { awb: "TAC-908123-SHL", label: "DEL to SHL (Express)" },
                    ].map((sample) => (
                      <button
                        key={sample.awb}
                        type="button"
                        onClick={() => {
                          setAwbInput(sample.awb)
                          setActiveAwb(sample.awb)
                          setIsSample(true)
                          setLiveData(null)
                          setErrorMessage(null)
                        }}
                        className={cn(
                          "px-2 py-0.5 font-mono text-[11px] rounded-none border transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.98] disabled:opacity-50",
                          activeAwb === sample.awb
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border/80 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* Active Consignment Meta Details Well */}
              <div className="mt-6 border border-border/80 bg-muted/20 p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <span className="font-sans text-xs text-muted-foreground font-medium">
                    Consignment Reference
                  </span>
                  <span className="font-mono text-sm font-semibold text-primary tabular-nums">{activeAwb}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block font-sans text-xs text-muted-foreground font-medium">Corridor</span>
                    <span className="font-sans font-medium text-foreground text-xs sm:text-sm">
                      {liveData ? `${liveData.origin} → ${liveData.destination}` : "Delhi (DEL) → Imphal (IMF)"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-sans text-xs text-muted-foreground font-medium">Service Mode</span>
                    <span className="font-sans font-medium text-info text-xs sm:text-sm">
                      {liveData ? liveData.service : "Air Express (Priority)"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs">
                  {isSample ? (
                    <Badge variant="outline" className="gap-1.5 font-normal">
                      <ShieldCheck className="size-3.5 text-status-delivered" />
                      Sample custody record
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1.5 font-normal">
                      <ShieldCheck className="size-3.5 text-muted-foreground" />
                      Consignment status
                    </Badge>
                  )}
                  <Badge variant="warning-light" className="font-mono text-xs">
                    {liveData ? liveData.status : "IN TRANSIT"}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Milestone Log & Progress Console (lg:col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: motionDurations.reveal,
              delay: 0.1,
              ease: motionEasings.editorial,
            }}
            className="relative border-l-2 border-l-primary border-t border-r border-b border-border/80 bg-card p-5 sm:p-7 lg:col-span-7 shadow-sm transition-colors duration-200 hover:border-primary/40"
          >
            <BorderBeam size={80} duration={10} colorFrom="var(--color-primary)" colorTo="transparent" delay={3} borderWidth={1} />
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-medium tracking-tight text-foreground">
                    Air Waybill (AWB) Manifest
                  </h3>
                  <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                    Statutory carriage document / Optical barcode &amp; custody ledger
                  </p>
                </div>

                {/* Sub-View Switcher: AWB Manifest vs Milestone Timeline vs POD vs Calculator */}
                <div
                  role="tablist"
                  aria-label="Consignment details view selection"
                  className="flex flex-wrap items-center gap-1 rounded-none border border-border/80 bg-muted/40 p-0.5"
                >
                  <button
                    type="button"
                    role="tab"
                    id="tab-awb"
                    aria-selected={trackingView === "awb"}
                    aria-controls="panel-awb"
                    onClick={() => setTrackingView("awb")}
                    className={cn(
                      "rounded-none px-2.5 py-1 text-xs font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-50",
                      trackingView === "awb"
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Air Waybill (AWB)
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-milestones"
                    aria-selected={trackingView === "milestones"}
                    aria-controls="panel-milestones"
                    onClick={() => setTrackingView("milestones")}
                    className={cn(
                      "rounded-none px-2.5 py-1 text-xs font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-50",
                      trackingView === "milestones"
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Gate Milestones
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-pod"
                    aria-selected={trackingView === "pod"}
                    aria-controls="panel-pod"
                    onClick={() => setTrackingView("pod")}
                    className={cn(
                      "rounded-none px-2.5 py-1 text-xs font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-50",
                      trackingView === "pod"
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Digital POD
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-calculator"
                    aria-selected={trackingView === "calculator"}
                    aria-controls="panel-calculator"
                    onClick={() => setTrackingView("calculator")}
                    className={cn(
                      "rounded-none px-2.5 py-1 text-xs font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-50",
                      trackingView === "calculator"
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Rate Estimator
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-docket"
                    aria-selected={trackingView === "docket"}
                    aria-controls="panel-docket"
                    onClick={() => setTrackingView("docket")}
                    className={cn(
                      "rounded-none px-2.5 py-1 text-xs font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-50",
                      trackingView === "docket"
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Docket Print
                  </button>
                </div>
              </div>

              {/* AnimatePresence for Smooth State Progression */}
              <AnimatePresence mode="wait">
                {errorMessage ? (
                  /* Error State */
                  <motion.div
                    key="error-state"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: motionDurations.fast }}
                    className="mt-6 border border-destructive/30 bg-destructive/10 p-5 text-xs text-destructive"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{errorMessage}</p>
                        <p className="mt-1 font-sans text-muted-foreground">
                          Verify the carriage reference on your physical consignment slip, or test with our sample reference.
                        </p>
                        <button
                          type="button"
                          onClick={handleResetToSample}
                          className="mt-3 font-sans text-xs font-medium underline underline-offset-4 hover:text-foreground whitespace-nowrap focus-visible:ring-1 focus-visible:ring-primary"
                        >
                          Restore sample reference
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : trackingView === "awb" ? (
                  /* Verified Air Waybill (AWB) Component UI */
                  <motion.div
                    key="awb-manifest-view"
                    id="panel-awb"
                    role="tabpanel"
                    aria-labelledby="tab-awb"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: motionDurations.control }}
                    className="mt-5 flex justify-center w-full"
                  >
                    <BoardingPass
                      flight={currentFlight}
                      labels={CARGO_LABELS}
                      className="w-full max-w-sm shadow-md"
                    />
                  </motion.div>
                ) : trackingView === "milestones" ? (
                  /* Physical Gate Milestone Stepper View */
                  <motion.div
                    key="milestones-view"
                    id="panel-milestones"
                    role="tabpanel"
                    aria-labelledby="tab-milestones"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: motionDurations.control }}
                    className="mt-4"
                  >
                    {/* Milestone Progress Rail with Ambient Shimmer */}
                    <MilestoneProgressRail
                      completedSteps={isSample ? 3 : (liveData?.events?.filter((_, i) => i > 0).length ?? 0)}
                      totalSteps={isSample ? SAMPLE_MILESTONES.length : (liveData?.events?.length ?? 5)}
                      shouldReduceMotion={!!shouldReduceMotion}
                    />

                    {/* Progressive Milestone Resolution via ReUI Stepper */}
                    <div className="space-y-4">
                      {isPending ? (
                        <div className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" />
                          <span className="font-sans">Retrieving consignment milestones…</span>
                        </div>
                      ) : liveData && liveData.events && liveData.events.length > 0 ? (
                        <LiveMilestoneStepper
                          events={liveData.events}
                          overallStatus={liveData.status}
                          shouldReduceMotion={!!shouldReduceMotion}
                        />
                      ) : !isSample ? (
                        <p className="py-6 font-sans text-xs text-muted-foreground">
                          No public tracking events are available yet.
                        </p>
                      ) : (
                        <SampleMilestoneStepper
                          shouldReduceMotion={!!shouldReduceMotion}
                        />
                      )}
                    </div>
                  </motion.div>
                ) : trackingView === "pod" ? (
                  /* Proof of Delivery (SignaturePad) View */
                  <motion.div
                    key="pod-signature-view"
                    id="panel-pod"
                    role="tabpanel"
                    aria-labelledby="tab-pod"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: motionDurations.control }}
                    className="mt-5 flex flex-col items-center w-full space-y-4"
                  >
                    <div className="w-full text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs text-primary font-semibold">
                          Milestone 05: Custodial Verification
                        </span>
                        <Badge variant="outline" className="font-sans text-xs rounded-none">
                          {podSigned ? "Signed & Verified" : "Pending Signature"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">
                        Sign below for custodial handover verification. Confirms final destination release.
                      </p>
                    </div>
                    <SignaturePad
                      label="Consignee Proof of Delivery Signature"
                      onChange={(svg) => setPodSigned(!!svg)}
                      className="w-full max-w-sm border border-border/80 bg-background"
                    />
                  </motion.div>
                ) : trackingView === "calculator" ? (
                  /* Rate Calculator (CurrencyTransfer) View */
                  <motion.div
                    key="calculator-view"
                    id="panel-calculator"
                    role="tabpanel"
                    aria-labelledby="tab-calculator"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: motionDurations.control }}
                    className="mt-5 flex flex-col items-center w-full space-y-4"
                  >
                    <div className="w-full text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs text-primary font-semibold">
                          Freight STEM Engine: Rate Estimator
                        </span>
                        <Badge variant="outline" className="font-sans text-xs rounded-none">
                          18%&nbsp;GST Itemized
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">
                        Chargeable weight to Indian Rupee conversion based on volumetric density rules.
                      </p>
                    </div>
                    <CurrencyTransfer
                      from={{
                        amount: 740,
                        currency: "KG",
                        symbol: "KG",
                        bank: "DEL IGI Air Cargo Terminal",
                        last4: "AIR1",
                      }}
                      to={{
                        amount: 18500,
                        currency: "INR",
                        symbol: "₹",
                        bank: "TAC Express Corridor Escrow",
                        last4: "2419",
                        name: "Imphal Regional Cargo Hub",
                      }}
                      rate={25}
                      txnId="AWB-TAC-2409-18472"
                      timestamp="14:15 IST"
                      status="completed"
                      className="w-full max-w-sm border border-border/80 bg-background"
                    />
                  </motion.div>
                ) : (
                  /* Thermal Consignment Docket Print (ReceiptPrinter) View */
                  <motion.div
                    key="docket-print-view"
                    id="panel-docket"
                    role="tabpanel"
                    aria-labelledby="tab-docket"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: motionDurations.control }}
                    className="mt-5 flex flex-col items-center w-full space-y-4"
                  >
                    <div className="w-full text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs text-primary font-semibold">
                          Terminal Waybill: Thermal Docket
                        </span>
                        <Badge variant="outline" className="font-sans text-xs rounded-none">
                          Optical Barcode Verified
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">
                        Interactive receipt printer for statutory gate passes and commercial consignments. Pull down on paper to tear.
                      </p>
                    </div>
                    <div className="flex justify-center w-full pt-2">
                      <ReceiptPrinter
                        merchant="TAC EXPRESS CARGO AIRWAYS"
                        order={activeAwb}
                        date="26 OCT 2026 / 14:15 IST"
                        currency="₹"
                        tax={0.18}
                        items={[
                          { name: "Air Linehaul (DEL → IMF)", quantity: 1, price: 4200 },
                          { name: "Optical Manifest Processing", quantity: 1, price: 350 },
                          { name: "BCAS Gate 4 Security Screening", quantity: 1, price: 450 },
                          { name: "Aviation Fuel Surcharge (FSC)", quantity: 1, price: 720 },
                        ]}
                        className="w-72 shadow-lg"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 border-t border-border/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <RadarSyncDot />
                <span className="font-normal text-muted-foreground">
                  {isSample
                    ? "Verified physical scan trail, synced within 120\u00A0s of gate intake"
                    : "Consignment record synchronized with central tracking log"}
                </span>
              </div>
              <span className="font-sans text-xs text-primary font-medium">
                Optical Gate Audit
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </EditorialContainer>
  )
}
