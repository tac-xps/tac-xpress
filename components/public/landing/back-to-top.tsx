"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ArrowUp } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * BackToTop: Industrial telemetry scroll-to-top control.
 *
 * Appears when user scrolls beyond 280px.
 * Features a real-time perimeter square progress gauge tracking document altitude.
 * Stacks vertically directly above the Support Assistant FAB on the right rail.
 * Adheres strictly to TAC-Xpress 0px straight-line industrial geometry.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const p = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0
      setProgress(p)
      setVisible(scrollY > 280)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "instant" : "smooth",
    })
  }

  const percent = Math.round(progress * 100)
  // Perimeter of an inset 38x38 square rect = 4 * 38 = 152
  const strokeOffset = 152 - 152 * progress

  return (
    <AnimatePresence>
      {visible && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                key="back-to-top-fab"
                type="button"
                onClick={scrollToTop}
                aria-label={`Back to top (${percent}% scrolled)`}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8, scale: 0.95 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8, scale: 0.95 }
                }
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                className="group fixed bottom-[72px] right-4 z-40 flex size-11 sm:size-12 cursor-pointer items-center justify-center rounded-none border border-border/80 bg-card/95 text-foreground shadow-md backdrop-blur-xs transition-colors hover:border-primary hover:bg-muted/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-[84px] sm:right-6 select-none"
              >
                {/* Square Perimeter Altitude Gauge */}
                <svg
                  className="pointer-events-none absolute inset-0 size-full p-0.5"
                  viewBox="0 0 44 44"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="38"
                    height="38"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-border/30"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="38"
                    height="38"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="152"
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="square"
                    className="text-primary transition-[stroke-dashoffset] duration-75"
                  />
                </svg>

                {/* Arrow with subtle hover lift */}
                <ArrowUp
                  className="relative z-10 size-4 stroke-[2.2] transition-transform duration-150 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
                <span className="sr-only">Back to top</span>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              sideOffset={12}
              className="rounded-none border border-border/80 bg-popover px-3 py-1.5 font-mono text-[11px] font-medium text-popover-foreground shadow-md"
            >
              <div className="flex items-center gap-2">
                <span>Back to top</span>
                <span className="text-primary font-bold">{percent}%</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </AnimatePresence>
  )
}
