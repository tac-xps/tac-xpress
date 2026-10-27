"use client"

import React, { useState, useMemo } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Plus, Search, HelpCircle, Phone, ArrowUpRight } from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { GridPattern } from "@/components/ui/grid-pattern"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  motionDurations,
  motionEasings,
} from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

interface FAQItem {
  id: string
  category: "booking" | "services" | "pricing" | "compliance"
  q: string
  lead: string
  a: string
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "booking",
    q: "Do I need a corporate account to send or track a shipment?",
    lead: "No corporate registration required.",
    a: "Any business or individual can book shipments directly with our dispatch desk and track consignments publicly using their 10-digit Air Waybill (AWB) number.",
  },
  {
    id: "faq-2",
    category: "services",
    q: "Which service should I select between Air Cargo and Surface Cargo?",
    lead: "Transit speed versus bulk capacity.",
    a: "Choose Air Cargo when transit time is urgent (24 to 48 hour gateway delivery for sensitive parts, electronics, or medical goods). Choose Surface Cargo when shipping heavier palletized cartons or larger consolidated freight where an economical multi-day road transit schedule is appropriate.",
  },
  {
    id: "faq-3",
    category: "pricing",
    q: "How is cargo pricing computed?",
    lead: "Chargeable volumetric ratio.",
    a: "Pricing is calculated using chargeable weight, which is the greater of actual gross weight or volumetric dimensional weight (Length × Width × Height in cm ÷ 5000 for air, or ÷ 4000 for surface), plus statutory 18% GST and applicable corridor fuel index.",
  },
  {
    id: "faq-4",
    category: "booking",
    q: "What is an Air Waybill (AWB) number and where do I find it?",
    lead: "Statutory 10-digit cargo barcode.",
    a: "Your AWB is the unique 10-digit statutory cargo barcode reference generated when your shipment is confirmed. It appears at the top right of your booking manifest and binding carriage receipt.",
  },
  {
    id: "faq-5",
    category: "compliance",
    q: "Does public tracking show continuous vehicle GPS location?",
    lead: "Verified physical milestone scans.",
    a: "Public tracking reports verified optical physical barcode milestone events at each linehaul checkpoint, flight manifest clearance, and local station delivery scan. Live continuous telemetry is reserved for our internal fleet dispatch safety team.",
  },
  {
    id: "faq-6",
    category: "compliance",
    q: "Can I ship fragile items, electronics, or batteries?",
    lead: "Statutory DG packaging compliance.",
    a: "Yes, provided statutory packing and handling declarations are satisfied. Lithium batteries (UN 3480/3481) require IATA Section II compliance verification. Fragile glassware and precision machinery require rigid crating and internal foam shock dampening.",
  },
]

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "booking", label: "Booking & AWB" },
  { id: "services", label: "Air vs Surface" },
  { id: "pricing", label: "Rates & Tax" },
  { id: "compliance", label: "Security & DG" },
] as const

/**
 * Frequently asked questions accordion addressing booking requirements,
 * chargeable weight calculations, and statutory dangerous goods declarations.
 * Rendered in an asymmetric 12-column layout with instant search and category filters.
 */
export function FAQSection() {
  const shouldReduceMotion = useReducedMotion()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        faq.q.toLowerCase().includes(query) ||
        faq.lead.toLowerCase().includes(query) ||
        faq.a.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [searchQuery, selectedCategory])

  return (
    <EditorialContainer
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden border-t border-border/80 bg-muted/15 py-10 sm:py-16 lg:py-20"
    >
      <GridPattern
        width={32}
        height={32}
        strokeDasharray="4 4"
        className="opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,var(--foreground)_70%,transparent_100%)] text-muted-foreground"
      />
      <div className="relative z-10 w-full max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 items-start">
          {/* Left Column: Sticky Knowledge Desk Navigation (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: motionDurations.editorial,
              ease: motionEasings.editorial,
            }}
            className="lg:col-span-4 lg:sticky lg:top-24 space-y-6"
          >
            <div>
              <h2
                id="faq-heading"
                className="text-section text-foreground text-balance"
              >
                <span className="font-medium text-foreground/80">Questions, </span>
                <span className="font-semibold text-foreground">
                  answered<span className="font-semibold text-primary">.</span>
                </span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
                Clear operational standards on consignment booking procedures, corridor transit timelines, chargeable volumetric math, and dangerous goods declarations.
              </p>
            </div>

            {/* Instant Filter Search Bar */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search freight questions..."
                className="h-11 w-full border border-input bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground rounded-none outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-sans text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-primary"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-1">
              <span className="block font-sans text-xs text-muted-foreground font-semibold mb-2">
                Filter by Category
              </span>
              <div role="tablist" aria-label="FAQ Categories" className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "px-3 py-1 font-sans text-xs rounded-none border transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.98] disabled:opacity-50",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "bg-card text-muted-foreground border-border/80 hover:bg-muted/40 hover:text-foreground"
                      )}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Direct Dispatch Assistance Callout */}
            <div className="border border-border/80 bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 font-sans text-xs font-semibold text-primary">
                <HelpCircle className="size-3.5" />
                <span>Urgent Operations Query?</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect directly with our 24/7 flight cargo dispatch desk for immediate flight manifesting or dangerous goods packaging clearance.
              </p>
              <a
                href="tel:+919856173829"
                className="inline-flex items-center gap-2 font-sans text-xs font-bold text-foreground hover:text-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary"
              >
                <Phone className="size-3 text-primary" />
                <span className="font-mono">+91 98561 73829</span>
                <ArrowUpRight className="size-3 ml-auto text-muted-foreground" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: High-Density Accordion List (8 cols) */}
          <div className="lg:col-span-8">
            {filteredFaqs.length === 0 ? (
              <div className="border border-border/80 bg-card p-8 text-center space-y-2">
                <p className="font-heading text-base font-semibold text-foreground">
                  No matching operational advisories found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search keywords or clear the category filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  className="mt-3 inline-block font-sans text-xs font-semibold text-primary underline focus-visible:ring-1 focus-visible:ring-primary"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <Accordion
                type="single"
                collapsible
                defaultValue={filteredFaqs[0]?.id}
                className="divide-y divide-border/80 border-y border-border/80 bg-card"
              >
                {filteredFaqs.map((faq, idx) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{
                      duration: motionDurations.reveal,
                      delay: Math.min(idx, 5) * 0.04,
                      ease: motionEasings.editorial,
                    }}
                  >
                    <AccordionItem
                      value={faq.id}
                      className="border-b-0 p-5 sm:p-6"
                    >
                      <AccordionTrigger
                        className="py-0 text-left hover:no-underline [&>svg]:hidden group cursor-pointer"
                      >
                        <span className="pr-6 flex items-baseline font-heading text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary text-balance sm:text-lg">
                          <span
                            className={
                              idx % 3 === 0
                                ? "mr-3.5 shrink-0 font-mono tabular-nums text-xs font-semibold text-primary sm:text-sm"
                                : idx % 3 === 1
                                ? "mr-3.5 shrink-0 font-mono tabular-nums text-xs font-semibold text-info sm:text-sm"
                                : "mr-3.5 shrink-0 font-mono tabular-nums text-xs font-semibold text-status-delivered sm:text-sm"
                            }
                          >
                            0{idx + 1}
                          </span>
                          <span>{faq.q}</span>
                        </span>
                        <span className="mt-1 flex size-6 shrink-0 items-center justify-center border border-border bg-card text-muted-foreground transition-[color,transform] duration-200 group-hover:border-primary group-hover:text-primary group-data-[state=open]:rotate-45 rounded-none">
                          <Plus className="size-3.5" />
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pr-6 sm:pr-10 space-y-2">
                        <p className="font-sans text-sm sm:text-base font-semibold text-foreground leading-snug">
                          {faq.lead}
                        </p>
                        <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal text-pretty max-w-[70ch]">
                          {faq.a}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
