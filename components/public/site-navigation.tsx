import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/reui/badge"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NavHeaderShell, NavDesktopLinks, NavMobileSheet } from "./nav-client"

interface SiteNavigationProps {
  overlay?: boolean
  inverse?: boolean
}

export function SiteNavigation({ overlay = false, inverse = false }: SiteNavigationProps) {
  return (
    <NavHeaderShell overlay={overlay} inverse={inverse}>
      {/* Brand logo */}
      <div className="flex items-center">
        <Link
          href="/"
          aria-label="TAC-XPRESS home"
          className="flex items-center rounded-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Logo className="text-foreground" />
        </Link>
      </div>

      {/* Desktop nav links */}
      <NavDesktopLinks />

      {/* Right-side actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex rounded-none text-xs h-9 px-3">
          <Link href="/?tracking=open">Track a shipment</Link>
        </Button>

        <Button asChild size="sm" className="rounded-none text-xs h-9 px-3.5">
          <Link href="/#contact">
            <span>Book Consignment</span>
            <ArrowUpRight className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </Button>

        {/* Mobile menu sheet */}
        <NavMobileSheet />
      </div>
    </NavHeaderShell>
  )
}
