"use client"

import React from "react"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    id: "item-1",
    question: "Do I need an account to book or track a shipment?",
    answer:
      "No account required. Anyone can schedule dispatches and track consignments publicly using a 10-digit Air Waybill (AWB) number.",
  },
  {
    id: "item-2",
    question: "How fast is transit between Delhi and Imphal?",
    answer:
      "Air Cargo lands within 24 hours via scheduled commercial flight belly-hold. Surface Linehaul arrives within 4 to 5 days via dedicated arterial highway trucks.",
  },
  {
    id: "item-3",
    question: "How are freight rates calculated?",
    answer:
      "Tariffs use chargeable weight (max of actual gross weight and volumetric weight: L × W × H cm ÷ 5000), plus 10% fuel surcharge and statutory 18% GST itemized on invoices.",
  },
  {
    id: "item-4",
    question: "Can I dispatch freight from Imphal to New Delhi?",
    answer:
      "Yes. Tac-Xpress operates daily return schedules from Imphal (IMF) to New Delhi (DEL) with full statutory documentation and optical barcode tracking.",
  },
  {
    id: "item-5",
    question: "What security screening standards are applied?",
    answer:
      "All cargo undergoes 100% BCAS regulated security screening and X-ray clearance at IGI Airport Gate 4 and Tulihal Airport prior to apron loading.",
  },
  {
    id: "item-6",
    question: "What statutory GST documents do I need to prepare?",
    answer:
      "Commercial consignments valued over ₹50,000 require an active GST e-waybill. Tac-Xpress automatically verifies and attaches digital e-waybills to your AWB docket.",
  },
]

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-background @container py-20 sm:py-24 border-b border-border"
    >
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="faq-heading"
            className="text-balance text-3xl sm:text-4xl font-medium tracking-tight text-foreground"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-xs sm:text-sm leading-relaxed">
            Find clear answers regarding bilateral transit schedules, gateway custody protocols, and statutory documentation.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 p-2 sm:p-3 rounded-none border border-border shadow-xs bg-card">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-border/70 last:border-b-0 px-4 sm:px-6"
              >
                <AccordionTrigger className="cursor-pointer py-4 text-left text-sm font-medium text-foreground hover:no-underline font-sans">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground pb-2 text-xs sm:text-sm leading-relaxed font-sans">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <p className="text-muted-foreground mt-8 text-center text-xs sm:text-sm">
          Still have questions?{" "}
          <Link
            href="#contact"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Contact corridor operations
          </Link>
        </p>
      </div>
    </section>
  )
}

export const FAQs = FaqSection
