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

import FlowField from "@/components/kokonutui/flow-field"
import SplitFlapText from "@/components/kokonutui/split-flap-text"
import AttractButton from "@/components/kokonutui/attract-button"

import {
  motionDurations,
  motionEasings,
  motionSprings,
  lineMaskReveal,
} from "@/lib/motion/motion.theme"


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
        className="opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,var(--foreground)_70%,transparent_100%)] z-0"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 items-center px-4 sm:px-6 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column: Editorial Copy & Chapter Origin */}
          <motion.div
            style={{ y: headlineY }}
            className="flex flex-col lg:col-span-7 xl:col-span-7"
          >


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
                  initial={false}
                  animate="visible"
                  variants={lineMaskReveal}
                >
                  Delhi to Northeast.
                </motion.span>
              </span>
              <span className="block py-0.5">
                <SplitFlapText
                  words={[
                    "DELIVERED.",
                    "IMPHAL.",
                    "GUWAHATI.",
                    "SHILLONG.",
                    "DIMAPUR.",
                    "AIZAWL.",
                    "AGARTALA.",
                  ]}
                  interval={3200}
                  className="font-mono text-hero-display font-semibold tracking-tight text-primary uppercase"
                />
              </span>
            </h1>

            {/* Supporting Copy & Living Cargo Line */}
            <div className="mt-5 sm:mt-6 space-y-4">
              <LivingCargoLine variant="rule" className="w-24 sm:w-32" />
              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{
                  duration: motionDurations.editorial,
                  delay: 0.26,
                  ease: motionEasings.editorial,
                }}
                className="space-y-4 max-w-[56ch]"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-l-2 border-primary bg-muted/20 py-1.5 pl-3 pr-2 font-sans text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="size-2 rounded-none bg-status-delivered motion-safe:animate-pulse motion-reduce:opacity-100" aria-hidden="true" />
                    <span className="font-semibold text-primary text-xs">Live Gate:</span>
                  </div>
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Live flight departure board"
                    className="overflow-x-auto max-w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <SplitFlapText
                      words={[
                        "6E-6124 DEL-IMF: DEPARTED",
                        "BCAS GATE 4: CLEAR 100%",
                        "RAMP SLA: 99.4% ON-TIME",
                        "AI-889 IMF-DEL: STAGED"
                      ]}
                      interval={4200}
                      className="text-xs font-mono font-semibold text-foreground"
                    />
                  </div>
                </div>
                <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed tracking-tight text-pretty">
                  Scheduled air cargo and arterial express linehaul connecting Delhi with Northeast India.
                </p>
              </motion.div>
            </div>

            {/* Actions Row with Kokonut UI AttractButton */}
            <motion.div
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{
                duration: motionDurations.reveal,
                delay: 0.34,
                ease: motionEasings.editorial,
              }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <AttractButton
                className="h-11 px-6 rounded-none font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors"
                onClick={() => {
                  const el = document.getElementById("contact")
                  if (el) el.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Book a shipment
                <ArrowUpRight className="size-4 shrink-0" />
              </AttractButton>

              <Button
                asChild
                variant="outline"
                className="h-11 px-5 font-medium tracking-tight hover:bg-accent rounded-none border-border/80 inline-flex items-center"
              >
                <Link href="#visibility-chapter">
                  <Search className="mr-2 size-3.5" />
                  Track cargo
                </Link>
              </Button>
            </motion.div>

            {/* Inline Instant Tracking Lookup Bar */}
            <motion.div
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{
                duration: motionDurations.reveal,
                delay: 0.38,
                ease: motionEasings.editorial,
              }}
              className="mt-6 flex max-w-md items-center h-11 border border-input bg-card p-1 shadow-xs"
              data-slot="quick-track"
            >
              <Search className="ml-2.5 size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Track AWB (e.g. TAC-2409-18472)..."
                className="h-full w-full bg-transparent px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const el = document.getElementById("visibility-chapter")
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              />
              <Button
                size="sm"
                className="rounded-none bg-primary text-primary-foreground font-sans text-xs px-4 h-9 hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  const el = document.getElementById("visibility-chapter")
                  if (el) el.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Track
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
              <div className="relative z-10 flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-sans text-xs text-foreground/80">
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
