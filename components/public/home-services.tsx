"use client"

// Adapted from @tailark-oss/veil-content-2; official shadcn actions.
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { services } from "./shipping-content"
import { CargoImage, type CargoAsset } from "./cargo-image"
import { motion, useReducedMotion } from "motion/react"

const cards = [
  ...services.map((service) => ({
    title: service.name,
    description: service.description,
    href: `/services/${service.slug}`,
    action: `Explore ${service.name.toLowerCase()}`,
    asset: (service.slug === "air-cargo" ? "air" : "surface") as CargoAsset,
  })),
  {
    title: "Ready for the journey",
    description:
      "Standardized multi-wall corrugated packaging, dual barcode labeling, and statutory GST e-way compliance before terminal handover.",
    href: "/shipping-guide",
    action: "Read the shipping guide",
    asset: "packing" as CargoAsset,
  },
]

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export function HomeServices() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="services"
      className="scroll-mt-20 bg-card"
      aria-labelledby="services-title"
    >
      <div className="cargo-container cargo-section">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow mb-5 text-muted-foreground">
              01 / Ways to move
            </p>
            <h2 id="services-title" className="text-section">
              Your cargo.
              <br />
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                The right journey.
              </span>
            </h2>
          </div>
          <p className="text-body-editorial max-w-sm">
            <strong className="font-semibold text-foreground">Calibrated routing modes. </strong>
            Across dedicated flight belly-holds or engineered linehaul road networks, we optimize corridor transit by payload weight, dimension, and arrival urgency.
          </p>
        </div>

        <motion.div
          className="mt-12 grid gap-12 md:grid-cols-3 md:gap-7"
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.1,
              },
            },
          }}
        >
          {cards.map((card, index) => (
            <motion.article
              key={card.href}
              className="cargo-service flex min-w-0 flex-col items-start rounded-none transition-shadow"
              variants={{
                hidden: { opacity: 1, y: 0 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.5,
                    ease: EASE_OUT_EXPO,
                  },
                },
              }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Link
                href={card.href}
                className="w-full overflow-hidden"
                tabIndex={-1}
                aria-hidden="true"
              >
                <CargoImage
                  asset={card.asset}
                  className="cargo-service-media transition-transform duration-300 hover:scale-[1.03]"
                  sizes="(min-width: 1440px) 420px, (min-width: 768px) 31vw, 100vw"
                />
              </Link>
              <div className="mt-6 flex w-full items-center justify-between gap-4 border-b border-transparent pb-5 [border-image:linear-gradient(90deg,var(--primary),var(--border)_60%,transparent)1]">
                <h3 className="text-2xl font-medium tracking-tight">
                  {card.title}
                </h3>
                <span className="font-mono text-sm text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <p className="text-body-editorial mt-5">
                {card.description}
              </p>
              <Button
                asChild
                variant="link"
                className="mt-5 px-0 group"
              >
                <Link href={card.href}>
                  <span>{card.action}</span>
                  <ArrowUpRight
                    data-icon="inline-end"
                    className="size-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
