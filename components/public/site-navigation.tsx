"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useSyncExternalStore, useRef, useEffect } from "react"
import { Menu, ArrowUpRight, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import { ThemeSwitcher } from "@/components/theme-switcher"
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from "motion/react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { MagneticButton } from "./magnetic-button"

const links = [
  { href: "/services", label: "Services" },
  { href: "/shipping-guide", label: "Shipping guide" },
  { href: "/about", label: "About us" },
  { href: "/track", label: "Track a shipment" },
]

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true })
  return () => window.removeEventListener("scroll", callback)
}
const getScrollSnapshot = () => typeof window !== "undefined" && window.scrollY > 24
const getServerScrollSnapshot = () => false

interface SiteNavigationProps {
  overlay?: boolean
  inverse?: boolean
}

// Confident arrival easing curve for motion transitions
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export function SiteNavigation({ overlay = false, inverse = false }: SiteNavigationProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)

  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const linksContainerRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot
  )

  // ── GSAP: Entrance Timeline Orchestration ────────────────────────────────
  useGSAP(
    () => {
      if (shouldReduceMotion) return

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.55 }
      )
        .fromTo(
          linksContainerRef.current ? Array.from(linksContainerRef.current.children) : [],
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 },
          "-=0.35"
        )
        .fromTo(
          actionsRef.current,
          { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: 0.5 },
          "-=0.3"
        )
    },
    { scope: headerRef }
  )

  // ── GSAP: Smooth Scroll Progress Tracking ────────────────────────────────
  useEffect(() => {
    const bar = progressBarRef.current
    if (!bar) return

    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1)
      gsap.to(bar, {
        scaleX: progress,
        duration: 0.15,
        ease: "none",
        overwrite: "auto",
      })
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true })
    updateScrollProgress()

    return () => {
      window.removeEventListener("scroll", updateScrollProgress)
    }
  }, [])

  const activeHref = links.find(
    (link) => pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href + "/"))
  )?.href

  const currentIndicator = hoveredHref ?? activeHref

  return (
    <header
      ref={headerRef}
      className={cn(
        "cargo-nav sticky top-0 z-40 border-b transition-colors duration-200",
        inverse && "cargo-inverse",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-xs border-border"
          : overlay
            ? "bg-transparent text-foreground border-transparent"
            : "bg-background text-foreground border-border"
      )}
      data-overlay={overlay}
      data-scrolled={scrolled}
    >
      {/* Scroll progress line at header bottom edge */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full bg-primary origin-left scale-x-0 z-50"
      />

      {/* Skip link — accessible for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:bg-background focus:text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:px-3 focus:py-2 focus:text-xs focus:font-mono focus:uppercase focus:tracking-wider"
      >
        Skip to content
      </a>

      <nav
        aria-label="Main navigation"
        className="cargo-container flex h-20 items-center justify-between gap-6"
      >
        {/* Logo — animated entry */}
        <div ref={logoRef} className="flex items-center">
          <Link href="/" aria-label="TAC-XPRESS home" className="flex items-center">
            <Logo className="h-7" />
          </Link>
        </div>

        {/* Desktop nav links — Motion sliding underline + GSAP staggered entry */}
        <div
          ref={linksContainerRef}
          className="hidden items-center gap-8 text-sm lg:flex"
          onMouseLeave={() => setHoveredHref(null)}
        >
          {links.map((link) => {
            const isActive = activeHref === link.href
            return (
              <div
                key={link.href}
                className="relative py-1"
                onMouseEnter={() => setHoveredHref(link.href)}
                onFocus={() => setHoveredHref(link.href)}
                onBlur={() => setHoveredHref(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative block font-mono text-xs font-medium uppercase tracking-wider transition-colors duration-150",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>

                {/* Motion: Liquid sliding underline indicator */}
                {currentIndicator === link.href && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className={cn(
                      "absolute -bottom-1 left-0 right-0 h-[2px]",
                      isActive ? "bg-primary" : "bg-foreground/40"
                    )}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Right-side actions — GSAP Magnetic Button + Theme Switcher */}
        <div ref={actionsRef} className="flex items-center gap-3">
          <ThemeSwitcher />

          {/* Magnetic CTA button for desktop */}
          <MagneticButton strength={0.2} className="hidden sm:inline-block">
            <Button
              asChild
              className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider px-4 transition-all duration-150 active:scale-[0.97]"
            >
              <Link href="/contact">
                Book a shipment
                <ArrowUpRight data-icon="inline-end" className="size-3.5 ml-1.5" />
              </Link>
            </Button>
          </MagneticButton>

          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground hover:bg-muted"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="cargo-public flex flex-col gap-0 p-0">
              {/* Mobile sheet header */}
              <SheetHeader className="border-b border-border px-5 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" onClick={() => setOpen(false)} aria-label="TAC-XPRESS home">
                    <Logo className="h-6" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground -mr-2"
                    onClick={() => setOpen(false)}
                    aria-label="Close navigation"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation links
                </SheetDescription>
              </SheetHeader>

              {/* Mobile nav links — Motion cascading entrance */}
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col flex-1 py-2"
              >
                <AnimatePresence>
                  {open &&
                    links.map((link, i) => {
                      const isActive = pathname === link.href
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.28,
                            delay: shouldReduceMotion ? 0 : 0.04 * i,
                            ease: EASE_OUT_EXPO,
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center justify-between px-5 py-3.5 font-mono text-sm font-medium uppercase tracking-wider border-b border-border/50 transition-colors",
                              isActive
                                ? "text-primary bg-primary/[0.04]"
                                : "text-foreground hover:bg-muted/60"
                            )}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <span>{link.label}</span>
                            {isActive && (
                              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                            )}
                          </Link>
                        </motion.div>
                      )
                    })}
                </AnimatePresence>
              </nav>

              {/* Mobile CTA */}
              <motion.div
                className="border-t border-border p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : 0.18,
                  ease: EASE_OUT_EXPO,
                }}
              >
                <Button
                  asChild
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold uppercase tracking-wider h-12 active:scale-[0.98] transition-transform"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/contact">
                    Book a shipment
                    <ArrowUpRight className="size-3.5 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
