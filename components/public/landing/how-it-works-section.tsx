"use client"

import React from "react"
import Image from "next/image"
import { LayoutGrid, Compass, Barcode } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Badge } from "@/components/reui/badge"
import { IconTile } from "@/components/reui/icon-tile"
import { cn } from "@/lib/utils"

const STEPS = [
  { icon: LayoutGrid, title: "Share shipment details", desc: "Send the contents, weight, dimensions, and direction of travel for review.", image: "/images/new-assets/how-air-belly.png", alt: "Illustration of cargo preparation", badge: "New Delhi and Imphal" },
  { icon: Compass, title: "Confirm the service", desc: "Agree the accepted cargo, delivery window, and quote with our team before booking.", image: "/images/new-assets/how-surface-convoy.png", alt: "Illustration of surface cargo", badge: "Air or surface cargo" },
  { icon: Barcode, title: "Follow shipment updates", desc: "Use your issued AWB number to view published shipment updates.", image: "/images/new-assets/how-barcode-telemetry.png", alt: "Illustration of a cargo barcode", badge: "AWB tracking" },
]

export function HowItWorksSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="method"
      aria-labelledby="how-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28 text-center"
    >
      <div id="shipping-guide" className="scroll-mt-20" />
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="how-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            How does it work?
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Predictable three-stage freight execution tailored exclusively for New Delhi and Imphal.
          </p>
        </div>

        {/* 3 Visual Step Columns with Hover Micro-Lift */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-left">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col justify-between border border-border bg-card p-5 sm:p-6 rounded-none shadow-xs transition-colors hover:border-foreground/40"
              >
                <div>
                  {/* Step Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-muted rounded-none mb-5">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className={cn(
                        "object-cover rounded-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        !shouldReduceMotion && "group-hover:scale-[1.03]"
                      )}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="outline" className="bg-background/95 font-mono">
                        Stage 0{idx + 1}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <Badge variant="primary-light" className="font-medium">
                        {step.badge}
                      </Badge>
                    </div>
                  </div>

                  {/* Header with Icon and Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <IconTile variant="outline" size="sm" className="rounded-none shrink-0 bg-muted/40">
                      <Icon className="size-4 text-foreground" aria-hidden="true" />
                    </IconTile>
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-sans text-muted-foreground">
                  <span>Corridor Route: DEL ⇄ IMF</span>
                  <span className="font-semibold text-foreground">Direct Handover</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
