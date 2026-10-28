"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const benefits = [
  "Guaranteed commercial airside custody at DEL and IMF",
  "Daily scheduled departures with zero transshipment",
  "Statutory 18% GST e-waybill reconciliation",
  "Real-time optical barcode tracking at each gate",
]

export function ClosingCtaSection() {
  return (
    <section
      aria-label="Call to action"
      className="bg-background @container py-20 sm:py-24 border-b border-border"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Card className="@xl:grid-cols-2 sm:grid-cols-2 grid gap-8 p-6 md:p-10 rounded-none border border-border shadow-xs bg-card">
          <div>
            <h2 className="text-balance text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              We build the linehaul of <span className="text-mn-ochre">DEL ⇄ IMF</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-balance text-xs sm:text-sm leading-relaxed">
              Dedicated commercial air express and arterial surface linehaul connecting New Delhi and Imphal with verified chain-of-custody.
            </p>
            <ul className="mt-6 space-y-2.5">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="text-muted-foreground flex items-center gap-2.5 text-xs sm:text-sm"
                >
                  <Check className="text-primary size-4 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted/40 flex flex-col justify-center rounded-none border border-border p-6 sm:p-8">
            <p className="text-xs font-medium text-muted-foreground">Starting tariff</p>
            <p className="mt-1 font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              ₹58<span className="text-muted-foreground text-base sm:text-lg font-normal">/kg</span>
            </p>
            <p className="text-muted-foreground mt-1.5 text-xs leading-normal">
              Surface linehaul rate (excl. 18% GST). Air Express available at ₹125/kg.
            </p>
            <Button
              asChild
              className="mt-6 gap-2 h-10 rounded-none font-medium text-xs bg-foreground text-background hover:bg-foreground/90 transition-colors w-full"
            >
              <Link href="#contact">
                Book Consignment
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <div className="mt-3 text-center">
              <a
                href="#pricing"
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Calculate instant tariff quote
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export const CallToAction = ClosingCtaSection
