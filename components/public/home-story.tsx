"use client"

// Adapted from @tailark-oss/veil-content-1.
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarehouseLottieDelivery } from "./warehouse-lottie-delivery"
import { MagneticButton } from "./magnetic-button"
import { motion, useReducedMotion } from "motion/react"
import { AnimatedCounter } from "@/components/ui/animated-counter"

interface HomeStoryProps {
  ctaHref?: string
  ctaText?: string
}

export function HomeStory({
  ctaHref = "/about",
  ctaText = "Meet TAC-XPRESS",
}: HomeStoryProps = {}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden bg-background"
      aria-labelledby="about-title"
    >
      {/* Subtle tinted background wash */}
      <div
        className="pointer-events-none absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="cargo-container cargo-section grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left — visual */}
        <motion.div
          className="cargo-story-frame relative overflow-hidden"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Accent top border on the media frame */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-primary via-accent to-secondary"
            aria-hidden="true"
          />
          <WarehouseLottieDelivery />
          <p className="mt-4 font-mono text-xs text-muted-foreground/70">
            Connecting communities / Delhi to Northeast India cargo route
          </p>
        </motion.div>

        {/* Right — copy */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          {/* Eyebrow — primary accent with left rule */}
          <div className="mb-6 flex items-center gap-3">
            <div
              className="h-4 w-[3px] shrink-0 bg-primary"
              aria-hidden="true"
            />
            <p
              className="text-eyebrow text-primary"
            >
              Our route. Our reason.
            </p>
          </div>

          {/* Heading — two-tone color */}
          <h2
            id="about-title"
            className="text-section"
          >
            <span className="text-foreground">Connected by more</span>
            <br />
            <span className="text-muted-foreground">
              than a destination.
            </span>
          </h2>

          {/* Body copy — slightly better contrast */}
          <p className="text-lead mt-7">
            A shop waiting for stock. A family sending a little piece of home.
            Every consignment connects people as well as places.
          </p>
          <p className="text-body-editorial mt-5">
            <strong className="font-semibold text-foreground">Dedicated arterial linehaul. </strong>
            TAC-XPRESS coordinates scheduled cargo movement between New Delhi consolidation terminals and Northeast India regional stations, anchored at our Imphal distribution hub.
          </p>
          <p className="text-body-editorial mt-3">
            <strong className="font-semibold text-foreground">Operational accountability. </strong>
            We manage every consignment with strict verification: volumetric profile intake, statutory AWB documentation, sealed transit custody, and single-custody handover.
          </p>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-3 gap-0 border border-border/60">
            <div className="flex flex-col gap-1 px-5 py-4 border-r border-border/60">
              <span className="font-mono text-xl font-bold text-foreground">
                <AnimatedCounter value={2000} suffix="+" stiffness={160} damping={26} />
              </span>
              <span className="text-xs text-muted-foreground leading-snug">
                Consignments moved
              </span>
            </div>
            <div className="flex flex-col gap-1 px-5 py-4 border-r border-border/60">
              <span className="font-mono text-xl font-bold text-foreground">
                <AnimatedCounter value={48} suffix=" hrs" stiffness={200} damping={28} />
              </span>
              <span className="text-xs text-muted-foreground leading-snug">
                Average transit
              </span>
            </div>
            <div className="flex flex-col gap-1 px-5 py-4">
              <span className="font-mono text-xl font-bold text-foreground">
                NEI
              </span>
              <span className="text-xs text-muted-foreground leading-snug">
                Routes covered
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <MagneticButton strength={0.16} className="w-fit">
              <Button
                asChild
                size="lg"
                className="group rounded-none border border-primary/60 bg-primary/10 font-mono text-xs font-semibold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.97]"
              >
                <Link href={ctaHref}>
                  <span>{ctaText}</span>
                  <ArrowUpRight
                    data-icon="inline-end"
                    className="size-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
