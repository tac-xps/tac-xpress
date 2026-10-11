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

const chartConfig = {
  views: {
    label: "Shipments",
  },
  delivered: {
    label: "Delivered",
    color: "var(--status-delivered)",
  },
  inTransit: {
    label: "In Transit",
    color: "var(--status-transit)",
  },
  pending: {
    label: "Pending",
    color: "var(--status-pending)",
  },
} satisfies ChartConfig

type DailyPoint = {
  date: string
  delivered: number
  inTransit: number
  pending: number
}

interface ShipmentBarInteractiveProps {
  /** Raw shipment rows passed down from the server page */
  rows: {
    status?: string | null
    createdAt?: string | Date | null
    [key: string]: unknown
  }[]
}

/** Build daily aggregated data from raw rows (last 90 days max) */
function buildChartData(
  rows: ShipmentBarInteractiveProps["rows"]
): DailyPoint[] {
  const map = new Map<string, DailyPoint>()

  for (const row of rows) {
    if (!row.createdAt) continue
    const date = new Date(row.createdAt as string)
    if (isNaN(date.getTime())) continue
    const key = date.toISOString().slice(0, 10) // YYYY-MM-DD

    if (!map.has(key)) {
      map.set(key, { date: key, delivered: 0, inTransit: 0, pending: 0 })
    }
    const point = map.get(key)!

    const s = (row.status ?? "").toLowerCase()
    if (s === "delivered") point.delivered++
    else if (
      s === "in-transit" ||
      s === "in_transit" ||
      s === "out_for_delivery"
    )
      point.inTransit++
    else point.pending++
  }

  return Array.from(map.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-90)
}

export function ShipmentBarInteractive({ rows }: ShipmentBarInteractiveProps) {
  const [activeChart, setActiveChart] =
    React.useState<"delivered" | "inTransit" | "pending">("inTransit")

  const chartData = React.useMemo(() => buildChartData(rows), [rows])

  const totals = React.useMemo(
    () => ({
      delivered: chartData.reduce((s, d) => s + d.delivered, 0),
      inTransit: chartData.reduce((s, d) => s + d.inTransit, 0),
      pending: chartData.reduce((s, d) => s + d.pending, 0),
    }),
    [chartData]
  )

  const tabs = (
    ["delivered", "inTransit", "pending"] as const
  )

  return (
    <Card className="border border-border/80 shadow-xs py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:py-5">
          <CardTitle>Daily shipment activity</CardTitle>
          <CardDescription>
            Click a metric to switch the chart view
          </CardDescription>
        </div>
        <div className="flex">
          {tabs.map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              onClick={() => setActiveChart(key)}
              className="relative z-1 flex flex-1 flex-col justify-center gap-1 border-t px-5 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-7 sm:py-5 transition-colors hover:bg-muted/30"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                <span
                  className="inline-block h-2 w-2 shrink-0"
                  style={{
                    background:
                      (chartConfig[key as keyof typeof chartConfig] as { color?: string }).color ?? "transparent",
                  }}
                />
                {(chartConfig[key as keyof typeof chartConfig] as { label: string }).label}
              </span>
              <span className="font-mono text-lg font-bold leading-none sm:text-2xl">
                {totals[key].toLocaleString("en-IN")}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No shipment data available for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[220px] w-full"
            aria-label={`Daily ${chartConfig[activeChart].label} shipments`}
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 4, right: 4 }}
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
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                }
              />
              <Bar
                dataKey={activeChart}
                fill={`var(--color-${activeChart})`}
                maxBarSize={28}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
