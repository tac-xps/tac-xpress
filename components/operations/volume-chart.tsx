"use client"
import { useState } from "react"
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
  airCargo: { label: "Air cargo", color: "var(--chart-1)" },
  surfaceCargo: { label: "Surface cargo", color: "var(--chart-2)" },
} satisfies ChartConfig
export function VolumeChart({ data }: { data: ShipmentVolumePoint[] }) {
  const [days, setDays] = useState("30")
  const points = data.slice(-Number(days))
  const total = points.reduce(
    (sum, point) => sum + point.airCargo + point.surfaceCargo,
    0
  )
  return (
    <Card className="h-full shadow-none">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle>Shipment volume</CardTitle>
          <CardDescription className="mt-2">
            {total.toLocaleString("en-IN")} bookings in the displayed period
          </CardDescription>
        </div>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger aria-label="Shipment volume period" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="h-64 w-full"
          aria-label={`Daily shipment bookings over the last ${days} days`}
        >
          <BarChart
            accessibilityLayer
            data={points}
            margin={{ top: 12, right: 4, left: 4, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
              tickFormatter={(value: string) =>
                new Date(value + "T12:00:00").toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="airCargo"
              stackId="volume"
              fill="var(--color-airCargo)"
              isAnimationActive={false}
            />
            <Bar
              dataKey="surfaceCargo"
              stackId="volume"
              fill="var(--color-surfaceCargo)"
              isAnimationActive={false}
              radius={0}
            />
          </BarChart>
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
