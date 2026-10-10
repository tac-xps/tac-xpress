"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { Phone, Mail, MapPin } from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { TicketForm } from "@/components/public/ticket-form"
import { BorderBeam } from "@/components/ui/border-beam"

/**
 * Direct contact desk section integrating operational gateway directories
 * alongside the validated support ticket and quote submission form.
 */
export function ContactSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <EditorialContainer
      id="contact"
      aria-labelledby="contact-heading"
      className="py-10 sm:py-16 lg:py-20"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Context & Contact Metadata */}
        <motion.div
          initial={shouldReduceMotion ? false : { y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <SectionEyebrow className="mb-4">Contact · Operations Desk</SectionEyebrow>
          <h2
            id="contact-heading"
            className="text-section text-foreground"
          >
            A person to help with the next step.
          </h2>
          <p className="mt-4 text-lead max-w-[50ch]">
            <strong className="font-semibold text-foreground">Dedicated logistics desk. </strong>
            Submit corridor parameters, dimensional cargo manifests, or dispatch inquiries. Our operations team computes volumetric ratings and responds directly.
          </p>

          {/* Operational Contact Directory */}
          <div className="mt-10 space-y-6 border-t border-border/80 pt-8">
            <div className="flex items-start gap-3">
              <Phone className="size-4 shrink-0 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground block font-sans uppercase tracking-wider text-[11px] font-semibold">
                  Dispatch Hotline
                </span>
                <span className="font-semibold text-foreground text-base">
                  +91 98561 73829
                </span>
                <span className="text-muted-foreground block font-mono text-[11px]">
                  Mon – Sat · 08:00 to 20:00 IST
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="size-4 shrink-0 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground block font-sans uppercase tracking-wider text-[11px] font-semibold">
                  Direct Electronic Inquiries
                </span>
                <span className="font-semibold text-foreground text-base">
                  cargo@tac-xpress.com
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground block font-sans uppercase tracking-wider text-[11px] font-semibold">
                  Principal Gateway Stations
                </span>
                <span className="text-foreground block text-sm">
                  Delhi Hub: Cargo Terminal 2, IGI Airport, New Delhi
                </span>
                <span className="text-foreground block text-sm">
                  Imphal Hub: RDS Station, Airport Road, Imphal
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Production TicketForm (Zod, Sentry, Arcjet, Supabase) */}
        <motion.div
          initial={shouldReduceMotion ? false : { y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-7 flex justify-start lg:justify-end"
        >
          <div className="relative w-full max-w-xl">
            <TicketForm hideHeader compact className="rounded-none border border-border/80 bg-card p-5 sm:p-6" />
            <BorderBeam
              size={120}
              duration={12}
              colorFrom="var(--color-primary)"
              colorTo="transparent"
              borderWidth={1}
            />
          </div>
        </motion.div>
      </div>
    </EditorialContainer>
  )
}
