"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  AnimatePresence,
} from "motion/react"
import { Menu, ArrowUpRight, Search } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { motionSprings } from "@/lib/motion/motion.theme"

import { MorphicNavbar, type NavItem } from "@/components/kokonutui/morphic-navbar"
import ActionSearchBar, { type CommandItem } from "@/components/kokonutui/action-search-bar"

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#visibility-chapter", label: "Tracking" },
  { href: "#journey-chapter", label: "Process" },
  { href: "#network", label: "Network" },
  { href: "#delivery-chapter", label: "Care" },
  { href: "#feedback", label: "Feedback" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
]

const MORPHIC_NAV_ITEMS: Record<string, NavItem> = {
  "#services": { name: "Services" },
  "#visibility-chapter": { name: "Tracking" },
  "#journey-chapter": { name: "Process" },
  "#network": { name: "Network" },
  "#delivery-chapter": { name: "Care" },
  "#feedback": { name: "Feedback" },
  "#faq": { name: "FAQ" },
  "#contact": { name: "Contact" },
}

const FREIGHT_COMMANDS: CommandItem[] = [
  {
    id: "track-sample-1",
    label: "Track AWB: TAC-2409-18472 (DEL ⇄ IMF)",
    group: "Consignments",
    keywords: ["tracking", "delhi", "imphal", "belly-hold", "awb"],
    href: "#visibility-chapter",
  },
  {
    id: "track-sample-2",
    label: "Track Flight Manifest: 6E-2419 Airborne",
    group: "Consignments",
    keywords: ["flight", "manifest", "indigo", "airborne"],
    href: "#visibility-chapter",
  },
  {
    id: "service-air",
    label: "Air Cargo Specifications (24–48h Gateway Linehaul)",
    group: "Services",
    keywords: ["air", "flight", "belly-hold", "express", "urgent"],
    href: "/services/air-cargo",
  },
  {
    id: "service-surface",
    label: "Surface Cargo Specifications (National Highway Fleet)",
    group: "Services",
    keywords: ["road", "truck", "expressway", "pallet", "multi-ton"],
    href: "/services/surface-cargo",
  },
  {
    id: "calc-freight",
    label: "Volumetric Freight Calculator (Weight to INR)",
    group: "Tools",
    keywords: ["rate", "quote", "cost", "gst", "pricing", "fuel"],
    href: "#visibility-chapter",
  },
  {
    id: "book-shipment",
    label: "Book Consignment Dispatch Manifest",
    group: "Actions",
    keywords: ["book", "dispatch", "order", "ticket", "new"],
    href: "#contact",
  },
  {
    id: "dispatch-hotline",
    label: "Operations Dispatch Desk: +91 98561 73829",
    group: "Contacts",
    keywords: ["phone", "call", "hotline", "support", "help"],
    href: "tel:+919856173829",
  },
]

/**
 * Direction-aware sticky navigation bar with editorial typography,
 * scroll progress indicator, active section tracking,
 * keyboard accessibility, and mobile drawer support.
 */
export function LandingNav() {
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const lastScrollY = useRef(0)

  const { scrollY, scrollYProgress } = useScroll()

  // N1: Smooth scroll progress bar linked to page scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    mass: 0.8,
  })

  // N4: Active section tracking via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.replace("#", ""))
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(`#${id}`)
            }
          })
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

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
      onFocusCapture={() => {
        if (hidden) setHidden(false)
      }}
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300 bg-background",
        scrolled
          ? "border-b border-border shadow-xs"
          : "border-b border-border/60"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="TAC-XPRESS home"
            className="flex items-center gap-2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Logo className="h-7 w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation using Kokonut UI MorphicNavbar */}
        <div className="hidden lg:flex items-center">
          <MorphicNavbar
            items={MORPHIC_NAV_ITEMS}
            defaultPath={activeSection || "#services"}
            compact={false}
            className="py-0 scale-95 origin-center"
          />
        </div>

        {/* Right Action Stack with Kokonut UI ActionSearchBar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden xl:block w-48 2xl:w-60">
            <ActionSearchBar
              items={FREIGHT_COMMANDS}
              placeholder="⌘K Search freight…"
              shortcut={true}
              className="h-[36px] w-full text-xs"
              onSelect={(item) => {
                if (item.href) {
                  if (item.href.startsWith("#")) {
                    const el = document.getElementById(item.href.slice(1))
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  } else {
                    window.location.href = item.href
                  }
                }
              }}
            />
          </div>

          <ThemeSwitcher />

          <Button
            asChild
            variant="ghost"
            size="default"
            className="hidden font-sans text-xs font-medium text-foreground/80 hover:text-foreground sm:inline-flex rounded-none border border-border/60 hover:bg-muted/40 h-10 px-3 items-center"
          >
            <Link href="#visibility-chapter">
              <Search className="mr-1.5 size-3.5" />
              Track
            </Link>
          </Button>

          <div className="hidden sm:inline-block">
            <Button
              asChild
              size="default"
              className="rounded-none bg-primary px-4 font-sans text-xs font-semibold tracking-[-0.01em] text-primary-foreground hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Link href="#contact">
                Book Cargo
                <ArrowUpRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Sheet Menu with N3: Staggered link entrance */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex size-10 items-center justify-center border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l border-border bg-background p-6"
            >
              <SheetHeader className="mb-4 p-0">
                <SheetTitle className="text-left font-sans text-xs font-semibold text-muted-foreground">
                  Navigation
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate to the main sections of the TAC-XPRESS website.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-4">
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(idx, 5) * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "font-sans text-base font-medium transition-colors",
                        activeSection === link.href
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-border/80 pt-4">
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(NAV_LINKS.length, 5) * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Button
                      asChild
                      className="w-full rounded-none bg-primary font-sans text-xs font-semibold text-primary-foreground"
                    >
                      <Link
                        href="#contact"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Book a Shipment
                        <ArrowUpRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* N1: Scroll Progress Indicator: 1px primary bar at header bottom */}
      <motion.div
        style={{
          scaleX: smoothProgress,
          transformOrigin: "left",
        }}
        className="absolute inset-x-0 bottom-0 h-px bg-primary"
      />
    </motion.header>
  )
}
