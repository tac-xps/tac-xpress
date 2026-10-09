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
import { motionDurations, motionEasings, motionSprings } from "@/lib/motion/motion.theme"

/**
 * Editorial brand narrative statement section delivering mission closure
 * with scroll-settling hero imagery and final cargo rule resolution.
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
      className="py-16 sm:py-28 lg:py-36"
    >
      <div ref={containerRef} className="mx-auto max-w-4xl text-center">
        {/* Eyebrow & Final Cargo Line Endpoint */}
        <div className="flex flex-col items-center space-y-4">
          <SectionEyebrow className="justify-center">
            Narrative Closure · Our Commitment
          </SectionEyebrow>

          {/* Living Cargo Line Final Endpoint */}
          <div className="w-32 py-2">
            <LivingCargoLine progress={lineProgress} variant="rule" />
          </div>

          {/* Masked Line-Level Editorial Headline (Phases 2 & 3) */}
          <h2
            id="brand-statement-heading"
            style={{ fontSize: "var(--type-display)" }}
            className="font-heading font-medium tracking-tight text-foreground leading-[1.03] text-balance"
          >
            <span className="block overflow-hidden py-0.5">
              <motion.span
                className="block"
                initial={shouldReduceMotion ? false : { y: "110%", opacity: 0.05 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: motionDurations.statement,
                  delay: 0.1,
                  ease: motionEasings.editorial,
                }}
              >
                Every shipment
              </motion.span>
            </span>
            <span className="block overflow-hidden py-0.5">
              <motion.span
                className="block text-muted-foreground/90"
                initial={shouldReduceMotion ? false : { y: "110%", opacity: 0.05 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: motionDurations.statement,
                  delay: 0.25,
                  ease: motionEasings.editorial,
                }}
              >
                moves something forward.
              </motion.span>
            </span>
          </h2>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: motionDurations.editorial,
              delay: 0.4,
              ease: motionEasings.editorial,
            }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground font-normal text-pretty"
          >
            Behind every consignment is an essential connection: a business fulfilling an
            urgent contract, a regional clinic awaiting diagnostic inventory, or a family
            receiving something indispensable. We honor that trust with deliberate
            operational rigor.
          </motion.p>
        </div>

        {/* Centerpiece Visual Frame (Phase 1 to 4) */}
        <div className="relative mx-auto mt-14 overflow-hidden border border-border/80 bg-card shadow-sm sm:mt-18">
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : { scale: imageScale, y: imageY }
            }
            className="relative aspect-16/10 max-h-[540px] w-full overflow-hidden"
          >
            <Image
              src="/images/logistics/Brand-and-Care.webp"
              alt="Contemporary Asian logistics specialist delivering critical consignment with care at commercial entrance"
              fill
              className="object-cover select-none"
              sizes="(min-width: 1024px) 896px, 100vw"
            />
          </motion.div>
          <div className="flex items-center justify-between border-t border-border/80 bg-background/95 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Custodial Discipline Complete</span>
            <span>Clarity · Dependability · Care</span>
          </div>
        </div>
      </div>
    </EditorialContainer>
  )
}
