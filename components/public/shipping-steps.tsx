"use client"

// Adapted from @tailark-oss/veil-content-2 with an ordered shipping process.
import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useReducedMotion, AnimatePresence } from "motion/react"
import { bookingSteps } from "./shipping-content"
import { VerticalRail, VerticalRailStep } from "./vertical-rail"

gsap.registerPlugin(ScrollTrigger)

export function ShippingSteps() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(-1)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (shouldReduceMotion) return

      const heading = headingRef.current
      const rail = railRef.current
      if (!heading || !rail) return

      // ── Heading children stagger in ──────────────────────────────────────
      gsap.fromTo(
        heading.querySelectorAll(".animate-child"),
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 80%",
            once: true,
          },
        },
      )

      // ── Per-step activation via ScrollTrigger ────────────────────────────
      const stepEls = rail.querySelectorAll("li")
      stepEls.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 65%",
          end: "bottom 30%",
          once: false,
          onEnter: () => setActiveStep(i),
          onLeaveBack: () => setActiveStep(i - 1),
        })
      })
    },
    { scope: sectionRef, dependencies: [shouldReduceMotion] },
  )

  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <section
      ref={sectionRef}
      className="cargo-container cargo-section"
      aria-labelledby="booking-title"
    >
      {/* ── Two-column layout on large screens ──────────────────────────── */}
      <div className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-24 xl:gap-32">

        {/* ── Left: Heading + sticky progress ─────────────────────────── */}
        <div>
          <div ref={headingRef} className="lg:sticky lg:top-32">
            <p className="animate-child cargo-eyebrow mb-5 text-muted-foreground">
              02 / From enquiry to delivery
            </p>
            <h2
              id="booking-title"
              className="animate-child cargo-heading"
            >
              A little preparation.
              <br />A clearer journey.
            </h2>
            <p className="animate-child mt-5 leading-relaxed text-muted-foreground">
              Here is what happens before and after your goods are handed over.
            </p>

            {/* ── Step progress tracker ─────────────────────────────── */}
            <motion.div
              aria-live="polite"
              aria-atomic="true"
              className="animate-child mt-10 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {bookingSteps.map((step, i) => (
                <button
                  key={step.title}
                  aria-label={`Step ${i + 1}: ${step.title}`}
                  className="flex w-full items-center gap-3 text-left group/pill"
                  tabIndex={-1}
                >
                  {/* Progress bar */}
                  <motion.span
                    className="block h-[3px] flex-1 rounded-full origin-left"
                    animate={{
                      backgroundColor:
                        i < activeStep
                          ? "var(--color-primary)"
                          : i === activeStep
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                      scaleX: i === activeStep ? 1 : i < activeStep ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.5, ease }}
                  />

                  {/* Step label */}
                  <motion.span
                    className="font-mono text-[10px] tracking-widest whitespace-nowrap"
                    animate={{
                      color:
                        i === activeStep
                          ? "var(--color-primary)"
                          : "var(--color-muted-foreground)",
                      opacity: i === activeStep ? 1 : i < activeStep ? 0.6 : 0.35,
                    }}
                    transition={{ duration: 0.35 }}
                  >
                    {`0${i + 1}`}
                  </motion.span>
                </button>
              ))}

              {/* Current step name */}
              <div className="pt-3 min-h-[2rem]">
                <AnimatePresence mode="wait">
                  {activeStep >= 0 && (
                    <motion.p
                      key={activeStep}
                      className="text-sm font-medium text-primary"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      {bookingSteps[activeStep]?.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Right: Rail ─────────────────────────────────────────────── */}
        <div ref={railRef} className="mt-16 lg:mt-0">
          <VerticalRail>
            {bookingSteps.map((step, index) => (
              <VerticalRailStep
                key={step.title}
                number={`0${index + 1} / STEP`}
                title={step.title}
                text={step.text}
                isActive={index <= activeStep}
              />
            ))}
          </VerticalRail>
        </div>

      </div>
    </section>
  )
}
