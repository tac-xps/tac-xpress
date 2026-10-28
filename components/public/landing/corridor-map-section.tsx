"use client"

import React, { useState } from "react"
import { MapPin } from "lucide-react"

export function CorridorMapSection() {
  const [, setActiveNode] = useState<"del" | "corridor" | "imf">("imf")

  return (
    <section
      id="network"
      aria-labelledby="corridor-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Section Header: Headline max 6 words, subhead max 12 words */}
        <div className="mb-12 max-w-xl">
          <h2
            id="corridor-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Direct Delhi to Imphal corridor.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-normal">
            Continuous bilateral linehaul connecting IGI Cargo Terminal and Tulihal Airport.
          </p>
        </div>

        {/* 8-col Map + 4-col Metric Blocks */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left (8 Columns): Clean Custom SVG Topological Route Map */}
          <div className="relative flex flex-col justify-between border border-border bg-muted/30 p-6 lg:col-span-8 lg:p-8 rounded-none">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-primary rounded-none animate-pulse" />
                <span className="text-xs font-sans font-semibold text-foreground">
                  Corridor topology: DEL ⇄ IMF
                </span>
              </div>
              <span className="text-xs font-sans text-muted-foreground">
                2,450 km arterial transit
              </span>
            </div>

            {/* Custom SVG Route Visualization */}
            <div className="relative my-8 flex min-h-[260px] w-full items-center justify-center">
              <svg
                viewBox="0 0 800 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-h-[260px]"
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  </pattern>
                </defs>
                <rect width="800" height="280" fill="url(#grid)" opacity="0.4" />

                {/* Direct High-Speed Air Route */}
                <path
                  d="M 120 180 C 280 60, 520 60, 680 180"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  className="text-primary motion-safe:animate-[dash_20s_linear_infinite]"
                />

                {/* Dedicated Ground Linehaul Route */}
                <path
                  d="M 120 180 Q 400 240, 680 180"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-muted-foreground"
                />

                {/* Node 1: New Delhi (DEL) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveNode("del")}
                >
                  <circle cx="120" cy="180" r="14" fill="var(--card)" stroke="var(--primary)" strokeWidth="3" />
                  <rect x="114" y="174" width="12" height="12" fill="var(--primary)" />
                  <text x="120" y="218" textAnchor="middle" fill="currentColor" className="text-[13px] font-sans font-bold text-foreground">
                    DEL (New Delhi)
                  </text>
                  <text x="120" y="234" textAnchor="middle" fill="currentColor" className="text-[11px] font-sans text-muted-foreground">
                    IGI Terminal Gate 4
                  </text>
                </g>

                {/* Midpoint Waypoint */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveNode("corridor")}
                >
                  <circle cx="400" cy="120" r="10" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
                  <text x="400" y="98" textAnchor="middle" fill="currentColor" className="text-[11px] font-sans font-semibold text-primary">
                    Airborne (6E-6124 / AI-889)
                  </text>
                </g>

                {/* Node 2: Imphal (IMF) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveNode("imf")}
                >
                  <circle cx="680" cy="180" r="14" fill="var(--card)" stroke="var(--primary)" strokeWidth="3" />
                  <rect x="674" y="174" width="12" height="12" fill="var(--primary)" />
                  <text x="680" y="218" textAnchor="middle" fill="currentColor" className="text-[13px] font-sans font-bold text-foreground">
                    IMF (Imphal)
                  </text>
                  <text x="680" y="234" textAnchor="middle" fill="currentColor" className="text-[11px] font-sans text-muted-foreground">
                    Tulihal Apron Station
                  </text>
                </g>
              </svg>
            </div>

            {/* Waypoint Details Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border pt-4 gap-2 text-xs font-sans text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground font-medium">
                <MapPin className="size-3.5 text-primary" />
                Primary route: IGI Cargo Gate 4 ⇄ Tulihal Domestic Cargo
              </span>
              <span>Daily flight and highway departures</span>
            </div>
          </div>

          {/* Right (4 Columns): 3 Large Metric Blocks */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-4">
            <div className="flex flex-col justify-center border border-border bg-card p-6 rounded-none flex-1">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-primary">
                99.8%
              </div>
              <div className="mt-1 text-xs font-sans text-foreground font-semibold">
                On-time linehaul
              </div>
              <div className="mt-1 text-xs text-muted-foreground font-sans">
                SLA verified across 1,200+ monthly runs.
              </div>
            </div>

            <div className="flex flex-col justify-center border border-border bg-card p-6 rounded-none flex-1">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-primary">
                1,240+
              </div>
              <div className="mt-1 text-xs font-sans text-foreground font-semibold">
                Monthly tonnage (kg)
              </div>
              <div className="mt-1 text-xs text-muted-foreground font-sans">
                Consolidated freight moved between DEL and IMF.
              </div>
            </div>

            <div className="flex flex-col justify-center border border-border bg-card p-6 rounded-none flex-1">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-primary">
                100%
              </div>
              <div className="mt-1 text-xs font-sans text-foreground font-semibold">
                Sealed handover
              </div>
              <div className="mt-1 text-xs text-muted-foreground font-sans">
                Direct origin-to-destination chain of custody.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
