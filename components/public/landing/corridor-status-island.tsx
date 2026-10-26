"use client"

import React, { useSyncExternalStore } from "react"
import { StatusIsland } from "@/components/kokonutui/status-island"
import { cn } from "@/lib/utils"
import {
  computeCorridorTelemetry,
  type CorridorTelemetryState,
} from "@/lib/stem/flight-telemetry"

// Fixed baseline snapshot for server-side rendering to prevent hydration mismatches
const SSR_BASELINE_DATE = new Date("2026-10-23T02:15:00.000Z")
const ssrSnapshot = computeCorridorTelemetry(SSR_BASELINE_DATE)

// Live external telemetry store
let clientSnapshot = computeCorridorTelemetry()
const listeners = new Set<() => void>()

if (typeof window !== "undefined") {
  // Update telemetry snapshot on a 5-second interval
  setInterval(() => {
    clientSnapshot = computeCorridorTelemetry()
    listeners.forEach((listener) => listener())
  }, 5000)
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function getSnapshot(): CorridorTelemetryState {
  return clientSnapshot
}

function getServerSnapshot(): CorridorTelemetryState {
  return ssrSnapshot
}

/**
 * Live Indian Standard Time (IST) corridor operations telemetry console.
 * Deterministically computes flight progress and gateway states without external APIs.
 */
export function CorridorStatusIsland({
  className,
  dropdown = false,
}: {
  className?: string
  dropdown?: boolean
} = {}) {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  if (dropdown) {
    return (
      <div className={className}>
        <StatusIsland
          tasks={current.tasks}
          istTime={current.currentIstTime}
          phaseTitle={current.phaseTitle}
          dropdown={true}
        />
      </div>
    )
  }

  return (
    <aside
      aria-label="Live Corridor Operations Monitor"
      className={cn(
        "fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 pointer-events-auto",
        className
      )}
    >
      <StatusIsland
        tasks={current.tasks}
        istTime={current.currentIstTime}
        phaseTitle={current.phaseTitle}
        className="shadow-lg backdrop-blur-md"
      />
    </aside>
  )
}
