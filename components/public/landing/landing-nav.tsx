"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react"
import { Menu, ArrowUpRight, Search } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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

/**
 * Direction-aware sticky navigation bar with editorial typography,
 * keyboard accessibility, and mobile drawer support.
 */
export function LandingNav() {
  const headerRef = useRef<HTMLElement>(null)
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

    const hasFocus =
      headerRef.current != null &&
      typeof document !== "undefined" &&
      headerRef.current.contains(document.activeElement)

    if (latest > previous && latest > 120 && !mobileMenuOpen && !hasFocus) {
      setHidden(true)
    } else if (latest < previous) {
      setHidden(false)
    }
  })

  return (
    <motion.header
      ref={headerRef}
      animate={{
        y: hidden && !mobileMenuOpen ? "-100%" : "0%",
      }}
      transition={motionSprings.springEditorial}
      onFocusCapture={() => { if (hidden) setHidden(false) }}
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
          aria-label="Main navigation"
          className="hidden items-center space-x-1 lg:flex"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              className="relative px-3 py-1.5 font-sans text-sm font-medium text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
              className="hidden font-sans text-xs font-medium text-foreground/80 hover:text-foreground sm:inline-flex"
            >
              <Link href="#visibility-chapter">
                <Search className="mr-1.5 size-3.5" />
                Track
              </Link>
            </Button>
          </motion.div>

          <div className="hidden sm:inline-block">
            <motion.div {...tactileInteraction}>
              <Button
                asChild
                size="sm"
                className="rounded-none bg-primary px-4 font-sans text-xs font-semibold tracking-[-0.01em] text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Link href="#contact">
                  Book Cargo
                  <ArrowUpRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Sheet Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex size-9 items-center justify-center border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border bg-background p-6">
              <SheetHeader className="p-0 mb-4">
                <SheetTitle className="text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Navigation
                </SheetTitle>
              </SheetHeader>
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
