"use client"

// Adapted from @tailark-oss/veil-content-2 with an ordered shipping process.
import { useRef, useState, useEffect } from "react"
import { motion, useReducedMotion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { bookingSteps } from "./shipping-content"
import { VerticalRail, VerticalRailStep } from "./vertical-rail"

export function ShippingSteps() {
  const headingRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const handleScroll = () => {
      const stepEls = rail.querySelectorAll<HTMLLIElement>("li")
      if (!stepEls.length) return

      // Ergonomic focal point: 42% down the viewport, exactly where user reads content
      const focalY = window.innerHeight * 0.42

      let bestIndex = 0
      let minDistance = Infinity

      stepEls.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        // Check distance of step from focal line
        const distance = Math.abs(rect.top - focalY)
        if (rect.top <= focalY + 140 && distance < minDistance) {
          minDistance = distance
          bestIndex = index
        }
      })

      setActiveStep(bestIndex)
    }

    // Run on initial render
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const ease = [0.16, 1, 0.3, 1] as const
  const textVariant = {
    hidden: { opacity: 1, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" as const },
    },
  }

  const scrollToStep = (index: number) => {
    setActiveStep(index)
    const stepEls = railRef.current?.querySelectorAll<HTMLLIElement>("li")
    if (stepEls?.[index]) {
      stepEls[index].scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "center" })
    }
  }

  return (
    <section
      className="cargo-container cargo-section"
      aria-labelledby="booking-title"
    >
      {/* ── Two-column layout on large screens ──────────────────────────── */}
      <div className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-24 xl:gap-32">

        {/* ── Left: Heading + sticky progress ─────────────────────────── */}
        <div>
          <motion.div
            ref={headingRef}
            className="lg:sticky lg:top-32"
            initial={false}
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.p
              variants={textVariant}
              className="cargo-eyebrow mb-5 text-muted-foreground"
            >
              02 / From enquiry to delivery
            </motion.p>
            <motion.h2
              variants={textVariant}
              id="booking-title"
              className="cargo-heading"
            >
              A little preparation.
              <br />A clearer journey.
            </motion.h2>
            <motion.p
              variants={textVariant}
              className="mt-5 leading-relaxed text-muted-foreground"
            >
              Here is what happens before and after your goods are handed over.
            </motion.p>

            {/* ── Step progress tracker ─────────────────────────────── */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="animate-child mt-10 space-y-3"
            >
              {bookingSteps.map((step, i) => {
                const isCurrent = i === activeStep
                const isPassed = i < activeStep

                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => scrollToStep(i)}
                    aria-label={`Step ${i + 1}: ${step.title}`}
                    className="flex w-full items-center gap-3 text-left group/pill cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-1 transition-opacity hover:opacity-90"
                  >
                    {/* Progress bar */}
                    <span
                      className={cn(
                        "block h-[3px] flex-1 rounded-full origin-left transition-all duration-300",
                        isCurrent
                          ? "bg-primary scale-x-100"
                          : isPassed
                            ? "bg-primary/50 scale-x-100"
                            : "bg-border scale-x-50"
                      )}
                    />

                    {/* Step label */}
                    <span
                      className={cn(
                        "font-mono text-xs tracking-widest whitespace-nowrap transition-colors duration-300",
                        isCurrent
                          ? "text-primary font-bold"
                          : isPassed
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground"
                      )}
                    >
                      {`0${i + 1}`}
                    </span>
                  </button>
                )
              })}

              {/* Current step name */}
              <div className="pt-3 min-h-[2.5rem]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeStep}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease }}
                    className="text-sm font-semibold text-primary"
                  >
                    <span className="font-mono text-xs uppercase tracking-wider mr-2 text-foreground">
                      Step 0{activeStep + 1} •
                    </span>
                    {bookingSteps[activeStep]?.title}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
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
                isActive={index === activeStep}
                isCompleted={index < activeStep}
              />
            ))}
          </VerticalRail>
        </div>

      </div>
    </section>
  )
}
