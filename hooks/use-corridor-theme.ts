"use client"

import { useCorridorThemeContext } from "@/components/theme/corridor-theme-provider"

/**
 * Hook to access and manage the active freight corridor OKLCH theme.
 * Allows components to reactively read active corridor hue or switch corridors.
 */
export function useCorridorTheme() {
  const { origin, destination, hue, setCorridor, resetCorridor } =
    useCorridorThemeContext()

  return {
    origin,
    destination,
    corridorCode: origin && destination ? `${origin}-${destination}` : null,
    hue,
    setCorridor,
    resetCorridor,
    /** Standard corridor utility classes for dynamic components */
    corridorClasses: {
      badge: "border-corridor-border bg-corridor-subtle text-corridor",
      border: "border-corridor-border",
      bgSubtle: "bg-corridor-subtle",
      text: "text-corridor",
    },
  }
}
