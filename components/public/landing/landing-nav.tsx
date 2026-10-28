"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react"
import { Button } from "@/components/ui/button"
import { MorphicNavbar, type NavItem } from "@/components/kokonutui/morphic-navbar"
import { cn } from "@/lib/utils"

const LANDING_NAV_ITEMS: Record<string, NavItem> = {
  "#features": { name: "Features" },
  "#method": { name: "Method" },
  "#customers": { name: "Customers" },
  "#pricing": { name: "Pricing" },
  "#company": { name: "Company" },
}

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("#features")
  const [isScrolled, setIsScrolled] = useState(false)

  const { scrollYProgress, scrollY } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 35,
    restDelta: 0.001,
  })

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 12)
    })
  }, [scrollY])

  useEffect(() => {
    const sectionIds = ["features", "method", "customers", "pricing", "company"]
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[72px] w-full border-b transition-colors duration-200",
        isScrolled
          ? "border-border bg-background shadow-xs"
          : "border-border/60 bg-background/95"
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1320px] items-center justify-between px-6 lg:px-12">
        {/* Left: Minimalist Brand Identity */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            aria-label="TAC-XPRESS home"
            className="group flex items-center gap-2.5 focus-visible:outline-none"
          >
            <div className="relative size-3.5 bg-mn-ochre rounded-none overflow-hidden transition-transform duration-200 group-hover:scale-105 active:scale-95 shadow-2xs">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -inset-x-2 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-full motion-reduce:hidden"
              />
            </div>
            <span className="font-sans text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-foreground">
              TAC-XPRESS
            </span>
          </Link>
        </div>

        {/* Center: Shared Layout Motion Navigation */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl">
          <MorphicNavbar
            items={LANDING_NAV_ITEMS}
            defaultPath={activeSection}
            compact={false}
            className="py-0"
          />
        </div>

        {/* Right: Tactical Action CTA */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Button
            asChild
            className="group relative h-8.5 px-4 rounded-none font-medium text-xs bg-primary text-primary-foreground hover:bg-primary-hover transition-colors duration-150 active:scale-[0.98] shadow-2xs overflow-hidden"
          >
            <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>
              <span>Book Consignment</span>
              <ArrowUpRight className="ml-1.5 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
        </div>

        {/* Mobile: Morphing Hamburger-to-X Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden size-9 items-center justify-center border border-border/80 bg-card hover:bg-muted text-foreground transition-colors rounded-none focus-visible:outline-none active:scale-95"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col justify-between size-4">
            <span
              className={cn(
                "h-0.5 w-full bg-foreground transition-transform duration-200 ease-out origin-center",
                mobileMenuOpen && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-full bg-foreground transition-opacity duration-150 ease-out",
                mobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-full bg-foreground transition-transform duration-200 ease-out origin-center",
                mobileMenuOpen && "-translate-y-[7px] -rotate-45"
              )}
            />
          </div>
        </button>
      </div>

      {/* Corridor Transit Scroll Progress Micro-Rail */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-border/20 overflow-hidden pointer-events-none">
        <motion.div
          className="h-full bg-primary origin-left"
          style={{ scaleX: smoothProgress }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile Drawer with Staggered Transition */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-b border-border bg-background/98 backdrop-blur-md px-6 py-6 shadow-sm"
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } },
                closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
              }}
              className="flex flex-col gap-2.5"
            >
              {Object.entries(LANDING_NAV_ITEMS).map(([href, item]) => {
                const isActive = activeSection === href
                return (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={(e) => scrollToSection(e, href)}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -8 },
                    }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={cn(
                      "flex items-center justify-between border-l-2 py-2 px-3 text-sm font-sans transition-colors rounded-none",
                      isActive
                        ? "border-primary bg-muted/60 font-semibold text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/30 hover:text-foreground"
                    )}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="size-1.5 bg-primary rounded-none" aria-hidden="true" />
                    )}
                  </motion.a>
                )
              })}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 8 },
                }}
                transition={{ duration: 0.2 }}
                className="pt-2"
              >
                <Button
                  asChild
                  className="h-9 w-full rounded-none font-medium text-xs bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-2xs"
                >
                  <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>
                    Book Consignment
                    <ArrowUpRight className="ml-1.5 size-3.5" />
                  </a>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
