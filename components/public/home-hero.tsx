"use client"

import React from "react"
import Link from "next/link"
import { ShieldCheck, Plane, Truck, Radio, ArrowUpRight } from "lucide-react"
import { CargoImage } from "./cargo-image"
import { HeroDispatchConsole } from "./hero-dispatch-console"
import { motion, useReducedMotion } from "motion/react"

/**
 * Enterprise Nordic Precision Hero Section for TAC-XPRESS.
 *
 * Grounded in EVIL MARTIANS & NORDIC QUIET INFRASTRUCTURE:
 * - High-altitude Himalayan Mountain Pass Linehaul Showcase in industrial terminal chassis.
 * - Corner registration marks (+) and live telemetry HUD cards (Del-Imphal corridor).
 * - Prominently integrated tabbed dispatch console (Consignment Tracking & Route Rate Check).
 * - Full Dark & Light theme compliance with zero design token drift.
 */

// Confident arrival easing — fast in, decelerate to rest
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

// Shared motion variants for hero entrance sequence
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE_OUT_EXPO },
  }),
}

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 0.25, ease: EASE_OUT_EXPO },
  },
}

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion()
  const dur = (ms: number) => (shouldReduceMotion ? 0 : ms / 1000)

  return (
    <section
      className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden bg-background text-foreground select-none border-b border-border py-8 sm:py-12 lg:py-16 transition-colors"
      aria-labelledby="home-title"
      id="hero-section"
    >
      {/* ── TECHNICAL BLUEPRINT GRID & AMBIENT DEPTH ─────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)] opacity-35 dark:opacity-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      />

      <div className="cargo-container relative z-10 w-full flex flex-col justify-between gap-6 sm:gap-8 lg:gap-10">
        {/* ── GEOGRAPHIC CORRIDOR COORDINATE WATERMARKS ─────────────── */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center justify-between font-mono text-[10px] text-muted-foreground/60 tracking-widest uppercase select-none border-b border-border/40 pb-2"
        >
          <span className="flex items-center gap-1.5">
            <span className="size-1 rounded-none bg-primary/60" />
            <span>CORRIDOR ORIGIN: 28.6139° N, 77.2090° E // DEL-HUB</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>CORRIDOR TERMINUS: 24.8170° N, 93.9368° E // IMF-HUB</span>
            <span className="size-1 rounded-none bg-primary/60" />
          </span>
        </div>

        {/* ── UNIFIED COMMAND STAGE: CONSOLE + 3D LINEHAUL ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Left Column: Eyebrow, Headline, Value Prop & Prominent Dispatch Console */}
          <motion.div
            className="lg:col-span-6 xl:col-span-6 z-20 flex flex-col justify-center"
            initial="hidden"
            animate="visible"
          >
            {/* Live Corridor Eyebrow Badge */}
            <motion.div
              variants={fadeUp}
              custom={dur(0.08)}
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
              className="font-sans font-black uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-foreground leading-[1.0] max-w-xl"
              variants={fadeUp}
              custom={dur(0.15)}
            >
              Your world.
              <br />
              <span className="text-primary">On the move.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-4 text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed max-w-lg"
              variants={fadeUp}
              custom={dur(0.22)}
            >
              Scheduled air and surface linehauls engineered for commercial freight, vital supplies, and time-critical consignments across Northeast India.
            </motion.p>

            {/* Prominent Tabbed Dispatch Console */}
            <motion.div variants={fadeUp} custom={dur(0.3)} className="mt-6 w-full max-w-xl">
              <HeroDispatchConsole defaultTab="track" />
            </motion.div>

            {/* Freight Trust Indicators Row */}
            <motion.div
              variants={fadeUp}
              custom={dur(0.38)}
              className="mt-4 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 max-w-xl"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
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

              <Link
                href="/services"
                className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-foreground uppercase tracking-wider hover:text-primary transition-colors group"
              >
                <span>SERVICES</span>
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Photorealistic 3D Himalayan Linehaul Showcase */}
          <motion.div
            className="lg:col-span-6 xl:col-span-6 relative w-full flex flex-col items-center lg:items-end justify-center"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-xl border border-border bg-card p-3 sm:p-4 shadow-xl select-none rounded-none">
              {/* Corner Registration Marks (+) */}
              <span aria-hidden="true" className="absolute -top-2.5 -left-2.5 font-mono text-xs font-bold text-muted-foreground/60 select-none">+</span>
              <span aria-hidden="true" className="absolute -top-2.5 -right-2.5 font-mono text-xs font-bold text-muted-foreground/70 select-none">+</span>
              <span aria-hidden="true" className="absolute -bottom-2.5 -left-2.5 font-mono text-xs font-bold text-muted-foreground/70 select-none">+</span>
              <span aria-hidden="true" className="absolute -bottom-2.5 -right-2.5 font-mono text-xs font-bold text-muted-foreground/70 select-none">+</span>

              {/* Chassis Header Bar */}
              <div className="mb-3 flex items-center justify-between border-b border-border/80 pb-2.5 font-mono text-[11px] uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-none bg-status-delivered animate-pulse" />
                  <span className="font-semibold text-foreground">TERMINAL FEED • LINEHAUL SECTOR 01</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Radio className="size-3 text-primary animate-pulse" aria-hidden="true" />
                  <span>LIVE TELEMETRY</span>
                </div>
              </div>

              {/* 3D Himalayan Linehaul Image Stage with HUD Overlays */}
              <div className="group relative w-full aspect-[16/10] overflow-hidden border border-border/70 bg-muted">
                <CargoImage
                  asset="hero"
                  priority
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Floating HUD Card 1: Top-Right Active Route Indicator */}
                <div className="absolute top-2.5 right-2.5 z-20 border border-border/80 bg-card/90 backdrop-blur-md px-3 py-1.5 shadow-md">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                    <span className="size-1.5 rounded-none bg-status-delivered animate-pulse" />
                    <span className="font-bold text-foreground">DEL ➔ IMF CORRIDOR</span>
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground">
                    DAILY SCHEDULED TRANSIT
                  </div>
                </div>

                {/* Floating HUD Card 2: Bottom-Left Mountain Pass Telemetry */}
                <div className="absolute bottom-2.5 left-2.5 z-20 max-w-[280px] border border-border/80 bg-card/90 backdrop-blur-md p-2.5 shadow-md">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    TRANS-HIMALAYAN HIGHWAY
                  </div>
                  <div className="mt-0.5 font-mono text-xs font-bold text-foreground">
                    NH-29 / NH-2 ALL-WEATHER ROUTE
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-primary">
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    <span>ARMORED &amp; GPS-ESCORTED FLEET</span>
                  </div>
                </div>
              </div>

              {/* Chassis Telemetry Footer Bar */}
              <div className="mt-3 grid grid-cols-3 divide-x divide-border border-t border-border/80 pt-2.5 text-center font-mono">
                <div className="px-1 sm:px-2">
                  <div className="text-[10px] uppercase text-muted-foreground">TRANSIT SLA</div>
                  <div className="text-xs font-bold text-foreground">24H AIR / 5D SURFACE</div>
                </div>
                <div className="px-1 sm:px-2">
                  <div className="text-[10px] uppercase text-muted-foreground">FREQUENCY</div>
                  <div className="text-xs font-bold text-primary">DAILY LINEHAUL</div>
                </div>
                <div className="px-1 sm:px-2">
                  <div className="text-[10px] uppercase text-muted-foreground">SECURITY</div>
                  <div className="text-xs font-bold text-foreground">SEALED CARGO</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
