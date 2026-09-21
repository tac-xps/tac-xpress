"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, ChevronUp, Package, Truck, Search } from "lucide-react"
import { HeroLottieTruck } from "./hero-lottie-truck"
import { HeroDispatchConsole } from "./hero-dispatch-console"
import { cn } from "@/lib/utils"
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from "motion/react"
import { MagneticButton } from "./magnetic-button"

/**
 * Clean, Minimalistic Nordic Lagom Hero Section for TAC-XPRESS.
 *
 * Full Light & Dark Mode Support:
 * - Single, unified hero section (NO divided bottom section or cut-off sub-cards)
 * - Light mode: Crisp white canvas with high-contrast slate/black typography & studio-lit truck
 * - Dark mode: Deep obsidian canvas with white display type & rim-lit dark truck
 * - Top-right horizontal stat triad (95%, 80+, 24/7) with primary color accents
 * - Exact floating telemetry badges: "• Live Tracks", "• Fast Status", "• Safe System"
 * - Instant inline AWB tracking lookup and expandable dispatch console
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay, ease: EASE_OUT_EXPO },
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
      className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden bg-background text-foreground select-none border-b border-border py-8 sm:py-10 lg:py-12 transition-colors"
      aria-labelledby="home-title"
      id="hero-section"
    >
      {/* Subtle ambient radial glow for warmth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 cargo-home-hero-glow"
        aria-hidden="true"
      />

      <div className="cargo-container relative z-10 w-full flex flex-col justify-between gap-8 sm:gap-10 lg:gap-12">

        {/* ── TOP BAR: EYEBROW & STAT TRIAD ─────────────────────── */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-5 border-b border-border/60"
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow Pill */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/80 dark:bg-foreground/[0.06] border border-border dark:border-foreground/10 font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase self-start"
            variants={fadeIn}
            custom={dur(0.05)}
          >
            <span className="flex size-4 items-center justify-center bg-primary text-primary-foreground">
              <Truck className="size-2.5" aria-hidden="true" />
            </span>
            <span>FAST AND SECURE TRANSPORT FLOW</span>
          </motion.div>

          {/* Top-Right Stat Counter Triad */}
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-12">
            {[
              { value: "95", suffix: "%", label: "On-time delivery rate" },
              { value: "80", suffix: "+", label: "Delivery destinations" },
              { value: "24", suffix: "/7", label: "Operational coverage" },
            ].map(({ value, suffix, label }, i) => (
              <motion.div
                key={label}
                className="flex flex-col"
                variants={fadeUp}
                custom={dur(0.1 + i * 0.08)}
              >
                <div className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
                  {value}<span className="text-primary">{suffix}</span>
                </div>
                <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5 max-w-[110px]">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── UNIFIED HERO STAGE: HEADLINE + PROMINENT TRUCK ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">

          {/* Left Column: Headline, Subtitle, Quick Track & CTAs */}
          <motion.div
            className="lg:col-span-5 xl:col-span-5 z-20 flex flex-col justify-center"
            initial="hidden"
            animate="visible"
          >
            {/* Heading */}
            <motion.h1
              id="home-title"
              className="font-sans font-black uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-foreground leading-[1.0] max-w-lg"
              variants={fadeUp}
              custom={dur(0.15)}
            >
              RAPID TRACE,
              <br />
              <span className="text-primary">CLEAR</span> PATHS
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-4 text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed max-w-md"
              variants={fadeUp}
              custom={dur(0.22)}
            >
              Scheduled air and surface linehauls engineered for commercial freight, vital supplies, and time-critical consignments across Northeast India.
            </motion.p>

            {/* Quick AWB Consignment Tracking Input */}
            <motion.form
              action="/track"
              method="get"
              aria-label="Track a consignment by AWB number"
              className="mt-6 flex max-w-md items-center border border-border bg-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-xs"
              variants={fadeUp}
              custom={dur(0.30)}
            >
              <div className="pl-3.5 text-muted-foreground" aria-hidden="true">
                <Search className="size-4 text-primary" />
              </div>
              <input
                name="awb"
                type="text"
                required
                maxLength={40}
                placeholder="Enter AWB number (e.g. TAC-948210)..."
                className="h-11 flex-1 bg-transparent px-3 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 px-4 sm:px-5 bg-primary text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shrink-0 flex items-center gap-1.5 active:scale-[0.97]"
              >
                <span>Track</span>
                <ArrowUpRight className="size-3.5 text-primary-foreground/80" aria-hidden="true" />
              </button>
            </motion.form>

            {/* CTA Actions */}
            <motion.div
              className="mt-5 flex flex-wrap items-center gap-4 sm:gap-5"
              variants={fadeUp}
              custom={dur(0.38)}
            >
              {/* Expandable Dispatch Console Button */}
              <MagneticButton strength={0.15}>
                <button
                  type="button"
                  onClick={() => setConsoleOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.97]"
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

          {/* Right Column: Truck Image with Floating Badges */}
          <motion.div
            className="lg:col-span-7 xl:col-span-7 relative w-full flex justify-center lg:justify-end items-center"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
              {/* Animated Lottie Linehaul Truck (public/lottie/Truck.json) */}
              <HeroLottieTruck />
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
