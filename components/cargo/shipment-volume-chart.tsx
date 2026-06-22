"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { formatInteger } from "@/components/formater"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard-card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta"

const chartData = [
  { month: "January", shipments: 555 },
  { month: "February", shipments: 904 },
  { month: "March", shipments: 727 },
  { month: "April", shipments: 801 },
  { month: "May", shipments: 942 },
  { month: "June", shipments: 1048 },
  { month: "July", shipments: 702 },
  { month: "August", shipments: 1103 },
  { month: "September", shipments: 879 },
  { month: "October", shipments: 1046 },
  { month: "November", shipments: 1407 },
  { month: "December", shipments: 1548 },
]

const totalShipments = chartData.reduce((sum, row) => sum + row.shipments, 0)

const chartConfig = {
  shipments: {
    label: "Shipments",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ShipmentVolumeChart() {
  const gradientId = `shipments-area-${useId().replace(/:/g, "")}`

  return (
    <DashboardCard className="md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">
            {formatInteger(totalShipments)}
          </CardTitle>
          <CardDescription className="text-pretty">
            Total shipments in the last 12 months.
          </CardDescription>
        </div>
        <Delta value={12.4} variant="badge">
          <DeltaIcon variant="trend" />
          <DeltaValue suffix="%" />
          <span>vs prior 12 months</span>
        </Delta>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-60 w-full"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            aria-label="Shipment Volume Chart"
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-shipments)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-shipments)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value) => String(value).slice(0, 3)}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dashed" />}
              cursor={{
                stroke: "var(--color-shipments)",
                strokeDasharray: "3 3",
                strokeLinecap: "round",
              }}
              wrapperStyle={{ outline: "none" }}
            />
            <Area
              dataKey="shipments"
              dot={{
                fill: "var(--color-shipments)",
                r: 2.5,
                strokeWidth: 2,
              }}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
              name={chartConfig.shipments.label}
              stroke="var(--color-shipments)"
              strokeWidth={2}
              type="linear"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </DashboardCard>
  )
}
