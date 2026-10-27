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

/** Operational freight specifications scrolled across the statement section */
const OPERATIONAL_SPECIFICATIONS = [
  "BCAS Cargo Gate 4 Cleared",
  "IATA 5000 Volumetric Ratio",
  "DG Class UN 3480 Verified",
  "DEL Runway 28 Linehaul",
  "Tulihal Apron Handover",
  "Statutory 10-Digit AWB",
  "18% GST E-Way Reconciled",
  "Digital POD Geotag Audit",
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
      as="div"
      aria-labelledby="brand-statement-heading"
      className="dark relative overflow-hidden border-y border-border bg-background py-12 text-foreground transition-colors sm:py-16 lg:py-20"
    >
      <GridPattern
        width={32}
        height={32}
        strokeDasharray="4 4"
        className="opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,var(--foreground)_70%,transparent_100%)] text-muted-foreground"
      />
      <div ref={containerRef} className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Living Cargo Line Endpoint */}
        <div className="flex flex-col items-center">
          {/* Living Cargo Line Final Endpoint */}
          <div className="w-32 py-1 mb-8">
            <LivingCargoLine progress={lineProgress} variant="rule" />
          </div>

          {/* Editorial Headline: unclipped typography with reliable reveal */}
          <h2
            id="brand-statement-heading"
            className="text-display text-foreground text-center"
          >
            <motion.span
              className="block font-heading font-semibold tracking-tight text-foreground"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: motionDurations.statement,
                ease: motionEasings.editorial,
              }}
            >
              Every shipment.
            </motion.span>
            <motion.span
              className="block font-heading font-semibold text-primary"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: motionDurations.statement,
                delay: 0.12,
                ease: motionEasings.editorial,
              }}
            >
              Moves something forward.
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: motionDurations.editorial,
              delay: 0.2,
              ease: motionEasings.editorial,
            }}
            className="mx-auto mt-5 max-w-[54ch] text-lead text-center text-muted-foreground leading-relaxed font-normal text-pretty"
          >
            Behind every consignment is essential enterprise: commercial continuity and verified delivery custody.
          </motion.p>
        </div>

        {/* Operational Specifications Marquee: verified statutory compliance standards */}
        <div
          data-slot="specifications-ticker"
          className="w-full max-w-full overflow-hidden mt-10 mb-4 border-y border-border bg-card/60"
          aria-hidden="true"
        >
          <Marquee
            pauseOnHover
            className="[--duration:28s] [--gap:0rem] py-0"
          >
            {OPERATIONAL_SPECIFICATIONS.map((spec, idx) => (
              <div
                key={spec}
                className="flex items-center gap-6 px-8 py-3 font-sans text-xs font-medium text-muted-foreground"
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
                <span>{spec}</span>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Centerpiece Visual Frame (brand.webp) */}
        <div className="relative mx-auto mt-8 overflow-hidden border border-border bg-card shadow-md sm:mt-10">
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
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5 font-sans text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Custodial Discipline</span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Clarity</span>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              <span>Dependability</span>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              <span>Care</span>
            </div>
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
