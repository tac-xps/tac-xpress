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
 * BackToTop — Floating scroll-to-top trigger.
 *
 * Appears when the user scrolls 400px down the page.
 * Aligned vertically directly above the Support Assistant FAB.
 * Adheres to TAC-Xpress Nordic Lagom design tokens:
 * - Geometric: rounded-none, border border-border/80, bg-card/95 backdrop-blur-xs
 * - Motion: motion/react spring entrance, respect useReducedMotion
 * - Accessible: tooltip + aria-label
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
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

  return (
    <AnimatePresence>
      {visible && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                key="back-to-top-fab"
                onClick={scrollToTop}
                aria-label="Back to top"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 10, scale: 0.95 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 10, scale: 0.95 }
                }
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                className="fixed bottom-20 right-5 z-40 flex size-10 cursor-pointer items-center justify-center rounded-none border border-border/80 bg-card/95 text-muted-foreground shadow-md backdrop-blur-xs transition-colors hover:border-primary/60 hover:bg-muted/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-24 sm:right-8"
              >
                <ArrowUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">Back to top</span>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              sideOffset={12}
              className="rounded-none border border-border/80 bg-popover px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-popover-foreground shadow-md"
            >
              Back to top
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </AnimatePresence>
  )
}
