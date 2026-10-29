"use client"

import React from "react"
import Image from "next/image"
import { ShieldCheck, Plane, Truck } from "lucide-react"
import { Badge } from "@/components/reui/badge"
import { IconTile } from "@/components/reui/icon-tile"

const CORRIDOR_COMMITMENTS = [
  {
    icon: Plane,
    title: "Commercial Belly-Hold Space",
    metric: "24h Transit SLA",
    desc: "Guaranteed commercial aircraft belly space departing daily from IGI Terminal Gate 4 directly into Tulihal Apron.",
    route: "DEL ➔ IMF Air Express",
  },
  {
    icon: Truck,
    title: "Dedicated Arterial Convoy",
    metric: "4-5 Days Transit SLA",
    desc: "Sealed high-cube container trucks navigating the 2,450 km national highway corridor with continuous digital GPS seals.",
    route: "DEL ⇄ IMF Surface Linehaul",
  },
  {
    icon: ShieldCheck,
    title: "Statutory Tax & Barcode Custody",
    metric: "100% E-Way Compliant",
    desc: "Automated GST e-waybill verification attached directly to digital AWB dockets with optical barcode scan records at each gate.",
    route: "Statutory Documentation",
  },
]

export function ClosingStorySection() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
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
              Committed bilateral logistics between the national capital and Manipur across 2,450 km.
            </p>
          </div>

          <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden border border-border bg-card rounded-none shadow-sm">
            <Image
              src="/images/corridor-ink/story-convoy.png"
              alt="TAC-XPRESS linehaul convoy navigating the mountain arterial corridor to Imphal"
              fill
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover rounded-none"
            />
          </div>
        </div>

        {/* 3-Card Visual Consignee Verification Strip */}
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-medium tracking-tight text-foreground">
              Verified operational linehaul standards
            </h3>
            <Badge variant="primary-light" size="sm">
              DEL ⇄ IMF Bilateral Corridor
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {CORRIDOR_COMMITMENTS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex flex-col justify-between border border-border bg-card p-6 rounded-none shadow-xs"
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
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
