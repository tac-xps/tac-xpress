"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"
import { IndianRupee, TrendingUp, TrendingDown, Users, PackageCheck } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { staggerContainer, staggerItem, microGestures } from "@/lib/animations"
import { AnimatedCounter } from "@/components/ui/animated-counter"

type KpiCardProps = {
  label: string
  numericValue: number
  prefix?: string
  suffix?: string
  decimals?: number
  subtext?: string
  trend?: number | null
  icon: React.ReactNode
  iconClassName: string
}

function KpiCard({
  label,
  numericValue,
  prefix = "",
  suffix = "",
  decimals = 0,
  subtext,
  trend,
  icon,
  iconClassName,
}: KpiCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const isPositive = trend !== undefined && trend !== null && trend >= 0

  return (
    <motion.div
      variants={staggerItem}
      whileHover={shouldReduceMotion ? {} : microGestures.hoverLift}
      className="h-full"
    >
      <Card className="group flex h-full flex-col justify-center overflow-hidden transition-shadow duration-200 hover:shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div
              className={`flex size-9 items-center justify-center rounded-none transition-colors duration-150 ${iconClassName}`}
            >
              {icon}
            </div>
          </div>
          <p className="font-metric-xl text-foreground">
            <AnimatedCounter
              value={numericValue}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          </p>
          {trend !== undefined && trend !== null ? (
            <div
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                isPositive ? "text-foreground font-semibold" : "text-destructive"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              <span className="tabular-nums">{Math.abs(trend).toFixed(1)}%</span>
              <span className="text-muted-foreground font-normal">vs prior month</span>
            </div>
          ) : (
            subtext && <p className="mt-2 text-xs font-medium text-muted-foreground">{subtext}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function RevenueKpiStrip({ data }: { data: AnalyticsOverview }) {
  const shouldReduceMotion = useReducedMotion()
  const totalRevenuePaise = data.revenueByMonth.reduce(
    (acc, curr) => acc + curr.amountPaise,
    0
  )
  const totalCustomers = data.customerGrowthByMonth.reduce(
    (acc, curr) => acc + curr.customers,
    0
  )
  const totalShipments = data.dailyVolume.reduce(
    (acc, curr) => acc + curr.air + curr.surface,
    0
  )

  const revMonths = data.revenueByMonth
  let momTrend: number | null = null
  if (revMonths.length >= 2) {
    const current = revMonths[revMonths.length - 1].amountPaise
    const prev = revMonths[revMonths.length - 2].amountPaise
    if (prev > 0) {
      momTrend = Number((((current - prev) / prev) * 100).toFixed(1))
    }
  }

  const avgYieldRupees =
    totalShipments > 0 ? Math.round(totalRevenuePaise / totalShipments / 100) : 0

  const runRateRupees =
    revMonths.length > 0
      ? Math.round(revMonths[revMonths.length - 1].amountPaise / 100)
      : Math.round(totalRevenuePaise / 100)

  return (
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4 lg:gap-6"
    >
      <KpiCard
        label="Total Billed Revenue"
        numericValue={Math.round(totalRevenuePaise / 100)}
        prefix="₹"
        trend={momTrend}
        subtext="Aggregated across active accounts"
        icon={<IndianRupee className="size-4" />}
        iconClassName="bg-primary/10 text-primary"
      />

      <KpiCard
        label="Active Shipper Accounts"
        numericValue={totalCustomers}
        subtext="Onboarded corporate clients"
        icon={<Users className="size-4" />}
        iconClassName="bg-muted text-foreground"
      />

      <KpiCard
        label="Avg Yield / Consignment"
        numericValue={avgYieldRupees}
        prefix="₹"
        subtext="Freight yield across network"
        icon={<PackageCheck className="size-4" />}
        iconClassName="bg-muted text-foreground"
      />

      <KpiCard
        label="Revenue Run-Rate"
        numericValue={runRateRupees}
        prefix="₹"
        subtext="Latest accounting period"
        icon={<TrendingUp className="size-4" />}
        iconClassName="bg-muted text-foreground"
      />
    </motion.div>
  )
}
