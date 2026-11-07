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
      "No account required. Contact our team to request a booking, or use your AWB number to view published shipment updates.",
  },
  {
    id: "item-2",
    question: "How fast is transit between Delhi and Imphal?",
    answer:
      "Ask our team to confirm the delivery window for your shipment before booking. Timing depends on the selected service and acceptance.",
  },
  {
    id: "item-3",
    question: "How are freight rates calculated?",
    answer:
      "Our team confirms the chargeable weight, rate, applicable surcharges, and tax in your quote. Share the weight and dimensions.",
  },
  {
    id: "item-4",
    question: "Can I dispatch freight from Imphal to New Delhi?",
    answer:
      "Yes. TAC-XPRESS serves New Delhi (DEL) and Imphal (IMF) in both directions. Confirm shipment acceptance and timing with our team.",
  },
  {
    id: "item-5",
    question: "What security screening standards are applied?",
    answer:
      "Describe the contents and any special handling needs before booking. Our team will confirm the acceptance and screening requirements.",
  },
  {
    id: "item-6",
    question: "What statutory GST documents do I need to prepare?",
    answer:
      "Ask our team which invoice, identification, and transport documents your consignment needs before handover.",
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
            Prepare your shipment details and confirm the service before handover.
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
