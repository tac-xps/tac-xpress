"use client"

import { useEffect, useState, type MouseEvent } from "react"
import Link from "next/link"
import { ArrowUpRight, Menu, Search } from "lucide-react"
import { motion, useScroll } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/reui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MorphicNavbar, type NavItem } from "@/components/kokonutui/morphic-navbar"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { TrackShipmentModal } from "@/components/public/track-shipment-modal"
import { cn } from "@/lib/utils"

const LANDING_NAV_ITEMS: Record<string, NavItem> = {
  "#features": { name: "Features" },
  "#services": { name: "Services" },
  "#method": { name: "Method" },
  "#pricing": { name: "Pricing" },
  "#about": { name: "About" },
}

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [trackingModalOpen, setTrackingModalOpen] = useState(() => {
    if (typeof window === "undefined") return false
    const params = new URLSearchParams(window.location.search)
    return Boolean(
      params.get("tracking") === "open" ||
      params.get("track") === "open" ||
      params.get("awb")
    )
  })
  const [queryAwb] = useState(() => {
    if (typeof window === "undefined") return ""
    return new URLSearchParams(window.location.search).get("awb") || ""
  })
  const [activeSection, setActiveSection] = useState("#features")
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress, scrollY } = useScroll()

  useEffect(() => {
    const handleTrackEvent = () => setTrackingModalOpen(true)
    window.addEventListener("tac-track-open", handleTrackEvent)
    return () => window.removeEventListener("tac-track-open", handleTrackEvent)
  }, [])

  useEffect(
    () => scrollY.on("change", (latest) => setIsScrolled(latest > 12)),
    [scrollY]
  )

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) {
          const targetId = visible.target.id
          if (targetId === "hero") {
            setActiveSection("#features")
          } else if (targetId === "fleet" || targetId === "services") {
            setActiveSection("#services")
          } else if (targetId === "shipping-guide" || targetId === "method") {
            setActiveSection("#method")
          } else if (targetId === "story" || targetId === "about") {
            setActiveSection("#about")
          } else {
            setActiveSection(`#${targetId}`)
          }
        }
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.25] }
    )
    for (const id of [
      "hero",
      "features",
      "services",
      "fleet",
      "method",
      "shipping-guide",
      "pricing",
      "about",
      "story",
    ]) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault()
    setMobileMenuOpen(false)
    const target = document.getElementById(href.slice(1))
    if (target) {
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      })
      if (window.location.hash !== href) {
        window.history.pushState(null, "", href)
      }
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[72px] w-full border-b transition-all duration-200",
        isScrolled
          ? "border-border/80 bg-background/90 backdrop-blur-md shadow-2xs"
          : "border-border/60 bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Brand identity */}
        <div className="flex items-center">
          <Link
            href="/"
            aria-label="TAC-XPRESS home"
            className="flex items-center rounded-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Logo className="text-foreground" />
          </Link>
        </div>

        {/* Morphic Navigation Centered Track */}
        <div className="hidden max-w-xl flex-1 justify-center lg:flex">
          <MorphicNavbar
            items={LANDING_NAV_ITEMS}
            defaultPath={activeSection}
            compact={false}
            className="py-0"
          />
        </div>

        {/* Desktop Action Cluster */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none text-xs h-9 px-3.5 gap-1.5 border-border/80 hover:bg-muted/70 hover:border-border text-foreground/85 hover:text-foreground transition-colors duration-150 shadow-2xs"
            onClick={() => setTrackingModalOpen(true)}
          >
            <Search className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span>Track a shipment</span>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-none text-xs h-9 px-4 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-150 shadow-xs hover:shadow-sm active:scale-[0.98]"
          >
            <a
              href="#contact"
              onClick={(event) => scrollToSection(event, "#contact")}
            >
              <span>Book Consignment</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>

        {/* Mobile Navigation Trigger & Drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none text-xs h-8 px-2.5"
              onClick={() => setTrackingModalOpen(true)}
            >
              Track
            </Button>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className="lg:hidden rounded-none"
                aria-label="Open navigation"
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent className="cargo-public flex flex-col justify-between p-0 rounded-none sm:max-w-md">
            <div>
              <SheetHeader className="border-b border-border/80 px-5 py-4">
                <div className="flex items-center justify-between">
                  <Logo className="text-foreground" />
                  <Badge variant="primary-light" size="xs" className="rounded-none font-mono">
                    EXPRESS LINEHAUL
                  </Badge>
                </div>
                <SheetTitle className="sr-only">Corridor Navigation</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-1">
                  Air and surface cargo between New Delhi and Imphal.
                </SheetDescription>
              </SheetHeader>

              {/* Corridor Route Telemetry Header */}
              <div className="border-b border-border/60 bg-muted/30 px-5 py-2.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Route</span>
                  <span className="text-xs font-medium text-foreground">DEL (IGI/Okhla) ⇄ IMF (Bir Tikendrajit)</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground mt-1">
                  <span>Transit SLA</span>
                  <span className="text-xs font-medium text-foreground">Air 24-48h | Surface 4-7d</span>
                </div>
              </div>

              {/* Mobile In-Page Route Links */}
              <nav
                aria-label="Mobile corridor navigation"
                className="flex flex-col py-2"
              >
                {Object.entries(LANDING_NAV_ITEMS).map(([href, item], index) => {
                  const isActive = activeSection === href
                  const padIndex = String(index + 1).padStart(2, "0")
                  return (
                    <a
                      key={href}
                      href={href}
                      onClick={(event) => scrollToSection(event, href)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "flex items-center justify-between px-5 py-3.5 text-sm transition-colors border-s-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        isActive
                          ? "border-primary bg-primary/[0.06] text-foreground font-semibold"
                          : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground/60 tabular-nums">
                          {padIndex}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <ArrowUpRight
                        className={cn(
                          "size-3.5 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground/40"
                        )}
                        aria-hidden="true"
                      />
                    </a>
                  )
                })}
              </nav>
            </div>

            {/* Mobile Sheet Footer Actions */}
            <div className="border-t border-border/80 p-5 space-y-3 bg-background">
              <div className="flex items-center justify-between py-1 text-sm">
                <span className="text-xs text-muted-foreground font-medium">Appearance</span>
                <ThemeToggle />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-none text-xs h-10"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setTrackingModalOpen(true)
                  }}
                >
                  <Search className="size-3.5 mr-1.5" aria-hidden="true" />
                  Track Consignment
                </Button>
                <Button
                  asChild
                  className="w-full rounded-none text-xs h-10"
                >
                  <a
                    href="#contact"
                    onClick={(event) => scrollToSection(event, "#contact")}
                  >
                    Book Freight
                    <ArrowUpRight className="size-3.5 ml-1" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Top Scroll Progress Line */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden bg-border/20"
        aria-hidden="true"
      >
        <motion.div
          className="h-full origin-left bg-primary"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      <TrackShipmentModal
        open={trackingModalOpen}
        onOpenChange={setTrackingModalOpen}
        initialAwb={queryAwb}
      />
    </header>
  )
}
