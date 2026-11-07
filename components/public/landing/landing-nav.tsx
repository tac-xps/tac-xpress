"use client"

import { useEffect, useState, useRef, type MouseEvent } from "react"
import Link from "next/link"
import { ArrowUpRight, Search } from "lucide-react"
import { motion, AnimatePresence, useScroll } from "motion/react"
import { Button } from "@/components/ui/button"
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
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const { scrollYProgress, scrollY } = useScroll()

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false)
        mobileButtonRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mobileMenuOpen])

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
        block: "start",
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
        "sticky top-0 z-50 h-[72px] w-full border-b transition-colors duration-200",
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
            className="rounded-none text-xs h-9 px-4 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors duration-150 shadow-xs hover:shadow-sm active:scale-[0.98]"
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

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none text-xs min-h-11 h-11 px-3"
            onClick={() => setTrackingModalOpen(true)}
          >
            Track
          </Button>
          <button
            ref={mobileButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-11 items-center justify-center border border-border/80 bg-card hover:bg-muted text-foreground transition-colors rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground active:scale-[0.96] cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          >
            <div className="flex flex-col justify-between size-4">
              <span
                className={cn(
                  "h-0.5 w-full bg-foreground transition-transform duration-200 ease-out origin-center",
                  mobileMenuOpen && "translate-y-[7px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-full bg-foreground transition-opacity duration-150 ease-out",
                  mobileMenuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-full bg-foreground transition-transform duration-200 ease-out origin-center",
                  mobileMenuOpen && "-translate-y-[7px] -rotate-45"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Corridor Transit Scroll Progress Micro-Rail */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-border/20 overflow-hidden pointer-events-none">
        <motion.div
          className="h-full bg-primary origin-left"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile Drawer with Staggered Transition */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-b border-border bg-background px-6 py-6 shadow-sm"
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } },
                closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
              }}
              className="flex flex-col gap-2.5"
            >
              {Object.entries(LANDING_NAV_ITEMS).map(([href, item]) => {
                const isActive = activeSection === href
                return (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={(e) => scrollToSection(e, href)}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -8 },
                    }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={cn(
                      "flex items-center justify-between border-s-2 py-2 px-3 text-sm font-sans transition-colors rounded-none",
                      isActive
                        ? "border-primary bg-muted/60 font-semibold text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/30 hover:text-foreground"
                    )}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="size-1.5 bg-primary rounded-none" aria-hidden="true" />
                    )}
                  </motion.a>
                )
              })}
              <div className="flex items-center justify-between border-t border-border/80 pt-3 mt-1">
                <span className="text-xs font-sans text-muted-foreground">Theme Appearance</span>
                <ThemeToggle />
              </div>
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 8 },
                }}
                transition={{ duration: 0.2 }}
                className="pt-2"
              >
                <Button
                  asChild
                  className="h-9 w-full rounded-none font-medium text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
                >
                  <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>
                    Book Consignment
                    <ArrowUpRight className="ml-1.5 size-3.5" />
                  </a>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <TrackShipmentModal
        open={trackingModalOpen}
        onOpenChange={setTrackingModalOpen}
        initialAwb={queryAwb}
      />
    </header>
  )
}
