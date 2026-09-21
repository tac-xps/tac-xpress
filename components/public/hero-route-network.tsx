import React from "react"
import { cn } from "@/lib/utils"

interface HeroRouteNetworkProps {
  className?: string
}

export function HeroRouteNetwork({ className }: HeroRouteNetworkProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden select-none", className)}
      aria-hidden="true"
    >
      <svg
        className="size-full opacity-65"
        viewBox="0 0 600 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Subtle GIS road network grid */}
        <g stroke="white" strokeWidth="0.75" strokeOpacity="0.18">
          <path d="M50 0V700" />
          <path d="M120 0V700" />
          <path d="M190 0V700" />
          <path d="M260 0V700" />
          <path d="M330 0V700" />
          <path d="M400 0V700" />
          <path d="M470 0V700" />
          <path d="M540 0V700" />

          <path d="M0 60H600" />
          <path d="M0 130H600" />
          <path d="M0 200H600" />
          <path d="M0 270H600" />
          <path d="M0 340H600" />
          <path d="M0 410H600" />
          <path d="M0 480H600" />
          <path d="M0 550H600" />
          <path d="M0 620H600" />

          {/* Organic arterial routes */}
          <path d="M-50 120C120 160 220 80 340 180S500 320 650 310" strokeDasharray="3 3" />
          <path d="M-20 400C160 380 280 480 440 430S580 560 650 580" strokeDasharray="2 4" />
          <path d="M80 -30C150 140 130 310 240 430S410 610 460 730" strokeDasharray="3 3" />
        </g>

        {/* Strategic Corridor Transit Line (Glowing Route Vector) */}
        <path
          d="M240 70L240 140L290 190L290 320L360 380L360 480L380 540"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />

        {/* Secondary Express Feeder Lines */}
        <path
          d="M240 140L160 180L130 250"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray="4 4"
        />
        <path
          d="M360 380L450 350L510 390"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeDasharray="4 4"
        />

        {/* Corridor Waypoint Nodes & Pulsing Beacons */}
        {/* Node 1: Delhi Origin Hub */}
        <g transform="translate(240, 70)">
          <circle r="14" fill="white" fillOpacity="0.15" />
          <circle r="7" fill="white" fillOpacity="0.4" />
          <circle r="3.5" fill="white" />
        </g>

        {/* Node 2: Siliguri Corridor Gate */}
        <g transform="translate(290, 190)">
          <circle r="16" fill="white" fillOpacity="0.12" />
          <circle r="8" fill="white" fillOpacity="0.35" />
          <circle r="4" fill="white" />
        </g>

        {/* Node 3: Guwahati Central Hub */}
        <g transform="translate(290, 320)">
          <circle r="20" fill="white" fillOpacity="0.15" />
          <circle r="10" fill="white" fillOpacity="0.4" />
          <circle r="5" fill="white" />
        </g>

        {/* Node 4: Dimapur Pass */}
        <g transform="translate(360, 380)">
          <circle r="15" fill="white" fillOpacity="0.12" />
          <circle r="7" fill="white" fillOpacity="0.35" />
          <circle r="3.5" fill="white" />
        </g>

        {/* Node 5: Imphal Terminal (Final Destination) */}
        <g transform="translate(380, 540)">
          <circle r="22" fill="white" fillOpacity="0.18" />
          <circle r="12" fill="white" fillOpacity="0.45" />
          <circle r="6" fill="white" />
        </g>

        {/* Auxiliary Regional Nodes */}
        <g transform="translate(130, 250)">
          <circle r="10" fill="white" fillOpacity="0.1" />
          <circle r="3" fill="white" fillOpacity="0.8" />
        </g>
        <g transform="translate(510, 390)">
          <circle r="12" fill="white" fillOpacity="0.1" />
          <circle r="3" fill="white" fillOpacity="0.8" />
        </g>
      </svg>
    </div>
  )
}
