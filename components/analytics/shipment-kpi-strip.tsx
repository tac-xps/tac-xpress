"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { AnalyticsOverview, TrendValue } from "@/lib/dashboard-metrics"
import { TrendingDown, TrendingUp, Package, Plane, Truck, AlertTriangle } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { staggerContainer, staggerItem, microGestures } from "@/lib/animations"
import { AnimatedCounter } from "@/components/ui/animated-counter"

function TrendNote({
  trend,
  fallback,
  context,
}: {
  trend: TrendValue
  fallback: string
  context: string
}) {
  if (trend === null) {
    return (
      <div className="mt-2 text-xs font-medium text-muted-foreground">
        {fallback}
      </div>
    )
  }

  const isPositive = trend >= 0

  return (
    <div
      className={`mt-2 flex items-center gap-1 text-xs font-medium ${
        isPositive ? "text-status-delivered" : "text-destructive"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="size-3.5" />
      ) : (
        <TrendingDown className="size-3.5" />
      )}
      <span className="tracking-tight tabular-nums">
        {Math.abs(trend).toFixed(1)}%
      </span>
      <span className="ml-1 text-foreground/70">{context}</span>
    </div>
  )
}

type KpiCardProps = {
  label: string
  value: number
  icon: React.ReactNode
  iconClassName: string
  children?: React.ReactNode
  variant?: "default" | "destructive"
}

function KpiCard({
  label,
  value,
  icon,
  iconClassName,
  children,
  variant = "default",
}: KpiCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const isDestructive = variant === "destructive"

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
              className={`flex size-9 items-center justify-center rounded-none transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 ${iconClassName}`}
            >
              {icon}
            </div>
          </div>
          <p
            className={`text-3xl font-bold tracking-tight tabular-nums ${
              isDestructive ? "text-destructive" : "text-foreground"
            }`}
          >
            <AnimatedCounter value={value} />
          </p>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ShipmentKpiStrip({ data }: { data: AnalyticsOverview }) {
  const shouldReduceMotion = useReducedMotion()
  const total = data.dailyVolume.reduce((acc, v) => acc + v.air + v.surface, 0)
  const totalAir = data.dailyVolume.reduce((acc, v) => acc + v.air, 0)
  const totalSurface = data.dailyVolume.reduce((acc, v) => acc + v.surface, 0)
  const totalAtRisk = data.statusBreakdown.atRisk

  return (
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4 lg:gap-6"
    >
      <KpiCard
        label="Total Shipments"
        value={total}
        icon={<Package className="size-4" />}
        iconClassName="bg-primary/10 text-primary"
      >
        <TrendNote
          trend={data.networkVolumeTrend}
          fallback="No prior period baseline"
          context="vs prior period"
        />
      </KpiCard>

      <KpiCard
        label="Air Cargo"
        value={totalAir}
        icon={<Plane className="size-4" />}
        iconClassName="bg-chart-1/10 text-chart-1"
      >
        <div className="mt-2 text-xs font-medium text-muted-foreground">
          {total > 0 ? ((totalAir / total) * 100).toFixed(1) : 0}% of total
        </div>
      </KpiCard>

      <KpiCard
        label="Surface Cargo"
        value={totalSurface}
        icon={<Truck className="size-4" />}
        iconClassName="bg-chart-3/10 text-chart-3"
      >
        <div className="mt-2 text-xs font-medium text-muted-foreground">
          {total > 0 ? ((totalSurface / total) * 100).toFixed(1) : 0}% of total
        </div>
      </KpiCard>

      <KpiCard
        label="SLA At-Risk"
        value={totalAtRisk}
        variant={totalAtRisk > 0 ? "destructive" : "default"}
        icon={<AlertTriangle className="size-4" />}
        iconClassName={
          totalAtRisk > 0
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }
      >
        <div
          className={`mt-2 text-xs font-medium ${
            totalAtRisk > 0 ? "text-destructive/80" : "text-muted-foreground"
          }`}
        >
          {totalAtRisk > 0
            ? "Shipments flagged as delayed"
            : "Zero active SLA breaches"}
        </div>
      </KpiCard>
    </motion.div>
  )
}
