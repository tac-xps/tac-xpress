"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

const STATUS_COLORS: Record<string, string> = {
  on_time: "var(--status-delivered)",
  delayed_minor: "var(--status-pending)",
  delayed_major: "var(--chart-4)",
  exception: "var(--status-failed)",
  returned: "var(--chart-5)",
}

const chartConfig = {
  volume: {
    label: "Shipments",
  },
  on_time: {
    label: "On-Time",
    color: "var(--status-delivered)",
  },
  delayed_minor: {
    label: "Delayed < 1hr",
    color: "var(--status-pending)",
  },
  delayed_major: {
    label: "Delayed > 1hr",
    color: "var(--chart-4)",
  },
  exception: {
    label: "Exception",
    color: "var(--status-failed)",
  },
  returned: {
    label: "Returned",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function DailyDeliveryStatusChart({
  data,
}: {
  data: { status: string; volume: number; fill: string }[]
}) {
  const normalizedData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      fill: STATUS_COLORS[item.status] || item.fill || "var(--chart-1)",
    }))
  }, [data])

  const totalShipments = React.useMemo(() => {
    return normalizedData.reduce((acc, curr) => acc + curr.volume, 0)
  }, [normalizedData])

  return (
    <Card className="flex h-full flex-col shadow-none">
      <CardHeader className="items-center pt-6 pb-0">
        <CardTitle className="text-base font-semibold tracking-tight">
          Bookings today
        </CardTitle>
        <CardDescription>Current status / booking day in UTC</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={normalizedData}
              dataKey="volume"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalShipments.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Shipments
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-4 flex-col gap-2 pb-6 text-sm">
        <div className="leading-none font-medium text-status-pending">
          {totalShipments === 0
            ? "No shipments booked today"
            : `${totalShipments.toLocaleString()} shipments booked today`}
        </div>
        <div className="text-center text-xs leading-none text-muted-foreground">
          Current shipment status distribution for the 24h cycle
        </div>
      </CardFooter>
    </Card>
  )
}
