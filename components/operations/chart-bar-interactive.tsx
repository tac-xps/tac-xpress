"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ShipmentVolumePoint } from "@/lib/dashboard-metrics"

const chartConfig = {
  views: {
    label: "Shipments",
  },
  airCargo: {
    label: "Air cargo",
    color: "var(--chart-1)",
  },
  surfaceCargo: {
    label: "Surface cargo",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type ActiveKey = "airCargo" | "surfaceCargo"

interface ChartBarInteractiveProps {
  data: ShipmentVolumePoint[]
}

export function ChartBarInteractive({ data }: ChartBarInteractiveProps) {
  const [activeChart, setActiveChart] = React.useState<ActiveKey>("airCargo")

  const total = React.useMemo(
    () => ({
      airCargo: data.reduce((acc, curr) => acc + curr.airCargo, 0),
      surfaceCargo: data.reduce((acc, curr) => acc + curr.surfaceCargo, 0),
    }),
    [data]
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-6">
          <CardTitle>Shipment volume</CardTitle>
          <CardDescription>
            Daily bookings broken down by service type
          </CardDescription>
        </div>
        <div className="flex">
          {(["airCargo", "surfaceCargo"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 transition-colors hover:bg-muted/30"
              onClick={() => setActiveChart(key)}
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                <span
                  className="inline-block h-2 w-2 shrink-0"
                  style={{
                    background: (chartConfig[key] as { color: string }).color,
                  }}
                />
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl font-mono">
                {total[key].toLocaleString("en-IN")}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
          aria-label={`Daily ${chartConfig[activeChart].label} shipments`}
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(value: string) =>
                new Date(value + "T12:00:00").toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    const dateStr = String(value)
                    return new Date(
                      dateStr + "T12:00:00"
                    ).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              maxBarSize={32}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
