"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plane, Truck, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calculateFreightPricing, calculateGstPaise } from "@/lib/stem/freight"
import { cn } from "@/lib/utils"

interface CapabilityTabItem {
  id: string
  label: string
  image: string
  alt: string
  flight: string
  originGate: string
  destApron: string
  payload: string
}

const CAPABILITY_TABS: CapabilityTabItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    image: "/images/corridor-ink/hero-console.png",
    alt: "TAC-XPRESS central dispatch operations console for Delhi-Imphal corridor",
    flight: "Flight 6E-6124: Airborne DEL ➔ IMF",
    originGate: "IGI Gate 4: Clear",
    destApron: "Tulihal Apron: Ready",
    payload: "2,480 kg loaded",
  },
  {
    id: "radar",
    label: "Flight Radar",
    image: "/images/corridor-ink/hero-air.png",
    alt: "Belly-hold commercial air cargo allocation on Delhi-Imphal scheduled flight",
    flight: "AI-883: Apron Tarmac Clearance DEL",
    originGate: "Runway 28: Clear",
    destApron: "BCAS Security: Verified",
    payload: "3,150 kg allocated",
  },
  {
    id: "linehaul",
    label: "Arterial Linehaul",
    image: "/images/corridor-ink/hero-surface.png",
    alt: "Surface linehaul transport truck navigating the Himalayan mountain pass to Imphal",
    flight: "Convoy TAC-EXP-41: Mountain Highway Transit",
    originGate: "NH-29: Passage Open",
    destApron: "GPS E-Seal: Intact",
    payload: "18,400 kg gross",
  },
  {
    id: "manifest",
    label: "GST Manifest",
    image: "/images/corridor-ink/hero-telemetry.png",
    alt: "Optical barcode laser scanning and live milestone telemetry manifest",
    flight: "AWB TG123456789IN: Sortation Conveyor Scan",
    originGate: "E-Way Bill: Validated",
    destApron: "Origin: Imphal (IMS)",
    payload: "5.2 kg parcel intake",
  },
]

export function OperationalCapabilitiesSection() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mode, setMode] = useState<"AIR" | "SURFACE">("AIR")
  const [weightKg, setWeightKg] = useState<number>(30)

  const currentTab = CAPABILITY_TABS.find((t) => t.id === activeTab) ?? CAPABILITY_TABS[0]

  // STEM pure freight calculation for Delhi <-> Imphal
  const unitRatePaise = mode === "AIR" ? 12500 : 5800
  const freightResult = calculateFreightPricing({
    chargedWeightKg: weightKg,
    ratePerKgPaise: unitRatePaise,
    minimumChargePaise: 50000,
    fuelSurchargePercent: 10,
  })
  const gstResult = calculateGstPaise(freightResult.subtotalTaxablePaise, 18, true)
  const totalInr = Math.round(gstResult.totalPaise / 100)

  return (
    <section
      id="operational-capabilities"
      aria-labelledby="capabilities-heading"
      className="w-full border-b border-border bg-background py-14 sm:py-18 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-12 text-center">
        <div className="mx-auto max-w-2xl mb-6 sm:mb-8">
          <h2
            id="capabilities-heading"
            className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground"
          >
            Verified operational capabilities across the corridor
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Commercial belly-hold flight allocations, mountain arterial linehaul, optical barcode sorting, and instant GST tariff computation.
          </p>
        </div>

        {/* 4 Feature Selector Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
          {CAPABILITY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-1.5 text-xs font-sans rounded-none transition-colors border shadow-2xs",
                activeTab === tab.id
                  ? "border-foreground bg-foreground text-background font-semibold"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Central Console Showcase */}
        <div className="relative mx-auto w-full max-w-5xl border border-border bg-card shadow-sm overflow-hidden rounded-none text-left">
          {/* Console Cockpit Top Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-sans text-muted-foreground">
            <div className="flex items-center gap-2">
              <Radio className="size-3.5 text-mn-ochre motion-safe:animate-pulse" />
              <span className="font-semibold text-foreground text-xs">
                {currentTab.flight}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>{currentTab.originGate}</span>
              <span>{currentTab.destApron}</span>
              <span className="font-sans text-mn-ochre font-medium">
                {currentTab.payload}
              </span>
            </div>
          </div>

          {/* Dashboard Visual Representation */}
          <div className="relative aspect-[16/9] w-full bg-muted">
            <Image
              key={currentTab.id}
              src={currentTab.image}
              alt={currentTab.alt}
              fill
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover rounded-none transition-opacity duration-300"
            />
          </div>

          {/* Interactive Rate Bar */}
          <div id="quick-calculator" className="border-t border-border bg-background p-4 sm:p-5 text-left">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-12 sm:items-center">
              {/* Mode Selector */}
              <div className="sm:col-span-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("AIR")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 border text-xs font-sans rounded-none transition-colors",
                    mode === "AIR"
                      ? "border-foreground bg-foreground text-background font-medium"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Plane className="size-3.5 shrink-0" />
                  <span>Air 24h</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("SURFACE")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 border text-xs font-sans rounded-none transition-colors",
                    mode === "SURFACE"
                      ? "border-foreground bg-foreground text-background font-medium"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Truck className="size-3.5 shrink-0" />
                  <span>Surface 4-5d</span>
                </button>
              </div>

              {/* Weight Selector */}
              <div className="sm:col-span-4 flex items-center justify-between border border-border px-3 py-1.5 text-xs font-sans">
                <span className="text-muted-foreground">Weight:</span>
                <div className="flex gap-1.5">
                  {[10, 30, 50, 100].map((kg) => (
                    <button
                      key={kg}
                      type="button"
                      onClick={() => setWeightKg(kg)}
                      className={cn(
                        "px-2 py-0.5 text-[11px] font-sans rounded-none transition-colors",
                        weightKg === kg
                          ? "bg-foreground text-background font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="font-mono">{kg}</span>kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Result & Action */}
              <div className="sm:col-span-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-muted-foreground font-sans">Est. Tariff + 18% GST</div>
                  <div className="text-base font-mono font-bold text-foreground">
                    ₹{totalInr.toLocaleString("en-IN")}
                  </div>
                </div>
                <Button
                  asChild
                  className="h-8.5 px-4 rounded-none font-medium text-xs bg-mn-ochre text-foreground hover:bg-mn-ochre/90 shadow-2xs"
                >
                  <Link href={`/contact?mode=${mode}&weight=${weightKg}&origin=DEL&dest=IMF`}>
                    Book Route
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
