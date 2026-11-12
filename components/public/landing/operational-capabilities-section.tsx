"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Radio } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
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
    label: "Corridor overview",
    image: "/images/new-assets/hero-console.png",
    alt: "Illustration of cargo between New Delhi and Imphal",
    flight: "Illustration: corridor overview",
    originGate: "New Delhi",
    destApron: "Imphal",
    payload: "Air and surface cargo",
  },
  {
    id: "radar",
    label: "Air cargo",
    image: "/images/new-assets/hero-air.png",
    alt: "Illustration of cargo between New Delhi and Imphal",
    flight: "Illustration: air cargo",
    originGate: "New Delhi",
    destApron: "Imphal",
    payload: "Confirm service availability",
  },
  {
    id: "linehaul",
    label: "Arterial Linehaul",
    image: "/images/new-assets/hero-surface.png",
    alt: "Illustration of cargo between New Delhi and Imphal",
    flight: "Illustration: surface cargo",
    originGate: "New Delhi",
    destApron: "Imphal",
    payload: "Confirm cargo dimensions",
  },
  {
    id: "manifest",
    label: "Shipment records",
    image: "/images/new-assets/hero-telemetry.png",
    alt: "Illustration of cargo between New Delhi and Imphal",
    flight: "Illustration: shipment records",
    originGate: "Shipment documents",
    destApron: "DEL and IMF",
    payload: "Use your issued AWB",
  },
]

export function OperationalCapabilitiesSection() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const currentTab = CAPABILITY_TABS.find((tab) => tab.id === activeTab) ?? CAPABILITY_TABS[0]
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="features"
      aria-labelledby="capabilities-heading"
      className="w-full border-b border-border bg-background py-14 sm:py-18 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-12 text-center">
        <div className="mx-auto max-w-2xl mb-6 sm:mb-8">
          <h2
            id="capabilities-heading"
            className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground"
          >
            Cargo services across the corridor
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Explore air and surface cargo between New Delhi and Imphal. Confirm acceptance and timing before booking.
          </p>
        </div>

        {/* 4 Feature Selector Action Buttons with Shared Layout Slide */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6" aria-label="Corridor operational capabilities">
          {CAPABILITY_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-sans rounded-none transition-colors border shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground cursor-pointer overflow-hidden",
                  isActive
                    ? "border-primary text-primary-foreground font-semibold shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCapabilityTab"
                    className="absolute inset-0 bg-primary z-0 rounded-none"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", visualDuration: 0.25, bounce: 0 }
                    }
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Central Console Showcase */}
        <div
          id="capability-console-panel"
          className="relative mx-auto w-full max-w-5xl border border-border bg-card shadow-sm overflow-hidden rounded-none text-left"
        >
          {/* Console Cockpit Top Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-sans text-muted-foreground">
            <div className="flex items-center gap-2">
              <Radio className="size-3.5 text-primary" aria-hidden="true" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={currentTab.id + "-flight"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-semibold text-foreground text-xs"
                >
                  {currentTab.flight}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span>{currentTab.originGate}</span>
              <span>{currentTab.destApron}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={currentTab.id + "-payload"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans text-primary font-medium"
                >
                  {currentTab.payload}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Dashboard Visual Representation with Cross-Fade & Subtle Zoom */}
          <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden group">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentTab.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full"
              >
                <Image
                  src={currentTab.image}
                  alt={currentTab.alt}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1100px"
                  className="object-cover rounded-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.02] motion-reduce:transition-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-3 border-t bg-background p-4 sm:p-5">
            <p className="text-sm text-muted-foreground">Illustrations explain the service. Ask our team to confirm availability, timing, and charges.</p>
            <Button asChild><Link href="#pricing">Calculate using your quoted rate</Link></Button>
          </div>
        </div>
      </div>
    </section>
  )
}
