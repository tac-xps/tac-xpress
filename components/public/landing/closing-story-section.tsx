"use client"

import React from "react"
import Image from "next/image"
import { Quote } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Rajesh K.",
    org: "LogiPrime Express",
    route: "DEL ⇄ IMF Route",
    quote: "Under 24 hours from Delhi to Imphal. Reliable milestone tracking at both airport gates.",
  },
  {
    name: "Priya S.",
    org: "NovaChem Supplies",
    route: "DEL ⇄ IMF Route",
    quote: "Daily commercial belly-hold capacity with zero transshipment delays for our medical consignments.",
  },
  {
    name: "Arun M.",
    org: "FreshNE Logistics",
    route: "IMF ⇄ DEL Route",
    quote: "Statutory AWB compliance and barcode gate scan verification at both terminals.",
  },
]

export function ClosingStorySection() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Wide 16:9 Corridor Linehaul Convoy Image */}
        <div className="mb-16 text-center">
          <div className="mb-8">
            <h2
              id="story-heading"
              className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
            >
              Every shipment moves <span className="text-mn-ochre">something forward</span>
            </h2>
            <p className="mt-2 text-xs font-sans text-muted-foreground max-w-lg mx-auto">
              Committed bilateral logistics between the national capital and Manipur across 2,450 km.
            </p>
          </div>

          <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden border border-border bg-card rounded-none shadow-sm">
            <Image
              src="/images/corridor-ink/story-convoy.png"
              alt="TAC-XPRESS linehaul convoy navigating the Himalayan mountain pass to Imphal"
              fill
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover rounded-none"
            />
          </div>
        </div>

        {/* 3-Card Visual Consignee Verification Strip */}
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-medium tracking-tight text-foreground">
              Trusted by corridor operators
            </h3>
            <span className="font-sans text-xs font-medium text-mn-ochre">
              Verified DEL ⇄ IMF Consignees
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between border border-border bg-card p-6 rounded-none shadow-xs"
              >
                <div>
                  <Quote className="size-5 text-mn-ochre mb-3" />
                  <p className="text-xs sm:text-sm font-normal text-foreground leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 border-t border-border pt-4 font-sans text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{item.name}</div>
                    <div className="text-muted-foreground text-[11px]">{item.org}</div>
                  </div>
                  <span className="font-sans text-[11px] text-mn-ochre font-medium">
                    {item.route}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
