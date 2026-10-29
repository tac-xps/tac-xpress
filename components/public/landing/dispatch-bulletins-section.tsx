"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const BULLETINS = [
  {
    id: "bcas-upgrade",
    date: "OCT 2026",
    category: "AIRPORT OPERATIONS",
    title: "BCAS Gate 4 digital screening upgrade verified.",
    summary: "High-throughput dual-view screening operational at IGI Terminal Gate 4 for expedited belly-hold loading.",
    image: "/images/corridor-ink/bulletin-screening.png",
    alt: "BCAS air cargo dual-view digital screening at Delhi Gate 4",
    href: "/shipping-guide",
  },
  {
    id: "winter-manifest",
    date: "OCT 2026",
    category: "FLIGHT SCHEDULE",
    title: "Winter flight linehaul capacity confirmed for DEL ⇄ IMF.",
    summary: "Commercial airline agreements guarantee daily belly-hold freight allocation across the winter schedule.",
    image: "/images/corridor-ink/bulletin-schedule.png",
    alt: "Daily belly-hold air cargo allocation on Delhi-Imphal flights",
    href: "/services/air-cargo",
  },
  {
    id: "tulihal-expansion",
    date: "SEP 2026",
    category: "TERMINAL INFRASTRUCTURE",
    title: "Tulihal domestic apron receiving bay expanded.",
    summary: "New airside staging bays expedite consignment offloading and local delivery in Imphal.",
    image: "/images/corridor-ink/bulletin-hub.png",
    alt: "Tulihal Imphal domestic cargo hub receiving and distribution bays",
    href: "/shipping-guide",
  },
]

export function DispatchBulletinsSection() {
  return (
    <section
      id="company"
      aria-labelledby="bulletins-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Exact Atomist Heading format */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="bulletins-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Read our latest articles & updates
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Operational advisories, gateway security protocols, and corridor schedules.
          </p>
        </div>

        {/* 3 Horizontal Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {BULLETINS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col border border-border bg-card hover:border-foreground/40 rounded-none transition-colors"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover rounded-none"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-sans text-muted-foreground">
                    <span>{item.category}</span>
                    <span className="font-mono">{item.date}</span>
                  </div>
                  <h3 className="mt-3 text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs font-sans text-foreground">
                  <span className="font-semibold">Read article</span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
