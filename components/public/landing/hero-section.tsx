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
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { LivingCargoLine } from "./living-cargo-line"
import {
  motionDurations,
  motionEasings,
  motionSprings,
  tactileInteraction,
} from "@/lib/motion/motion.theme"

/**
 * Hero section delivering the primary commercial value proposition,
 * linehaul metrics, quick quote and tracking CTAs, and master logistics visual.
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
    <EditorialContainer
      ref={containerRef}
      id="cargo-chapter"
      aria-labelledby="hero-heading"
      className="overflow-hidden py-12 sm:py-18 lg:py-24"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
        {/* Left Column: Editorial Copy & Chapter Origin */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: headlineY }}
          className="flex flex-col lg:col-span-5"
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
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2">
              <SectionEyebrow>
                01 Cargo · Dispatch &amp; Linehaul Network
              </SectionEyebrow>
              <span className="relative flex size-2 motion-reduce:hidden" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-delivered opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-status-delivered" />
              </span>
            </div>
          </motion.div>

          {/* Headline (fluid --type-display with line-mask reveal) */}
          <h1
            id="hero-heading"
            style={{ fontSize: "var(--type-display)" }}
            className="font-heading font-semibold tracking-[-0.035em] text-foreground leading-[1.04] text-balance"
          >
            <span className="block overflow-hidden py-1">
              <motion.span
                className="block"
                initial={shouldReduceMotion ? false : { y: "115%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: motionDurations.hero,
                  delay: 0.06,
                  ease: motionEasings.hero,
                }}
              >
                Move cargo.
              </motion.span>
            </span>
            <span className="block overflow-hidden py-1">
              <motion.span
                className="block text-muted-foreground/90"
                initial={shouldReduceMotion ? false : { y: "115%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: motionDurations.hero,
                  delay: 0.16,
                  ease: motionEasings.hero,
                }}
              >
                With clarity.
              </motion.span>
            </span>
          </h1>

          {/* Supporting Copy & Living Cargo Line */}
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <LivingCargoLine variant="rule" className="w-24" />
            <motion.p
              initial={shouldReduceMotion ? false : { y: 10 }}
              animate={{ y: 0 }}
              transition={{
                duration: motionDurations.editorial,
                delay: 0.26,
                ease: motionEasings.editorial,
              }}
              className="max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground font-normal text-pretty"
            >
              Book, move and track shipments through one straightforward logistics experience.
              Engineered for seamless air linehaul and highway freight.
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
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <motion.div {...tactileInteraction}>
              <Button
                asChild
                size="lg"
                className="group rounded-none bg-primary px-5 sm:px-6 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                className="rounded-none border-border bg-card px-5 sm:px-6 font-mono text-xs font-medium uppercase tracking-wider text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Link href="#visibility-chapter">
                  <Search className="mr-2 size-3.5" />
                  Track cargo
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Master Illustration (Clean, Minimalist Architectural Frame) */}
        <div className="lg:col-span-7">
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
            {/* Visual Master Container */}
            <div className="relative overflow-hidden border border-border/80 bg-card shadow-sm">
              {/* Master Image with Subtle Scroll Parallax */}
              <motion.div
                style={
                  shouldReduceMotion
                    ? undefined
                    : { scale: imageScale, y: imageY }
                }
                className="relative aspect-4/3 w-full overflow-hidden"
              >
                <Image
                  src="/images/logistics/hero.webp"
                  alt="Contemporary Asian logistics specialist with modern delivery van on urban avenue at dawn with elevated viaduct and volumetric sunbeams"
                  fill
                  priority
                  className="object-cover select-none"
                  sizes="(min-width: 1280px) 760px, (min-width: 1024px) 58vw, 100vw"
                />
              </motion.div>

              {/* Architectural Caption Bar */}
              <div className="flex items-center justify-between border-t border-border/80 bg-background px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="inline-block size-1.5 rounded-none bg-status-delivered" aria-hidden="true" />
                  Metropolitan Arterial Gateway · Active Dispatch
                </span>
                <span className="hidden sm:inline">Custodial Chain Verified</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </EditorialContainer>
  )
}
