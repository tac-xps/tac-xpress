"use client"

// Tailark contact composition with official shadcn Field, Input and Button.
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { MagneticButton } from "./magnetic-button"
import { TrackDialogForm } from "./track-dialog-form"
import { motion, useReducedMotion } from "motion/react"

export function ShipmentDesk() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="shipment-desk"
      className="cargo-accent scroll-mt-20"
      aria-labelledby="desk-title"
    >
      <div className="cargo-container grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-20 lg:py-20">
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="cargo-eyebrow mb-4 text-primary">Already on its way?</p>
          <h2 id="desk-title" className="cargo-heading">
            A number.
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              A clearer picture.
            </span>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
            Check your shipment’s recorded progress with the AWB number on your
            booking receipt. No account needed.
          </p>
        </motion.div>

        <motion.div
          className="relative p-[1px] bg-gradient-to-br from-primary/35 via-border to-primary/15 shadow-sm transition-shadow focus-within:shadow-md focus-within:from-primary/50"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <TrackDialogForm variant="desk" />
        </motion.div>
      </div>
    </section>
  )
}
