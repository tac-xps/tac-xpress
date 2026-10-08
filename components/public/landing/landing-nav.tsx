"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react"
import { Menu, X, ArrowUpRight, Search } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motionSprings, tactileInteraction } from "@/lib/motion/motion.theme"

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#visibility-chapter", label: "Tracking" },
  { href: "#journey-chapter", label: "Process" },
  { href: "#network", label: "Network" },
  { href: "#delivery-chapter", label: "Care" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const lastScrollY = useRef(0)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current
    lastScrollY.current = latest

    setScrolled(latest > 24)

    if (shouldReduceMotion) {
      setHidden(false)
      return
    }

    if (latest > previous && latest > 120 && !mobileMenuOpen) {
      setHidden(true)
    } else if (latest < previous) {
      setHidden(false)
    }
  })

  return (
    <motion.header
      animate={{
        y: hidden && !mobileMenuOpen ? "-100%" : "0%",
      }}
      transition={motionSprings.springEditorial}
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border/80 bg-background/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="TAC-XPRESS home"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Logo className="h-7 w-auto" />
          </Link>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground lg:inline-block">
            Cargo &amp; Freight Desk
          </span>
        </div>

        {/* Desktop Editorial Navigation Links with Shared Layout Hover Pill */}
        <nav
          aria-label="Main Navigation"
          className="hidden items-center space-x-1 lg:flex"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              className="relative px-3 py-1.5 font-sans text-sm font-normal text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {hoveredLink === link.href && (
                <motion.span
                  layoutId="navHoverPill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute inset-0 -z-10 rounded-none bg-muted/70"
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Stack with Tactile Micro-Springs */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          <motion.div {...tactileInteraction}>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              <Link href="#visibility-chapter">
                <Search className="mr-1.5 size-3.5" />
                Track
              </Link>
            </Button>
          </motion.div>

          <motion.div {...tactileInteraction}>
            <Button
              asChild
              size="sm"
              className="rounded-none bg-primary px-4 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Link href="#contact">
                Book Cargo
                <ArrowUpRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </motion.div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-background px-6 py-6 lg:hidden"
          >
            <div className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-base font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border/80 pt-4">
                <Button
                  asChild
                  className="w-full rounded-none bg-primary font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground"
                >
                  <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                    Book a Shipment
                    <ArrowUpRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
