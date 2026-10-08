"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { Phone, Mail, MapPin } from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { TicketForm } from "@/components/public/ticket-form"

export function ContactSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <EditorialContainer
      id="contact"
      aria-labelledby="contact-heading"
      className="py-12 sm:py-20 lg:py-24"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Context & Contact Metadata */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <SectionEyebrow className="mb-4">Direct Dispatch Desk</SectionEyebrow>
          <h2
            id="contact-heading"
            style={{ fontSize: "var(--type-section)" }}
            className="font-heading font-medium tracking-tight text-foreground leading-[1.06] text-balance"
          >
            A person to help
            <br />
            <span className="text-muted-foreground/90">with the next step.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground font-normal text-pretty">
            Every quote and route inquiry is reviewed directly by our cargo controllers in
            New Delhi and Imphal. Share your consignment parameters for an itemized transit
            plan.
          </p>

          {/* Operational Contact Directory */}
          <div className="mt-10 space-y-6 border-t border-border/80 pt-8 font-mono text-xs">
            <div className="flex items-start gap-3">
              <Phone className="size-4 shrink-0 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground block uppercase tracking-wider text-[10px]">
                  Dispatch Hotline
                </span>
                <span className="font-semibold text-foreground text-sm">
                  +91 98561 73829
                </span>
                <span className="text-muted-foreground block text-[11px]">
                  Mon – Sat · 08:00 to 20:00 IST
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="size-4 shrink-0 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground block uppercase tracking-wider text-[10px]">
                  Direct Electronic Inquiries
                </span>
                <span className="font-semibold text-foreground text-sm">
                  cargo@tac-xpress.com
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground block uppercase tracking-wider text-[10px]">
                  Principal Gateway Stations
                </span>
                <span className="text-foreground block text-xs">
                  Delhi Hub: Cargo Terminal 2, IGI Airport, New Delhi
                </span>
                <span className="text-foreground block text-xs">
                  Imphal Hub: RDS Station, Airport Road, Imphal
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Production TicketForm (Zod, Sentry, Arcjet, Supabase) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <TicketForm className="rounded-none border border-border/80 bg-card p-4 sm:p-7 lg:p-8" />
        </motion.div>
      </div>
    </EditorialContainer>
  )
}
