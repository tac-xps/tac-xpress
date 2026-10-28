"use client"

import React, { useState } from "react"

export function AwbDocketSection() {
  const [copied, setCopied] = useState(false)
  const awbNumber = "TAC-2409-18472"

  const handleCopy = () => {
    navigator.clipboard.writeText(awbNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="track"
      aria-labelledby="docket-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Section Header: Headline max 6 words, subhead max 12 words */}
        <div className="mb-14 text-center max-w-xl mx-auto">
          <h2
            id="docket-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Tactile custody. Total visibility.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-normal">
            Every consignment tracked from physical weigh-in to recipient handover.
          </p>
        </div>

        {/* Centered Digital AWB Shipping Label Card with 4 Floating Callout Pins */}
        <div className="relative mx-auto max-w-3xl">
          {/* 4 Minimal Floating Callout Pins */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-sans text-foreground rounded-none">
              <span className="size-1.5 bg-primary rounded-none" />
              <span>Instant AWB</span>
            </div>
            <div className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-sans text-foreground rounded-none">
              <span className="size-1.5 bg-primary rounded-none" />
              <span>Doorstep pickup</span>
            </div>
            <div className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-sans text-foreground rounded-none">
              <span className="size-1.5 bg-primary rounded-none" />
              <span>Live GPS</span>
            </div>
            <div className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-sans text-foreground rounded-none">
              <span className="size-1.5 bg-primary rounded-none" />
              <span>Zero hidden fees</span>
            </div>
          </div>

          {/* High-Craft Digital Air Waybill (AWB) Card */}
          <div className="border border-border bg-card p-6 sm:p-10 shadow-none rounded-none">
            {/* Docket Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-6 gap-4">
              <div>
                <span className="text-xs font-sans text-muted-foreground">
                  Statutory cargo docket
                </span>
                <div className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-foreground">
                  TAC Xpress Air Waybill
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="border border-border px-3 py-1.5 text-xs font-sans text-foreground hover:bg-muted/30 transition-colors rounded-none"
                >
                  {copied ? "Copied" : "Copy AWB"}
                </button>
                <div className="border border-primary bg-primary/10 px-3 py-1.5 text-xs font-sans font-semibold text-primary rounded-none">
                  Status: In transit
                </div>
              </div>
            </div>

            {/* Consignment Routing Spec */}
            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-border pb-6 font-sans text-xs">
              <div className="border border-border bg-muted/30 p-4 rounded-none">
                <span className="text-muted-foreground block text-[11px]">
                  Origin dispatch
                </span>
                <span className="text-base font-bold text-foreground block mt-1">
                  DEL · New Delhi Gateway
                </span>
                <span className="text-muted-foreground block mt-1">
                  BCAS Cargo Terminal Gate 4, IGI Airport
                </span>
              </div>

              <div className="border border-border bg-muted/30 p-4 rounded-none">
                <span className="text-muted-foreground block text-[11px]">
                  Destination receipt
                </span>
                <span className="text-base font-bold text-foreground block mt-1">
                  IMF · Imphal Hub
                </span>
                <span className="text-muted-foreground block mt-1">
                  Tulihal Domestic Apron Cargo Handover
                </span>
              </div>
            </div>

            {/* Cargo Metrics Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-border pb-6 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">AWB number</span>
                <span className="font-bold text-foreground mt-0.5 block font-mono">{awbNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">Chargeable wt</span>
                <span className="font-bold text-foreground mt-0.5 block font-mono">30.0 kg</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">Transit mode</span>
                <span className="font-bold text-primary mt-0.5 block font-sans">Direct Air Express</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">Total tariff</span>
                <span className="font-bold text-foreground mt-0.5 block font-mono">₹4,493 (incl. GST)</span>
              </div>
            </div>

            {/* Realistic Barcode Line Artwork */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex flex-col items-start gap-1">
                {/* SVG Code-128 Style Barcode */}
                <svg className="h-12 w-64 text-foreground" viewBox="0 0 240 48" fill="currentColor">
                  {/* Barcode line series */}
                  <rect x="0" y="0" width="3" height="48" />
                  <rect x="6" y="0" width="2" height="48" />
                  <rect x="12" y="0" width="5" height="48" />
                  <rect x="20" y="0" width="2" height="48" />
                  <rect x="26" y="0" width="4" height="48" />
                  <rect x="33" y="0" width="2" height="48" />
                  <rect x="38" y="0" width="6" height="48" />
                  <rect x="48" y="0" width="3" height="48" />
                  <rect x="54" y="0" width="2" height="48" />
                  <rect x="60" y="0" width="5" height="48" />
                  <rect x="68" y="0" width="3" height="48" />
                  <rect x="74" y="0" width="2" height="48" />
                  <rect x="80" y="0" width="7" height="48" />
                  <rect x="91" y="0" width="2" height="48" />
                  <rect x="96" y="0" width="4" height="48" />
                  <rect x="104" y="0" width="5" height="48" />
                  <rect x="112" y="0" width="2" height="48" />
                  <rect x="118" y="0" width="4" height="48" />
                  <rect x="126" y="0" width="3" height="48" />
                  <rect x="132" y="0" width="6" height="48" />
                  <rect x="142" y="0" width="2" height="48" />
                  <rect x="148" y="0" width="5" height="48" />
                  <rect x="156" y="0" width="3" height="48" />
                  <rect x="162" y="0" width="2" height="48" />
                  <rect x="168" y="0" width="6" height="48" />
                  <rect x="178" y="0" width="2" height="48" />
                  <rect x="184" y="0" width="4" height="48" />
                  <rect x="192" y="0" width="5" height="48" />
                  <rect x="200" y="0" width="3" height="48" />
                  <rect x="206" y="0" width="2" height="48" />
                  <rect x="212" y="0" width="6" height="48" />
                  <rect x="222" y="0" width="2" height="48" />
                  <rect x="228" y="0" width="4" height="48" />
                  <rect x="236" y="0" width="4" height="48" />
                </svg>
                <span className="text-[10px] font-mono text-muted-foreground">
                  * TAC240918472 *
                </span>
              </div>

              <div className="text-right text-xs font-sans text-muted-foreground">
                <span>E-Way Bill: Reconciled</span>
                <span className="block mt-0.5 text-foreground font-semibold">
                  Flight 6E-6124 belly-hold verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
