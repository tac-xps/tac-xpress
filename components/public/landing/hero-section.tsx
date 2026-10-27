"use client"

import React, { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react"
import { ArrowUpRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProofStats } from "./section-primitives"
import { LivingCargoLine } from "./living-cargo-line"
import { GridPattern } from "@/components/ui/grid-pattern"
import { BorderBeam } from "@/components/ui/border-beam"
import SplitFlapText from "@/components/kokonutui/split-flap-text"
import FlowField from "@/components/kokonutui/flow-field"
import {
  motionDurations,
  motionEasings,
  motionSprings,
  lineMaskReveal,
} from "@/lib/motion/motion.theme"

const LINEHAUL_DEPARTURES = [
  "DEL-IMF: ON TIME",
  "IMF-DEL: BOARDING",
  "DEL-IMF: GATE SCAN",
  "IMF-DEL: AIRBORNE",
  "DEL-IMF: IN TRANSIT",
]

/**
 * Hero section delivering the primary commercial value proposition,
 * linehaul metrics, quick quote and tracking CTAs, master logistics visual,
 * and grounded baseline telemetry proof strip (KPI stats + route marquee).
 */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Scroll-linked editorial zoom and parallax on scroll exit
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Smooth scroll interpolation via calibrated spring
  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  // Subtle Nordic scroll zoom & vertical translation
  const imageScale = useTransform(smoothProgress, [0, 1], [1.0, 1.045])
  const imageY = useTransform(smoothProgress, [0, 1], [0, 14])
  const headlineY = useTransform(smoothProgress, [0, 1], [0, -14])

  return (
    <section
      ref={containerRef}
      id="cargo-chapter"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-between overflow-hidden border-b border-border/80 bg-background text-foreground transition-colors"
    >
      {/* Background High-Altitude Jet Stream Corridor Flow Field */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-15 dark:opacity-25 text-muted-foreground">
        <FlowField density={0.28} speed={0.55} interactive={false} />
      </div>

      <GridPattern
        width={32}
        height={32}
        strokeDasharray="4 4"
        className="opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] z-0"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 items-center px-4 sm:px-6 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column: Editorial Copy & Chapter Origin */}
          <motion.div
            style={shouldReduceMotion ? undefined : { y: headlineY }}
            className="flex flex-col lg:col-span-7 xl:col-span-7"
          >
            {/* Split-Flap Departure Flight Schedule Board & Tactical Modality Badges */}
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-primary rounded-none">
                  Express
                </span>
                <span className="inline-flex items-center border border-border/90 bg-muted/50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-foreground rounded-none">
                  Surface
                </span>
              </div>
              <div className="inline-flex w-fit items-center gap-2.5 rounded-none border border-border/90 bg-card/95 px-3 py-1 shadow-xs backdrop-blur-xs transition-colors hover:border-foreground/30">
                <span className="relative flex size-2 shrink-0 rounded-none">
                  <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-none bg-status-delivered opacity-75" />
                  <span className="relative inline-flex size-2 rounded-none bg-status-delivered" />
                </span>
                <span className="shrink-0 font-mono text-xs font-bold text-muted-foreground uppercase">
                  Linehaul
                </span>
                <span className="text-border/80 select-none font-mono" aria-hidden="true">
                  /
                </span>
                <SplitFlapText
                  words={LINEHAUL_DEPARTURES}
                  interval={3500}
                  className="text-xs sm:text-[13px] font-mono font-bold tracking-normal text-foreground"
                  tileClassName="bg-primary text-primary-foreground border border-primary/40"
                />
              </div>
            </div>

            {/* Headline (fluid display with unclipped typography reveal) */}
            <h1
              id="hero-heading"
              className="text-hero-display text-foreground"
            >
              <span className="sr-only">Move cargo. With clarity. </span>
              <span className="block overflow-hidden py-0.5">
                <motion.span
                  className="block font-medium text-foreground lg:whitespace-nowrap"
                  custom={0}
                  initial={shouldReduceMotion ? false : "hidden"}
                  animate="visible"
                  variants={lineMaskReveal}
                >
                  Delhi to Northeast.
                </motion.span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <motion.span
                  className="block font-extrabold text-primary"
                  custom={1}
                  initial={shouldReduceMotion ? false : "hidden"}
                  animate="visible"
                  variants={lineMaskReveal}
                >
                  Delivered.
                </motion.span>
              </span>
            </h1>

            {/* Supporting Copy & Living Cargo Line */}
            <div className="mt-5 sm:mt-6 space-y-4">
              <LivingCargoLine variant="rule" className="w-24 sm:w-32" />
              <motion.div
                initial={shouldReduceMotion ? false : { y: 10 }}
                animate={{ y: 0 }}
                transition={{
                  duration: motionDurations.editorial,
                  delay: 0.26,
                  ease: motionEasings.editorial,
                }}
                className="space-y-3 max-w-[56ch]"
              >
                <p className="text-base sm:text-lg font-medium text-foreground leading-snug tracking-tight text-pretty">
                  Scheduled freight linehaul connecting New Delhi and Northeast India.
                </p>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 border border-border/80 bg-muted/40 px-2.5 py-0.5 text-foreground font-semibold rounded-none">
                    <span className="size-1.5 bg-primary rounded-none" aria-hidden="true" />
                    DEL ⇄ IMF / GAU
                  </span>
                  <span className="border border-border/60 bg-muted/20 px-2 py-0.5 text-xs rounded-none">
                    COMMERCIAL AIR BELLY-HOLD
                  </span>
                  <span className="border border-border/60 bg-muted/20 px-2 py-0.5 text-xs rounded-none">
                    STATUTORY AWB
                  </span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal text-pretty">
                  Commercial air belly-hold space and arterial surface transport with statutory Air Waybill compliance, optical gate scan verification, and dedicated dispatch support.
                </p>
              </motion.div>
            </div>

            {/* Actions Row */}
            <motion.div
              initial={shouldReduceMotion ? false : { y: 12 }}
              animate={{ y: 0 }}
              transition={{
                duration: motionDurations.reveal,
                delay: 0.34,
                ease: motionEasings.editorial,
              }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="group font-medium tracking-tight text-primary-foreground hover:bg-primary/90"
              >
                <Link href="#contact">
                  Book a shipment
                  <ArrowUpRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-medium tracking-tight hover:bg-accent"
              >
                <Link href="#visibility-chapter">
                  <Search className="mr-2 size-3.5" />
                  Track cargo
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column: Master Cinematic Visual Container (lg:col-span-5) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="relative overflow-hidden border border-border/80 bg-card shadow-sm isolate">
              <BorderBeam
                size={80}
                duration={10}
                colorFrom="var(--color-primary)"
                colorTo="transparent"
                borderWidth={1}
              />

              {/* Master Cinematic Video Wrapper (4:3) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/10">
                <motion.div
                  style={
                    shouldReduceMotion
                      ? undefined
                      : { scale: imageScale, y: imageY }
                  }
                  className="relative h-full w-full transform-gpu"
                >
                  <Image
                    src="/images/logistics/hero.webp"
                    alt="TAC Express commercial logistics corridor connecting Delhi and Northeast India"
                    fill
                    priority
                    className="object-cover select-none"
                    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw"
                  />
                </motion.div>
              </div>

              {/* Restrained Architectural Baseline Tag */}
              <div className="relative z-10 flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-sans text-xs uppercase text-foreground/80">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-none bg-status-delivered" aria-hidden="true" />
                  <span className="font-medium text-foreground">DEL ⇄ Northeast Linehaul</span>
                </span>
                <span className="text-muted-foreground font-medium">Daily Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Docked Hero Baseline: Proof Stats (4-column operational KPI metrics) */}
      <ProofStats className="relative z-10 border-b-0" />
    </section>
  )
}
