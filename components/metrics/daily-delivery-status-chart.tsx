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

const chartConfig = {
  volume: {
    label: "Shipments",
  },
  on_time: {
    label: "On-Time",
    color: "var(--chart-1)",
  },
  delayed_minor: {
    label: "Delayed < 1hr",
    color: "var(--chart-2)",
  },
  delayed_major: {
    label: "Delayed > 1hr",
    color: "var(--chart-3)",
  },
  exception: {
    label: "Exception",
    color: "var(--chart-4)",
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
  const totalShipments = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.volume, 0)
  }, [data])

  return (
    <Card className="flex h-full flex-col border-border/40 bg-background/50 shadow-sm backdrop-blur-3xl delay-75">
      <CardHeader className="items-center pt-6 pb-0">
        <CardTitle className="text-base font-semibold tracking-tight">
          Daily Delivery Status
        </CardTitle>
        <CardDescription>Live tracking for today</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
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
