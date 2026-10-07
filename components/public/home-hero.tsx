"use client"

import React from "react"
import Link from "next/link"
import { ShieldCheck, Plane, Truck } from "lucide-react"
import { HeroLottieTruck } from "./hero-lottie-truck"
import { TrackDialogForm } from "./track-dialog-form"
import { motion, useReducedMotion } from "motion/react"

/**
 * Minimalistic Nordic Lagom Hero Section for TAC-XPRESS.
 *
 * Grounded in NORDIC QUIET INFRASTRUCTURE:
 * - Serene, uncluttered spatial geometry with purposeful negative space.
 * - Restrained commercial transport truck Lottie animation.
 * - Single, high-contrast AWB tracking command input.
 * - Quiet Delhi ⇄ Imphal linehaul corridor indicator.
 * - Zero decorative noise, zero HUD clutter, full dark/light mode fidelity.
 */

// Confident arrival easing — fast in, decelerate to rest
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

// Shared motion variants for hero entrance sequence
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: EASE_OUT_EXPO },
  }),
}

const slideFromRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO },
  },
}

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion()
  const dur = (ms: number) => (shouldReduceMotion ? 0 : ms / 1000)

  return (
    <section
      className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden bg-background text-foreground select-none border-b border-border py-12 sm:py-16 lg:py-20 transition-colors"
      aria-labelledby="home-title"
      id="hero-section"
    >
      {/* ── SERENE NORDIC AMBIENCE ─────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_50%,transparent_100%)] opacity-20 dark:opacity-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      />

      <div className="cargo-container relative z-10 w-full">
        {/* ── UNIFIED TWO-COLUMN STAGE ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column: Headline, Value Proposition & AWB Tracking */}
          <motion.div
            className="lg:col-span-6 xl:col-span-6 z-20 flex flex-col justify-center"
            initial="hidden"
            animate="visible"
          >
            {/* Quiet Corridor Indicator */}
            <motion.div
              variants={fadeUp}
              custom={dur(0.06)}
              className="mb-4 inline-flex items-center gap-2 border border-border bg-surface px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs self-start"
            >
              <span className="size-1.5 rounded-none bg-status-delivered animate-pulse" />
              <span>DELHI ⇄ IMPHAL CORRIDOR</span>
              <span className="text-border">|</span>
              <span className="text-foreground">SCHEDULED LINEHAULS</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              id="home-title"
              className="font-sans font-black uppercase tracking-tight text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.0] max-w-lg"
              variants={fadeUp}
              custom={dur(0.12)}
            >
              Your world.
              <br />
              <span className="text-primary">On the move.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md"
              variants={fadeUp}
              custom={dur(0.18)}
            >
              Scheduled air and surface linehauls engineered for commercial freight, vital supplies, and time-critical consignments across Northeast India.
            </motion.p>

            {/* AWB Consignment Tracking Input */}
            <motion.div variants={fadeUp} custom={dur(0.25)} className="mt-6 max-w-md">
              <TrackDialogForm variant="inline" />

              {/* Quiet Trust Signals */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Escorted freight</span>
                </span>
                <span className="text-border" aria-hidden="true">•</span>
                <span className="flex items-center gap-1.5">
                  <Plane className="size-3.5 text-primary" aria-hidden="true" />
                  <span>24–48h Air Cargo</span>
                </span>
                <span className="text-border" aria-hidden="true">•</span>
                <span className="flex items-center gap-1.5">
                  <Truck className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Surface Express</span>
                </span>
              </div>
            </motion.div>

            {/* Restrained Action Links */}
            <motion.div
              className="mt-6 flex items-center gap-5"
              variants={fadeUp}
              custom={dur(0.32)}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-10 px-5 bg-primary text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-xs"
              >
                Book a Shipment
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground uppercase tracking-wider hover:text-primary transition-colors group"
              >
                <span>Network Services</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Serene Lottie Transport Animation */}
          <motion.div
            className="lg:col-span-6 xl:col-span-6 relative w-full flex items-center justify-center lg:justify-end"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-md lg:max-w-lg border border-border/80 bg-card/60 backdrop-blur-xs p-4 sm:p-6 shadow-sm select-none">
              {/* Lottie Linehaul Truck Animation */}
              <HeroLottieTruck className="w-full aspect-[4/3]" />

              {/* Quiet Route Caption Strip */}
              <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-none bg-status-delivered" />
                  <span className="uppercase">Direct Linehaul Corridor</span>
                </div>
                <span className="font-semibold text-foreground">DEL ⇄ IMF</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
