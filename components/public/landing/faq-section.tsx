"use client"

import React, { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Plus } from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"

const FAQS = [
  {
    q: "Do I need a corporate account to send or track a shipment?",
    a: "No prior account or registration is required. Any business or individual can book shipments directly with our dispatch desk and track consignments publicly using their 10-digit Air Waybill (AWB) number.",
  },
  {
    q: "Which service should I select between Air Cargo and Surface Cargo?",
    a: "Choose Air Cargo when transit time is urgent (24–48 hour gateway delivery for sensitive parts, electronics, or medical goods). Choose Surface Cargo when shipping heavier palletized cartons or larger consolidated freight where an economical multi-day road transit schedule is appropriate.",
  },
  {
    q: "How is cargo pricing computed?",
    a: "Pricing is calculated using chargeable weight, which is the greater of actual gross weight or volumetric dimensional weight (Length × Width × Height in cm ÷ 5000 for air, or ÷ 4000 for surface), plus statutory 18% GST and applicable corridor fuel index.",
  },
  {
    q: "What is an Air Waybill (AWB) number and where do I find it?",
    a: "Your AWB is the unique 10-digit statutory cargo barcode reference generated when your shipment is confirmed. It appears at the top right of your booking manifest and binding carriage receipt.",
  },
  {
    q: "Does public tracking show continuous vehicle GPS location?",
    a: "Public tracking reports verified optical physical barcode milestone events at each linehaul checkpoint, flight manifest clearance, and local station delivery scan. Live continuous telemetry is reserved for our internal fleet dispatch safety team.",
  },
  {
    q: "Can I ship fragile items, electronics, or batteries?",
    a: "Yes, provided statutory packing and handling declarations are satisfied. Lithium batteries (UN 3480/3481) require IATA Section II compliance verification. Fragile glassware and precision machinery require rigid crating and internal foam shock dampening.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const shouldReduceMotion = useReducedMotion()

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <EditorialContainer
      id="faq"
      aria-labelledby="faq-heading"
      className="py-12 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-4xl space-y-10 lg:space-y-12">
        {/* Section Header */}
        <div>
          <SectionEyebrow className="mb-4">Frequent Inquiries</SectionEyebrow>
          <h2
            id="faq-heading"
            style={{ fontSize: "var(--type-section)" }}
            className="font-heading font-medium tracking-tight text-foreground leading-[1.06] text-balance"
          >
            Questions,
            <br />
            <span className="text-muted-foreground/90">answered.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty">
            Clear guidelines on booking procedures, corridor timelines, and cargo handling
            rules.
          </p>
        </div>

        {/* Clean Horizontal Accordion Rows */}
        <div className="divide-y divide-border/80 border-y border-border/80">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx

            return (
              <div key={faq.q} className="py-4 sm:py-6">
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="group flex w-full items-start justify-between text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-expanded={isOpen}
                >
                  <span
                    style={{ fontSize: "var(--type-sub)" }}
                    className="pr-6 font-heading font-medium tracking-tight text-foreground transition-colors group-hover:text-primary"
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-1 flex size-6 shrink-0 items-center justify-center border border-border bg-card text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary"
                  >
                    <Plus className="size-3.5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={
                        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }
                      }
                      animate={
                        shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }
                      }
                      exit={
                        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }
                      }
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 pr-12 text-sm sm:text-base leading-relaxed text-muted-foreground font-normal">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </EditorialContainer>
  )
}
