"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Package, ShieldCheck, Plane, Truck } from "lucide-react"
import { HeroLottieBox } from "./hero-lottie-box"
import { HeroDispatchConsole } from "./hero-dispatch-console"
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from "motion/react"
import { TrackDialogForm } from "./track-dialog-form"
import { MagneticButton } from "./magnetic-button"

/**
 * Clean, Minimalistic Nordic Lagom Hero Section for TAC-XPRESS.
 *
 * Full Light & Dark Mode Support:
 * - Single, unified hero section with subtle atmospheric grid
 * - Direct New Delhi ↔ Northeast India linehaul corridor indicator
 * - High-contrast typography & interactive consignment search
 * - Floating telemetry HUD cards anchoring the 3D cargo parcel box
 * - Expandable dispatch console & consignment rate calculator
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
  const [consoleOpen, setConsoleOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const dur = (ms: number) => (shouldReduceMotion ? 0 : ms / 1000)

  return (
    <section
      className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden bg-background text-foreground select-none border-b border-border py-8 sm:py-10 lg:py-14 transition-colors"
      aria-labelledby="home-title"
      id="hero-section"
    >
      {/* ── SUBTLE BLUEPRINT GRID & AMBIENT ATMOSPHERE ─────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-25 dark:opacity-15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      />

      <div className="cargo-container relative z-10 w-full flex flex-col justify-between gap-8 sm:gap-10 lg:gap-12">
        {/* ── UNIFIED HERO STAGE: HEADLINE + PROMINENT TRUCK ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">

          {/* Left Column: Eyebrow, Headline, Subtitle, Quick Track & CTAs */}
          <motion.div
            className="lg:col-span-5 xl:col-span-5 z-20 flex flex-col justify-center"
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
              className="font-sans font-black uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-foreground leading-[1.0] max-w-lg"
              variants={fadeUp}
              custom={dur(0.15)}
            >
              Your world.
              <br />
              <span className="text-primary">On the move.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-4 text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed max-w-md"
              variants={fadeUp}
              custom={dur(0.22)}
            >
              Scheduled air and surface linehauls engineered for commercial freight, vital supplies, and time-critical consignments across Northeast India.
            </motion.p>

            {/* Quick AWB Consignment Tracking Input & Trust Badges */}
            <motion.div variants={fadeUp} custom={dur(0.30)} className="mt-6">
              <TrackDialogForm variant="inline" />
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

            {/* CTA Actions */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-4 sm:gap-5"
              variants={fadeUp}
              custom={dur(0.38)}
            >
              {/* Expandable Dispatch Console Button */}
              <MagneticButton strength={0.15}>
                <button
                  type="button"
                  onClick={() => setConsoleOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.97] rounded-none"
                >
                  <span>EXPLORE DESK</span>
                  <Package className="size-3.5" aria-hidden="true" />
                  <AnimatePresence mode="wait" initial={false}>
                    {consoleOpen ? (
                      <motion.span
                        key="up"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
                      >
                        <ChevronUp className="size-3.5 ml-0.5 text-primary-foreground/80" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="down"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
                      >
                        <ChevronDown className="size-3.5 ml-0.5 text-primary-foreground/80" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </MagneticButton>

              {/* Secondary Link */}
              <Link
                href="/services"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold text-foreground uppercase tracking-wider hover:text-primary transition-colors group"
              >
                <span>LEARN MORE</span>
                <motion.span
                  aria-hidden="true"
                  className="inline-block"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual Stage with Floating Telemetry HUD */}
          <motion.div
            className="lg:col-span-7 xl:col-span-7 relative w-full flex justify-center lg:justify-end items-center"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-center justify-center py-6 sm:py-8">
              {/* Floating Telemetry Card 1: Active Route Status */}
              <motion.div
                variants={fadeUp}
                custom={dur(0.35)}
                className="absolute top-0 left-0 sm:top-2 sm:left-2 z-20 border border-border bg-card/90 backdrop-blur-md p-3 shadow-md max-w-[210px] hidden xs:block"
              >
                <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-1.5 mb-1.5 font-mono text-[10px] uppercase text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-none bg-status-delivered animate-pulse" />
                    <span>LINEHAUL ROUTE</span>
                  </span>
                  <span className="font-bold text-foreground">DEL ➔ IMF</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground text-[11px]">Daily Transit</span>
                  <span className="text-primary font-bold">AIR &amp; SURFACE</span>
                </div>
              </motion.div>

              {/* Animated Lottie Box (public/lottie/empty_box.json) */}
              <HeroLottieBox />

              {/* Floating Telemetry Card 2: Security & SLA Verification */}
              <motion.div
                variants={fadeUp}
                custom={dur(0.42)}
                className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 z-20 border border-border bg-card/90 backdrop-blur-md p-3 shadow-md max-w-[220px] hidden xs:block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center bg-primary/10 text-primary">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      VERIFIED FREIGHT
                    </span>
                    <span className="font-sans text-xs font-bold text-foreground truncate">
                      Tamper-Evident Cargo
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>


        {/* ── EXPANDABLE OPERATIONAL DISPATCH CONSOLE ─────────────── */}
        <AnimatePresence>
          {consoleOpen && (
            <motion.div
              className="border-t border-border pt-6"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: EASE_OUT_EXPO }}
            >
              <div className="flex items-center justify-between pb-3">
                <div className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                  OPERATIONAL DESK • CONSIGNMENT LOOKUP &amp; RATE ESTIMATOR
                </div>
                <button
                  type="button"
                  onClick={() => setConsoleOpen(false)}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Close Console [✕]
                </button>
              </div>
              <HeroDispatchConsole />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
