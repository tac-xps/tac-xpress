"use client"
import { cn } from "@/lib/utils"
import React from "react"
import { Button } from "@/components/ui/button"
import { Portal, PortalBackdrop } from "@/components/portal"
import { navLinks } from "./header"
import { XIcon, MenuIcon } from "lucide-react"
import Link from "next/link"

import { ThemeToggleButton } from "@/components/theme-toggle-button"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2 md:hidden">
      <ThemeToggleButton />
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop onClick={() => setOpen(false)} />
          <div
            className={cn(
              "ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97",
              "size-full p-4"
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="grid gap-y-2">
              {navLinks.map((link: { label: string; href: string }) => (
                <Button
                  asChild
                  className="justify-start"
                  key={link.label}
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <a href={link.href}>{link.label}</a>
                </Button>
              ))}
            </div>
            <div className="mt-12 flex flex-col gap-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Quick Estimate
              </Button>
              <Button className="w-full" asChild onClick={() => setOpen(false)}>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
