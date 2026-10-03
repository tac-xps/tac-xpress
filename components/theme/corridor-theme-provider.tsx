"use client"

import React, { createContext, useContext, useEffect, useState, useMemo } from "react"
import { getCorridorHue } from "@/lib/stem/color-science"

interface CorridorThemeContextValue {
  origin: string | null
  destination: string | null
  hue: number
  setCorridor: (origin: string | null, destination: string | null) => void
  resetCorridor: () => void
}

const DEFAULT_HUE = 245 // Default Tac-Xpress corridor hue (DEL-IMF)

const CorridorThemeContext = createContext<CorridorThemeContextValue>({
  origin: null,
  destination: null,
  hue: DEFAULT_HUE,
  setCorridor: () => {},
  resetCorridor: () => {},
})

export interface CorridorThemeProviderProps {
  children: React.ReactNode
  defaultOrigin?: string | null
  defaultDestination?: string | null
}

export function CorridorThemeProvider({
  children,
  defaultOrigin = null,
  defaultDestination = null,
}: CorridorThemeProviderProps) {
  const [origin, setOrigin] = useState<string | null>(defaultOrigin)
  const [destination, setDestination] = useState<string | null>(defaultDestination)

  const hue = useMemo(() => {
    return getCorridorHue(origin, destination)
  }, [origin, destination])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--corridor-h", hue.toString())
    }
  }, [hue])

  const setCorridor = (newOrigin: string | null, newDestination: string | null) => {
    setOrigin(newOrigin)
    setDestination(newDestination)
  }

  const resetCorridor = () => {
    setOrigin(null)
    setDestination(null)
  }

  const value = useMemo(
    () => ({
      origin,
      destination,
      hue,
      setCorridor,
      resetCorridor,
    }),
    [origin, destination, hue]
  )

  return (
    <CorridorThemeContext.Provider value={value}>
      {children}
    </CorridorThemeContext.Provider>
  )
}

export function useCorridorThemeContext() {
  return useContext(CorridorThemeContext)
}
