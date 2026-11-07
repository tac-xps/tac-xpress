"use client"

import React from "react"
import Image from "next/image"
import { ShieldCheck, Plane, Truck } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Badge } from "@/components/reui/badge"
import { IconTile } from "@/components/reui/icon-tile"
import { cn } from "@/lib/utils"

const CORRIDOR_COMMITMENTS = [
  { icon: Plane, title: "Air cargo", metric: "Confirm the delivery window", desc: "Discuss acceptance, timing, and charges for your air cargo before booking.", route: "DEL to IMF, or IMF to DEL" },
  { icon: Truck, title: "Surface cargo", metric: "Share the cargo dimensions", desc: "Provide the weight and external dimensions so our team can review the shipment.", route: "DEL to IMF, or IMF to DEL" },
  { icon: ShieldCheck, title: "Shipment documents", metric: "Prepare before handover", desc: "Ask our team which documents your consignment requires and retain your issued AWB.", route: "Booking and handover" },
]

export function ClosingStorySection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="about"
      aria-labelledby="story-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div id="story" className="scroll-mt-20" />
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Wide 16:9 Corridor Linehaul Convoy Image */}
        <div className="mb-16 text-center">
          <div className="mb-8">
            <h2
              id="story-heading"
              className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
            >
              Every shipment moves something forward
            </h2>
            <p className="mt-2 text-xs font-sans text-muted-foreground max-w-lg mx-auto">
              Air and surface cargo exclusively between New Delhi and Imphal.
            </p>
          </div>

          <div className="group relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden border border-border bg-card rounded-none shadow-sm">
            <Image
              src="/images/new-assets/story-convoy.png"
              alt="Illustration of surface cargo between New Delhi and Imphal"
              fill
              sizes="(max-width: 1200px) 100vw, 1100px"
              className={cn(
                "object-cover rounded-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                !shouldReduceMotion && "group-hover:scale-[1.02]"
              )}
            />
          </div>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-medium tracking-tight text-foreground">
              Confirm the details before booking
            </h3>
            <Badge variant="primary-light">
              DEL ⇄ IMF Bilateral Corridor
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {CORRIDOR_COMMITMENTS.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col justify-between border border-border bg-card p-6 rounded-none shadow-xs transition-colors hover:border-foreground/40"
                >
                  <div>
                    <IconTile variant="soft" size="lg" className="rounded-none mb-3">
                      <Icon className="size-5 text-primary" aria-hidden="true" />
                    </IconTile>
                    <div className="text-xs font-sans font-semibold text-foreground">
                      {item.metric}
                    </div>
                    <h4 className="mt-1 text-sm font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-border pt-4 font-sans text-xs flex items-center justify-between">
                    <span className="text-muted-foreground">Standard Route</span>
                    <span className="font-mono text-xs text-foreground font-medium">
                      {item.route}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
