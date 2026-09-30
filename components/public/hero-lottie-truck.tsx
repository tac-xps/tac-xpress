import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface HeroLottieTruckProps {
  className?: string
}

/**
 * High-performance Nordic hero visual for TAC-XPRESS commercial linehaul.
 * Uses Next.js optimized Image with priority loading to eliminate blank hero voids.
 */
export function HeroLottieTruck({ className }: HeroLottieTruckProps) {
  return (
    <div className={cn("relative w-full aspect-[4/3] flex items-center justify-center select-none", className)}>
      {/* Subtle ambient radial glow behind truck in dark & light mode */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-radial from-primary/15 via-transparent to-transparent blur-3xl opacity-70 dark:opacity-40 scale-110"
        aria-hidden="true"
      />
      
      {/* High-fidelity static commercial cargo transport linehaul */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src="/images/hero/hero-blender-truck-dark.png"
          alt="TAC-XPRESS commercial cargo transport truck"
          width={800}
          height={600}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="w-full h-auto object-contain drop-shadow-sm dark:drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
        />
      </div>
    </div>
  )
}
