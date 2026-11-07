"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export function BrandStatementSection() {
  return (
    <section
      aria-label="Operational mission and ethos"
      className="w-full border-b border-border bg-background py-20 sm:py-24 text-center"
    >
      <div className="mx-auto w-full max-w-3xl px-6 lg:px-8">
        <div className="border border-border bg-card p-8 sm:p-14 rounded-none shadow-2xs">
          <p className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-foreground leading-snug">
            Air and surface cargo between New Delhi and Imphal, in both directions.
          </p>

          <p className="mt-4 text-xs font-sans text-muted-foreground max-w-lg mx-auto">
            Share your shipment details so our team can review the service, price, and delivery window.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              className="h-10 px-6 rounded-none font-medium text-xs bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-2xs"
            >
              <a href="#method">
                View custody method
                <ArrowUpRight className="ml-1.5 size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
