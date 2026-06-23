"use client"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { useScroll } from "@/hooks/use-scroll"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"
import { UserCircle2 } from "lucide-react"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

export const navLinks: { label: string; href: string }[] = [
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Track",
    href: "#track",
  },
  {
    label: "Routes",
    href: "#routes",
  },
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Support",
    href: "#support",
  },
]

export function Header() {
  const scrolled = useScroll(10)
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <header
        className={cn(
          "sticky top-0 z-50 mx-auto w-full max-w-7xl border-b border-border/30 bg-sidebar/80 text-sidebar-foreground backdrop-blur-xl transition-all duration-300 ease-out md:mt-4 md:rounded-lg md:border",
          {
            "md:top-4 md:shadow-lg": scrolled,
          }
        )}
      >
        <nav
          className={cn(
            "flex h-16 w-full items-center justify-between px-4 md:h-20 md:px-8 md:transition-all md:ease-out",
            {
              "md:h-16 md:px-6": scrolled,
            }
          )}
        >
          <a className="rounded-sm p-2 hover:bg-muted" href="#">
            <Logo className="h-8" />
          </a>
          <div className="hidden items-center gap-6 md:flex">
            <div className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Button
                  asChild
                  key={link.label}
                  size="sm"
                  variant="ghost"
                  className="text-sm tracking-wider text-foreground/70 uppercase hover:bg-muted hover:text-foreground"
                >
                  <a href={link.href}>{link.label}</a>
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggleButton />

              {/* Customer Sign In — opens AuthModal */}
              <Button
                variant="outline"
                onClick={() => setAuthOpen(true)}
                className="gap-1.5 border-primary/40 text-xs tracking-wider text-primary uppercase shadow-sm shadow-primary/10 hover:bg-primary/10"
              >
                <UserCircle2 className="h-3.5 w-3.5" />
                Sign In
              </Button>
              {/* Admin Login */}
              <Button
                asChild
                className="bg-primary text-xs tracking-wider text-primary-foreground uppercase hover:bg-primary/90"
              >
                <Link href="/login">Admin</Link>
              </Button>
            </div>
          </div>
          <MobileNav />
        </nav>
      </header>
    </>
  )
}
