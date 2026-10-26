"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  Star,
  Quote,
  ArrowDown,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
} from "lucide-react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import {
  motionDurations,
  motionEasings,
} from "@/lib/motion/motion.theme"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/reui/badge"
import Link from "next/link"

// Verified corridor performance feedback
const TESTIMONIALS = [
  {
    name: "Rajesh K.",
    role: "Operations Manager, LogiPrime",
    corridor: "DEL → IMF Express Corridor",
    message:
      "TAC-XPRESS lowered our Delhi to Imphal air freight transit time to under 24 hours. Milestone tracking provides reliable custody status for our consignments.",
    stars: 5,
  },
  {
    name: "Priya S.",
    role: "Supply Chain Lead, NovaChem",
    corridor: "IMF → DEL Return Linehaul",
    message:
      "Daily commercial belly-hold capacity from Imphal to New Delhi gives our high-value consignments direct capital access with zero transshipment delays.",
    stars: 5,
  },
  {
    name: "Arun M.",
    role: "Founder, FreshNE Logistics",
    corridor: "DEL ⇄ IMF Priority Route",
    message:
      "Statutory Air Waybill compliance and optical gate scan verification at both IGI and Tulihal terminals ensure complete cargo accountability.",
    stars: 5,
  },
] as const

// Star rating indicator
function StarRating({ count }: { count: number }) {
  return (
    <div
      role="img"
      aria-label={`${count} out of 5 stars`}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < count
              ? "fill-warning text-warning"
              : "fill-muted text-muted-foreground/30"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

// Testimonial card
function TestimonialCard({
  testimonial,
  index,
  shouldReduceMotion,
}: {
  testimonial: (typeof TESTIMONIALS)[number]
  index: number
  shouldReduceMotion: boolean | null
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: motionDurations.reveal,
        delay: Math.min(index, 5) * 0.05,
        ease: motionEasings.editorial,
      }}
      className="group relative flex flex-col justify-between rounded-none border-l-2 border-l-primary/60 border-t border-r border-b border-border/80 bg-card p-6 transition-colors duration-200 hover:border-l-primary hover:bg-muted/10"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <Quote
            className="size-5 text-primary/40"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <Badge variant="primary-light" className="rounded-none font-mono text-xs">
            {testimonial.corridor}
          </Badge>
        </div>

        <blockquote className="mt-4 border-l-2 border-primary/30 pl-3.5 py-0.5 text-base sm:text-lg leading-relaxed text-foreground/95 italic font-sans text-pretty">
          &ldquo;{testimonial.message}&rdquo;
        </blockquote>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/40 pt-4">
        <div className="min-w-0">
          <span className="block text-sm font-medium text-foreground">
            {testimonial.name}
          </span>
          <span className="block font-sans text-xs text-muted-foreground">
            {testimonial.role}
          </span>
        </div>
        <StarRating count={testimonial.stars} />
      </div>
    </motion.div>
  )
}

// FeedbackSection: Customer proof and quality telemetry

/**
 * Customer feedback and trust section for the master landing page.
 * Displays verified testimonial cards and aggregate service metrics.
 * Calls to action link directly to the combined Contact & Feedback form.
 */
export function FeedbackSection() {
  const shouldReduceMotion = useReducedMotion()

  const scrollToFeedbackForm = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "contact?intent=feedback"
      const el = document.getElementById("contact")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <EditorialContainer
      id="feedback"
      aria-labelledby="feedback-heading"
      className="py-12 sm:py-16 lg:py-20"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: motionDurations.editorial,
          ease: motionEasings.editorial,
        }}
        className="mb-10 max-w-2xl"
      >
        <h2
          id="feedback-heading"
          className="text-section text-foreground text-balance"
        >
          Every shipment tells a story. Driven by reliability.
        </h2>
        <p className="mt-4 text-lead max-w-[55ch] text-muted-foreground leading-relaxed font-normal text-pretty">
          Real customer experiences across our Northeast corridors. Every shipment
          calibrates our transit schedules and strengthens our quality controls.
        </p>
      </motion.div>

      {/* Testimonials 3-Column Grid */}
      <div data-slot="testimonial-deck" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard
            key={t.name}
            testimonial={t}
            index={i}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>

      {/* Aggregate Quality Strip & Combined CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{
          duration: motionDurations.reveal,
          delay: 0.2,
          ease: motionEasings.editorial,
        }}
        className="mt-6 border border-border/80 bg-card p-5 sm:p-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Quality Metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            <div className="space-y-0.5">
              <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
                4.8 / 5
              </span>
              <span className="block font-sans text-xs text-muted-foreground font-medium">
                Avg. Corridor Rating
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
                &lt; 24h
              </span>
              <span className="block font-sans text-xs text-muted-foreground font-medium">
                SLA Review Response
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
                +72
              </span>
              <span className="block font-sans text-xs text-muted-foreground font-medium">
                Net Promoter Score
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
                99.4%
              </span>
              <span className="block font-sans text-xs text-muted-foreground font-medium">
                On-Time Reliability
              </span>
            </div>
          </div>

          {/* Action linking to the combined contact form below */}
          <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-4 lg:border-t-0 lg:pt-0">
            <Button
              type="button"
              onClick={scrollToFeedbackForm}
              className="gap-2 rounded-none font-sans text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] disabled:opacity-50 h-11 px-4"
            >
              <Sparkles className="size-3.5" />
              Share Feedback on Operations Desk
              <ArrowDown className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-none font-sans text-xs focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] disabled:opacity-50 h-11 px-4"
            >
              <Link href="/feedback">
                Dedicated Feedback Page
                <ExternalLink className="size-3 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </EditorialContainer>
  )
}
