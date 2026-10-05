"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { format, eachMonthOfInterval } from "date-fns"

const chartConfig = {
  customers: {
    label: "New Customers",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}-15T12:00:00Z`))
}

function fillMissingMonths(data: Array<{ month: string; customers: number }>) {
  if (data.length === 0) {
    const currentMonthKey = format(new Date(), "yyyy-MM")
    return [{ month: currentMonthKey, customers: 0 }]
  }

  const map = new Map<string, number>()
  for (const item of data) {
    map.set(item.month, item.customers)
  }

  const sortedMonths = [...data].map((d) => d.month).sort()
  const earliestStr = sortedMonths[0]
  const latestStr = sortedMonths[sortedMonths.length - 1]

  const earliestDate = new Date(`${earliestStr}-15T12:00:00Z`)
  const latestDate = new Date(`${latestStr}-15T12:00:00Z`)

  const intervalMonths = eachMonthOfInterval({
    start: earliestDate <= latestDate ? earliestDate : latestDate,
    end: latestDate,
  })

  return intervalMonths.map((m) => {
    const key = format(m, "yyyy-MM")
    return {
      month: key,
      customers: map.get(key) || 0,
    }
  })
}

export function CustomerGrowthChart({
  data,
  period,
}: {
  data: Array<{ month: string; customers: number }>
  period?: string
}) {
  const normalizedData = React.useMemo(() => fillMissingMonths(data), [data])

  const chartData = normalizedData.map((d) => ({
    month: formatMonth(d.month),
    customers: d.customers,
  }))

  const totalCustomers = data.reduce((acc, curr) => acc + curr.customers, 0)
  
  // Calculate trend using calendar months
  const currentMonth = normalizedData[normalizedData.length - 1]?.customers ?? 0
  const previousMonth = normalizedData[normalizedData.length - 2]?.customers ?? 0
  
  let trend: number | null = null
  if (normalizedData.length >= 2) {
    if (previousMonth > 0) {
      trend = ((currentMonth - previousMonth) / previousMonth) * 100
    } else if (currentMonth > 0) {
      trend = 100
    } else {
      trend = 0
    }
  }

  const descriptionText =
    period === "all"
      ? "All-time new customer accounts"
      : period === "lastmonth"
      ? "New user registrations for prior month"
      : period === "month"
      ? "New user registrations for current month"
      : period
      ? `New user registrations for selected period (${period})`
      : "New user registrations over reporting period"

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Customer Growth</CardTitle>
        <CardDescription>
          {descriptionText}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="text-3xl font-bold tracking-tight">
            {totalCustomers.toLocaleString("en-IN")}
          </div>
          <div className="text-sm font-normal text-muted-foreground">new customers</div>
        </div>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="customers"
              fill="var(--color-customers)"
              radius={0}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-6">
        <div className="flex gap-2 font-medium leading-none">
          {trend === null ? (
            <span className="text-muted-foreground">Insufficient monthly data for trend</span>
          ) : trend >= 0 ? (
            <>
              Up by {trend.toFixed(1)}% this month <TrendingUp className="h-4 w-4 text-status-delivered" />
            </>
          ) : (
            <>
              Down by {Math.abs(trend).toFixed(1)}% this month <TrendingDown className="h-4 w-4 text-destructive" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Shows net new customers onboarding to the portal.
        </div>
      </CardFooter>
    </Card>
  )
}
