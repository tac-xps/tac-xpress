"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Pause, Plane, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const applyPreference = () => {
      if (preference.matches) {
        video.pause()
        setIsPlaying(false)
      } else {
        void video.play().catch(() => {})
      }
    }
    applyPreference()
    preference.addEventListener("change", applyPreference)
    return () => preference.removeEventListener("change", applyPreference)
  }, [])

  const togglePlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play().catch(() => {})
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative w-full border-b border-border bg-background min-h-[calc(100svh-4rem)] flex flex-col justify-between pt-20 sm:pt-24 lg:pt-28 pb-8 lg:pb-10 overflow-hidden"
    >
      {/* Primary Hero Two-Column Grid (Vertically Balanced in Fold) */}
      <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-12 my-auto py-2 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Proposition, Headline, CTAs & Route Scope */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Service Context Eyebrow Chip */}
            <div className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-0.5 text-xs font-sans text-muted-foreground rounded-none shadow-2xs">
              <span className="size-1.5 rounded-none bg-primary" aria-hidden="true" />
              <span className="font-medium text-foreground">Air Express and Highway Freight</span>
            </div>
            <h1
              id="hero-heading"
              className="mt-3.5 text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-foreground leading-[1.08] text-balance"
            >
              Connecting Delhi to Imphal.{" "}
              <span className="text-primary font-semibold">Moving freight.</span>
            </h1>

            {/* Clear Concise Value Proposition Subhead */}
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl text-pretty">
              Dedicated commercial logistics connecting Delhi and Imphal in both directions.
            </p>

            {/* Dual Conversion Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Button
                asChild
                className="h-10 px-5 rounded-none font-medium text-xs bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-2xs active:scale-[0.96]"
              >
                <Link href="#contact">
                  Book Consignment
                  <ArrowUpRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 px-5 rounded-none font-medium text-xs border-border bg-card text-foreground hover:bg-muted transition-colors shadow-2xs"
              >
                <Link href="#pricing">
                  Estimate cargo charges
                </Link>
              </Button>
            </div>
            <div className="mt-6 pt-4 border-t border-border/80 w-full grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div>
                <div className="text-xs font-sans text-muted-foreground">Origin Hub</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">
                  DEL <span className="text-xs font-normal text-muted-foreground">New Delhi</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-sans text-muted-foreground">Destination Hub</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">
                  IMF <span className="text-xs font-normal text-muted-foreground">Imphal</span>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-xs font-sans text-muted-foreground">Delivery timing</div>
                <div className="text-xs font-medium text-foreground mt-0.5">
                  Confirm timing before booking
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Deliberate Operational Canvas with Docked Corridor Overview */}
          <div className="lg:col-span-6 w-full">
            <div className="relative border border-border bg-card shadow-xs overflow-hidden rounded-none">
              {/* Operational Looping Video Console (Uncropped 16:9 Viewport) */}
              <div className="relative aspect-video w-full bg-black/95 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/images/new-assets/hero-console.png"
                  aria-label="Commercial air express and arterial highway linehaul operations connecting New Delhi and Imphal"
                  className="h-full w-full object-contain rounded-none"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => setIsPlaying(false)}
                >
                  <source src="/video/new_hero_video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button
                  type="button"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? "Pause linehaul video" : "Play linehaul video"}
                  className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center border border-border bg-background/90 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-none shadow-2xs cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="size-3.5 fill-current" />
                  ) : (
                    <Play className="size-3.5 fill-current ml-0.5" />
                  )}
                </button>
              </div>
              <div className="p-3.5 sm:p-4 border-t border-border bg-background">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground tracking-tight">Corridor illustration</span>
                  </div>
                  <span className="text-xs text-primary font-medium">Service corridor</span>
                </div>

                <div className="grid grid-cols-12 gap-2 pt-2.5 items-center">
                  {/* Origin Endpoint */}
                  <div className="col-span-4">
                    <div className="text-xs font-sans text-muted-foreground">Origin</div>
                    <div className="text-sm font-bold text-foreground">DEL</div>
                    <div className="text-xs text-muted-foreground">New Delhi</div>
                  </div>

                  {/* Route Vector Distance */}
                  <div className="col-span-4 flex flex-col items-center justify-center text-center px-1">
                    <div className="text-xs font-medium text-muted-foreground">DEL to IMF</div>
                    <div className="relative w-full flex items-center my-0.5">
                      <div className="h-[1.5px] w-full bg-border" />
                      <Plane className="size-2.5 text-primary absolute left-1/2 -translate-x-1/2 -translate-y-[1px]" />
                    </div>
                    <div className="text-xs text-muted-foreground">Air + Arterial Road</div>
                  </div>

                  {/* Destination Endpoint */}
                  <div className="col-span-4 text-right">
                    <div className="text-xs font-sans text-muted-foreground">Destination</div>
                    <div className="text-sm font-bold text-foreground">IMF</div>
                    <div className="text-xs text-muted-foreground">Imphal (Tulihal)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
