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
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { LivingCargoLine } from "./living-cargo-line"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  motionDurations,
  motionEasings,
  tactileInteraction,
} from "@/lib/motion/motion.theme"

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
    title: "Manifest Departure — Linehaul Flight 6E-2419",
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
      className="py-12 sm:py-20 lg:py-24"
    >
      <div id="shipment-desk" className="space-y-10 lg:space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl">
          <SectionEyebrow className="mb-4">
            Consignment Console · Milestone Verification
          </SectionEyebrow>
          <h2
            id="tracking-heading"
            className="text-section text-foreground"
          >
            A number. A clearer picture.
          </h2>
          <p className="mt-4 text-lead max-w-[56ch]">
            <strong className="font-semibold text-foreground">Verified milestone telemetry. </strong>
            Query statutory Air Waybill (AWB) or surface consignment numbers to review gate intake scans, hub cross-dock transfers, and departure manifests in real time.
          </p>
        </div>

        {/* Dedicated Two-Column Product Interface */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Search Form & Consignment Profile (lg:col-span-5) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="relative border border-border/80 bg-card p-5 sm:p-7 shadow-xs">
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
                  className="block font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                >
                  AWB / shipment reference
                </label>
                <div
                  className={`relative flex items-center border bg-background transition-colors ${
                    isFocused ? "border-primary ring-1 ring-primary/40" : "border-border/80"
                  }`}
                >
                  <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="home-awb"
                    name="awb"
                    aria-label="AWB / shipment reference"
                    value={awbInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setAwbInput(e.target.value)}
                    placeholder="Enter shipment number"
                    className="h-11 border-0 bg-transparent pl-10 pr-3 font-mono text-sm tracking-wide text-foreground uppercase placeholder:normal-case focus-visible:ring-0"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <motion.div {...tactileInteraction}>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="rounded-none bg-primary px-6 font-sans text-xs font-semibold tracking-[-0.01em] text-primary-foreground hover:bg-primary/90"
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
                  </motion.div>

                  <button
                    type="button"
                    onClick={handleResetToSample}
                    className="font-sans text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    Reset sample
                  </button>
                </div>
              </form>

              {/* Active Consignment Meta Details Well */}
              <div className="mt-6 border border-border/80 bg-muted/20 p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5 font-mono">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Consignment Reference
                  </span>
                  <span className="text-sm font-bold tracking-wider text-primary">{activeAwb}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground font-medium">Corridor</span>
                    <span className="font-bold text-foreground">
                      {liveData ? `${liveData.origin} → ${liveData.destination}` : "Delhi (DEL) → Imphal (IMF)"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground font-medium">Service Mode</span>
                    <span className="font-bold text-info">
                      {liveData ? liveData.service : "Air Express · Priority"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs">
                  {isSample ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground font-medium">
                      <ShieldCheck className="size-4 text-status-delivered" />
                      Sample custody record
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground font-medium">
                      <ShieldCheck className="size-4 text-muted-foreground" />
                      Consignment status
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 border border-status-transit/40 bg-status-transit/10 px-2.5 py-1 font-mono text-xs font-bold text-status-transit">
                    <span className="size-1.5 bg-status-transit" />
                    {liveData ? liveData.status.toUpperCase() : "IN TRANSIT"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Milestone Log & Progress Console (lg:col-span-7) */}
          <div className="relative border border-border/80 bg-card p-5 sm:p-7 lg:col-span-7 shadow-xs">
            <BorderBeam size={80} duration={10} colorFrom="var(--color-primary)" colorTo="transparent" delay={3} borderWidth={1} />
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-medium tracking-tight text-foreground">
                    Milestone audit trail
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {isSample ? "5 recorded optical scan events" : "Physical gate milestone sequence"}
                  </p>
                </div>
                {isSample && (
                  <span className="border border-border bg-muted/60 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Sample preview
                  </span>
                )}
              </div>

              {/* AnimatePresence for Smooth State Progression */}
              <AnimatePresence mode="wait">
                {errorMessage ? (
                  /* Error State */
                  <motion.div
                    key="error-state"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
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
                          className="mt-3 font-mono text-xs underline underline-offset-4 hover:text-foreground"
                        >
                          Restore sample consignment preview
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Verified Consignment Record Card */
                  <motion.div
                    key="found-state"
                    initial={shouldReduceMotion ? false : { y: 6 }}
                    animate={{ y: 0 }}
                    exit={{ y: -6 }}
                    transition={{ duration: motionDurations.control }}
                    className="mt-4"
                  >
                    {/* Living Cargo Progress Line */}
                    <div className="mb-6">
                      <LivingCargoLine variant="rule" />
                    </div>

                    {/* Progressive Milestone Resolution */}
                    <div className="space-y-4">
                      {isPending ? (
                        <div className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" />
                          <span className="font-mono">Retrieving consignment milestones…</span>
                        </div>
                      ) : liveData && liveData.events && liveData.events.length > 0 ? (
                        liveData.events.map((evt, index) => {
                          const isDelivered = liveData.status === "delivered"
                          const isCompleted = isDelivered || index > 0
                          const isCurrent = !isDelivered && index === 0

                          return (
                            <div
                              key={evt.id || index}
                              className="milestone-row flex items-start gap-3.5 text-xs"
                            >
                              <div className="mt-0.5 flex flex-col items-center">
                                {isCurrent ? (
                                  <Clock className="size-4 text-status-transit" />
                                ) : isCompleted ? (
                                  <CheckCircle2 className="size-4 text-status-delivered" />
                                ) : (
                                  <Circle className="size-4 text-border" />
                                )}
                                {index < liveData.events.length - 1 && (
                                  <div className="my-1 h-6 w-px bg-border/60" />
                                )}
                              </div>

                              <div className="flex-1 pb-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <p className="text-xs font-semibold text-foreground">
                                    {evt.description || evt.status || "Milestone Scan"}
                                  </p>
                                  {evt.event_time && (
                                    <span className="border border-border/70 bg-muted/60 px-2 py-0.5 font-mono text-xs text-foreground/90 font-medium">
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
                                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                  {evt.location || "Gateway Hub"}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      ) : !isSample ? (
                        <p className="py-6 font-mono text-xs text-muted-foreground">
                          No public tracking events are available yet.
                        </p>
                      ) : (
                        SAMPLE_MILESTONES.map((item, index) => {
                          const isCompleted = item.status === "completed"
                          const isCurrent = item.status === "current"

                          return (
                            <motion.div
                              key={item.title}
                              initial={shouldReduceMotion ? false : { x: -6 }}
                              animate={{ x: 0 }}
                              transition={{
                                duration: motionDurations.fast,
                                delay: index * 0.06,
                                ease: motionEasings.editorial,
                              }}
                              className="milestone-row flex items-start gap-3.5 text-xs"
                            >
                              <div className="mt-0.5 flex flex-col items-center">
                                {isCompleted ? (
                                  <CheckCircle2 className="size-4 text-status-delivered" />
                                ) : isCurrent ? (
                                  <Clock className="size-4 text-status-transit" />
                                ) : (
                                  <Circle className="size-4 text-border" />
                                )}
                                {index < SAMPLE_MILESTONES.length - 1 && (
                                  <div
                                    className={`my-1 h-6 w-px ${
                                      isCompleted ? "bg-status-delivered/50" : "bg-border/60"
                                    }`}
                                  />
                                )}
                              </div>

                              <div className="flex-1 pb-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <p
                                    className={`text-xs ${
                                      isCurrent
                                        ? "text-foreground font-semibold"
                                        : isCompleted
                                        ? "text-foreground font-medium"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {item.title}
                                  </p>
                                  <span className="border border-border/70 bg-muted/60 px-2 py-0.5 font-mono text-xs text-foreground/90 font-medium">
                                    {item.timestamp}
                                  </span>
                                </div>
                                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                  {item.location}
                                </p>
                              </div>
                            </motion.div>
                          )
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 border-t border-border/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-none bg-status-delivered animate-pulse" />
                <span className="font-medium">
                  {isSample
                    ? "Verified physical scan trail · Synced within 120s of gate intake"
                    : "Consignment record synchronized with central tracking log"}
                </span>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                Optical Gate Audit
              </span>
            </div>
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
