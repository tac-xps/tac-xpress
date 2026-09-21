"use client"

// Tailark content typography composition; product statement, not a testimonial.
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "./magnetic-button"
import { motion, useReducedMotion } from "motion/react"

export function CargoStatement() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="cargo-accent" aria-labelledby="statement-title">
      <div className="cargo-container cargo-section">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="cargo-eyebrow mb-8">More than what is in the box</p>
          <h2 id="statement-title" className="cargo-statement max-w-6xl">
            Behind every shipment,
            <br className="hidden md:block" />{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              something moves forward.
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col justify-between gap-8 border-t border-transparent pt-8 md:flex-row md:items-center [border-image:linear-gradient(90deg,var(--primary),var(--border)_45%,transparent)1]"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="max-w-xl text-lg leading-relaxed">
            A business gets ready. A home feels closer. Tell us what needs to
            move, and we’ll help you work through the next step.
          </p>
          <MagneticButton strength={0.16} className="w-fit shrink-0">
            <Button
              asChild
              size="lg"
              className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider px-5 active:scale-[0.97] transition-all"
            >
              <Link href="/contact">
                <span>Let’s talk cargo</span>
                <ArrowUpRight data-icon="inline-end" className="size-3.5 ml-1.5" />
              </Link>
            </Button>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
