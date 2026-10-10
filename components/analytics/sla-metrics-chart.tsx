"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartConfig = {
  performance: {
    label: "On-Time Performance",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SlaMetricsChart({
  onTimePerformance,
  trend,
  atRiskCount,
}: {
  onTimePerformance: number | null
  trend: number | null
  atRiskCount: number
}) {
  const value = onTimePerformance ?? 0
  const chartData = [
    { name: "Performance", value, fill: "var(--color-performance)" },
  ]

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>On-time performance</CardTitle>
        <CardDescription>Overall SLA adherence</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 + (value / 100) * 360}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={0} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground font-mono text-3xl font-semibold"
                        >
                          {onTimePerformance === null
                            ? "N/A"
                            : `${onTimePerformance.toFixed(1)}%`}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Delivered on-time
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm pt-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center flex-1 border-r border-border">
            <div className="flex gap-2 font-medium leading-none mb-1">
              Trend
            </div>
            {trend !== null ? (
              <div className="flex items-center text-muted-foreground">
                {trend >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-status-delivered mr-1" />
                    +{trend.toFixed(1)}%
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                    {trend.toFixed(1)}%
                  </>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground text-xs">No data</div>
            )}
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="flex gap-2 font-medium leading-none mb-1 text-destructive">
              <AlertTriangle className="h-4 w-4" /> At Risk
            </div>
            <div className="text-muted-foreground font-bold">
              {atRiskCount.toLocaleString("en-IN")} Shipments
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
