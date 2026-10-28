"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative w-full border-b border-border bg-background pt-24 sm:pt-28 lg:pt-32 xl:pt-36 pb-10 sm:pb-12 lg:pb-14 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Proposition, Headline, CTAs & Route Scope */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Service Context Eyebrow Chip */}
            <div className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-0.5 text-xs font-sans text-muted-foreground rounded-none shadow-2xs">
              <span className="size-1.5 rounded-none bg-mn-ochre" aria-hidden="true" />
              <span className="font-medium text-foreground">Air Express and Highway Freight</span>
            </div>

            {/* Clean Display Headline with Semantic Typographic Emphasis (20% Larger) */}
            <h1
              id="hero-heading"
              className="mt-3.5 text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-foreground leading-[1.08] text-balance"
            >
              Connecting Delhi to Imphal.{" "}
              <span className="text-primary font-semibold">Moving freight.</span>
            </h1>

            {/* Clear Concise Value Proposition Subhead */}
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl text-pretty">
              Dedicated commercial logistics connecting Delhi and Imphal with verified linehaul visibility.
            </p>

            {/* Dual Conversion Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Button
                asChild
                className="h-10 px-5 rounded-none font-medium text-xs bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-2xs active:scale-[0.98]"
              >
                <Link href="#contact">
                  Book Consignment
                  <ArrowUpRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 px-5 rounded-none font-medium text-xs border-border bg-card text-foreground hover:bg-muted transition-colors shadow-2xs"
              >
                <a href="#quick-calculator">
                  Get an Instant Quote
                </a>
              </Button>
            </div>

            {/* Verified Corridor Endpoint Metadata */}
            <div className="mt-6 pt-4 border-t border-border/80 w-full grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div>
                <div className="text-[10px] font-sans text-muted-foreground">Origin Hub</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">
                  DEL <span className="text-[11px] font-normal text-muted-foreground">New Delhi</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-sans text-muted-foreground">Destination Hub</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">
                  IMF <span className="text-[11px] font-normal text-muted-foreground">Imphal</span>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-[10px] font-sans text-muted-foreground">Transit Standard</div>
                <div className="text-[11px] font-medium text-foreground mt-0.5">
                  Air 24h, road 4 to 5 days
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Deliberate Operational Canvas with Docked Corridor Overview */}
          <div className="lg:col-span-6 w-full">
            <div className="relative border border-border bg-card shadow-xs overflow-hidden rounded-none">
              {/* Operational Artwork Representation */}
              <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                <Image
                  src="/images/corridor-ink/hero-console.png"
                  alt="TAC-XPRESS commercial aircraft and arterial mountain linehaul connecting New Delhi and Imphal"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover rounded-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Compact Docked Corridor Overview Telemetry Card */}
              <div className="p-3.5 sm:p-4 border-t border-border bg-background">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex size-1.5" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-status-delivered opacity-75 motion-reduce:hidden" />
                      <span className="relative inline-flex size-1.5 bg-status-delivered rounded-none" />
                    </span>
                    <span className="text-[11px] font-semibold text-foreground tracking-tight">CORRIDOR OVERVIEW</span>
                  </div>
                  <span className="text-[10px] text-mn-ochre font-medium">Bilateral Route Active</span>
                </div>

                <div className="grid grid-cols-12 gap-2 pt-2.5 items-center">
                  {/* Origin Endpoint */}
                  <div className="col-span-4">
                    <div className="text-[9px] text-muted-foreground">ORIGIN</div>
                    <div className="text-sm font-bold text-foreground">DEL</div>
                    <div className="text-[10px] text-muted-foreground">New Delhi (IGI T4)</div>
                  </div>

                  {/* Route Vector Distance */}
                  <div className="col-span-4 flex flex-col items-center justify-center text-center px-1">
                    <div className="text-[9px] font-sans text-muted-foreground">2,410 km</div>
                    <div className="relative w-full flex items-center my-0.5">
                      <div className="h-[1.5px] w-full bg-border" />
                      <Plane className="size-2.5 text-primary absolute left-1/2 -translate-x-1/2 -translate-y-[1px]" />
                    </div>
                    <div className="text-[8.5px] text-muted-foreground">Air + Arterial Road</div>
                  </div>

                  {/* Destination Endpoint */}
                  <div className="col-span-4 text-right">
                    <div className="text-[9px] text-muted-foreground">DESTINATION</div>
                    <div className="text-sm font-bold text-foreground">IMF</div>
                    <div className="text-[10px] text-muted-foreground">Imphal (Tulihal)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Minimalistic 15+ Years Service Milestone Stats */}
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-border/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="flex flex-col text-left">
              <div className="font-mono text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-foreground leading-none">
                15<span className="text-primary font-sans">+</span> Years
              </div>
              <div className="mt-1.5 text-xs font-semibold text-foreground">
                Continuous Service
              </div>
              <div className="text-[11px] text-muted-foreground">
                Delhi and Imphal since 2011
              </div>
            </div>

            <div className="flex flex-col text-left">
              <div className="font-mono text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-foreground leading-none">
                500k<span className="text-primary font-sans">+</span>
              </div>
              <div className="mt-1.5 text-xs font-semibold text-foreground">
                Consignments Delivered
              </div>
              <div className="text-[11px] text-muted-foreground">
                Air and highway tonnage
              </div>
            </div>

            <div className="flex flex-col text-left">
              <div className="font-mono text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-foreground leading-none">
                99.8<span className="text-primary font-sans">%</span>
              </div>
              <div className="mt-1.5 text-xs font-semibold text-foreground">
                SLA Compliance
              </div>
              <div className="text-[11px] text-muted-foreground">
                24h air, 4 to 5 day road
              </div>
            </div>

            <div className="flex flex-col text-left">
              <div className="font-mono text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-foreground leading-none">
                10,000<span className="text-primary font-sans">+</span>
              </div>
              <div className="mt-1.5 text-xs font-semibold text-foreground">
                Commercial Shippers
              </div>
              <div className="text-[11px] text-muted-foreground">
                Pharma, retail, and trade
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
