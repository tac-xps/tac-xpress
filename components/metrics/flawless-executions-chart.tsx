"use client"

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
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

export const description = "A radial chart with a custom shape"

const chartConfig = {
  volume: {
    label: "Executions",
  },
  flawless: {
    label: "Flawless",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

export function FlawlessExecutionsChart({
  onTimeCount,
  deliveredCount,
}: {
  onTimeCount: number
  deliveredCount: number
}) {
  const chartData = [
    {
      metric: "flawless",
      volume: deliveredCount === 0 ? 0 : (onTimeCount / deliveredCount) * 100,
      fill: "var(--color-flawless)",
    },
  ]
  return (
    <Card className="flex h-full flex-col border-border/40 bg-background/50 shadow-sm backdrop-blur-3xl delay-150">
      <CardHeader className="items-center pt-6 pb-0">
        <CardTitle className="text-base font-semibold tracking-tight">
          Flawless Executions
        </CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={65}
            outerRadius={95}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="volume" background />
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {onTimeCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          On-time
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
      <CardFooter className="mt-4 flex-col gap-2 pb-6 text-sm">
        <div className="leading-none font-medium text-primary">
          {deliveredCount === 0
            ? "No delivered shipments in this period"
            : `${((onTimeCount / deliveredCount) * 100).toFixed(1)}% on-time delivery`}
        </div>
        <div className="text-center text-xs leading-none text-muted-foreground">
          Showing total flawlessly executed deliveries for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
