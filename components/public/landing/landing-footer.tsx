"use client"

import React from "react"
import Link from "next/link"

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Method", href: "#method" },
      { label: "Tracked Linehaul", href: "#method" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Operations Desk", href: "#contact" },
      { label: "Corridor Stations", href: "#method" },
      { label: "Terms of Carriage", href: "/shipping-guide" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Articles & Updates", href: "#company" },
      { label: "AWB Tracking", href: "/track" },
      { label: "GST Tax Invoicing", href: "/dashboard/invoices" },
      { label: "FAQs", href: "#faq" },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer
      data-slot="footer"
      className="relative w-full overflow-hidden border-t border-border bg-background pt-16 pb-12 text-foreground"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        {/* Main Footer Navigation Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 pb-16 border-b border-border">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="size-4 bg-mn-ochre rounded-none" />
              <span className="font-mono text-base font-bold tracking-tight text-foreground">
                TAC-XPRESS
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground font-normal">
              Direct commercial air express and arterial highway linehaul operating
              exclusively between New Delhi and Imphal.
            </p>
            <div className="mt-4 flex flex-col gap-1 text-xs font-mono text-muted-foreground">
              <span>Gate Hotline: +91 98561 73829</span>
              <span>Operations: ops@tac-xpress.com</span>
            </div>
          </div>

          {/* 3 Nav Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-sans font-semibold text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                {col.links.map((link) => (
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

        {/* Bottom Metadata */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-muted-foreground">
          <p>© 2026 TAC-XPRESS LOGISTICS LLP. New Delhi ⇄ Imphal Corridor Only.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>GST Registered</span>
            <span>BCAS Compliant</span>
            <Link href="/terms" className="hover:text-foreground">Privacy & Terms</Link>
          </div>
        </div>

        {/* Giant Watermark Logo Spanning Across Bottom (Exact Atomist Signature) */}
        <div
          aria-hidden="true"
          className="pointer-events-none mt-12 select-none text-center font-mono text-[14vw] font-black leading-none tracking-tighter text-foreground/[0.04] whitespace-nowrap overflow-hidden"
        >
          TAC-XPRESS
        </div>
      </div>
    </footer>
  )
}
