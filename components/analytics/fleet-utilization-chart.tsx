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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  managed: {
    label: "Managed Vehicles",
    color: "var(--color-primary)",
  },
  registry: {
    label: "Fleet Registry",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

type FleetUtilizationChartProps = {
  managedTotal: number
  managedOperational: number
  registryTotal: number
  registryOperational: number
  data: Array<{
    label: string
    managed: number
    registry: number
  }>
}

export function FleetUtilizationChart({
  managedTotal,
  managedOperational,
  registryTotal,
  registryOperational,
  data,
}: FleetUtilizationChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("managed")

  return (
    <Card className="col-span-1 overflow-hidden border border-border/40 bg-background/50 shadow-sm backdrop-blur-3xl md:col-span-2">
      <CardHeader className="flex flex-col items-stretch border-b border-border/50 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-5">
          <CardTitle className="text-base font-semibold tracking-tight">
            Fleet Availability Snapshot
          </CardTitle>
          <CardDescription>
            Current operational split across managed vehicles and the wider
            fleet registry.
          </CardDescription>
        </div>
        <div className="flex">
          {[
            {
              key: "managed" as const,
              total: managedTotal,
              operational: managedOperational,
            },
            {
              key: "registry" as const,
              total: registryTotal,
              operational: registryOperational,
            },
          ].map((item) => (
            <button
              key={item.key}
              data-active={activeChart === item.key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-border/50 px-6 py-4 text-left transition-colors even:border-l hover:bg-muted/30 data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(item.key)}
              type="button"
            >
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {chartConfig[item.key].label}
              </span>
              <span className="text-xl leading-none font-bold text-foreground sm:text-3xl">
                {item.total.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.operational.toLocaleString()} operational
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-6 pb-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--color-border)"
              strokeOpacity={0.3}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent className="w-[160px] rounded-xl border-border/50 bg-background/80 shadow-xl backdrop-blur-xl" />
              }
            />
            <defs>
              <linearGradient
                id="fleetAvailabilityFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${activeChart})`}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${activeChart})`}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={activeChart}
              stroke={`var(--color-${activeChart})`}
              fillOpacity={1}
              fill="url(#fleetAvailabilityFill)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
