"use client"

import React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

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
      { label: "Track Consignment", href: "#tracking" },
      { label: "How It Works", href: "#process" },
      { label: "Network Stations", href: "#network" },
      { label: "Custody & Care", href: "#care" },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "Conditions of Carriage", href: "/shipping-guide" },
      { label: "Restricted Goods", href: "/shipping-guide" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-border/80 bg-surface/50 text-foreground transition-colors">
      <div className="mx-auto w-full max-w-[1360px] px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20">
        {/* Top Editorial Callout */}
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-border/80 pb-10 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Freight Commitment
            </span>
            <p
              style={{ fontSize: "var(--type-section)" }}
              className="mt-2 font-heading font-medium tracking-tight text-balance text-foreground leading-[1.06]"
            >
              Move cargo.
              <br />
              <span className="text-muted-foreground/80">With clarity.</span>
            </p>
          </div>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              size="lg"
              className="w-fit rounded-none bg-primary px-6 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              <Link href="#contact">
                Start a shipment inquiry
                <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </Button>
          </motion.div>
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
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Your cargo. Our continuous responsibility.
            </p>
          </div>

          {/* Links Columns */}
          {FOOTER_GROUPS.map((grp) => (
            <div key={grp.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-foreground">
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
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/80 pt-8 sm:flex-row sm:items-center font-mono text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TAC-XPRESS LOGISTICS LLP. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>GST Registered</span>
            <span>·</span>
            <span>IATA Associated</span>
            <span>·</span>
            <span>Delhi ⇄ Imphal Corridor</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
