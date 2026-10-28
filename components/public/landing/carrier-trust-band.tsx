"use client"

import React from "react"
import { Plane, Building2, Truck, ShieldCheck, CheckCircle2 } from "lucide-react"

const TRUSTED_CARRIERS = [
  {
    name: "Air India Cargo",
    role: "Commercial Belly-Hold",
    icon: Plane,
  },
  {
    name: "IndiGo CarGo",
    role: "Daily Scheduled Rotation",
    icon: Plane,
  },
  {
    name: "IGI Terminal Gate 4",
    role: "Delhi Departure Hub",
    icon: Building2,
  },
  {
    name: "Tulihal Cargo Apron",
    role: "Imphal Receiving Bay",
    icon: Truck,
  },
  {
    name: "BCAS Regulated Agent",
    role: "Civil Aviation Security",
    icon: ShieldCheck,
  },
]

export function CarrierTrustBand() {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="w-full border-b border-border bg-background py-16 sm:py-20 text-center"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Exact Atomist Heading format */}
        <h2
          id="trust-heading"
          className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
        >
          We trusted <span className="text-mn-ochre">with</span>
        </h2>
        <p className="mt-2 text-xs font-sans text-muted-foreground max-w-md mx-auto">
          Verified commercial aviation and gateway terminal infrastructure on DEL ⇄ IMF.
        </p>

        {/* 5 Clean Partner Cards with Borders */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TRUSTED_CARRIERS.map((carrier) => {
            const Icon = carrier.icon
            return (
              <div
                key={carrier.name}
                className="flex flex-col items-center justify-center border border-border bg-card p-6 rounded-none text-center transition-colors hover:border-foreground/40"
              >
                <Icon className="size-6 text-foreground mb-3" />
                <span className="text-sm font-sans font-medium text-foreground">
                  {carrier.name}
                </span>
                <span className="mt-1 text-[11px] font-sans text-muted-foreground">
                  {carrier.role}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
