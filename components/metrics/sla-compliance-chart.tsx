"use client"

import { PolarGrid, RadialBar, RadialBarChart } from "recharts"

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

export const description = "A radial chart with a grid"

const chartConfig = {
  volume: {
    label: "Volume",
  },
  north: {
    label: "North Zone",
    color: "var(--chart-1)",
  },
  south: {
    label: "South Zone",
    color: "var(--chart-2)",
  },
  east: {
    label: "East Zone",
    color: "var(--chart-3)",
  },
  west: {
    label: "West Zone",
    color: "var(--chart-4)",
  },
  central: {
    label: "Central",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function SlaComplianceChart({
  data,
  complianceRate,
}: {
  data: { priority: string; compliant: number; fill: string }[]
  complianceRate: number | null
}) {
  return (
    <Card className="flex h-full flex-col border-border/40 bg-background/50 shadow-sm backdrop-blur-3xl delay-0">
      <CardHeader className="items-center pt-6 pb-0">
        <CardTitle className="text-base font-semibold tracking-tight">
          SLA Compliance by Zone
        </CardTitle>
        <CardDescription>Deliveries within SLA limits</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={data} innerRadius={30} outerRadius={100}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="priority" />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="compliant" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-4 flex-col gap-2 pb-6 text-sm">
        <div className="leading-none font-medium">
          {complianceRate === null
            ? "No SLA records in this period"
            : `${complianceRate.toFixed(1)}% compliant in the last 30 days`}
        </div>
        <div className="text-center text-xs leading-none text-muted-foreground">
          Resolved and active support tickets grouped by priority
        </div>
      </CardFooter>
    </Card>
  )
}
