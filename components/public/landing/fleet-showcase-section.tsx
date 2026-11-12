"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ArrowUpRight, Plane, Truck, ShieldCheck, Check, Package, Building2 } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

interface FeatureItem {
  id: "air" | "surface" | "secure" | "packaging" | "hub"
  title: string
  desc: string
  image: string
  alt: string
  bullets: string[]
  href: string
  linkLabel: string
  icon: React.ElementType
}

const FEATURES: FeatureItem[] = [
  { id: "air", title: "Air cargo", desc: "Discuss air cargo between New Delhi and Imphal in either direction.", image: "/images/new-assets/fleet-air.png", alt: "Illustration of air cargo", bullets: ["Confirm acceptance before booking", "Agree a delivery window", "Prepare shipment documents"], href: "#contact", linkLabel: "Book consignment", icon: Plane },
  { id: "surface", title: "Surface cargo", desc: "Discuss road freight between New Delhi and Imphal in either direction.", image: "/images/new-assets/fleet-surface.png", alt: "Illustration of surface cargo", bullets: ["Share the weight and dimensions", "Confirm collection and delivery", "Request a confirmed quote"], href: "#contact", linkLabel: "Book consignment", icon: Truck },
  { id: "secure", title: "Special handling", desc: "Describe valuable or sensitive contents before booking so our team can review acceptance.", image: "/images/new-assets/fleet-secure.png", alt: "Illustration of cargo handling", bullets: ["Declare the contents", "Explain handling requirements", "Confirm acceptance with our team"], href: "#method", linkLabel: "View custody method", icon: ShieldCheck },
  { id: "packaging", title: "Packaging guidance", desc: "Prepare the contents, weight, dimensions, and packaging details before handover.", image: "/images/new-assets/fleet-packaging.png", alt: "Illustration of packaged cargo", bullets: ["Describe the packaging", "Record the external dimensions", "Prepare the address details"], href: "#method", linkLabel: "View custody method", icon: Package },
  { id: "hub", title: "Corridor enquiries", desc: "Contact our team to confirm collection and handover arrangements in New Delhi or Imphal.", image: "/images/new-assets/fleet-imphal-hub.png", alt: "Illustration of a cargo facility", bullets: ["Confirm the handover location", "Agree a collection window", "Keep your booking reference"], href: "#contact", linkLabel: "Contact operations desk", icon: Building2 },
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
  { category: "Vehicle illustration", model: "Heavy cargo vehicle", capacity: "Confirm capacity before booking", role: "Discuss vehicle requirements with our team when requesting surface cargo.", image: "/images/new-assets/vehicle-hcv.png", alt: "Illustration of a heavy cargo vehicle", corridor: "New Delhi and Imphal" },
  { category: "Vehicle illustration", model: "Medium cargo vehicle", capacity: "Confirm capacity before booking", role: "Share the shipment dimensions so our team can review the transport requirements.", image: "/images/new-assets/vehicle-mcv.png", alt: "Illustration of a medium cargo vehicle", corridor: "New Delhi and Imphal" },
  { category: "Vehicle illustration", model: "Cargo delivery van", capacity: "Confirm availability before booking", role: "Confirm collection and delivery arrangements with our team.", image: "/images/new-assets/vehicle-lcv.png", alt: "Illustration of a cargo van", corridor: "New Delhi and Imphal" },
]

export function FleetShowcaseSection() {
  const [activeId, setActiveId] = useState<FeatureItem["id"]>("air")
  const activeFeature = FEATURES.find((f) => f.id === activeId) ?? FEATURES[0]
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="services"
      aria-labelledby="fleet-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div id="fleet" className="scroll-mt-20" />
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="fleet-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Dedicated corridor linehaul
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Calibrated transport modes for the New Delhi and Imphal bilateral corridor.
          </p>
        </div>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Console Visual with Cross-Fade and Micro-Zoom */}
          <div className="relative lg:col-span-7">
            <div className="relative border border-border bg-card p-2 rounded-none shadow-sm group">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={activeFeature.image}
                      alt={activeFeature.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 680px"
                      className="object-cover rounded-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Interactive Feature Items with Micro-Transitions */}
          <div className="lg:col-span-5 flex flex-col gap-3" aria-label="Corridor linehaul modes and infrastructure">
            {FEATURES.map((item) => {
              const isActive = item.id === activeId
              const Icon = item.icon

              return (
                <div
                  key={item.id}
                  className={cn(
                    "border p-5 rounded-none transition-colors",
                    isActive
                      ? "border-primary bg-card text-foreground shadow-xs"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-border-strong hover:text-foreground"
                  )}
                >
                  <button
                    type="button"
                    id={`fleet-tab-${item.id}`}
                    aria-expanded={isActive}
                    aria-controls={`fleet-panel-${item.id}`}
                    onClick={() => setActiveId(item.id)}
                    className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                      <h3 className="text-sm sm:text-base font-medium text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <ArrowUpRight className={cn("size-4 transition-colors shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`fleet-panel-${item.id}`}
                        aria-labelledby={`fleet-tab-${item.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.desc}
                          </p>
                          <div className="space-y-1.5 pt-1">
                            {item.bullets.map((b) => (
                              <div key={b} className="flex items-center gap-2 text-xs font-sans text-foreground">
                                <Check className="size-3.5 text-primary shrink-0" />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2">
                            <a
                              href={item.href}
                              className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                            >
                              {item.linkLabel}
                              <ArrowUpRight className="size-3" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* Corridor Fleet Commercial Equipment Strip */}
        <div className="mt-20 border-t border-border pt-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              Vehicle illustrations
            </h3>
            <p className="mt-2 text-xs font-sans text-muted-foreground">
              Vehicle illustrations explain possible transport requirements. Confirm availability and capacity with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FLEET_VEHICLES.map((vehicle) => (
              <motion.div
                key={vehicle.model}
                whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group border border-border bg-card p-5 rounded-none flex flex-col justify-between shadow-xs transition-colors hover:border-foreground/40"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-background border border-border/60 mb-4 rounded-none">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain p-2 rounded-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans text-muted-foreground mb-1">
                    <span className="font-semibold text-foreground">{vehicle.category}</span>
                    <span className="font-mono text-muted-foreground text-xs">{vehicle.model}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 font-sans">
                    {vehicle.role}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-sans text-muted-foreground">
                  <span>Capacity: {vehicle.capacity}</span>
                  <span className="font-medium text-foreground">{vehicle.corridor}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
