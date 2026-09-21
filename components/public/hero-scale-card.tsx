import React from "react"
import { cn } from "@/lib/utils"

interface HeroScaleCardProps {
  className?: string
  stat?: string
  title?: string
  subtitle?: string
}

/**
 * Bottom-right scale metric card inspired by the CARGOCAST layout:
 * - Eyebrow corridor label
 * - Clean light-surface card with massive orange stat counter ("328k+")
 * - Procedural SVG halftone dot-matrix sphere/globe representing active transit nodes
 * - Square geometry adhering strictly to Nordic Lagom
 */
export function HeroScaleCard({
  className,
  stat = "328k+",
  title = "Orders Moving Across World",
  subtitle = "SECURE TRANSIT CHAINS / REACH ALL MAJOR LANDS",
}: HeroScaleCardProps) {
  // Generate rows of dots for the half-sphere globe
  // The dots form an isometric/spherical grid with varying radiuses
  const rows = [
    { y: 15, count: 5, r: 2.2 },
    { y: 30, count: 9, r: 2.5 },
    { y: 45, count: 13, r: 2.8 },
    { y: 60, count: 17, r: 3.0 },
    { y: 75, count: 21, r: 3.2 },
    { y: 90, count: 23, r: 3.4 },
    { y: 105, count: 25, r: 3.5 },
    { y: 120, count: 25, r: 3.5 },
    { y: 135, count: 23, r: 3.2 },
  ]

  return (
    <div className={cn("flex flex-col select-none", className)}>
      {/* Upper technical routing eyebrow */}
      <div className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest text-zinc-700 uppercase mb-2">
        {subtitle}
      </div>

      {/* Main Metric & Halftone Globe Card */}
      <div className="relative overflow-hidden border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-sm">
        <div className="relative z-10">
          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 tracking-tight leading-snug">
            {title}
          </h3>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-orange-500 font-sans">
            {stat}
          </div>
        </div>

        {/* Halftone Spherical Dot Matrix Graphic (Bottom right quadrant) */}
        <div className="mt-4 flex justify-center sm:justify-end overflow-hidden">
          <svg
            viewBox="0 0 200 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-44 sm:w-52 h-auto opacity-95"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="globe-dot-grad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="60%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#fdba74" stopOpacity="0.4" />
              </radialGradient>
            </defs>

            {rows.map((row, rowIndex) => {
              const startX = 100 - (row.count * 7) / 2
              return (
                <g key={rowIndex}>
                  {Array.from({ length: row.count }).map((_, colIndex) => {
                    const cx = startX + colIndex * 7
                    // calculate distance from center to give spherical curve
                    const dx = (cx - 100) / 80
                    const dy = (row.y - 60) / 60
                    const distSq = dx * dx + dy * dy
                    if (distSq > 1) return null

                    const dotR = row.r * Math.max(0.4, 1 - distSq * 0.4)
                    return (
                      <circle
                        key={colIndex}
                        cx={cx}
                        cy={row.y}
                        r={dotR}
                        fill="url(#globe-dot-grad)"
                      />
                    )
                  })}
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
