"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Check, Plane, Truck, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { calculateFreightPricing, calculateGstPaise } from "@/lib/stem/freight"
import { Badge } from "@/components/reui/badge"
import { IconTile } from "@/components/reui/icon-tile"

interface PricingPlan {
  id: "air" | "surface" | "charter"
  name: string
  rate: string
  ratePerKgPaise: number
  minimumChargePaise: number
  subRate: string
  sla: string
  minWeight: string
  minWeightKg: number
  desc: string
  features: string[]
  icon: React.ElementType
  image: string
  alt: string
}

const PLANS: PricingPlan[] = [
  {
    id: "air",
    name: "Air Express Cargo",
    rate: "₹125",
    ratePerKgPaise: 12500,
    minimumChargePaise: 62500, // 5 kg minimum
    subRate: "/ kg + 18% GST",
    sla: "24 Hours SLA",
    minWeight: "Min chargeable 5 kg",
    minWeightKg: 5,
    desc: "Commercial belly-hold capacity allocated daily across scheduled flights between IGI Gate 4 and Tulihal Apron.",
    features: [
      "Guaranteed commercial flight departure",
      "Direct airside custody and BCAS scan",
      "Real-time GPS and gate milestone tracking",
      "Statutory 18% GST tax invoice breakdown",
    ],
    icon: Plane,
    image: "/images/corridor-ink/tariff-air.png",
    alt: "Air express cargo dispatch and telemetry console",
  },
  {
    id: "surface",
    name: "Surface Linehaul",
    rate: "₹58",
    ratePerKgPaise: 5800,
    minimumChargePaise: 116000, // 20 kg minimum
    subRate: "/ kg + 18% GST",
    sla: "4 to 5 Days SLA",
    minWeight: "Min chargeable 20 kg",
    minWeightKg: 20,
    desc: "Dedicated sealed trucks traversing the 2,450 km highway corridor with continuous GPS surveillance.",
    features: [
      "Dedicated multi-ton sealed arterial trucks",
      "Continuous GPS tracking and digital seal audits",
      "Zero intermediate transshipment hubs",
      "Bi-weekly scheduled departure convoys",
    ],
    icon: Truck,
    image: "/images/corridor-ink/tariff-surface.png",
    alt: "Surface linehaul arterial fleet tracking console",
  },
  {
    id: "charter",
    name: "High-Value Charter",
    rate: "Custom",
    ratePerKgPaise: 0,
    minimumChargePaise: 0,
    subRate: "/ corridor manifest",
    sla: "Dedicated SLA",
    minWeight: "Tailored capacity",
    minWeightKg: 50,
    desc: "Dedicated container or chartered aircraft allocation for sensitive electronics and medical supplies.",
    features: [
      "Dedicated security escort and airside handover",
      "Point-to-point temperature & seal logging",
      "Custom airway bill documentation priority",
      "Direct apron escort at IGI Gate 4 & Tulihal",
    ],
    icon: ShieldAlert,
    image: "/images/corridor-ink/tariff-charter.png",
    alt: "High-value charter freight cargo plane on tarmac",
  },
]

function formatInr(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  })
}

export function CorridorTariffsSection() {
  const [selectedPlanId, setSelectedPlanId] = useState<"air" | "surface" | "charter">("air")
  const [calcWeight, setCalcWeight] = useState<number>(30)

  const activePlan = PLANS.find((p) => p.id === selectedPlanId) ?? PLANS[0]

  const calculation = useMemo(() => {
    if (activePlan.id === "charter") return null

    const chargedWeight = Math.max(activePlan.minWeightKg, calcWeight)
    const pricing = calculateFreightPricing({
      chargedWeightKg: chargedWeight,
      ratePerKgPaise: activePlan.ratePerKgPaise,
      minimumChargePaise: activePlan.minimumChargePaise,
      fuelSurchargePercent: 10,
    })
    const gst = calculateGstPaise(pricing.subtotalTaxablePaise, 18, true)

    return {
      chargedWeight,
      pricing,
      gst,
    }
  }, [activePlan, calcWeight])

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="pricing-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Flexible pricing for any scale
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Direct rate schedules between New Delhi and Imphal with statutory GST compliance.
          </p>
        </div>

        <div className="mx-auto max-w-4xl grid grid-cols-1 gap-8 md:grid-cols-12 items-stretch">
          {/* Left Column: Plan Selectors & STEM Estimator */}
          <div className="md:col-span-5 flex flex-col gap-3">
            {PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlanId
              const Icon = plan.icon

              return (
                <button
                  key={plan.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedPlanId(plan.id)
                    if (calcWeight < plan.minWeightKg) {
                      setCalcWeight(plan.minWeightKg)
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between p-5 border text-left transition-colors rounded-none",
                    isSelected
                      ? "border-foreground bg-card text-foreground shadow-2xs"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconTile
                      variant={isSelected ? "solid" : "outline"}
                      size="sm"
                      className="rounded-none shrink-0"
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                    </IconTile>
                    <div>
                      <div className="text-sm font-medium text-foreground">{plan.name}</div>
                      <div className="text-xs text-muted-foreground font-sans">{plan.sla}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-foreground">{plan.rate}</span>
                  </div>
                </button>
              )
            })}

            {/* Interactive STEM Tariff Calculator */}
            <div className="border border-border bg-muted/30 p-5 rounded-none mt-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-foreground font-sans">
                  Quick Rate Estimator
                </span>
                <Badge variant="primary-light" size="sm">
                  18% GST itemized
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="tariff-weight" className="text-muted-foreground">Consignment Weight:</label>
                  <div className="flex items-center gap-1">
                    <input
                      id="tariff-weight"
                      type="number"
                      min={activePlan.minWeightKg}
                      max={2000}
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Math.max(1, Number(e.target.value) || 1))}
                      className="w-20 min-h-[40px] text-right bg-background border border-border px-2 text-base sm:text-sm font-mono font-bold text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                    <span className="text-xs text-muted-foreground">kg</span>
                  </div>
                </div>

                {calculation ? (
                  <div className="pt-2 border-t border-border/70 space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Base freight ({calculation.chargedWeight} kg):</span>
                      <span className="font-mono text-foreground">{formatInr(calculation.pricing.baseFreightPaise)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Fuel surcharge (10%):</span>
                      <span className="font-mono text-foreground">{formatInr(calculation.pricing.fuelSurchargePaise)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Statutory GST (18%):</span>
                      <span className="font-mono text-foreground">{formatInr(calculation.gst.totalTaxPaise)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground pt-1.5 border-t border-border/50 text-xs">
                      <span>Total Estimated Tariff:</span>
                      <span className="font-mono text-sm text-foreground font-bold">{formatInr(calculation.gst.totalPaise)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-border/70 text-xs text-muted-foreground leading-relaxed">
                    Custom charters are quoted via direct ramp review based on aircraft belly-hold allotment and apron security escorts.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Active Plan Details Card */}
          <div className="md:col-span-7 flex flex-col justify-between border border-border bg-card p-6 sm:p-8 rounded-none shadow-2xs">
            <div>
              <div className="relative aspect-[21/9] w-full overflow-hidden border border-border bg-muted rounded-none mb-6">
                <Image
                  src={activePlan.image}
                  alt={activePlan.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover rounded-none"
                />
              </div>

              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-medium text-foreground">
                      {activePlan.name}
                    </h3>
                    <Badge variant="outline" size="sm" className="font-mono text-xs">
                      {activePlan.sla}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-sans mt-1">
                    {activePlan.minWeight}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
                    {activePlan.rate}
                  </div>
                  <div className="text-xs font-sans text-muted-foreground">
                    {activePlan.subRate}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                {activePlan.desc}
              </p>

              <div className="mt-6 space-y-2.5">
                {activePlan.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-xs font-sans text-foreground">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <Button
                asChild
                className="w-full h-11 rounded-none font-medium text-xs bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                <Link href={`#contact`}>
                  Book {activePlan.name}
                  <ArrowUpRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
