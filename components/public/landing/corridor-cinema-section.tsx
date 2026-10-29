"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Play, Radio } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function CorridorCinemaSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section
      aria-labelledby="cinema-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12 text-center">
        {/* Exact Atomist Heading format */}
        <h2
          id="cinema-heading"
          className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
        >
          Direct bilateral transit connection
        </h2>
        <p className="mt-2 text-xs font-sans text-muted-foreground max-w-md mx-auto">
          Continuous physical connection bridging the national capital and Manipur across 2,450 km.
        </p>

        {/* 16:9 Cinematic Atmospheric Banner */}
        <div className="relative mt-12 mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden border border-border bg-muted rounded-none shadow-sm">
          <Image
            src="/images/corridor-ink/cinema-network.png"
            alt="Corridor transit across New Delhi and Imphal arterial route"
            fill
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-cover rounded-none"
          />

          {/* Warm Amber Atmospheric Light Beams Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20"
          />

          {/* Central Play / Radar Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label="Inspect corridor operational linehaul video"
              className="flex size-16 sm:size-20 items-center justify-center rounded-none bg-background text-foreground border border-border transition-transform active:scale-95 shadow-sm"
            >
              <Play className="ml-1 size-6 sm:size-8 fill-foreground text-foreground" />
            </button>
          </div>

          {/* Bottom Corridor Label */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border border-border bg-card px-4 py-2.5 text-xs font-sans text-muted-foreground rounded-none">
            <div className="flex items-center gap-2">
              <Radio className="size-3.5 text-primary motion-safe:animate-pulse" />
              <span className="font-semibold text-foreground">DEL ⇄ IMF Arterial Line</span>
            </div>
            <span className="font-sans text-xs text-foreground font-medium">2,450 km bilateral</span>
          </div>
        </div>

        {/* Modal Corridor Telemetry Simulator */}
        <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
          <DialogContent
            showCloseButton={true}
            className="max-w-4xl p-6 text-left rounded-none border border-border bg-card shadow-lg"
          >
            <DialogHeader className="gap-1 p-0 text-left">
              <div className="flex items-center gap-2.5">
                <Radio className="size-4 text-primary motion-safe:animate-pulse" />
                <DialogTitle className="text-base font-medium text-foreground">
                  Corridor Telemetry and Multi-Modal Transit Stream
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Real-time multi-modal flight radar and highway convoy dispatch connecting IGI Terminal Gate 4 and Tulihal Cargo Apron.
              </DialogDescription>
            </DialogHeader>

            <div className="relative mt-2 aspect-video w-full overflow-hidden border border-border bg-muted rounded-none">
              <Image
                src="/images/corridor-ink/journey-modal.png"
                alt="Multi-modal journey transit across New Delhi and Imphal arterial route"
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover rounded-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
              <div className="absolute top-3 left-3 border border-border/80 bg-background/90 px-2.5 py-1 text-xs font-sans font-medium text-foreground flex items-center gap-2">
                <span className="size-1.5 bg-status-delivered rounded-none" aria-hidden="true" />
                <span>CORRIDOR TRANSIT ACTIVE / DEL ⇄ IMF</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between border border-border/80 bg-background/90 px-3 py-1.5 text-xs font-sans text-muted-foreground">
                <span>GPS E-Seal and Barcode Telemetry: Operational</span>
                <span className="font-sans text-foreground font-medium">SLA: 24h Air / 4-5d Surface</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
