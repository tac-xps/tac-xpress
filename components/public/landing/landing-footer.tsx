"use client"

import React from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight, ArrowUp } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { motionDurations, motionEasings } from "@/lib/motion/motion.theme"

const FOOTER_GROUPS = [
  {
    title: "Services",
    links: [
      { label: "Air Cargo", href: "#services" },
      { label: "Surface Cargo", href: "#services" },
      { label: "Door-to-Door", href: "#services" },
      { label: "Freight Quotation", href: "#contact" },
    ],
  },
  {
    title: "Operations",
    links: [
      { label: "Track Consignment", href: "#visibility-chapter" },
      { label: "How It Works", href: "#journey-chapter" },
      { label: "Network Stations", href: "#network" },
      { label: "Custody & Care", href: "#delivery-chapter" },
      { label: "Customer Feedback", href: "#feedback" },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "Conditions of Carriage", href: "/shipping-guide" },
      { label: "Restricted Goods", href: "/shipping-guide" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
]

/**
 * Editorial footer providing brand governance, operations navigation,
 * direct quote CTAs, and statutory registration credentials.
 */
export function LandingFooter() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <footer data-slot="footer" className="relative w-full overflow-hidden border-t border-border/80 bg-surface/50 text-foreground transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: motionDurations.editorial,
          ease: motionEasings.editorial,
        }}
        className="mx-auto w-full max-w-[1360px] px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20"
      >
        {/* Top Editorial Callout */}
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-border/80 pb-10 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 mb-2 font-sans text-xs text-status-delivered font-semibold">
              <span className="size-2 rounded-none bg-status-delivered motion-safe:animate-pulse motion-reduce:opacity-100" />
              <span>All 14 Northeast Corridors Operational / Active Dispatch</span>
            </div>
            <p className="mt-1 text-section text-foreground">
              Move cargo. With clarity.
            </p>
          </div>
          <Button
            asChild
            className="w-fit rounded-none font-semibold tracking-tight text-primary-foreground hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] h-11 px-6"
          >
            <Link href="#contact">
              Start a shipment inquiry
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="TAC-XPRESS home">
              <Logo className="h-7 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground font-normal">
              Direct scheduled linehaul connecting New Delhi and Northeast India through
              thoughtful air and surface freight custody.
            </p>
            <p className="mt-4 font-sans text-xs text-muted-foreground font-medium">
              Your cargo. Our continuous responsibility.
            </p>
          </div>

          {/* Links Columns */}
          {FOOTER_GROUPS.map((grp) => (
            <div key={grp.title}>
              <h4 className="font-sans text-xs text-foreground font-semibold">
                {grp.title}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {grp.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and Metadata */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/80 pt-8 sm:flex-row sm:items-center font-sans text-xs text-muted-foreground">
          <p suppressHydrationWarning>© {new Date().getFullYear()} TAC-XPRESS LOGISTICS LLP. Indian Freight Forwarding &amp; Inter-State Consignment Services.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>GST Registered</span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span>IATA Associated</span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span className="text-primary font-medium">Delhi ⇄ Imphal Corridor</span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: shouldReduceMotion ? "instant" : "smooth",
                })
              }
              className="text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary active:scale-[0.99] disabled:opacity-50"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
