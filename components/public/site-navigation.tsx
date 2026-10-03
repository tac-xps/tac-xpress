import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { MagneticButton } from "./magnetic-button"
import { NavHeaderShell, NavDesktopLinks, NavMobileSheet } from "./nav-client"

interface SiteNavigationProps {
  overlay?: boolean
  inverse?: boolean
}

export function SiteNavigation({ overlay = false, inverse = false }: SiteNavigationProps) {
  return (
    <NavHeaderShell overlay={overlay} inverse={inverse}>
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" aria-label="TAC-XPRESS home" className="flex items-center">
          <Logo className="h-7" />
        </Link>
      </div>

      {/* Desktop nav links */}
      <NavDesktopLinks />

      {/* Right-side actions */}
      <div className="flex items-center gap-3">
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

        {/* Mobile menu sheet */}
        <NavMobileSheet />
      </div>
    </NavHeaderShell>
  )
}
