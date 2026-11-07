"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ArrowUpRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/reui/badge"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#method", label: "Shipping guide" },
  { href: "/#about", label: "About us" },
  { href: "/?tracking=open", label: "Track a shipment" },
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

const getScrollSnapshot = () => (typeof window !== "undefined" ? window.scrollY : 0)
const getServerScrollSnapshot = () => 0

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
  const scrolled = scrollY > 12

  return (
    <header
      data-overlay={overlay ? "true" : undefined}
      data-scrolled={scrolled ? "true" : undefined}
      className={cn(
        "cargo-nav sticky top-0 z-40 h-[72px] w-full border-b transition-colors",
        inverse && "cargo-inverse",
        scrolled
          ? "bg-background shadow-2xs border-border"
          : overlay
            ? "bg-transparent text-foreground border-transparent"
            : "bg-background text-foreground border-border/70"
      )}
    >
      <NavScrollProgress scrollY={scrollY} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:bg-background focus:text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:px-3 focus:py-2 focus:text-xs rounded-none"
      >
        Skip to content
      </a>
      <nav aria-label="Main navigation" className="mx-auto flex h-full w-full max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-12">
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
      className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full bg-primary origin-left z-50"
      style={{ transform: `scaleX(${progress})` }}
    />
  )
}

export function NavDesktopLinks() {
  const pathname = usePathname()
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
                "relative block text-sm font-medium transition-colors",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>

            {currentIndicator === link.href && (
              <span
                className={cn(
                  "absolute -bottom-1 left-0 right-0 h-[2px] rounded-none transition-colors",
                  isActive ? "bg-primary" : "bg-foreground/40"
                )}
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
      <SheetContent className="cargo-public flex flex-col justify-between p-0 rounded-none sm:max-w-md">
        <div>
          <SheetHeader className="border-b border-border/80 px-5 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                aria-label="TAC-XPRESS home"
                className="flex items-center rounded-none"
              >
                <Logo className="text-foreground" />
              </Link>
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

          <nav aria-label="Mobile corridor navigation" className="flex flex-col py-2">
            {links.map((link, index) => {
              const isActive = isLinkActive(pathname, link.href)
              const padIndex = String(index + 1).padStart(2, "0")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5 text-sm font-medium border-s-2 transition-colors",
                    isActive
                      ? "border-primary bg-primary/[0.06] text-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground/60 tabular-nums">
                      {padIndex}
                    </span>
                    <span>{link.label}</span>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "size-3.5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground/40"
                    )}
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-border/80 p-5 space-y-3 bg-background">
          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-xs text-muted-foreground font-medium">Appearance</span>
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-none text-xs h-10"
              onClick={() => setOpen(false)}
            >
              <Link href="/?tracking=open">
                <Search className="size-3.5 mr-1.5" aria-hidden="true" />
                Track Consignment
              </Link>
            </Button>
            <Button
              asChild
              className="w-full rounded-none text-xs h-10"
              onClick={() => setOpen(false)}
            >
              <Link href="/#contact">
                Book Freight
                <ArrowUpRight className="size-3.5 ml-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
