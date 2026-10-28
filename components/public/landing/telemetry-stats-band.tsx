"use client"

import React from "react"
import { TrendingUp, ShieldCheck } from "lucide-react"
import { ActivityTerrain } from "@/components/kokonutui/activity-terrain"

export function TelemetryStatsBand() {
  return (
    <section
      id="telemetry"
      aria-labelledby="tracked-heading"
      className="w-full border-b border-border bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-12 text-center">
        {/* Eyebrow Context Chip */}
        <div className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-0.5 text-xs font-sans text-muted-foreground rounded-none shadow-2xs mb-3">
          <span className="size-1.5 rounded-none bg-mn-ochre" aria-hidden="true" />
          <span className="font-medium text-foreground">Corridor Telemetry & Linehaul Volume</span>
        </div>

        {/* Section Heading */}
        <h2
          id="tracked-heading"
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance"
        >
          Tracked <span className="text-primary font-semibold">linehaul</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
          Operational volume and SLA compliance measured directly on the DEL ⇄ IMF trade lane.
        </p>

        {/* Top 3 Stat Columns */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 border-b border-border/80 pb-10 sm:pb-12 text-left">
          <div className="border-l-2 border-foreground pl-4 sm:pl-5">
            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              150,000<span className="text-primary font-sans">+</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-foreground">
              Kilograms linehaul moved monthly
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Dedicated commercial belly-hold flight allocations
            </div>
          </div>

          <div className="border-l-2 border-foreground pl-4 sm:pl-5">
            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              40,000<span className="text-primary font-sans">+</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-foreground">
              Statutory barcode scans verified
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Optical barcode sortation at IGI Gate 4 and Tulihal Apron
            </div>
          </div>

          <div className="border-l-2 border-foreground pl-4 sm:pl-5">
            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              99.8<span className="text-primary font-sans">%</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-foreground">
              On-time corridor SLA compliance
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Strict delivery execution on 24h air and 4 to 5 day road legs
            </div>
          </div>
        </div>

        {/* Bottom Interactive 3D Activity Terrain Volume Console */}
        <div className="mt-8 sm:mt-10 border border-border bg-card p-6 sm:p-8 lg:p-10 text-left rounded-none shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Volume Stat Monument & Corridor Credentials */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 border border-border bg-background px-2.5 py-0.5 text-[11px] font-sans text-muted-foreground rounded-none shadow-2xs mb-3">
                  <TrendingUp className="size-3.5 text-primary" />
                  <span className="font-semibold text-foreground">+14.2% QoQ Growth</span>
                </div>

                <div className="text-xs font-semibold text-muted-foreground font-sans">
                  Total corridor volume
                </div>

                <div className="mt-2 font-mono text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                  8,314,549 <span className="text-lg sm:text-xl font-normal text-muted-foreground">kg</span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Cumulative commercial air express and arterial linehaul delivered between New Delhi and Imphal.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border/70 flex flex-col gap-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <ShieldCheck className="size-4 text-primary" />
                    Continuous Airside Custody
                  </span>
                  <span className="text-[11px] font-semibold text-foreground">BCAS Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Corridor Scope</span>
                  <span className="font-sans text-foreground font-semibold">DEL ⇄ IMF Bilateral</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Topographic Activity Terrain */}
            <div className="lg:col-span-7 w-full">
              <ActivityTerrain
                title="26-Week Corridor Linehaul Topography"
                unit="kg"
                defaultFlat={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
