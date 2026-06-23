"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import type { ShipmentVolumePoint } from "@/lib/dashboard-metrics"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Package } from "lucide-react"

const chartConfig = {
  tonnage: {
    label: "Volume",
  },
  airCargo: {
    label: "Air Cargo",
    color: "var(--color-chart-1)",
  },
  surfaceCargo: {
    label: "Surface Cargo",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

type SalesOverviewChartProps = {
  data: ShipmentVolumePoint[]
}

export function SalesOverviewChart({ data }: SalesOverviewChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = React.useMemo(() => {
    if (data.length === 0) {
      return []
    }

    const referenceDate = new Date(data[data.length - 1].date)
    const daysToSubtract =
      timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return data.filter((item) => new Date(item.date) >= startDate)
  }, [data, timeRange])

  const hasData = filteredData.some(
    (item) => item.airCargo > 0 || item.surfaceCargo > 0
  )

  return (
    <Card className="h-full delay-300">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base font-semibold tracking-tight">
            Shipment Volume
          </CardTitle>
          <CardDescription>
            Daily shipment counts for the selected period.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-none sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="90d" className="rounded-none">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-none">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-none">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillAirCargo" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-airCargo)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-airCargo)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillSurfaceCargo"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-surfaceCargo)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-surfaceCargo)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="surfaceCargo"
                type="natural"
                fill="url(#fillSurfaceCargo)"
                stroke="var(--color-surfaceCargo)"
                stackId="a"
              />
              <Area
                dataKey="airCargo"
                type="natural"
                fill="url(#fillAirCargo)"
                stroke="var(--color-airCargo)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <Empty className="min-h-[250px] border border-dashed border-border/60 bg-muted/10">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <Package className="size-4" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No shipment data yet</EmptyTitle>
                <EmptyDescription>
                  Shipment volume will appear here after bookings start flowing
                  into the platform.
                </EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
