"use client"

import React, { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

interface Chapter {
  id: string
  number: string
  title: string
}

const CHAPTERS: Chapter[] = [
  { id: "cargo-chapter", number: "01", title: "Cargo" },
  { id: "visibility-chapter", number: "02", title: "Visibility" },
  { id: "journey-chapter", number: "03", title: "Journey" },
  { id: "delivery-chapter", number: "04", title: "Delivery" },
]

/**
 * TAC Journey Rail — Restrained 4-Stage Narrative Navigation
 * Replaces developer/debug markers with an editorial logistics rail:
 * 01 Cargo ● │ 02 Visibility ○ │ 03 Journey ○ │ 04 Delivery ○
 *
 * Desktop only (hidden on mobile).
 * Only the active chapter receives Quiet Indigo emphasis.
 */
export function ChapterRail() {
  const [activeChapter, setActiveChapter] = useState<string>("cargo-chapter")
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          setActiveChapter(CHAPTERS[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToChapter = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" })
    }
  }

  return (
    <nav
      aria-label="Chapter Rail"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-6 2xl:left-10 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-start select-none min-[1600px]:flex"
    >
      <div className="relative flex flex-col items-start space-y-6">
        {/* Continuous Background Rail Track */}
        <div
          className="absolute left-[5.5px] top-2 bottom-2 w-px bg-border/80"
          aria-hidden="true"
        />

        {CHAPTERS.map((chapter) => {
          const isActive = activeChapter === chapter.id

          return (
            <div key={chapter.id} className="relative z-10 flex flex-col items-start">
              <button
                type="button"
                onClick={() => scrollToChapter(chapter.id)}
                className="group flex items-center gap-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                aria-current={isActive ? "step" : undefined}
                aria-label={`Jump to Chapter ${chapter.number}: ${chapter.title}`}
              >
                {/* Chapter Dot Indicator on Continuous Track */}
                <div className="relative flex size-3 items-center justify-center bg-background">
                  {isActive ? (
                    <motion.div
                      layoutId={shouldReduceMotion ? undefined : "activeChapterDot"}
                      className="size-2 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  ) : (
                    <div className="size-1.5 rounded-full border border-muted-foreground/50 bg-background transition-colors group-hover:border-foreground" />
                  )}
                </div>

                {/* Chapter Number & Label */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-widest transition-colors",
                      isActive
                        ? "font-semibold text-primary"
                        : "text-muted-foreground/70 group-hover:text-foreground"
                    )}
                  >
                    {chapter.number}
                  </span>
                  <motion.span
                    animate={{
                      opacity: isActive || isHovered ? 1 : 0,
                      x: isActive || isHovered ? 0 : -4,
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider transition-colors",
                      isActive
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {chapter.title}
                  </motion.span>
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
