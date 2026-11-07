"use client"

import React from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"

const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Air cargo", href: "/#services" },
      { label: "Surface cargo", href: "/#services" },
      { label: "Linehaul pricing", href: "/#pricing" },
      { label: "Request a quote", href: "/#contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/#about" },
      { label: "Operations desk", href: "/#contact" },
      { label: "Terms & conditions", href: "/terms" },
      { label: "Shipping guide", href: "/#method" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Track a shipment", href: "/track" },
      { label: "Questions & answers", href: "/#faq" },
      { label: "Share feedback", href: "/#feedback" },
      { label: "Corridor method", href: "/#method" },
    ],
  },
]

export function LandingFooter() {
  const handleScrollClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href === "/track" || href === "/?tracking=open") {
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent("tac-track-open"))
        return
      }
    }
    if (
      href.startsWith("/#") &&
      typeof window !== "undefined" &&
      window.location.pathname === "/"
    ) {
      const targetId = href.replace("/#", "")
      const el = document.getElementById(targetId)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        })
        if (window.location.hash !== `#${targetId}`) {
          window.history.pushState(null, "", `#${targetId}`)
        }
      }
    }
  }

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
            <Link href="/" aria-label="TAC-XPRESS home" className="flex items-center">
              <Logo className="text-foreground" iconClassName="size-8 text-primary" />
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
                      onClick={(e) => handleScrollClick(e, link.href)}
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
            <Link href="/terms" className="hover:text-foreground">Terms & conditions</Link>
            <Link href="/signin" className="hover:text-foreground">Staff access</Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none mt-12 select-none overflow-hidden"
        >
          <svg
            viewBox="0 0 1200 160"
            className="w-full h-auto max-h-[16vw] fill-foreground/[0.04]"
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x="50%"
              y="75%"
              textAnchor="middle"
              className="font-mono font-black text-[150px] tracking-tighter"
            >
              TAC-XPRESS
            </text>
          </svg>
        </div>
      </div>
    </footer>
  )
}
