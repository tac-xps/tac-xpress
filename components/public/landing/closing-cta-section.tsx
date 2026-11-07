"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const benefits = [
  "Confirm cargo acceptance before booking",
  "Agree the collection and delivery window",
  "Prepare the required shipment documents",
  "Track published shipment updates with your AWB",
]

export function ClosingCtaSection() {
  return (
    <section
      aria-label="Call to action"
      className="bg-background @container py-20 sm:py-24 border-b border-border"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-border bg-card rounded-none shadow-xs divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="p-6 md:p-10">
            <h2 className="text-balance text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Direct bilateral linehaul: <span className="text-primary font-semibold">DEL ⇄ IMF</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-balance text-xs sm:text-sm leading-relaxed">
              Dedicated commercial air express and arterial surface linehaul connecting New Delhi and Imphal in both directions.
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
          <div className="bg-muted/20 flex flex-col justify-center p-6 md:p-10">
            <p className="text-xs font-medium text-muted-foreground">Request a quote</p>
            <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Confirm your rate
            </p>
            <p className="text-muted-foreground mt-1.5 text-xs leading-normal">
              Send the weight, dimensions, contents, and direction of travel for a confirmed quote.
            </p>
            <Button
              asChild
              className="mt-6 gap-2 h-10 rounded-none font-medium text-xs bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-2xs w-full cursor-pointer"
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
                Calculate with your quoted rate
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const CallToAction = ClosingCtaSection
