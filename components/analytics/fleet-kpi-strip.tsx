"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"
import { Truck, CheckCircle2, Activity, Wrench } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { staggerContainer, staggerItem, microGestures } from "@/lib/animations"
import { AnimatedCounter } from "@/components/ui/animated-counter"

type KpiCardProps = {
  label: string
  numericValue: number
  suffix?: string
  decimals?: number
  subtext: string
  icon: React.ReactNode
  iconClassName: string
  variant?: "default" | "warning"
}

function KpiCard({
  label,
  numericValue,
  suffix = "",
  decimals = 0,
  subtext,
  icon,
  iconClassName,
  variant = "default",
}: KpiCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const isWarning = variant === "warning"

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
          <p className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
            <AnimatedCounter
              value={numericValue}
              decimals={decimals}
              suffix={suffix}
            />
          </p>
          <p
            className={`mt-2 text-xs font-medium ${isWarning ? "text-foreground/80" : "text-muted-foreground"}`}
          >
            {subtext}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function FleetKpiStrip({ data }: { data: AnalyticsOverview }) {
  const shouldReduceMotion = useReducedMotion()
  const { fleetAvailability } = data
  const totalFleet = fleetAvailability.managedTotal + fleetAvailability.registryTotal
  const totalOperational =
    fleetAvailability.managedOperational + fleetAvailability.registryOperational
  const totalInactive = totalFleet - totalOperational
  const operationalRate =
    totalFleet > 0 ? (totalOperational / totalFleet) * 100 : 0

  return (
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4 lg:gap-6"
    >
      <KpiCard
        label="Total Fleet Assets"
        numericValue={totalFleet}
        subtext={`${fleetAvailability.managedTotal} managed · ${fleetAvailability.registryTotal} registry`}
        icon={<Truck className="size-4" />}
        iconClassName="bg-primary/10 text-primary"
      />

      <KpiCard
        label="Operational Ready"
        numericValue={totalOperational}
        subtext="Available for linehaul & dispatch"
        icon={<CheckCircle2 className="size-4" />}
        iconClassName="bg-muted text-foreground"
      />

      <KpiCard
        label="Fleet Availability Rate"
        numericValue={operationalRate}
        decimals={1}
        suffix="%"
        subtext="Operational ratio across fleet"
        icon={<Activity className="size-4" />}
        iconClassName="bg-muted text-foreground"
      />

      <KpiCard
        label="Maintenance & Off-Road"
        numericValue={totalInactive}
        subtext="In depot or scheduled service"
        variant={totalInactive > 0 ? "warning" : "default"}
        icon={<Wrench className="size-4" />}
        iconClassName="bg-muted text-muted-foreground"
      />
    </motion.div>
  )
}
