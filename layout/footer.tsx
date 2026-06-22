"use client"

import {
  CustomGlobeIcon,
  MailCustomIcon,
  MapMarkerIcon,
} from "@/components/icons/landing-icons"
import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="mt-auto flex w-full flex-col items-center justify-center border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-stretch justify-between self-stretch pt-16 pb-12 md:flex-row">
        <div className="flex flex-col items-start justify-start gap-8 p-4 md:w-1/3 md:p-8">
          <div className="flex items-center justify-start gap-3 self-stretch">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Home"
            >
              <Logo className="h-8 text-2xl" />
            </Link>
          </div>
          <div className="text-sm font-medium">
            <h1 className="mb-2 text-lg font-bold">Logistics without limits</h1>
            <p className="max-w-sm leading-relaxed text-muted-foreground">
              We create resilient supply chains that connect businesses. We
              handle air, surface, and critical cargo operations end-to-end.
            </p>
          </div>

          <div className="mt-4 flex items-start justify-start gap-6">
            <CustomGlobeIcon
              className="w-5 text-muted-foreground transition-colors hover:text-primary"
              aria-hidden="true"
            />
            <MailCustomIcon
              className="w-5 text-muted-foreground transition-colors hover:text-primary"
              aria-hidden="true"
            />
            <MapMarkerIcon
              className="w-5 text-muted-foreground transition-colors hover:text-primary"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col flex-wrap items-start justify-start gap-6 self-stretch p-4 sm:flex-row sm:justify-between md:mt-0 md:flex-1 md:gap-8 md:p-8">
          <div className="flex min-w-40 flex-1 flex-col items-start justify-start gap-4">
            <div className="self-stretch text-sm font-bold tracking-widest text-foreground uppercase">
              Operations
            </div>
            <div className="flex flex-col items-start justify-end gap-3 font-mono">
              <Link
                href="/operations/air-cargo"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Air Cargo
              </Link>
              <Link
                href="/operations/surface-cargo"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Surface Cargo
              </Link>
              <Link
                href="/operations/live-tracking"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Live Tracking
              </Link>
              <Link
                href="/operations/network-map"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Network Map
              </Link>
              <Link
                href="/operations/warehouse"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Warehouse
              </Link>
            </div>
          </div>

          <div className="flex min-w-40 flex-1 flex-col items-start justify-start gap-4">
            <div className="text-sm font-bold tracking-widest text-foreground uppercase">
              Company
            </div>
            <div className="flex flex-col items-start justify-center gap-3 font-mono">
              <Link
                href="/company/about"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                About Us
              </Link>
              <Link
                href="/company/fleet"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Our Fleet
              </Link>
              <Link
                href="/company/careers"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Careers
              </Link>
              <Link
                href="/company/investors"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Investors
              </Link>
              <Link
                href="/company/contact"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex min-w-40 flex-1 flex-col items-start justify-start gap-4">
            <div className="text-sm font-bold tracking-widest text-foreground uppercase">
              Resources
            </div>
            <div className="flex flex-col items-start justify-center gap-3 font-mono">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/resources/api"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                API Reference
              </Link>
              <Link
                href="/resources/docs"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Documentation
              </Link>
              <Link
                href="/resources/webhooks"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Webhooks
              </Link>
              <Link
                href="/resources/support"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-between border-t border-border bg-background/50 px-8 py-6 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TAC-XPRESS Logistics. All rights
          reserved.
        </p>
        <div className="mt-4 flex gap-4 md:mt-0">
          <span className="cursor-default text-sm text-muted-foreground">
            Privacy Policy
          </span>
          <span className="cursor-default text-sm text-muted-foreground">
            Status
          </span>
        </div>
      </div>
    </footer>
  )
}
