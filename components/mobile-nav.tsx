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
        <Portal className="top-16" id="mobile-menu">
          <PortalBackdrop onClick={() => setOpen(false)} />
          <div
            className={cn(
              "bg-background duration-200 ease-out fade-in-0 data-[slot=open]:animate-in",
              "size-full border-t border-border p-4 shadow-md"
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="grid gap-y-2">
              {navLinks.map((link: { label: string; href: string }) => (
                <Button
                  asChild
                  className="justify-start text-muted-foreground hover:text-foreground"
                  key={link.label}
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <a href={link.href}>{link.label}</a>
                </Button>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-2 border-t border-border pt-4">
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
