import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { CorridorThemeProvider } from "@/components/theme/corridor-theme-provider"
import { useCorridorTheme } from "@/hooks/use-corridor-theme"
import { StatusBadge } from "@/components/logistics/status-badge"
import { Button } from "@/components/ui/button"

function CorridorDemoWorkbench() {
  const { origin, destination, hue, setCorridor, corridorClasses } = useCorridorTheme()

  const corridors = [
    { origin: "DEL", destination: "IMF", label: "DEL → IMF (North-East Express)", hue: 245 },
    { origin: "GAU", destination: "CCU", label: "GAU → CCU (Assam Gateway)", hue: 160 },
    { origin: "BOM", destination: "DEL", label: "BOM → DEL (Western Trunk)", hue: 200 },
    { origin: "BLR", destination: "IMF", label: "BLR → IMF (Southern Air)", hue: 285 },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-xl p-6 rounded-none border border-border bg-card shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Dynamic OKLCH Corridor Theming
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Select a corridor to observe instant OKLCH hue adaptation with zero layout shift.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {corridors.map((c) => {
          const isSelected = origin === c.origin && destination === c.destination
          return (
            <Button
              key={`${c.origin}-${c.destination}`}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setCorridor(c.origin, c.destination)}
            >
              {c.label}
            </Button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-none border border-border bg-muted/30">
          <span className="text-xs text-muted-foreground block">Active Corridor</span>
          <span className="text-sm font-semibold font-mono text-foreground">
            {origin && destination ? `${origin} → ${destination}` : "Default (DEL-IMF)"}
          </span>
        </div>
        <div className="p-4 rounded-none border border-border bg-muted/30">
          <span className="text-xs text-muted-foreground block">OKLCH Hue Angle</span>
          <span className="text-sm font-semibold font-mono text-foreground">
            {hue}°
          </span>
        </div>
      </div>

      <div className={`p-4 rounded-none border ${corridorClasses.border} ${corridorClasses.bgSubtle} transition-colors duration-300`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${corridorClasses.text}`}>
            Corridor Express Waybill
          </span>
          <StatusBadge status="corridor" label="Priority Freight" />
        </div>
        <div className="mt-3 text-sm font-mono text-foreground">
          AWB: TAC-948201-{origin || "DEL"}-{destination || "IMF"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Guaranteed corridor transit time: 36h via dedicated linehaul network.
        </p>
      </div>
    </div>
  )
}

function ThemedWrapper({ defaultOrigin, defaultDestination }: { defaultOrigin: string; defaultDestination: string }) {
  return (
    <CorridorThemeProvider defaultOrigin={defaultOrigin} defaultDestination={defaultDestination}>
      <CorridorDemoWorkbench />
    </CorridorThemeProvider>
  )
}

const meta = {
  title: "Logistics/CorridorTheming",
  component: ThemedWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemedWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const NorthEastExpress: Story = {
  args: {
    defaultOrigin: "DEL",
    defaultDestination: "IMF",
  },
}

export const AssamGateway: Story = {
  args: {
    defaultOrigin: "GAU",
    defaultDestination: "CCU",
  },
}

export const WesternTrunk: Story = {
  args: {
    defaultOrigin: "BOM",
    defaultDestination: "DEL",
  },
}
