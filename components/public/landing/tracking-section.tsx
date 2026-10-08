"use client"

import React, { useState, useTransition } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import {
  Search,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  Loader2,
  FileText,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { LivingCargoLine } from "./living-cargo-line"
import { trackAwb } from "@/app/actions/tracking"
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
    e.preventDefault()
    const trimmed = awbInput.trim().toUpperCase()
    if (!trimmed) return

    setErrorMessage(null)
    setActiveAwb(trimmed)

    if (trimmed === "TAC-2409-18472") {
      setIsSample(true)
      setLiveData(null)
      return
    }

    setIsSample(false)
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("awb_number", trimmed)
        const res = await trackAwb(formData)
        if (!res || "error" in res || !res.data) {
          setLiveData(null)
          setErrorMessage(
            (res && "error" in res && res.error) ||
              `Consignment reference "${trimmed}" was not found in active records. Check your AWB number.`
          )
          return
        }

        const shipment = res.data
        const events = Array.isArray(shipment.events) ? shipment.events : []

        setLiveData({
          status: shipment.status || "in-transit",
          origin: shipment.origin || "Delhi (DEL)",
          destination: shipment.destination || "Imphal (IMF)",
          service: shipment.service || "Air Express",
          events: events.map((e: {
            id?: string
            status?: string
            location?: string
            description?: string
            event_time?: string
          }) => ({
            id: e.id,
            status: e.status,
            location: e.location,
            description: e.description,
            event_time: e.event_time,
          })),
        })
      } catch {
        setLiveData(null)
        setErrorMessage("Tracking service temporarily unavailable. Please try again.")
      }
    })
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
      <div className="space-y-10 lg:space-y-14">
        {/* Section Header */}
        <div className="max-w-2xl">
          <SectionEyebrow className="mb-4">
            02 Visibility · Real-Time Consignment Intel
          </SectionEyebrow>
          <h2
            id="tracking-heading"
            style={{ fontSize: "var(--type-section)" }}
            className="font-heading font-medium tracking-tight text-foreground leading-[1.06] text-balance"
          >
            A number.
            <br />
            <span className="text-muted-foreground/90">A clearer picture.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty">
            Recorded milestone visibility from physical intake scan to final doorstep signature.
            Every custody transition is logged with location, timestamp, and personnel sign-off.
          </p>
        </div>

        {/* Dual Column Layout: Mobile prioritizes console first, desktop side-by-side */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: Physical Logistics Custody Overview (Order 2 on mobile, Order 1 on desktop) */}
          <div className="order-2 flex flex-col justify-between overflow-hidden border border-border/80 bg-card lg:order-1 lg:col-span-5">
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src="/images/logistics/network.webp"
                alt="IGI Air Cargo terminal apron with cargo container dollies and linehaul transport"
                fill
                className="object-cover select-none"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
            <div className="space-y-4 border-t border-border/80 bg-background/95 p-5 sm:p-6 font-mono text-xs">
              <div className="flex items-center justify-between uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  Physical Custody
                </span>
                <span>Gate Bay 14</span>
              </div>
              <p className="font-sans text-xs leading-relaxed text-muted-foreground">
                Consignments are scanned at primary apron gates, linehaul transfer nodes, and destination sorting stations with verifiable custody audit trails.
              </p>
              <div className="border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span className="text-foreground">Sample Reference:</span> TAC-2409-18472 (Air Linehaul)
              </div>
            </div>
          </div>

          {/* Right: Primary Tracking Console (Order 1 on mobile, Order 2 on desktop) */}
          <div className="order-1 flex flex-col justify-between border border-border/80 bg-card p-4 sm:p-7 lg:order-2 lg:col-span-7 shadow-xs">
            <div>
              {/* Form Input with Restrained Focus State */}
              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <label
                  htmlFor="awb-query"
                  className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  Enter AWB Consignment Reference
                </label>
                <div className="flex gap-2">
                  <div
                    className={`relative flex-1 border transition-colors ${
                      isFocused ? "border-primary" : "border-border"
                    }`}
                  >
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="awb-query"
                      value={awbInput}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => setAwbInput(e.target.value)}
                      placeholder="e.g. TAC-2409-18472"
                      className="border-0 bg-background pl-9 font-mono text-sm tracking-wide text-foreground uppercase placeholder:normal-case focus-visible:ring-0"
                    />
                  </div>
                  <motion.div {...tactileInteraction}>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="rounded-none bg-primary px-4 sm:px-6 font-mono text-xs uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Track"
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>

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
                          className="mt-3 font-mono text-[11px] underline underline-offset-4 hover:text-foreground"
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
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: motionDurations.control }}
                    className="mt-6 border-t border-border/80 pt-6"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            Consignment Reference
                          </span>
                          {isSample && (
                            <span className="border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                              Sample Preview
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-base font-semibold text-foreground">
                          {activeAwb}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 border border-status-transit/30 bg-status-transit/10 px-2.5 py-1 font-mono text-xs font-medium text-status-transit">
                        <span className="size-1.5 rounded-none bg-status-transit" />
                        {liveData ? liveData.status.toUpperCase() : "IN TRANSIT"}
                      </span>
                    </div>

                    {/* Living Cargo Progress Line */}
                    <div className="mt-3">
                      <LivingCargoLine variant="rule" />
                    </div>

                    {/* Corridor & Service Specs */}
                    <div className="mt-4 grid grid-cols-2 gap-4 border-y border-border/60 py-3 font-mono text-[11px] text-muted-foreground">
                      <div>
                        <span className="block text-[10px] uppercase text-muted-foreground/80">
                          Corridor
                        </span>
                        <span className="text-foreground">
                          {liveData ? `${liveData.origin} → ${liveData.destination}` : "DEL → IMF"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-muted-foreground/80">
                          Modality / Weight
                        </span>
                        <span className="text-foreground">
                          {liveData ? liveData.service : "Air Express · 34.5 kg"}
                        </span>
                      </div>
                    </div>

                    {/* Progressive Milestone Resolution */}
                    <div className="mt-6 space-y-4">
                      {liveData && liveData.events && liveData.events.length > 0 ? (
                        liveData.events.map((evt, index) => {
                          const isCompleted = index > 0
                          const isCurrent = index === 0

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
                                <p className="font-medium text-foreground">
                                  {evt.description || evt.status || "Milestone Scan"}
                                </p>
                                <div className="mt-0.5 flex flex-wrap items-center justify-between gap-1 font-mono text-[11px] text-muted-foreground">
                                  <span>{evt.location || "Gateway Hub"}</span>
                                  <span>
                                    {evt.event_time
                                      ? new Date(evt.event_time).toLocaleDateString("en-IN", {
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        SAMPLE_MILESTONES.map((item, index) => {
                          const isCompleted = item.status === "completed"
                          const isCurrent = item.status === "current"

                          return (
                            <motion.div
                              key={item.title}
                              initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
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
                                <p
                                  className={`font-medium ${
                                    isCurrent
                                      ? "text-foreground font-semibold"
                                      : isCompleted
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {item.title}
                                </p>
                                <div className="mt-0.5 flex flex-wrap items-center justify-between gap-1 font-mono text-[11px] text-muted-foreground">
                                  <span>{item.location}</span>
                                  <span>{item.timestamp}</span>
                                </div>
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

            <div className="mt-6 border-t border-border/80 pt-4 font-mono text-[11px] text-muted-foreground">
              <span>Verified intake record · Synchronized within 120 seconds of physical gate read</span>
            </div>
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
