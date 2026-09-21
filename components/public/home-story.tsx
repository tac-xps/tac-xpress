"use client"

// Adapted from @tailark-oss/veil-content-1.
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CargoImage } from "./cargo-image"
import { MagneticButton } from "./magnetic-button"
import { motion, useReducedMotion } from "motion/react"

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
      className="cargo-inverse bg-background"
      aria-labelledby="about-title"
    >
      <div className="cargo-container cargo-section grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          className="cargo-story-frame relative overflow-hidden"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <CargoImage asset="warehouse" className="cargo-story-media" />
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Connecting communities / Delhi to Northeast India cargo route
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="cargo-eyebrow mb-5 text-muted-foreground">
            Our route. Our reason.
          </p>
          <h2 id="about-title" className="cargo-heading">
            Connected by more than a destination.
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
            A shop waiting for stock. A family sending a little piece of home.
            Every consignment connects people as well as places.
          </p>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            TAC-XPRESS supports the movement of goods between New Delhi and
            Northeast India, with Imphal at the heart of our story. We start
            with the details that matter: what you are sending, the route, the
            handling and the handover.
          </p>
          <div className="mt-8">
            <MagneticButton strength={0.16} className="w-fit">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none border-current bg-transparent font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:bg-foreground hover:text-background active:scale-[0.97]"
              >
                <Link href={ctaHref}>
                  <span>{ctaText}</span>
                  <ArrowUpRight data-icon="inline-end" className="size-3.5 ml-1.5" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
