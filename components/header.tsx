"use client"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"
import { UserCircle2 } from "lucide-react"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

export const navLinks: { label: string; href: string }[] = [
  { label: "Services", href: "#services" },
  { label: "Track", href: "#track" },
  { label: "Routes", href: "#routes" },
  { label: "About", href: "#about" },
  { label: "Support", href: "#support" },
]

export function Header() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/*
       * Nordic Lagom header — calm, flat, functional.
       * Sticky, full-width, single hairline border-b.
       * No pill, no blur blob, no rounded container.
       * 60 px fixed height gives breathing room; max-w-7xl centers content.
       */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-6 md:px-10">

          {/* Brand — flush left */}
          <a
            href="#"
            className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="TAC-XPRESS home"
          >
            <Logo className="h-[26px]" />
          </a>

          {/* Primary links — horizontally centred */}
          <div className="hidden items-center md:flex" role="navigation" aria-label="Main">
            {navLinks.map((link) => (
              <Button
                asChild
                key={link.label}
                size="sm"
                variant="ghost"
                className="h-[60px] rounded-none border-b-2 border-transparent px-4 text-[13px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-transparent hover:text-foreground"
              >
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </div>

          {/* Right utility actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggleButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAuthOpen(true)}
              className="h-8 gap-1.5 rounded-none px-3 text-[13px] font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <UserCircle2 className="h-[15px] w-[15px]" />
              Sign In
            </Button>
            <Button
              asChild
              size="sm"
              className="h-8 rounded-none px-4 text-[13px] font-medium"
            >
              <Link href="/signin">Admin Portal</Link>
            </Button>
          </div>

          {/* Mobile */}
          <MobileNav />
        </nav>
      </header>
    </>
  )
}
