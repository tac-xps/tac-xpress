"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Plane, Truck, ShieldCheck, Check, Package, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureItem {
  id: "air" | "surface" | "secure" | "packaging" | "hub"
  title: string
  desc: string
  image: string
  alt: string
  bullets: string[]
  href: string
  icon: React.ElementType
}

const FEATURES: FeatureItem[] = [
  {
    id: "air",
    title: "Express Air Cargo (24h SLA)",
    desc: "Commercial belly-hold capacity allocated daily across scheduled flights between IGI Terminal Gate 4 and Tulihal Domestic Apron.",
    image: "/images/corridor-ink/fleet-air.png",
    alt: "Air express cargo dispatch and telemetry console",
    bullets: [
      "Direct airside custody and BCAS security screening",
      "Priority ramp turnaround at New Delhi and Imphal",
      "Statutory 18% GST tax invoice breakdown",
    ],
    href: "/services/air-cargo",
    icon: Plane,
  },
  {
    id: "surface",
    title: "Surface Linehaul (4-5 Days SLA)",
    desc: "Dedicated sealed multi-ton arterial transport trucks traversing the 2,450 km highway corridor with continuous GPS surveillance.",
    image: "/images/corridor-ink/fleet-surface.png",
    alt: "Surface linehaul arterial fleet tracking console",
    bullets: [
      "Zero intermediate transshipment hubs",
      "Digital electronic seal tamper detection",
      "Scheduled bi-weekly convoys DEL ⇄ IMF",
    ],
    href: "/services/surface-cargo",
    icon: Truck,
  },
  {
    id: "secure",
    title: "Secure High-Value Freight",
    desc: "Specialized custody and airside escort for high-value electronics, pharmaceuticals, and sensitive commercial consignments.",
    image: "/images/corridor-ink/fleet-secure.png",
    alt: "Secure freight custody monitoring console",
    bullets: [
      "Dedicated airside custody escort at both terminals",
      "Tamper-evident physical containment",
      "Direct operations manager supervision",
    ],
    href: "/shipping-guide",
    icon: ShieldCheck,
  },
  {
    id: "packaging",
    title: "Industrial Packaging & Crating",
    desc: "Heavy-duty reinforced EPAL wooden pallets, corner edge protectors, waterproof stretch wrap, and statutory AWB labeling.",
    image: "/images/corridor-ink/fleet-packaging.png",
    alt: "Industrial EPAL pallet packaging and cargo crating console",
    bullets: [
      "EPAL euro-pallet foundation with ratchet tie-down straps",
      "Shock and moisture protection for sensitive cargo",
      "Corridor-specific DEL -> IMP AWB routing tags",
    ],
    href: "/shipping-guide",
    icon: Package,
  },
  {
    id: "hub",
    title: "Imphal Regional Cargo Terminal",
    desc: "Dedicated 5-bay cross-dock distribution facility in Imphal valley managing local dispatch, staging, and last-mile allocation.",
    image: "/images/corridor-ink/fleet-imphal-hub.png",
    alt: "Imphal regional cargo hub and terminal distribution console",
    bullets: [
      "Direct Tulihal apron intake and offloading",
      "5 dedicated sorting bays and secure staging area",
      "Final-mile distribution fleet staging",
    ],
    href: "/about",
    icon: Building2,
  },
]

interface FleetVehicle {
  category: string
  model: string
  capacity: string
  role: string
  image: string
  alt: string
  corridor: string
}

const FLEET_VEHICLES: FleetVehicle[] = [
  {
    category: "Heavy Commercial (HCV)",
    model: "32 FT Multi-Axle Container",
    capacity: "15 to 20 MT payload",
    role: "High-cube sealed arterial container trucks with GPS tracking and electronic security locks for full-truckload linehaul.",
    image: "/images/corridor-ink/vehicle-hcv.png",
    alt: "32 FT heavy commercial multi-axle freight truck for arterial linehaul",
    corridor: "DEL ⇄ IMF Linehaul",
  },
  {
    category: "Medium Commercial (MCV)",
    model: "Tata LPT 1212 (20-24 FT)",
    capacity: "7 to 9 MT payload",
    role: "Dedicated regional transit rigid container trucks optimized for hill-road navigation through the Manipur mountain pass.",
    image: "/images/corridor-ink/vehicle-mcv.png",
    alt: "Medium commercial rigid container truck Tata LPT 1212",
    corridor: "DEL ⇄ IMF Arterial",
  },
  {
    category: "Light Commercial (LCV)",
    model: "Final-Mile Delivery Van",
    capacity: "1.5 to 2.5 MT payload",
    role: "Closed container final-mile delivery vans with roll-up shutter doors for rapid urban pickup and drop in Delhi NCR & Imphal.",
    image: "/images/corridor-ink/vehicle-lcv.png",
    alt: "Light commercial final-mile delivery van",
    corridor: "Local Hub Delivery",
  },
]

export function FleetShowcaseSection() {
  const [activeId, setActiveId] = useState<FeatureItem["id"]>("air")
  const activeFeature = FEATURES.find((f) => f.id === activeId) ?? FEATURES[0]

  return (
    <section
      id="fleet"
      aria-labelledby="fleet-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Exact Atomist Heading format */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="fleet-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            We provide best <span className="text-mn-ochre">linehaul</span>
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Calibrated transport modes for the New Delhi and Imphal bilateral corridor.
          </p>
        </div>

        {/* 2-Column Exact Atomist Layout: Left Console Image, Right Interactive Feature List */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Console Visual (7 cols) */}
          <div className="relative lg:col-span-7">
            <div className="relative border border-border bg-card p-2 rounded-none shadow-sm">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={activeFeature.image}
                  alt={activeFeature.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="object-cover rounded-none transition-opacity duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right: Interactive Feature Items (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {FEATURES.map((item) => {
              const isActive = item.id === activeId
              const Icon = item.icon

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "cursor-pointer border p-5 rounded-none transition-colors",
                    isActive
                      ? "border-foreground bg-card text-foreground"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-mn-ochre" : "text-muted-foreground")} />
                      <h3 className="text-sm sm:text-base font-medium text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <ArrowUpRight className={cn("size-4 transition-colors shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
                  </div>

                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="space-y-1.5 pt-1">
                        {item.bullets.map((b) => (
                          <div key={b} className="flex items-center gap-2 text-xs font-sans text-foreground">
                            <Check className="size-3.5 text-mn-ochre shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2">
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-foreground hover:text-mn-ochre transition-colors"
                        >
                          Inspect specifications
                          <ArrowUpRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Corridor Fleet Commercial Equipment Strip */}
        <div className="mt-20 border-t border-border pt-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              Corridor <span className="text-mn-ochre">Fleet Equipment</span>
            </h3>
            <p className="mt-2 text-xs font-sans text-muted-foreground">
              Dedicated vehicles engineered for the 2,450 km New Delhi ⇄ Imphal arterial passage and valley final-mile.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FLEET_VEHICLES.map((vehicle) => (
              <div
                key={vehicle.category}
                className="border border-border bg-card p-5 rounded-none flex flex-col justify-between shadow-xs transition-colors hover:border-foreground/40"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-background border border-border/60 mb-4 rounded-none">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain p-2 rounded-none"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans text-muted-foreground mb-1">
                    <span className="font-semibold text-foreground">{vehicle.category}</span>
                    <span className="font-mono text-mn-ochre text-[11px]">{vehicle.model}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 font-sans">
                    {vehicle.role}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[11px] font-sans text-muted-foreground">
                  <span>Capacity: {vehicle.capacity}</span>
                  <span className="font-medium text-foreground">{vehicle.corridor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
