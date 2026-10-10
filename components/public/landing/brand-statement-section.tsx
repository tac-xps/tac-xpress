"use client"

import React, { useRef } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react"
import { SectionEyebrow, EditorialContainer } from "./section-primitives"
import { LivingCargoLine } from "./living-cargo-line"
import { Marquee } from "@/components/ui/marquee"
import { BorderBeam } from "@/components/ui/border-beam"
import { GridPattern } from "@/components/ui/grid-pattern"
import { motionDurations, motionEasings, motionSprings } from "@/lib/motion/motion.theme"
import { cn } from "@/lib/utils"

/** Brand pillar words scrolled as a marquee across the statement section */
const BRAND_PILLARS = [
  "Clarity",
  "Dependability",
  "Care",
  "Precision",
  "Trust",
  "Integrity",
  "Speed",
  "Accountability",
]

/**
 * Editorial brand narrative statement section delivering mission closure
 * with scroll-settling hero imagery, brand pillar marquee, and final cargo rule resolution.
 */
export function BrandStatementSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, motionSprings.springScroll)

  // Phase 1 -> Phase 4: Image gently settles from scale 1.02 to 1.00
  const imageScale = useTransform(smoothProgress, [0.15, 0.6], [1.02, 1.0])
  const imageY = useTransform(smoothProgress, [0.15, 0.6], [6, 0])

  // Phase 5: Living Cargo Line reaches the final endpoint and quietly resolves
  const lineProgress = useTransform(smoothProgress, [0.2, 0.55], [0, 1])

  return (
    <EditorialContainer
      id="brand"
      aria-labelledby="brand-statement-heading"
      className="relative overflow-hidden py-14 sm:py-20 lg:py-24 bg-card/40 border-y border-border/80"
    >
      <GridPattern
        width={32}
        height={32}
        strokeDasharray="4 4"
        className="opacity-15 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />
      <div ref={containerRef} className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Eyebrow & Final Cargo Line Endpoint */}
        <div className="flex flex-col items-center">
          <SectionEyebrow className="justify-center mb-3">
            Brand · The Meaning Behind Cargo
          </SectionEyebrow>

          {/* Living Cargo Line Final Endpoint */}
          <div className="w-28 py-1 mb-4">
            <LivingCargoLine progress={lineProgress} variant="rule" />
          </div>

          {/* Editorial Headline — unclipped typography with reliable reveal */}
          <h2
            id="brand-statement-heading"
            className="text-display text-foreground text-center"
          >
            <motion.span
              className="block font-heading font-bold tracking-tight text-foreground"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: motionDurations.statement,
                ease: motionEasings.editorial,
              }}
            >
              Every shipment
            </motion.span>
            <motion.span
              className="block font-heading font-medium text-foreground/80"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: motionDurations.statement,
                delay: 0.12,
                ease: motionEasings.editorial,
              }}
            >
              moves something forward.
            </motion.span>
          </h2>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: motionDurations.editorial,
              delay: 0.2,
              ease: motionEasings.editorial,
            }}
            className="mx-auto mt-5 max-w-[54ch] text-lead text-center"
          >
            <strong className="font-semibold text-foreground">Operational purpose. </strong>
            Behind every consignment is essential enterprise: commercial supply continuity, critical regional inventory, and verified delivery custody.
          </motion.p>
        </div>

        {/* Brand Pillar Marquee — scrolling operational values */}
        <div className="w-full max-w-full overflow-hidden mt-9 mb-3 border-y border-border/80 bg-background/50" aria-hidden="true">
          <Marquee
            pauseOnHover
            className="[--duration:28s] [--gap:0rem] py-0"
          >
            {BRAND_PILLARS.map((pillar, idx) => (
              <div
                key={pillar}
                className="flex items-center gap-6 px-8 py-3 font-sans text-xs uppercase tracking-[0.24em] font-semibold text-muted-foreground"
              >
                <span
                  className={cn(
                    "inline-block size-1.5 rounded-none",
                    idx % 3 === 0
                      ? "bg-primary"
                      : idx % 3 === 1
                      ? "bg-info"
                      : "bg-status-delivered"
                  )}
                  aria-hidden="true"
                />
                <span>{pillar}</span>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Centerpiece Visual Frame (brand.webp) */}
        <div className="relative mx-auto mt-8 overflow-hidden border border-border/80 bg-card shadow-sm sm:mt-10">
          <BorderBeam size={120} duration={14} colorFrom="var(--color-primary)" colorTo="transparent" borderWidth={1} />
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : { scale: imageScale, y: imageY }
            }
            className="relative aspect-16/10 max-h-[540px] w-full overflow-hidden"
          >
            <Image
              src="/images/logistics/brand.webp"
              alt="Contemporary Asian logistics specialist delivering critical consignment with care at commercial entrance"
              fill
              className="object-cover select-none"
              sizes="(min-width: 1024px) 896px, 100vw"
            />
          </motion.div>
          <div className="flex items-center justify-between border-t border-border/80 bg-background px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <span className="font-medium">Custodial Discipline</span>
            <span className="font-medium">Clarity · Dependability · Care</span>
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
