"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight, FileUp, Search, SlidersHorizontal, Plane, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroDispatchConsoleProps {
  className?: string
  variant?: "dark" | "light"
}

export function HeroDispatchConsole({ className, variant: _variant }: HeroDispatchConsoleProps = {}) {
  const [activeTab, setActiveTab] = useState<"track" | "quote">("track")
  const [selectedDest, setSelectedDest] = useState("imphal")
  const [cargoType, setCargoType] = useState<"air" | "surface">("air")
  const [fileName, setFileName] = useState<string | null>(null)

  const trackTabRef = useRef<HTMLButtonElement>(null)
  const quoteTabRef = useRef<HTMLButtonElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

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
        className="flex items-center gap-6 border-b border-border pb-4 font-mono text-xs tracking-wider uppercase"
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
            "flex items-center gap-2 pb-2 transition-colors focus:outline-none focus-visible:ring-1",
            activeTab === "track"
              ? "border-b-2 border-orange-500 font-bold text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Search className="size-3.5 text-orange-500" aria-hidden="true" />
          <span>01 / Track Consignment</span>
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
            "flex items-center gap-2 pb-2 transition-colors focus:outline-none focus-visible:ring-1",
            activeTab === "quote"
              ? "border-b-2 border-orange-500 font-bold text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <SlidersHorizontal className="size-3.5 text-orange-500" aria-hidden="true" />
          <span>02 / Rate & Route Check</span>
        </button>
      </div>

      {/* Tab content wrapper with locked height to prevent layout shifts */}
      <div className="mt-5 min-h-[148px]">
        {/* Tab 1: Instant AWB Track */}
        {activeTab === "track" ? (
          <div
            role="tabpanel"
            id="panel-track"
            aria-labelledby="tab-track"
            className="flex min-h-[148px] flex-col justify-between"
          >
            <form action="/track" method="get" className="flex min-h-[148px] flex-col justify-between">
              <div>
                <label htmlFor="hero-awb-input" className="sr-only">
                  AWB Consignment Number
                </label>
                <input
                  id="hero-awb-input"
                  name="awb"
                  required
                  maxLength={40}
                  autoComplete="off"
                  placeholder="Enter 10-digit AWB number (e.g., TAC-948210)..."
                  className="w-full px-4 py-3 font-mono text-sm border focus:outline-none focus-visible:ring-1 transition-colors bg-surface text-foreground placeholder:text-muted-foreground/60 border-border focus:border-orange-500 focus-visible:ring-orange-500"
                />
                <p className="mt-2 text-xs font-mono text-muted-foreground">
                  Direct lookup for New Delhi ↔ Northeast India consignments.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between border-t border-border">
                <label
                  htmlFor="manifest-upload"
                  className="inline-flex cursor-pointer items-center gap-2 font-mono text-xs transition-colors text-muted-foreground hover:text-foreground"
                >
                  <FileUp className="size-4 text-orange-500" aria-hidden="true" />
                  <span className="truncate max-w-[220px]">
                    {fileName ? fileName : "Attach e-Way bill / invoice"}
                  </span>
                  <input
                    id="manifest-upload"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-label="Attach e-Way bill or invoice"
                  />
                </label>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-none h-10 px-5 font-sans text-sm font-medium tracking-wide focus-visible:ring-1 active:scale-[0.98] transition-transform bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-orange-500"
                  >
                    Track Cargo <ArrowUpRight data-icon="inline-end" className="size-4 ml-1" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Tab 2: Quick Rate & Route Check */
          <div
            role="tabpanel"
            id="panel-quote"
            aria-labelledby="tab-quote"
            className="flex min-h-[148px] flex-col justify-between"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Origin</span>
                <div className="border border-border px-3.5 py-2 font-mono text-sm flex items-center justify-between bg-surface text-foreground">
                  <span>DEL / New Delhi</span>
                  <span className="text-[10px] px-1.5 py-0.5 font-bold bg-orange-100 text-orange-700 dark:bg-primary/20 dark:text-primary">
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
                  className="border border-border px-3.5 py-2 font-mono text-sm focus:outline-none focus-visible:ring-1 transition-colors bg-surface text-foreground focus:border-orange-500 focus-visible:ring-orange-500"
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
                <button
                  type="button"
                  aria-pressed={cargoType === "air"}
                  onClick={() => setCargoType("air")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-colors border",
                    cargoType === "air"
                      ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-primary dark:bg-primary/20 dark:text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Plane className="size-3.5" aria-hidden="true" />
                  <span>Air (24-48h)</span>
                </button>
                <button
                  type="button"
                  aria-pressed={cargoType === "surface"}
                  onClick={() => setCargoType("surface")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-colors border",
                    cargoType === "surface"
                      ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-primary dark:bg-primary/20 dark:text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Truck className="size-3.5" aria-hidden="true" />
                  <span>Surface (5-7d)</span>
                </button>
              </div>

              <Button
                asChild
                size="lg"
                className="rounded-none h-10 px-5 font-sans text-sm font-medium tracking-wide focus-visible:ring-1 active:scale-[0.98] transition-transform bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-orange-500"
              >
                <Link href={`/contact?origin=DEL&dest=${selectedDest.toUpperCase()}&mode=${cargoType}`}>
                  Calculate Freight <ArrowUpRight data-icon="inline-end" className="size-4 ml-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
