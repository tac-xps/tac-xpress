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
          <form
            action="/track"
            method="get"
            aria-label="Track your shipment"
            className="bg-card p-6 sm:p-8"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="home-awb" className="text-base font-medium">
                  AWB / shipment reference
                </FieldLabel>
                <div className="flex flex-col gap-3 sm:flex-row items-stretch sm:items-center">
                  <Input
                    id="home-awb"
                    name="awb"
                    required
                    maxLength={40}
                    autoComplete="off"
                    placeholder="Enter your AWB number"
                    aria-describedby="home-awb-help"
                    className="cargo-desk-input h-10 min-w-0 flex-1 text-base"
                  />
                  <MagneticButton strength={0.18} className="shrink-0">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto h-10 px-5 rounded-none bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-95 active:scale-[0.98]"
                    >
                      <span>Track shipment</span>
                      <ArrowUpRight data-icon="inline-end" className="size-3.5 ml-1.5" />
                    </Button>
                  </MagneticButton>
                </div>
                <FieldDescription id="home-awb-help" className="text-muted-foreground text-sm">
                  Tracking shows recorded events, rather than a live vehicle
                  location.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
