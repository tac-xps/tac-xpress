"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ArrowUpRight, X } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import { Logo } from "@/components/logo"

const links = [
  { href: "/services", label: "Services" },
  { href: "/shipping-guide", label: "Shipping guide" },
  { href: "/about", label: "About us" },
  { href: "/track", label: "Track a shipment" },
]

function subscribeToScroll(callback: () => void) {
  let ticking = false
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback()
        ticking = false
      })
      ticking = true
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  return () => window.removeEventListener("scroll", onScroll)
}

const getScrollSnapshot = () => typeof window !== "undefined" ? window.scrollY : 0
const getServerScrollSnapshot = () => 0

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

function isLinkActive(pathname: string | null, href: string) {
  if (!pathname) return false
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export function NavHeaderShell({
  overlay,
  inverse,
  children,
}: {
  overlay?: boolean
  inverse?: boolean
  children: React.ReactNode
}) {
  const scrollY = useSyncExternalStore(subscribeToScroll, getScrollSnapshot, getServerScrollSnapshot)
  const scrolled = scrollY > 24

  return (
    <header
      data-overlay={overlay ? "true" : undefined}
      data-scrolled={scrolled ? "true" : undefined}
      className={cn(
        "cargo-nav sticky top-0 z-40 border-b transition-colors duration-200",
        inverse && "cargo-inverse",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-xs border-border"
          : overlay
            ? "bg-transparent text-foreground border-transparent"
            : "bg-background text-foreground border-border"
      )}
    >
      <NavScrollProgress scrollY={scrollY} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:bg-background focus:text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:px-3 focus:py-2 focus:text-xs focus:font-mono focus:uppercase focus:tracking-wider"
      >
        Skip to content
      </a>
      <nav aria-label="Main navigation" className="cargo-container flex h-20 items-center justify-between gap-6">
        {children}
      </nav>
    </header>
  )
}

function NavScrollProgress({ scrollY }: { scrollY: number }) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        requestAnimationFrame(() => {
          setProgress(Math.min(Math.max(window.scrollY / scrollHeight, 0), 1))
        })
      }
    }
    updateProgress()
    window.addEventListener("resize", updateProgress, { passive: true })
    return () => window.removeEventListener("resize", updateProgress)
  }, [scrollY])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full bg-primary origin-left z-50 transition-transform duration-75 ease-linear"
      style={{ transform: `scaleX(${progress})` }}
    />
  )
}

export function NavDesktopLinks() {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)

  const activeHref = links.find((link) => isLinkActive(pathname, link.href))?.href
  const currentIndicator = hoveredHref ?? activeHref

  return (
    <div
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

            {currentIndicator === link.href && (
              <motion.span
                layoutId="nav-active-pill"
                className={cn(
                  "absolute -bottom-1 left-0 right-0 h-[2px]",
                  isActive ? "bg-primary" : "bg-foreground/40"
                )}
                transition={shouldReduceMotion ? { duration: 0 } : {
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
  )
}

export function NavMobileSheet() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  return (
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
          <SheetDescription className="sr-only">Site navigation links</SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="flex flex-col flex-1 py-2">
          <AnimatePresence>
            {open &&
              links.map((link, i) => {
                const isActive = isLinkActive(pathname, link.href)
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
                      {isActive && <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />}
                    </Link>
                  </motion.div>
                )
              })}
          </AnimatePresence>
        </nav>

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
  )
}
