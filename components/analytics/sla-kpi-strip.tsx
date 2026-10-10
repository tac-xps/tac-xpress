"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"
import { Timer, CheckCircle, AlertTriangle, Target, TrendingUp, TrendingDown } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { staggerContainer, staggerItem, microGestures } from "@/lib/animations"
import { AnimatedCounter } from "@/components/ui/animated-counter"

type KpiCardProps = {
  label: string
  numericValue?: number | null
  displayOverride?: string
  suffix?: string
  decimals?: number
  subtext?: string
  trend?: number | null
  icon: React.ReactNode
  iconClassName: string
  variant?: "default" | "destructive"
}

function KpiCard({
  label,
  numericValue,
  displayOverride,
  suffix = "",
  decimals = 0,
  subtext,
  trend,
  icon,
  iconClassName,
  variant = "default",
}: KpiCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const isDestructive = variant === "destructive"
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
          <p
            className={`font-metric-xl ${
              isDestructive ? "text-destructive" : "text-foreground"
            }`}
          >
            {numericValue !== undefined && numericValue !== null ? (
              <AnimatedCounter
                value={numericValue}
                decimals={decimals}
                suffix={suffix}
              />
            ) : (
              displayOverride || "—"
            )}
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
              <span className="text-muted-foreground font-normal">vs prior period</span>
            </div>
          ) : (
            subtext && (
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {subtext}
              </p>
            )
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SlaKpiStrip({ data }: { data: AnalyticsOverview }) {
  const shouldReduceMotion = useReducedMotion()
  const deliveredCount = data.statusBreakdown.delivered
  const atRiskCount = data.statusBreakdown.atRisk

  return (
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4 lg:gap-6"
    >
      <KpiCard
        label="On-Time Delivery Rate"
        numericValue={data.onTimePerformance}
        decimals={1}
        suffix="%"
        displayOverride={data.onTimePerformance === null ? "N/A" : undefined}
        trend={data.onTimePerformanceTrend}
        subtext="Consignments completed on schedule"
        icon={<Timer className="size-4" />}
        iconClassName="bg-primary/10 text-primary"
      />

      <KpiCard
        label="Delivered On Schedule"
        numericValue={deliveredCount}
        subtext="Total fulfilled without breach"
        icon={<CheckCircle className="size-4" />}
        iconClassName="bg-muted text-foreground"
      />

      <KpiCard
        label="SLA At-Risk"
        numericValue={atRiskCount}
        variant={atRiskCount > 0 ? "destructive" : "default"}
        subtext={
          atRiskCount > 0
            ? "Shipments requiring linehaul escalation"
            : "Zero active SLA breaches"
        }
        icon={<AlertTriangle className="size-4" />}
        iconClassName={
          atRiskCount > 0
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }
      />

      <KpiCard
        label="SLA Benchmark Target"
        numericValue={98.5}
        decimals={1}
        suffix="%"
        subtext="Northeast Express commitment"
        icon={<Target className="size-4" />}
        iconClassName="bg-muted text-foreground"
      />
    </motion.div>
  )
}
