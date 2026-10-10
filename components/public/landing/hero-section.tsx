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
import { SectionEyebrow, ProofStrip } from "./section-primitives"
import { LivingCargoLine } from "./living-cargo-line"
import { GridPattern } from "@/components/ui/grid-pattern"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  motionDurations,
  motionEasings,
  motionSprings,
  tactileInteraction,
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
      <GridPattern
        width={32}
        height={32}
        strokeDasharray="4 4"
        className="opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 items-center px-4 sm:px-6 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        {/* Left Column: Editorial Copy & Chapter Origin */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: headlineY }}
          className="flex flex-col lg:col-span-7 xl:col-span-7"
        >
          {/* Eyebrow with Active Pulse Indicator */}
          <motion.div
            initial={shouldReduceMotion ? false : { y: 8 }}
            animate={{ y: 0 }}
            transition={{
              duration: motionDurations.reveal,
              ease: motionEasings.editorial,
            }}
          >
            <SectionEyebrow className="mb-5 sm:mb-6">
              15+ Years Corridor Authority · Delhi ⇄ Northeast
            </SectionEyebrow>
          </motion.div>

          {/* Headline (fluid display with unclipped typography reveal) */}
          <h1
            id="hero-heading"
            style={{ fontSize: "clamp(2.75rem, 5vw + 0.5rem, 5.5rem)" }}
            className="font-heading font-bold tracking-[-0.035em] text-foreground leading-[1.08] text-balance"
          >
            <motion.span
              className="block font-heading font-bold text-foreground"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: motionDurations.hero,
                delay: 0.06,
                ease: motionEasings.hero,
              }}
            >
              Delhi to Northeast.
            </motion.span>
            <motion.span
              className="block font-heading font-bold bg-gradient-to-r from-primary via-primary/90 to-info bg-clip-text text-transparent"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: motionDurations.hero,
                delay: 0.16,
                ease: motionEasings.hero,
              }}
            >
              Delivered.
            </motion.span>
          </h1>

          {/* Supporting Copy & Living Cargo Line */}
          <div className="mt-5 sm:mt-6 space-y-4">
            <LivingCargoLine variant="rule" className="w-24 sm:w-32" />
            <motion.p
              initial={shouldReduceMotion ? false : { y: 10 }}
              animate={{ y: 0 }}
              transition={{
                duration: motionDurations.editorial,
                delay: 0.26,
                ease: motionEasings.editorial,
              }}
              className="max-w-[56ch] text-lead"
            >
              <strong className="font-semibold text-foreground">
                Over 15 years of continuous freight linehaul connecting New Delhi and Northeast India.
              </strong>{" "}
              Scheduled commercial air belly-hold space, arterial surface transport, and statutory Air Waybill (AWB) compliance with optical gate scan audit trails and dedicated operations desk support.
            </motion.p>
          </div>

          {/* Actions with Tactile Micro-Springs */}
          <motion.div
            initial={shouldReduceMotion ? false : { y: 12 }}
            animate={{ y: 0 }}
            transition={{
              duration: motionDurations.reveal,
              delay: 0.34,
              ease: motionEasings.editorial,
            }}
            className="mt-8 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <motion.div {...tactileInteraction}>
              <Button
                asChild
                size="lg"
                className="group rounded-none bg-primary px-6 sm:px-7 font-sans text-sm font-semibold tracking-[-0.01em] text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Link href="#contact">
                  Book a shipment
                  <ArrowUpRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div {...tactileInteraction}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none border-border bg-card px-6 sm:px-7 font-sans text-sm font-medium tracking-[-0.01em] text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Link href="#visibility-chapter">
                  <Search className="mr-2 size-3.5" />
                  Track cargo
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* 15+ Years Verified Corridor Telemetry Strip */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionDurations.reveal,
              delay: 0.42,
              ease: motionEasings.editorial,
            }}
            className="mt-8 pt-6 border-t border-border/70 grid grid-cols-3 gap-4 max-w-lg"
          >
            <div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-primary">15+</span>
              <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mt-0.5 font-medium">Years Active</span>
            </div>
            <div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-info">24–48h</span>
              <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mt-0.5 font-medium">Air SLA</span>
            </div>
            <div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-status-delivered">100%</span>
              <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mt-0.5 font-medium">AWB Custody</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Master Illustration */}
        <div className="lg:col-span-5 xl:col-span-5">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { scale: 0.985, y: 12 }
            }
            animate={{ scale: 1, y: 0 }}
            transition={{
              duration: motionDurations.hero,
              delay: 0.16,
              ease: motionEasings.hero,
            }}
            className="relative"
          >
            {/* Visual Master Container with BorderBeam accent */}
            <div className="relative overflow-hidden border border-border/80 bg-card shadow-sm isolate">
              {/* BorderBeam accent on the card */}
              <BorderBeam
                size={80}
                duration={10}
                colorFrom="var(--color-primary)"
                colorTo="transparent"
                borderWidth={1}
              />

              {/* Master Image with Stable Aspect Ratio Wrapper */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden">
                <motion.div
                  style={
                    shouldReduceMotion
                      ? undefined
                      : { scale: imageScale, y: imageY }
                  }
                  className="relative h-full w-full will-change-transform transform-gpu"
                >
                  <Image
                    src="/images/logistics/hero.webp"
                    alt="Contemporary Asian logistics specialist with modern delivery van on urban avenue at dawn with elevated viaduct and volumetric sunbeams"
                    fill
                    priority
                    className="object-cover select-none"
                    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw"
                  />
                </motion.div>
              </div>

              {/* Architectural Caption Bar — static markup avoids SSR/hydration flicker */}
              <div className="relative z-10 flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-mono text-xs tracking-wider uppercase text-foreground/80">
                <span className="flex items-center gap-2">
                  <span className="inline-block size-2 rounded-none bg-status-delivered" aria-hidden="true" />
                  <span className="font-semibold text-foreground">15+ Years Delhi ⇄ Northeast</span>
                </span>
                <span className="text-muted-foreground font-medium">Daily Scheduled Routes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Docked Hero Baseline: Proof Strip (KPI Stats Row on top + Route Marquee underneath) */}
    <ProofStrip className="relative z-10 border-b-0" />
  </section>
)
}
