"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
} from "@/components/ui/chart"
export function SlaComplianceChart({
  data,
  complianceRate,
}: {
  data: { priority: string; compliant: number; fill: string }[]
  complianceRate: number | null
}) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Ticket SLA by priority</CardTitle>
        <CardDescription>Requests created in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-3xl font-medium tabular-nums">
          {complianceRate === null
            ? "No data"
            : `${complianceRate.toFixed(1)}%`}
        </p>
        <ChartContainer
          config={{
            compliant: { label: "Within SLA", color: "var(--chart-1)" },
          }}
          className="h-44 w-full"
          aria-label="Assessed tickets within SLA by priority"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="priority"
              tick={{ fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="compliant"
              fill="var(--color-compliant)"
              radius={0}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Only tickets with a recorded SLA assessment contribute to the
          percentage. Bars show the count within SLA.
        </p>
      </CardContent>
    </Card>
  )
}
