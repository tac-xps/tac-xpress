"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, PackageCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroParcelCardProps {
  className?: string
}

/**
 * Bottom-left consignment module matching the CARGOCAST reference screenshot:
 * - 3D Blender stacked corrugated cardboard cargo boxes with orange security tape
 * - Overlapping clean info card: "Our system delivers daily updates for your journey."
 * - Solid black READ MORE button with orange arrow square
 * - Quick expandable AWB tracking input
 */
export function HeroParcelCard({ className }: HeroParcelCardProps) {
  const [showQuickTrack, setShowQuickTrack] = useState(false)
  const [awbQuery, setAwbQuery] = useState("")

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (awbQuery.trim()) {
      window.location.href = `/track?awb=${encodeURIComponent(awbQuery.trim())}`
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row items-stretch sm:items-end gap-3 select-none",
        className
      )}
    >
      {/* 3D Blender Stacked Corrugated Parcels */}
      <div className="relative w-36 sm:w-44 md:w-48 shrink-0 overflow-hidden" aria-hidden="true">
        <Image
          src="/images/hero/hero-stacked-boxes.jpg"
          alt="Stacked consignment parcels"
          width={400}
          height={400}
          className="w-full h-auto object-contain select-none"
        />
      </div>

      {/* Info & Action Card */}
      <div className="flex-1 border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-sm max-w-md">
        <p className="text-xs sm:text-sm font-medium text-zinc-800 leading-snug">
          Our system delivers daily updates for your journey.
        </p>

        {showQuickTrack ? (
          <form onSubmit={handleQuickTrack} className="mt-3 flex items-center gap-1.5">
            <input
              type="text"
              value={awbQuery}
              onChange={(e) => setAwbQuery(e.target.value)}
              placeholder="Enter AWB #..."
              className="flex-1 h-9 px-2.5 font-mono text-xs border border-zinc-300 bg-zinc-50 focus:outline-none focus:border-orange-500"
              autoFocus
            />
            <button
              type="submit"
              className="h-9 px-3 bg-orange-500 text-white font-mono text-xs font-semibold hover:bg-orange-600 transition-colors shrink-0"
            >
              Track
            </button>
          </form>
        ) : (
          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQuickTrack(true)}
              className="inline-flex items-center gap-2 h-9 px-3.5 bg-zinc-950 text-white font-mono text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
            >
              <span>READ MORE</span>
              <span className="flex size-5 items-center justify-center bg-orange-500 text-white">
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </button>

            <Link
              href="/track"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 font-mono transition-colors"
            >
              <PackageCheck className="size-3.5 text-orange-500" />
              <span>AWB Desk</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
