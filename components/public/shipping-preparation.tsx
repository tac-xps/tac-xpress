"use client"

// Adapted from @tailark-oss/veil-content-1.
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { preparation } from "./shipping-content"
import { CargoImage } from "./cargo-image"
import { motion, useReducedMotion } from "motion/react"

export function ShippingPreparation() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="bg-card" aria-labelledby="preparation-title">
      <div className="cargo-container cargo-section">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="cargo-eyebrow mb-5 text-muted-foreground">
              03 / Before the first mile
            </p>
            <h2 id="preparation-title" className="cargo-heading">
              Care begins
              <br />
              with the details.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Strong packaging. Clear labels. The right information. A little
              preparation helps your goods travel well.
            </p>
            <Button asChild variant="link" className="mt-5 px-0 group">
              <Link href="/shipping-guide">
                <span>Read the shipping guide</span>
                <ArrowUpRight
                  data-icon="inline-end"
                  className="size-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <CargoImage asset="packing" className="aspect-[4/3] overflow-hidden" />
          </motion.div>
        </div>

        <motion.dl
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.08,
              },
            },
          }}
        >
          {preparation.map((item) => (
            <motion.div
              key={item.title}
              className="border-t border-border pt-6 transition-colors duration-200 hover:border-primary group"
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <dt className="text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                {item.title}
              </dt>
              <dd className="mt-3 leading-relaxed text-muted-foreground">
                {item.text}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
