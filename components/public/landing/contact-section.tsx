"use client"

import React, { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Calculator,
  Plane,
  Truck,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react"
import { IconTile } from "@/components/reui/icon-tile"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { TicketForm } from "@/components/public/ticket-form"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  motionDurations,
  motionEasings,
} from "@/lib/motion/motion.theme"
import SlideToConfirm from "@/components/kokonutui/slide-to-confirm"
import { cn } from "@/lib/utils"
import { calculateFreightPricing, calculateGstPaise } from "@/lib/stem/freight"

interface HubTariff {
  code: string
  city: string
  state: string
  airRate: number
  surfRate: number
  airSla: string
  surfSla: string
}

const NORTHEAST_HUBS: HubTariff[] = [
  { code: "IMF", city: "Imphal", state: "Manipur", airRate: 125, surfRate: 58, airSla: "28h", surfSla: "96h" },
  { code: "GAU", city: "Guwahati", state: "Assam", airRate: 95, surfRate: 42, airSla: "24h", surfSla: "72h" },
  { code: "SHL", city: "Shillong", state: "Meghalaya", airRate: 110, surfRate: 48, airSla: "30h", surfSla: "84h" },
  { code: "DMU", city: "Dimapur", state: "Nagaland", airRate: 120, surfRate: 54, airSla: "28h", surfSla: "90h" },
  { code: "AJL", city: "Aizawl", state: "Mizoram", airRate: 130, surfRate: 62, airSla: "32h", surfSla: "96h" },
]

/**
 * Direct contact desk section integrating operational gateway directories
 * alongside the tactile freight rate calculator and verified ticket submission form.
 */
export function ContactSection() {
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<"calculator" | "ticket">("calculator")
  const [dispatched, setDispatched] = useState(false)

  // Rate Calculator State
  const [selectedHub, setSelectedHub] = useState<HubTariff>(NORTHEAST_HUBS[0])
  const [mode, setMode] = useState<"AIR" | "SURFACE">("AIR")
  const [weightKg, setWeightKg] = useState<number>(30)
  const [pickupSlot, setPickupSlot] = useState<string>("today")

  // STEM Freight Tariff Computations via pure engine
  const unitRate = mode === "AIR" ? selectedHub.airRate : selectedHub.surfRate
  const freightResult = calculateFreightPricing({
    chargedWeightKg: weightKg,
    ratePerKgPaise: unitRate * 100,
    minimumChargePaise: 50000,
    fuelSurchargePercent: 10,
  })
  const gstResult = calculateGstPaise(freightResult.subtotalTaxablePaise, 18, true)
  const baseFreight = Math.round(freightResult.baseFreightPaise / 100)
  const surcharge = Math.round(freightResult.fuelSurchargePaise / 100)
  const gst18 = Math.round(gstResult.totalTaxPaise / 100)
  const totalTariff = Math.round(gstResult.totalPaise / 100)
  const activeSla = mode === "AIR" ? selectedHub.airSla : selectedHub.surfSla

  return (
    <EditorialContainer
      id="contact"
      as="section"
      aria-labelledby="contact-heading"
      className="py-10 sm:py-16 lg:py-20"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">

        {/* Left Column: Context & Contact Directory (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionDurations.editorial,
            ease: motionEasings.editorial,
          }}
          className="lg:col-span-5 space-y-6"
        >
          <div>
            <h2
              id="contact-heading"
              className="text-section text-foreground text-balance"
            >
              <span className="font-medium text-muted-foreground">Direct dispatch. </span>
              <span className="font-semibold text-foreground">
                A person to help<span className="font-semibold text-primary">.</span>
              </span>
            </h2>
            <div className="mt-4 space-y-2 max-w-[50ch]">
              <p className="text-base font-medium text-foreground leading-snug tracking-tight">
                Dedicated freight operations desk.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
                Compute corridor rates and schedule priority consignments directly with our flight dispatch controllers.
              </p>
            </div>
          </div>

          {/* Contact Directory: 2x2 icon-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-border/80 bg-border/40">

            {/* Card 1: Dispatch Hotline */}
            <a
              href="tel:+919856173829"
              className="group relative flex items-start gap-3.5 bg-card p-4 sm:p-5 transition-colors duration-200 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Call dispatch hotline +91 98561 73829"
            >
              <IconTile variant="soft" size="sm" className="mt-0.5 text-primary" aria-hidden="true">
                <Phone strokeWidth={1.75} />
              </IconTile>
              <div className="min-w-0 flex-1">
                <span className="block font-sans text-xs font-semibold text-primary">
                  Dispatch Hotline
                </span>
                <span className="mt-1 block font-mono text-sm font-semibold tabular-nums text-foreground group-hover:text-primary transition-colors">
                  +91 98561 73829
                </span>
              </div>
            </a>

            {/* Card 2: Operating Hours */}
            <div className="flex items-start gap-3.5 bg-card p-4 sm:p-5">
              <IconTile variant="soft" size="sm" className="mt-0.5 text-info" aria-hidden="true">
                <Clock strokeWidth={1.75} />
              </IconTile>
              <div className="min-w-0">
                <span className="block font-sans text-xs font-semibold text-info">
                  Operating Hours
                </span>
                <span className="mt-1 block font-sans text-sm font-medium text-foreground">
                  Mon to Sat
                </span>
                <span className="block font-mono text-xs tabular-nums text-muted-foreground">
                  08:00 to 20:00 IST
                </span>
              </div>
            </div>

            {/* Card 3: Electronic Inquiries */}
            <a
              href="mailto:cargo@tac-xpress.com"
              className="group relative flex items-start gap-3.5 bg-card p-4 sm:p-5 transition-colors duration-200 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Email cargo@tac-xpress.com"
            >
              <IconTile variant="soft" size="sm" className="mt-0.5 text-status-delivered" aria-hidden="true">
                <Mail strokeWidth={1.75} />
              </IconTile>
              <div className="min-w-0 flex-1">
                <span className="block font-sans text-xs font-semibold text-status-delivered">
                  Electronic Mail
                </span>
                <span className="mt-1 block font-sans text-xs font-medium text-foreground group-hover:text-status-delivered transition-colors break-all">
                  cargo@tac-xpress.com
                </span>
              </div>
            </a>

            {/* Card 4: Gateway Stations */}
            <div className="flex items-start gap-3.5 bg-card p-4 sm:p-5">
              <IconTile variant="soft" size="sm" className="mt-0.5 text-status-pending" aria-hidden="true">
                <MapPin strokeWidth={1.75} />
              </IconTile>
              <div className="min-w-0">
                <span className="block font-sans text-xs font-semibold text-status-pending">
                  Primary Stations
                </span>
                <span className="mt-1 block font-sans text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">DEL</span>: Terminal 2 Ramp
                </span>
                <span className="block font-sans text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">IMF</span>: Airport Apron 3
                </span>
              </div>
            </div>

          </div>

          {/* Enterprise Bulk Note */}
          <div className="border border-border/80 bg-muted/20 p-4 space-y-1">
            <span className="font-sans text-xs font-bold text-primary">
              Enterprise Project Cargo (&gt; 500 KG)
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Contact our corridor controllers for contracted corporate tariffs, dedicated linehaul vehicles, and monthly ledger billing.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Tactile Rate Calculator / Dispatch Console (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionDurations.editorial,
            delay: 0.12,
            ease: motionEasings.editorial,
          }}
          className="relative lg:col-span-7 flex flex-col justify-start"
          data-slot="dispatch-workbench"
        >
          {/* Top Segmented Navigation Tab */}
          <div className="flex items-center gap-1 border border-border/80 bg-muted/30 p-1 mb-4 rounded-none" role="tablist" aria-label="Dispatch Console Modes">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "calculator"}
              onClick={() => setActiveTab("calculator")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 font-sans text-xs whitespace-nowrap rounded-none transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] disabled:opacity-50",
                activeTab === "calculator"
                  ? "bg-card text-foreground font-bold shadow-2xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Calculator className="size-3.5 text-primary" />
              <span className="whitespace-nowrap">Rate Calculator</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "ticket"}
              onClick={() => setActiveTab("ticket")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 font-sans text-xs whitespace-nowrap rounded-none transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] disabled:opacity-50",
                activeTab === "ticket"
                  ? "bg-card text-foreground font-bold shadow-2xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="size-3.5 text-info" />
              <span className="whitespace-nowrap">Operations Desk</span>
            </button>
          </div>

          {activeTab === "calculator" ? (
            /* Tactile Rate Calculator & Dispatch Module */
            <div data-slot="calculator" className="relative border border-border/80 bg-card p-5 sm:p-7 shadow-sm space-y-6">
              <BorderBeam size={100} duration={12} colorFrom="var(--color-primary)" colorTo="transparent" borderWidth={1} />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Delhi NCR ⇄ Northeast India
                  </h3>
                  <div className="mt-0.5 font-sans text-xs text-primary font-medium">
                    Corridor Tariff Terminal
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs px-2 py-0.5 border border-primary/40 bg-primary/10 text-primary font-medium rounded-none">
                    Target SLA: <strong className="font-mono font-semibold">{activeSla}</strong>
                  </span>
                </div>
              </div>

              {/* 1. Destination Hub Picker */}
              <div className="space-y-2">
                <label className="font-sans text-xs text-muted-foreground font-semibold">
                  01. Northeast Destination Hub
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {NORTHEAST_HUBS.map((hub) => {
                    const isSelected = selectedHub.code === hub.code
                    return (
                      <button
                        key={hub.code}
                        type="button"
                        onClick={() => setSelectedHub(hub)}
                        className={cn(
                          "p-2.5 text-left border rounded-none transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] disabled:opacity-50",
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border/80 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground"
                        )}
                      >
                        <div className="font-mono text-sm font-bold text-foreground">
                          {hub.code}
                        </div>
                        <div className="text-[11px] font-sans truncate text-muted-foreground">
                          {hub.city}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Modality Switcher (Air Priority vs Surface Linehaul) */}
              <div className="space-y-2" data-slot="modality-switcher" role="radiogroup" aria-label="Transit Modality">
                <label className="font-sans text-xs text-muted-foreground font-semibold">
                  02. Transit Modality
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={mode === "AIR"}
                    onClick={() => setMode("AIR")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setMode("AIR")
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between p-3.5 border rounded-none text-left transition-colors cursor-pointer select-none focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99]",
                      mode === "AIR"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/80 bg-muted/20 text-muted-foreground hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Plane className="size-4 text-primary shrink-0" />
                      <div>
                        <div className="font-sans text-xs font-bold text-foreground">
                          Air Priority
                        </div>
                        <div className="font-sans text-xs text-muted-foreground">
                          24 to 48h Flight
                        </div>
                      </div>
                    </div>
                    <span className="font-sans text-xs font-semibold tabular-nums text-primary">
                      <span className="font-mono">₹{selectedHub.airRate}</span>/kg
                    </span>
                  </div>

                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={mode === "SURFACE"}
                    onClick={() => setMode("SURFACE")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setMode("SURFACE")
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between p-3.5 border rounded-none text-left transition-colors cursor-pointer select-none focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99]",
                      mode === "SURFACE"
                        ? "border-info bg-info/10 text-foreground"
                        : "border-border/80 bg-muted/20 text-muted-foreground hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="size-4 text-info shrink-0" />
                      <div>
                        <div className="font-sans text-xs font-bold text-foreground">
                          Surface Express
                        </div>
                        <div className="font-sans text-xs text-muted-foreground">
                          Linehaul Fleet
                        </div>
                      </div>
                    </div>
                    <span className="font-sans text-xs font-semibold tabular-nums text-info">
                      <span className="font-mono">₹{selectedHub.surfRate}</span>/kg
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Dead / Chargeable Weight */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="cargo-weight-range" className="font-sans text-xs text-muted-foreground font-semibold">
                    03. Chargeable Weight (KG)
                  </label>
                  <span className="font-sans text-sm font-semibold tabular-nums text-foreground">
                    <span className="font-mono">{weightKg}</span> kg
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="cargo-weight-range"
                    aria-label="Chargeable weight in kilograms"
                    type="range"
                    min={5}
                    max={500}
                    step={5}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[10, 25, 50, 100, 250].map((kg) => (
                    <button
                      key={kg}
                      type="button"
                      onClick={() => setWeightKg(kg)}
                      className={cn(
                        "px-2.5 py-1 font-sans text-xs rounded-none border transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.98] disabled:opacity-50",
                        weightKg === kg
                          ? "bg-primary text-primary-foreground border-primary font-bold"
                          : "bg-muted/30 text-muted-foreground border-border/80 hover:text-foreground"
                      )}
                    >
                      <span className="font-mono">{kg}</span> <span className="font-sans text-[11px]">kg</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. STEM Tariff Calculation Breakdown */}
              <div className="border border-border/80 bg-muted/20 p-4 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Corridor Tariff ({weightKg} kg × ₹{unitRate})</span>
                  <span className="text-foreground font-semibold tabular-nums">₹{baseFreight.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Aviation FSC &amp; Terminal Screening (10%)</span>
                  <span className="text-foreground font-semibold tabular-nums">₹{surcharge.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Statutory 18% GST (Taxable Basis)</span>
                  <span className="text-foreground font-semibold tabular-nums">₹{gst18.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-border/80 pt-2 flex justify-between items-baseline font-sans">
                  <div>
                    <span className="font-bold text-foreground text-sm block">Illustrative Baseline Estimate</span>
                    <span className="text-[11px] text-muted-foreground font-normal">Standard tariff. Confirmed upon physical gate weigh-in.</span>
                  </div>
                  <span className="font-mono text-xl font-bold text-primary tabular-nums">₹{totalTariff.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* 5. Slide to Booking Form */}
              <div className="border border-border/80 bg-background p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-muted-foreground font-semibold">
                    Request Consignment Booking
                  </span>
                  {dispatched && (
                    <span className="flex items-center gap-1 font-sans text-xs text-status-delivered font-semibold">
                      <CheckCircle2 className="size-3.5" />
                      Opening booking desk
                    </span>
                  )}
                </div>
                <SlideToConfirm
                  label="Slide to request consignment booking"
                  confirmingLabel="Routing to operations desk…"
                  doneLabel="Proceeding to booking details"
                  onConfirm={async () => {
                    await new Promise((resolve) => setTimeout(resolve, 400))
                    setDispatched(true)
                    setActiveTab("ticket")
                  }}
                  className="w-full rounded-none"
                />
              </div>
            </div>
          ) : (
            /* Operations Desk Ticket Form */
            <div className="space-y-4">
              <TicketForm
                hideHeader
                compact
                className="rounded-none border border-border/80 bg-card p-5 sm:p-6"
              />
            </div>
          )}
        </motion.div>

      </div>
    </EditorialContainer>
  )
}
