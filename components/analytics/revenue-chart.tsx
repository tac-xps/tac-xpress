"use client"

import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function formatCurrency(amountPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100)
}

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`))
}

export function RevenueChart({
  data,
  period,
}: {
  data: Array<{ month: string; amountPaise: number }>
  period?: string
}) {
  const chartData = data.map((d) => ({
    month: formatMonth(d.month),
    revenue: d.amountPaise / 100,
  }))

  const totalRevenue = data.reduce((acc, curr) => acc + curr.amountPaise, 0)
  
  // Calculate trend
  const currentMonth = data[data.length - 1]?.amountPaise || 0
  const previousMonth = data[data.length - 2]?.amountPaise || 0
  
  let trend = 0
  if (previousMonth > 0) {
    trend = ((currentMonth - previousMonth) / previousMonth) * 100
  }

  const descriptionText =
    period === "all"
      ? "All-time billed freight revenue"
      : period === "lastmonth"
      ? "Billed revenue for prior month"
      : period === "month"
      ? "Billed revenue for current month"
      : period
      ? `Billed revenue for selected period (${period})`
      : "Billed revenue across reporting period"

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>
          {descriptionText}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="text-3xl font-bold tracking-tight mb-6">
          {formatCurrency(totalRevenue)}
          <span className="text-sm font-normal text-muted-foreground ml-2">total</span>
        </div>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value: any) => `₹${Number(value || 0).toLocaleString("en-IN")}`}
                />
              }
            />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="revenue"
              type="linear"
              fill="url(#fillRevenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-6">
        <div className="flex gap-2 font-medium leading-none">
          {trend >= 0 ? (
            <>
              Trending up by {trend.toFixed(1)}% this month <TrendingUp className="h-4 w-4 text-status-delivered" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(trend).toFixed(1)}% this month <TrendingDown className="h-4 w-4 text-destructive" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Billed revenue across all services.
        </div>
      </CardFooter>
    </Card>
  )
}
