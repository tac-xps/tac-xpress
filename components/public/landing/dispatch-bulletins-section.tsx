"use client"

import React from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

const BULLETINS = [
  { id: "prepare", date: "Method", category: "Preparation", title: "Prepare your consignment", summary: "Review packaging, dimensions, and custody verification before handover.", image: "/images/new-assets/bulletin-screening.png", alt: "Illustration of cargo preparation", href: "#method", linkLabel: "View custody method" },
  { id: "air", date: "Service", category: "Air cargo", title: "Commercial corridor linehaul", summary: "Priority belly-hold and arterial road transport between New Delhi and Imphal.", image: "/images/new-assets/bulletin-schedule.png", alt: "Illustration of air cargo", href: "#services", linkLabel: "Inspect linehaul services" },
  { id: "contact", date: "Company", category: "TAC-XPRESS", title: "Corridor commitments", summary: "Direct accountability, verified optical milestones, and scheduled departures.", image: "/images/new-assets/bulletin-hub.png", alt: "Illustration of a cargo facility", href: "#about", linkLabel: "Read corridor story" },
]

export function DispatchBulletinsSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="company"
      aria-labelledby="bulletins-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="bulletins-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Shipping resources
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Explore service and preparation guides for the New Delhi and Imphal corridor.
          </p>
        </div>

        {/* 3 Horizontal Cards with Hover Micro-Lift */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {BULLETINS.map((item) => (
            <motion.a
              key={item.id}
              href={item.href}
              aria-label={`View: ${item.title}`}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col border border-border bg-card hover:border-foreground/40 rounded-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={cn(
                    "object-cover rounded-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    !shouldReduceMotion && "group-hover:scale-[1.03]"
                  )}
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
                  <span className="font-semibold">{item.linkLabel}</span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
