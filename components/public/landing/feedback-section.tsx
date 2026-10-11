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
import Link from "next/link"

/* ------------------------------------------------------------------ */
/*  Verified Testimonials — Social Proof & Corridor Performance       */
/* ------------------------------------------------------------------ */
const TESTIMONIALS = [
  {
    name: "Rajesh K.",
    role: "Operations Manager, LogiPrime",
    corridor: "DEL → IMF Corridor",
    message:
      "TAC-XPRESS cut our Delhi–Imphal transit time by 40%. The real-time tracking is a game-changer for our perishable goods corridor.",
    stars: 5,
  },
  {
    name: "Priya S.",
    role: "Supply Chain Lead, NovaChem",
    corridor: "DEL → GAU Hazmat Route",
    message:
      "Exceptional attention to statutory customs clearance. Our hazmat shipments clear security in half the time compared to legacy providers.",
    stars: 5,
  },
  {
    name: "Arun M.",
    role: "Founder, FreshNE Foods",
    corridor: "CCU → DMU Surface Line",
    message:
      "The dimensional weight calculator saved us from overpaying on air cargo. Transparent corridor pricing with zero hidden surcharges.",
    stars: 5,
  },
] as const

/* ------------------------------------------------------------------ */
/*  Star Rating Component                                              */
/* ------------------------------------------------------------------ */
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
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

/* ------------------------------------------------------------------ */
/*  Testimonial Card                                                   */
/* ------------------------------------------------------------------ */
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
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: motionDurations.reveal,
        delay: index * 0.08,
        ease: motionEasings.editorial,
      }}
      className="group relative flex flex-col justify-between border border-border/80 bg-card p-6 transition-all hover:border-primary/40 hover:bg-muted/20"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <Quote
            className="size-5 text-primary/30"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5">
            {testimonial.corridor}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-sans">
          &ldquo;{testimonial.message}&rdquo;
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/40 pt-4">
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">
            {testimonial.name}
          </span>
          <span className="block font-mono text-[10px] text-muted-foreground tracking-wide">
            {testimonial.role}
          </span>
        </div>
        <StarRating count={testimonial.stars} />
      </div>
    </motion.div>
  )
}

/* ================================================================== */
/*  FeedbackSection — Editorial Social Proof & Quality Telemetry       */
/* ================================================================== */

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
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: motionDurations.editorial,
          ease: motionEasings.editorial,
        }}
        className="mb-10 max-w-2xl"
      >
        <SectionEyebrow className="mb-4">
          Feedback · Signal Loop
        </SectionEyebrow>
        <h2
          id="feedback-heading"
          className="text-section text-foreground"
        >
          Every shipment tells a story. Driven by reliability.
        </h2>
        <p className="mt-4 text-lead max-w-[55ch] text-muted-foreground leading-relaxed font-normal">
          Real customer experiences across our Northeast corridors. Every shipment
          calibrates our transit schedules and strengthens our quality controls.
        </p>
      </motion.div>

      {/* Testimonials 3-Column Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
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
              <span className="font-mono text-xl font-bold tabular-nums text-foreground">
                4.8 / 5
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Avg. Corridor Rating
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-xl font-bold tabular-nums text-foreground">
                &lt; 24h
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                SLA Review Response
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-xl font-bold tabular-nums text-foreground">
                +72
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Net Promoter Score
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-xl font-bold tabular-nums text-foreground">
                99.4%
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                On-Time Reliability
              </span>
            </div>
          </div>

          {/* Action linking to the combined contact form below */}
          <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-4 lg:border-t-0 lg:pt-0">
            <Button
              type="button"
              onClick={scrollToFeedbackForm}
              className="gap-2 rounded-none font-mono text-xs uppercase tracking-wider"
            >
              <Sparkles className="size-3.5" />
              Share Feedback on Operations Desk
              <ArrowDown className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-none font-mono text-xs"
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
