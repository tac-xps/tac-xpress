"use client"

import * as React from "react"
import { useTransition } from "react"
import { Search, ArrowUpRight, MapPin, Package, ArrowRight, CheckCircle2, Truck, CircleDot, AlertTriangle, Loader2 } from "lucide-react"
import { trackAwb } from "@/app/actions/tracking"
import type { TrackingResult } from "@/types/tracking"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { AnimatedParcel } from "@/components/tracking/animated-parcel"
import { PackageTrackerCard } from "@/components/ui/tracker-card"
import Link from "next/link"

// ── Helpers ────────────────────────────────────────────────────────────────

function displayDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "Time not recorded"
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value))
}

// ── Inner dialog body (reused) ──────────────────────────────────────────────

function TrackingDialogBody({ result }: { result: TrackingResult }) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-row items-start justify-between gap-4 border-b p-6 pr-12 sm:p-8 sm:pr-14">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Shipment</p>
          <DialogTitle className="font-mono text-xl font-semibold break-all">
            {result.awb_number}
          </DialogTitle>
        </div>
        <Badge variant="secondary" className="capitalize shrink-0 mt-1">
          {result.status.replaceAll("-", " ")}
        </Badge>
      </div>

      {/* Package card summary */}
      <div className="border-b p-6 sm:p-8 flex justify-center">
        <PackageTrackerCard
          status={result.status.replaceAll("-", " ")}
          packageNumber={result.awb_number}
          destination={result.destination}
          destinationFlag={<MapPin className="h-4 w-4 text-muted-foreground" />}
          date={`${result.origin} - ${displayDate(result.created_at)}`}
          packageImage={<AnimatedParcel status={result.status} />}
          className="max-w-sm w-full"
        />
      </div>

      {/* Route strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 p-6 sm:p-8">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">From</p>
          <p className="text-xl font-medium">{result.origin}</p>
        </div>
        <ArrowRight className="size-5 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="mb-1 text-xs text-muted-foreground">To</p>
          <p className="text-xl font-medium">{result.destination}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8">
        {/* Meta */}
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

        {/* Multi-leg progress */}
        {result.leg_progress && result.leg_progress.totalLegs > 0 && (
          <div className="mb-8 border border-border/60 bg-muted/20 p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Multi-Leg Route Progress
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {result.leg_progress.completedLegs} of{" "}
                  {result.leg_progress.totalLegs} segments completed (
                  {result.leg_progress.progressPercent}%)
                </p>
              </div>
              <Badge variant="secondary">
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

        {/* Events */}
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
            No public tracking events yet. Check again after your next shipment
            update.
          </p>
        )}

        {/* Link to full track page */}
        <div className="mt-8 border-t pt-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/track?awb=${result.awb_number}`}>
              Open full tracking page
              <ArrowUpRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Exported dialog-aware track form variants ──────────────────────────────

interface TrackDialogFormProps {
  variant?: "inline" | "desk" | "console"
  className?: string
}

export function TrackDialogForm({
  variant = "inline",
  className,
}: TrackDialogFormProps) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = React.useState<TrackingResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const awb = inputRef.current?.value?.trim().toUpperCase() ?? ""
    if (!awb) return
    setError(null)
    setResult(null)

    startTransition(async () => {
      const fd = new FormData()
      fd.set("awb_number", awb)
      const res = await trackAwb(fd)
      if (res.error) {
        setError(res.error)
        setOpen(true)
      } else if (res.success && res.data) {
        setResult(res.data as TrackingResult)
        setOpen(true)
      }
    })
  }

  const placeholder = "Enter AWB number (e.g. TAC-948210)..."

  return (
    <>
      {/* ── inline variant ── */}
      {variant === "inline" && (
        <form
          onSubmit={handleSubmit}
          aria-label="Track a consignment by AWB number"
          className={cn(
            "flex max-w-md items-center border border-border bg-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-xs overflow-hidden",
            className
          )}
        >
          <div className="pl-3.5 text-muted-foreground" aria-hidden="true">
            <Search className="size-4 text-primary" />
          </div>
          <input
            ref={inputRef}
            name="awb"
            type="text"
            required
            aria-label="Air Waybill (AWB) number"
            maxLength={40}
            pattern="^[A-Za-z0-9\-]{5,40}$"
            placeholder={placeholder}
            className="h-11 flex-1 bg-transparent px-3 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none uppercase"
          />
          <button
            type="submit"
            disabled={isPending}
            className="h-11 px-4 sm:px-5 bg-primary text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shrink-0 flex items-center gap-1.5 active:scale-[0.97] disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <>
                <span>Track</span>
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      )}

      {/* ── desk variant ── */}
      {variant === "desk" && (
        <form
          onSubmit={handleSubmit}
          aria-label="Track your shipment"
          className={cn("bg-card p-6 sm:p-8", className)}
        >
          <div className="flex flex-col gap-3 sm:flex-row items-stretch sm:items-center">
            <input
              ref={inputRef}
              name="awb"
              required
              maxLength={40}
              autoComplete="off"
              placeholder={placeholder}
              className="cargo-desk-input h-10 min-w-0 flex-1 font-mono text-xs sm:text-sm border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary uppercase"
            />
            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-5 bg-primary text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span>Track shipment</span>
                  <ArrowUpRight className="size-3.5 ml-1.5" />
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Tracking shows recorded events, rather than a live vehicle location.
          </p>
        </form>
      )}

      {/* ── console variant ── */}
      {variant === "console" && (
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex min-h-[148px] flex-col justify-between",
            className
          )}
        >
          <div>
            <label htmlFor="hero-awb-input" className="sr-only">
              AWB Consignment Number
            </label>
            <input
              ref={inputRef}
              id="hero-awb-input"
              name="awb"
              required
              maxLength={40}
              autoComplete="off"
              placeholder={placeholder}
              className="w-full px-4 py-3 font-mono text-sm border focus:outline-none focus-visible:ring-1 transition-colors bg-surface text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus-visible:ring-primary uppercase"
            />
            <p className="mt-2 text-xs font-mono text-muted-foreground">
              Direct lookup for New Delhi ↔ Northeast India consignments.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-end border-t border-border">
            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-5 font-sans text-sm font-medium tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-1.5 transition-all disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Track Cargo{" "}
                  <ArrowUpRight className="size-4 ml-1" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ── Result dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-2xl w-full max-h-[90svh] overflow-y-auto p-0 gap-0">
          {error ? (
            <div className="p-6 sm:p-8">
              <DialogTitle className="mb-3 text-base font-semibold text-destructive">
                Shipment not found
              </DialogTitle>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Check the number on your receipt or{" "}
                <Link
                  href="/#support"
                  className="underline hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  contact support
                </Link>
                .
              </p>
            </div>
          ) : result ? (
            <TrackingDialogBody result={result} />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
