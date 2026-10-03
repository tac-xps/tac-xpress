"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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
  count: {
    label: "Shipments",
  },
  delivered: {
    label: "Delivered",
    color: "var(--chart-1)",
  },
  inTransit: {
    label: "In Transit",
    color: "var(--chart-2)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
  },
  atRisk: {
    label: "At Risk",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function ShipmentStatusDonut({
  data,
}: {
  data: {
    delivered: number
    inTransit: number
    pending: number
    atRisk: number
  }
}) {
  const chartData = [
    { status: "delivered" as const, count: data.delivered, fill: "var(--color-delivered)" },
    { status: "inTransit" as const, count: data.inTransit, fill: "var(--color-inTransit)" },
    { status: "pending" as const, count: data.pending, fill: "var(--color-pending)" },
  ].filter((item) => item.count > 0)

  const totalShipments = React.useMemo(() => {
    return data.delivered + data.inTransit + data.pending
  }, [data.delivered, data.inTransit, data.pending])

  // Primary lifecycle statuses for the legend
  const legendItems = [
    { key: "delivered" as const, label: "Delivered", count: data.delivered, color: chartConfig.delivered.color },
    { key: "inTransit" as const, label: "In Transit", count: data.inTransit, color: chartConfig.inTransit.color },
    { key: "pending" as const, label: "Pending", count: data.pending, color: chartConfig.pending.color },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 border-b p-5">
        <CardTitle>Current Status Breakdown</CardTitle>
        <CardDescription>
          Distribution of shipments booked in this period.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex flex-col items-center justify-center min-h-[300px]">
        {totalShipments === 0 ? (
          <div className="text-sm text-muted-foreground py-10">No shipments found.</div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[220px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={55}
                  outerRadius={85}
                  strokeWidth={3}
                  stroke="var(--card)"
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
                              className="fill-muted-foreground text-xs"
                            >
                              Total
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full pt-4 pb-5 border-t mt-2 px-2">
              {legendItems.map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-block size-2.5 rounded-none shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground truncate">{item.label}</span>
                  <span className="ml-auto font-semibold tabular-nums text-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
              {data.atRisk > 0 && (
                <div className="col-span-2 mt-2 flex items-center justify-between border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive">
                  <span className="font-medium">SLA Risk Watch</span>
                  <span className="font-mono font-bold tabular-nums">
                    {data.atRisk} shipments
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
