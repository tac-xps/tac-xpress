import React from "react"
import Image from "next/image"
import { ArrowRight, Plane, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroExpressCardProps {
  className?: string
}

export function HeroExpressCard({ className }: HeroExpressCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-2xl border border-white/25 bg-black/75 p-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/40",
        className
      )}
    >
      {/* Visual Header with Drone Delivery Artwork */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
        <Image
          src="/images/hero/hero-drone.jpg"
          alt="TAC-XPRESS autonomous express linehaul delivery drone with secure cargo container"
          fill
          sizes="(min-width: 1024px) 240px, 180px"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Live GPS Telemetry Indicator */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-mono tracking-wider text-emerald-400 backdrop-blur-md border border-emerald-500/30">
          <Radio className="size-3 animate-pulse" aria-hidden="true" />
          <span>LIVE AIRWAY</span>
        </div>

        {/* Directional Efficiency Callout Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg bg-orange-600/90 px-3 py-1.5 text-white backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-sans text-xs font-bold tracking-tight">
            <span>53%</span>
            <span className="font-normal text-[11px] text-white/90">Faster Linehaul SLA</span>
          </div>
          <ArrowRight className="size-3.5 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom Floating Metric Pill (White / High Contrast) */}
      <div className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2 text-zinc-900 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <Plane className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Active Air Fleet
            </span>
            <span className="text-xs font-bold tracking-tight text-zinc-900">
              Daily Northeast Sort
            </span>
          </div>
        </div>
        <span className="font-mono text-base font-extrabold tracking-tight text-zinc-950">
          1.2k+
        </span>
      </div>
    </div>
  )
}
