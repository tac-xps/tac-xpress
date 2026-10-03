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
import { format, parseISO } from "date-fns"

const chartConfig = {
  views: {
    label: "Shipments",
  },
  air: {
    label: "Air Cargo",
    color: "var(--chart-1)",
  },
  surface: {
    label: "Surface Cargo",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ShipmentVolumeBarChart({
  data,
}: {
  data: Array<{ date: string; air: number; surface: number }>
}) {
  const [activeTab, setActiveTab] = React.useState<"air" | "surface">("air")

  const totals = React.useMemo(
    () => ({
      air: data.reduce((acc, curr) => acc + curr.air, 0),
      surface: data.reduce((acc, curr) => acc + curr.surface, 0),
    }),
    [data]
  )

  const isSparse = data.length < 15

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Daily Network Volume</CardTitle>
          <CardDescription>
            Showing daily bookings by service type in the selected period.
          </CardDescription>
        </div>
        <div className="flex">
          {(["air", "surface"] as const).map((key) => (
            <button
              key={key}
              data-active={activeTab === key}
              className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveTab(key)}
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                <span
                  className="inline-block h-2 w-2 shrink-0"
                  style={{
                    background: (chartConfig[key as keyof typeof chartConfig] as { color?: string })?.color ?? "transparent",
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
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {data.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No data available for this period.
            </div>
          ) : (
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  try {
                    const date = parseISO(value)
                    return format(date, "MMM d")
                  } catch (e) {
                    return value
                  }
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      try {
                        return format(parseISO(value), "MMM d, yyyy")
                      } catch {
                        return value
                      }
                    }}
                  />
                }
              />
              <Bar 
                dataKey={activeTab} 
                fill={`var(--color-${activeTab})`} 
                maxBarSize={isSparse ? 28 : undefined}
                radius={0} 
              />
            </BarChart>
          )}
        </ChartContainer>
        {isSparse && data.length > 0 && data.length < 3 && (
          <p className="text-xs text-muted-foreground text-center mt-3 pb-1">
            Charts will become more detailed as shipment volume increases.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
