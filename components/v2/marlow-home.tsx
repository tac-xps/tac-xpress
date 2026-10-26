"use client"

import * as React from "react"
import { MarlowHeader } from "./marlow-header"
import { MarlowHero } from "./marlow-hero"
import { MarlowFeature } from "./marlow-feature"
import { MarlowTelemetry } from "./marlow-telemetry"
import { MarlowTidewater } from "./marlow-tidewater"
import { MarlowFieldnotes } from "./marlow-fieldnotes"
import { MarlowClients } from "./marlow-clients"
import { MarlowExperiments } from "./marlow-experiments"
import { MarlowQuote } from "./marlow-quote"
import { MarlowPricing } from "./marlow-pricing"
import { MarlowDualSection } from "./marlow-dual-section"
import { MarlowFooter } from "./marlow-footer"
import { CorridorStatusIsland } from "@/components/public/landing/corridor-status-island"

export function MarlowHome() {
  return (
    <div className="marlow-theme min-h-screen selection:bg-[#141413] selection:text-[#FAFAF8]">
      <MarlowHeader />
      <main>
        <MarlowHero />
        <MarlowFeature />
        <MarlowTelemetry />
        <MarlowTidewater />
        <MarlowFieldnotes />
        <MarlowClients />
        <MarlowExperiments />
        <MarlowQuote />
        <MarlowPricing />
        <MarlowDualSection />
      </main>
      <MarlowFooter />
      <CorridorStatusIsland />
    </div>
  )
}
