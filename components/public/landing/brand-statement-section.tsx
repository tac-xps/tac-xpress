"use client"

import React from "react"
import Link from "next/link"
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
            &ldquo;We believe direct bilateral connectivity between New Delhi and Imphal demands
            zero transshipment and continuous chain-of-custody.&rdquo;
          </p>

          <p className="mt-4 text-xs font-sans text-muted-foreground max-w-lg mx-auto">
            Dedicated commercial linehaul ensuring daily scheduled capacity, statutory GST transparency,
            and optical barcode reconciliation.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              className="h-10 px-6 rounded-none font-medium text-xs bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              <Link href="/shipping-guide">
                Inspect Corridor Standards
                <ArrowUpRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
