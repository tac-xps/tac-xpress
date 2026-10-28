"use client"

import React from "react"
import Image from "next/image"

export function TestimonialSection() {
  return (
    <section
      id="customers"
      aria-labelledby="testimonials-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Exact Atomist Heading format */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="testimonials-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Customers see the direct <span className="text-mn-ochre">result</span>
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Verified freight operators moving commercial consignments between New Delhi and Imphal.
          </p>
        </div>

        {/* 2-Column Split Testimonial Card */}
        <div className="mx-auto max-w-4xl border border-border bg-card p-6 sm:p-10 rounded-none shadow-2xs">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
            {/* Left: Square Customer Photo */}
            <div className="relative aspect-square w-full max-w-[280px] mx-auto md:col-span-5 overflow-hidden border border-border bg-muted">
              <Image
                src="/images/corridor-ink/testimonial-director.png"
                alt="Rajesh K., Operations Director with manifest headset and scanner"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover rounded-none"
              />
            </div>

            {/* Right: Quote Content */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                  &ldquo;Under 24 hours from Delhi to Imphal. Reliable gate milestone tracking,
                  consistent belly-hold capacity, and complete barcode reconciliation for our medical consignments.&rdquo;
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Rajesh K.</div>
                  <div className="text-xs text-muted-foreground font-sans">
                    Logistics Director, LogiPrime Express
                  </div>
                </div>
                <div className="border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-sans font-medium text-foreground">
                  DEL ⇄ IMF Route
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
