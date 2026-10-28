"use client"

import React from "react"
import Image from "next/image"
import { LayoutGrid, Compass, Barcode } from "lucide-react"

const STEPS = [
  {
    icon: LayoutGrid,
    title: "Commercial Belly-Hold Space",
    desc: "Direct guaranteed allocation across scheduled commercial flights leaving IGI Terminal Gate 4 for Tulihal Apron daily.",
    image: "/images/corridor-ink/how-air-belly.png",
    alt: "Commercial flight belly-hold air cargo loading at IGI Terminal Gate 4",
    badge: "Air Express (24h SLA)",
  },
  {
    icon: Compass,
    title: "Dedicated Arterial Convoy",
    desc: "Sealed multi-ton transport trucks operating direct express linehaul across 2,450 km with continuous electronic seal monitoring.",
    image: "/images/corridor-ink/how-surface-convoy.png",
    alt: "Dedicated arterial linehaul truck traversing Himalayan mountain pass to Imphal",
    badge: "Surface Linehaul (4-5 Days)",
  },
  {
    icon: Barcode,
    title: "Statutory Barcode AWB",
    desc: "Optical scanning reconciliation at origin, transit, and destination gates with 18% GST tax invoice integration.",
    image: "/images/corridor-ink/how-barcode-telemetry.png",
    alt: "Optical barcode laser scanner and milestone telemetry on sortation conveyor",
    badge: "Live Telemetry & GST",
  },
]

export function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28 text-center"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Exact Atomist Heading format */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="how-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            How does it <span className="text-mn-ochre">work?</span>
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Predictable three-stage freight execution tailored exclusively for New Delhi and Imphal.
          </p>
        </div>

        {/* 3 Visual Step Columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-left">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="flex flex-col justify-between border border-border bg-card p-5 sm:p-6 rounded-none shadow-xs transition-colors hover:border-foreground/40"
              >
                <div>
                  {/* Step Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-muted rounded-none mb-5">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover rounded-none"
                    />
                    <div className="absolute top-2.5 left-2.5 border border-border/80 bg-background/90 px-2 py-0.5 text-[10px] font-sans font-medium text-foreground">
                      STAGE 0{idx + 1}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 border border-border/80 bg-background/90 px-2 py-0.5 text-[10px] font-sans font-medium text-mn-ochre">
                      {step.badge}
                    </div>
                  </div>

                  {/* Header with Icon and Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-9 items-center justify-center border border-border bg-muted/40 rounded-none shrink-0">
                      <Icon className="size-4 text-foreground" />
                    </div>
                    <h3 className="text-base font-medium text-foreground">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-sans text-muted-foreground">
                  <span>Corridor Route: DEL ⇄ IMF</span>
                  <span className="font-semibold text-foreground">Direct Handover</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
