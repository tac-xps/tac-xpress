"use client"
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import type { ShipmentVolumePoint } from "@/lib/dashboard-metrics"

const config = {
  airCargo: {
    label: "Air cargo",
    color: "var(--chart-1)",
  },
  surfaceCargo: {
    label: "Surface cargo",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function VolumeChart({ data }: { data: ShipmentVolumePoint[] }) {
  const baseId = React.useId().replace(/:/g, "")
  const airGradientId = `fillAirCargo-${baseId}`
  const surfaceGradientId = `fillSurfaceCargo-${baseId}`
  const [timeRange, setTimeRange] = React.useState("90")

  const filteredData = React.useMemo(() => {
    return data.slice(-Number(timeRange))
  }, [data, timeRange])

  const total = React.useMemo(
    () =>
      filteredData.reduce(
        (sum, point) => sum + point.airCargo + point.surfaceCargo,
        0
      ),
    [filteredData]
  )

  const airTotal = React.useMemo(
    () => filteredData.reduce((sum, p) => sum + p.airCargo, 0),
    [filteredData]
  )

  const surfaceTotal = React.useMemo(
    () => filteredData.reduce((sum, p) => sum + p.surfaceCargo, 0),
    [filteredData]
  )

  return (
    <Card className="h-full border border-border/80 shadow-xs pt-0">
      <CardHeader className="flex flex-col gap-0 border-b py-5 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0">
        <div className="grid flex-1 gap-1">
          <CardTitle>Shipment volume trend</CardTitle>
          <CardDescription>
            {total.toLocaleString("en-IN")}{" "}
            {total === 1 ? "booking" : "bookings"} in the displayed period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] sm:ml-auto"
            aria-label="Shipment volume period"
          >
            <SelectValue placeholder="Last 90 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Summary totals strip */}
      <div className="grid grid-cols-3 border-b border-border/60">
        <div className="flex flex-col gap-0.5 px-5 py-3 border-r border-border/60">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="font-mono text-base font-semibold text-foreground">
            {total.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 px-5 py-3 border-r border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 bg-chart-1" />
            Air
          </span>
          <span className="font-mono text-base font-semibold text-chart-1">
            {airTotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 px-5 py-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 bg-chart-2" />
            Surface
          </span>
          <span className="font-mono text-base font-semibold text-chart-2">
            {surfaceTotal.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={config}
          className="aspect-auto h-[250px] w-full"
          aria-label={`Daily shipment bookings over the last ${timeRange} days`}
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id={airGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-airCargo)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-airCargo)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id={surfaceGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-surfaceCargo)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-surfaceCargo)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickMargin={4}
              allowDecimals={false}
              width={28}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const dateStr = String(value)
                    return new Date(dateStr + "T12:00:00").toLocaleDateString("en-IN", {
                      weekday: "short",
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
              type="linear"
              fill={`url(#${surfaceGradientId})`}
              stroke="var(--color-surfaceCargo)"
              strokeWidth={1.5}
              stackId="volume"
              isAnimationActive={false}
            />
            <Area
              dataKey="airCargo"
              type="linear"
              fill={`url(#${airGradientId})`}
              stroke="var(--color-airCargo)"
              strokeWidth={1.5}
              stackId="volume"
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent className="pt-3" />} />
          </AreaChart>
        </ChartContainer>
        {!total && (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            No bookings recorded in this period.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
