"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ArrowUpRight, Search, SlidersHorizontal, Plane, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TrackDialogForm } from "./track-dialog-form"
import { cn } from "@/lib/utils"
import { springs, microGestures } from "@/lib/animations"

interface HeroDispatchConsoleProps {
  className?: string
  variant?: "dark" | "light"
}

export function HeroDispatchConsole({ className, variant: _variant }: HeroDispatchConsoleProps = {}) {
  const [activeTab, setActiveTab] = useState<"track" | "quote">("quote")
  const [selectedDest, setSelectedDest] = useState("imphal")
  const [cargoType, setCargoType] = useState<"air" | "surface">("air")
  const shouldReduceMotion = useReducedMotion()

  const trackTabRef = useRef<HTMLButtonElement>(null)
  const quoteTabRef = useRef<HTMLButtonElement>(null)

  const handleTabKeyDown = (e: React.KeyboardEvent, currentTab: "track" | "quote") => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      if (currentTab === "track") {
        setActiveTab("quote")
        quoteTabRef.current?.focus()
      } else {
        setActiveTab("track")
        trackTabRef.current?.focus()
      }
    }
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl p-6 sm:p-7 transition-colors border border-border bg-card text-card-foreground shadow-sm dark:bg-card/95 dark:backdrop-blur-md",
        className
      )}
    >
      {/* Mode Selector Tabs with Full ARIA Semantics */}
      <div
        role="tablist"
        aria-label="Dispatch Console Options"
        className="relative flex items-center gap-6 border-b border-border pb-4 font-mono text-xs tracking-wider uppercase"
      >
        <button
          ref={trackTabRef}
          role="tab"
          id="tab-track"
          aria-selected={activeTab === "track"}
          aria-controls="panel-track"
          tabIndex={activeTab === "track" ? 0 : -1}
          type="button"
          onClick={() => setActiveTab("track")}
          onKeyDown={(e) => handleTabKeyDown(e, "track")}
          className={cn(
            "relative flex items-center gap-2 pb-2 transition-colors focus:outline-none focus-visible:ring-1 cursor-pointer",
            activeTab === "track"
              ? "font-bold text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Search className="size-3.5 text-primary" aria-hidden="true" />
          <span>01 / Track Consignment</span>
          {activeTab === "track" && (
            <motion.div
              layoutId="hero-console-active-tab"
              className="absolute -bottom-4 left-0 right-0 h-[2px] bg-primary"
              transition={springs.smooth}
            />
          )}
        </button>

        <button
          ref={quoteTabRef}
          role="tab"
          id="tab-quote"
          aria-selected={activeTab === "quote"}
          aria-controls="panel-quote"
          tabIndex={activeTab === "quote" ? 0 : -1}
          type="button"
          onClick={() => setActiveTab("quote")}
          onKeyDown={(e) => handleTabKeyDown(e, "quote")}
          className={cn(
            "relative flex items-center gap-2 pb-2 transition-colors focus:outline-none focus-visible:ring-1 cursor-pointer",
            activeTab === "quote"
              ? "font-bold text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <SlidersHorizontal className="size-3.5 text-primary" aria-hidden="true" />
          <span>02 / Rate & Route Check</span>
          {activeTab === "quote" && (
            <motion.div
              layoutId="hero-console-active-tab"
              className="absolute -bottom-4 left-0 right-0 h-[2px] bg-primary"
              transition={springs.smooth}
            />
          )}
        </button>
      </div>

      {/* Tab content wrapper with locked min-height to prevent layout shifts */}
      <div className="mt-5 min-h-[148px]">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "track" ? (
            <motion.div
              key="panel-track"
              role="tabpanel"
              id="panel-track"
              aria-labelledby="tab-track"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={springs.snappy}
              className="flex min-h-[148px] flex-col justify-between"
            >
              <TrackDialogForm variant="console" />
            </motion.div>
          ) : (
            <motion.div
              key="panel-quote"
              role="tabpanel"
              id="panel-quote"
              aria-labelledby="tab-quote"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={springs.snappy}
              className="flex min-h-[148px] flex-col justify-between"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Origin</span>
                  <div className="border border-border px-3.5 py-2 font-mono text-sm flex items-center justify-between bg-surface text-foreground rounded-none">
                    <span>DEL / New Delhi</span>
                    <span className="text-[10px] px-1.5 py-0.5 font-bold bg-primary/10 text-primary rounded-none">
                      HUB 01
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="hero-dest-select"
                    className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Destination
                  </label>
                  <select
                    id="hero-dest-select"
                    value={selectedDest}
                    onChange={(e) => setSelectedDest(e.target.value)}
                    className="border border-border px-3.5 py-2 font-mono text-sm focus:outline-none focus-visible:ring-1 transition-colors bg-surface text-foreground focus:border-primary focus-visible:ring-primary rounded-none"
                  >
                    <option value="imphal">IMF / Imphal (Manipur)</option>
                    <option value="guwahati">GAU / Guwahati (Assam)</option>
                    <option value="dimapur">DMU / Dimapur (Nagaland)</option>
                    <option value="agartala">IXA / Agartala (Tripura)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between border-t border-border">
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    aria-pressed={cargoType === "air"}
                    whileTap={shouldReduceMotion ? undefined : microGestures.tap}
                    onClick={() => setCargoType("air")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-colors border rounded-none cursor-pointer",
                      cargoType === "air"
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Plane className="size-3.5" aria-hidden="true" />
                    <span>Air (24-48h)</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    aria-pressed={cargoType === "surface"}
                    whileTap={shouldReduceMotion ? undefined : microGestures.tap}
                    onClick={() => setCargoType("surface")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-colors border rounded-none cursor-pointer",
                      cargoType === "surface"
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Truck className="size-3.5" aria-hidden="true" />
                    <span>Surface (5-7d)</span>
                  </motion.button>
                </div>

                <motion.div
                  whileHover={shouldReduceMotion ? undefined : microGestures.hoverScale}
                  whileTap={shouldReduceMotion ? undefined : microGestures.tap}
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-none h-10 px-5 font-sans text-sm font-medium tracking-wide focus-visible:ring-1 active:scale-[0.98] transition-transform bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-primary"
                  >
                    <Link href={`/contact?origin=DEL&dest=${selectedDest.toUpperCase()}&mode=${cargoType}`}>
                      Calculate Freight <ArrowUpRight data-icon="inline-end" className="size-4 ml-1" aria-hidden="true" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
