"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { Phone, Mail, MapPin } from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { TicketForm } from "@/components/public/ticket-form"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  motionDurations,
  motionEasings,
  tactileInteraction,
} from "@/lib/motion/motion.theme"

/**
 * Direct contact desk section integrating operational gateway directories
 * alongside the validated support ticket and quote submission form.
 *
 * Contact directory rendered as a 4-column icon-card strip:
 * Dispatch Hotline · Operating Hours · Electronic Inquiries · Gateway Stations
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

        {/* Left Column: Context & Contact Directory */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionDurations.editorial,
            ease: motionEasings.editorial,
          }}
          className="lg:col-span-5"
        >
          <SectionEyebrow className="mb-4">Contact · Operations Desk</SectionEyebrow>
          <h2
            id="contact-heading"
            className="text-section text-foreground"
          >
            A person to help with the next step.
          </h2>
          <p className="mt-4 text-lead max-w-[50ch] text-muted-foreground leading-relaxed font-normal">
            Dedicated logistics desk. Submit corridor parameters, dimensional cargo manifests,
            or dispatch inquiries. Our operations team computes volumetric ratings and responds directly.
          </p>

          {/* Contact Directory: 2x2 icon-card grid with staggered entrance (M3) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px border border-border/80 bg-border/30">

            {/* Card 1 — Dispatch Hotline */}
            <motion.a
              href="tel:+919856173829"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
              transition={{
                duration: motionDurations.reveal,
                delay: 0.04,
                ease: motionEasings.editorial,
              }}
              className="group relative flex items-start gap-3.5 bg-card p-5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Call dispatch hotline +91 98561 73829"
            >
              <span aria-hidden="true" className="mt-0.5 flex size-9 shrink-0 items-center justify-center bg-primary/10">
                <Phone className="size-4 text-primary" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  Dispatch Hotline
                </span>
                <span className="mt-1 block font-sans text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  +91 98561 73829
                </span>
              </div>
            </motion.a>

            {/* Card 2 — Operating Hours */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: motionDurations.reveal,
                delay: 0.08,
                ease: motionEasings.editorial,
              }}
              className="flex items-start gap-3.5 bg-card p-5"
            >
              <span aria-hidden="true" className="mt-0.5 flex size-9 shrink-0 items-center justify-center bg-info/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-info" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-info">
                  Operating Hours
                </span>
                <span className="mt-1 block font-sans text-sm font-medium text-foreground">
                  Mon – Sat
                </span>
                <span className="block font-mono text-xs text-muted-foreground">
                  08:00 – 20:00 IST
                </span>
              </div>
            </motion.div>

            {/* Card 3 — Electronic Inquiries */}
            <motion.a
              href="mailto:cargo@tac-xpress.com"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
              transition={{
                duration: motionDurations.reveal,
                delay: 0.12,
                ease: motionEasings.editorial,
              }}
              className="group relative flex items-start gap-3.5 bg-card p-5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Email cargo@tac-xpress.com"
            >
              <span aria-hidden="true" className="mt-0.5 flex size-9 shrink-0 items-center justify-center bg-status-delivered/10">
                <Mail className="size-4 text-status-delivered" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-status-delivered">
                  Electronic Inquiries
                </span>
                <span className="mt-1 block font-sans text-sm font-medium text-foreground group-hover:text-status-delivered transition-colors break-all">
                  cargo@tac-xpress.com
                </span>
              </div>
            </motion.a>

            {/* Card 4 — Gateway Stations */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: motionDurations.reveal,
                delay: 0.16,
                ease: motionEasings.editorial,
              }}
              className="flex items-start gap-3.5 bg-card p-5"
            >
              <span aria-hidden="true" className="mt-0.5 flex size-9 shrink-0 items-center justify-center bg-status-pending/10">
                <MapPin className="size-4 text-status-pending" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-status-pending">
                  Gateway Stations
                </span>
                <span className="mt-1 block font-sans text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Delhi Hub</span>
                  {" · "}Cargo Terminal 2, IGI Airport
                </span>
                <span className="block font-sans text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Imphal Hub</span>
                  {" · "}RDS Station, Airport Road
                </span>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Right Column: Production TicketForm */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionDurations.editorial,
            delay: 0.12,
            ease: motionEasings.editorial,
          }}
          className="relative lg:col-span-7 flex justify-start lg:justify-end"
        >
          <div className="relative w-full max-w-xl">
            <TicketForm
              hideHeader
              compact
              className="rounded-none border border-border/80 bg-card p-5 sm:p-6"
            />
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
