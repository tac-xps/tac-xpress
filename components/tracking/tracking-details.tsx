"use client"
import { useState, useSyncExternalStore } from "react"
import { MapPin, Package, ArrowRight, CheckCircle2, Truck, CircleDot, AlertTriangle } from "lucide-react"
import type { TrackingResult } from "@/types/tracking"
import { Badge } from "@/components/ui/badge"
import { PackageTrackerCard } from "@/components/ui/tracker-card"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

import { AnimatedParcel } from "./animated-parcel"

interface TrackingDetailsProps {
  result: TrackingResult
}

function displayDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "Time not recorded"
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value))
}

const subscribe = () => () => {}

export function TrackingDetails({ result }: TrackingDetailsProps) {
  const [showFullTracking, setShowFullTracking] = useState(false)
  const trackingUrl = useSyncExternalStore(
    subscribe,
    () => window.location.href,
    () => ""
  )

  const packageImage = <AnimatedParcel status={result.status} />
  
  const destinationFlag = <MapPin className="h-4 w-4 text-muted-foreground" />

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <PackageTrackerCard
        status={result.status.replaceAll("-", " ")}
        packageNumber={result.awb_number}
        destination={result.destination}
        destinationFlag={destinationFlag}
        date={`${result.origin} - ${displayDate(result.created_at)}`}
        qrCodeValue={trackingUrl}
        packageImage={packageImage}
        isExpanded={showFullTracking}
        onTrackClick={() => setShowFullTracking(!showFullTracking)}
      />

      <AnimatePresence>
        {showFullTracking && (
          <motion.section
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            aria-label="Shipment details"
            className="w-full overflow-hidden rounded-none border bg-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b p-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Shipment</p>
                <h2 className="font-mono text-xl font-semibold break-all">
                  {result.awb_number}
                </h2>
              </div>
              <Badge variant="secondary" className="capitalize">
                {result.status.replaceAll("-", " ")}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-surface p-6 sm:p-8">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">From</p>
                <p className="text-xl font-medium">{result.origin}</p>
              </div>
              <ArrowRight
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="mb-1 text-xs text-muted-foreground">To</p>
                <p className="text-xl font-medium">{result.destination}</p>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="mb-8 flex flex-wrap gap-x-12 gap-y-4 text-sm">
                <div>
                  <p className="mb-1 text-muted-foreground">Service</p>
                  <p className="capitalize">
                    {result.service?.replaceAll("-", " ") || "Not recorded"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground">Estimated delivery</p>
                  <p>
                    {result.estimated_delivery
                      ? displayDate(result.estimated_delivery)
                      : "Not yet available"}
                  </p>
                </div>
              </div>

              {result.leg_progress && result.leg_progress.totalLegs > 0 && (
                <div className="mb-8 rounded-none border border-border/60 bg-muted/20 p-5 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        Multi-Leg Route Progress
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {result.leg_progress.completedLegs} of {result.leg_progress.totalLegs} segments completed ({result.leg_progress.progressPercent}%)
                      </p>
                    </div>
                    <Badge variant={result.leg_progress.isCompleted ? "success" : "secondary"}>
                      {result.leg_progress.isCompleted
                        ? "All Legs Completed"
                        : `Leg ${result.leg_progress.activeLegNumber || 1} Active`}
                    </Badge>
                  </div>

                  <div className="mb-5 h-1.5 w-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${result.leg_progress.progressPercent}%` }}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {result.leg_progress.legs.map((leg) => {
                      const isComplete = leg.status === "completed"
                      const isInTransit = leg.status === "in_transit"
                      const isException = leg.status === "exception"
                      return (
                        <div
                          key={leg.id}
                          className={cn(
                            "relative flex flex-col justify-between border p-3 text-xs transition-colors",
                            isComplete
                              ? "border-status-delivered/40 bg-status-delivered/5"
                              : isInTransit
                                ? "border-primary/50 bg-primary/5 shadow-xs"
                                : isException
                                  ? "border-destructive/50 bg-destructive/5"
                                  : "border-border/40 bg-background/50 text-muted-foreground"
                          )}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-mono text-[11px] font-semibold text-foreground">
                              Segment #{leg.legNumber}
                            </span>
                            {isComplete ? (
                              <span className="inline-flex items-center gap-1 font-medium text-status-delivered">
                                <CheckCircle2 className="size-3.5" />
                                Done
                              </span>
                            ) : isInTransit ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-primary animate-pulse">
                                <Truck className="size-3.5" />
                                In Transit
                              </span>
                            ) : isException ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-destructive">
                                <AlertTriangle className="size-3.5" />
                                Exception
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <CircleDot className="size-3.5" />
                                Pending
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground leading-tight">
                              {leg.originLocation}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              ↓ to
                            </p>
                            <p className="font-medium text-foreground leading-tight">
                              {leg.destinationLocation}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <h3 className="mb-6 text-lg font-semibold">Latest updates</h3>
              {result.events.length ? (
                <ol className="flex flex-col gap-6">
                  {result.events.map((event) => (
                    <li key={event.id} className="flex gap-4">
                      <MapPin
                        className="mt-1 size-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <div className="flex min-w-0 flex-col gap-1">
                        <p className="font-medium">
                          {event.location || "Location not recorded"}
                        </p>
                        <p className="text-sm leading-relaxed break-words text-muted-foreground">
                          {event.description}
                        </p>
                        <time className="text-xs text-muted-foreground">
                          {displayDate(event.event_time || event.created_at)} IST
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Package className="size-5 shrink-0" />
                  There are no public tracking events yet. Check again after your next
                  shipment update.
                </p>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
