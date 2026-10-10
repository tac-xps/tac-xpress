"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"

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
  volume: {
    label: "Shipments",
    color: "var(--chart-1)",
  },
  route: {
    label: "Route",
    color: "var(--foreground)",
  },
} satisfies ChartConfig

export function TopRoutesChart({
  routes,
}: {
  routes: Array<{ route: string; volume: number }>
}) {
  return (
    <Card>
      <CardHeader className="border-b p-5">
        <CardTitle>Top routes</CardTitle>
        <CardDescription>Highest volume origin-destination pairs.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {routes.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No route data found for this period.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart
              accessibilityLayer
              data={routes}
              layout="vertical"
              margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <YAxis
                dataKey="route"
                type="category"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 24) + (value.length > 24 ? "…" : "")}
                width={140}
                tickMargin={10}
                className="text-xs font-medium"
              />
              <XAxis dataKey="volume" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar 
                dataKey="volume" 
                fill="var(--color-volume)" 
                radius={0}
                barSize={20}
              >
                <LabelList
                  dataKey="volume"
                  position="right"
                  offset={8}
                  className="fill-foreground font-mono text-xs font-semibold"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
