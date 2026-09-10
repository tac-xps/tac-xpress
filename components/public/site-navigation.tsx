"use client"

import Link from "next/link"
import { useState, useSyncExternalStore } from "react"
import { Menu, ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import { ThemeSwitcher } from "@/components/theme-switcher"

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
const getScrollSnapshot = () => window.scrollY > 24
// Keep navigation opaque until hydration, including when JavaScript is disabled.
const getServerScrollSnapshot = () => true
interface SiteNavigationProps {
  overlay?: boolean
}

export function SiteNavigation({ overlay = false }: SiteNavigationProps) {
  const [open, setOpen] = useState(false)
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot
  )
  return (
    <header
      className="cargo-nav cargo-inverse sticky top-0 z-40 border-b"
      data-overlay={overlay}
      data-scrolled={scrolled}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:p-3"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main navigation"
        className="cargo-container flex h-20 items-center justify-between gap-4"
      >
        <Link href="/" aria-label="TAC-XPRESS home">
          <Logo className="h-7" />
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button asChild className="hidden px-4 sm:inline-flex">
            <Link href="/contact">
              Let’s talk cargo <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="cargo-public">
              <SheetHeader>
                <SheetTitle>TAC-XPRESS</SheetTitle>
                <SheetDescription>
                  Ship, track, and get support.
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-2 px-4"
              >
                {[
                  ...links,
                  { href: "/contact", label: "Contact our team" },
                ].map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setOpen(false)}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
