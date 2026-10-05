"use client"

import Link from "next/link"
import type { DashboardStats } from "@/lib/dashboard-metrics"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { motion, useReducedMotion } from "motion/react"
import { staggerContainer, staggerItem, microGestures } from "@/lib/animations"
import { Package, Plane, Truck, ArrowLeftRight } from "lucide-react"

export function OverviewMetrics({ stats }: { stats: DashboardStats }) {
  const shouldReduceMotion = useReducedMotion()

  const metrics = [
    {
      label: "Shipments",
      value: stats.totalDispatches,
      href: "/dashboard/shipments",
      icon: Package,
    },
    {
      label: "Air cargo",
      value: stats.airCargo,
      href: "/dashboard/operations/air-cargo",
      icon: Plane,
    },
    {
      label: "Surface cargo",
      value: stats.surfaceCargo,
      href: "/dashboard/operations/surface-cargo",
      icon: Truck,
    },
    {
      label: "Pickup & delivery runs",
      value: stats.pickDrop,
      href: "/dashboard/dispatch",
      icon: ArrowLeftRight,
    },
  ]

  return (
    <section
      aria-label="All-time operational totals"
      className="overflow-hidden rounded-none border border-border/80 bg-card shadow-xs transition-shadow duration-200 hover:shadow-sm"
    >
      <div className="border-b border-border/80 bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground flex items-center justify-between">
        <span>All-time totals · excludes deleted shipments</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/70">
          <span className="size-1.5 rounded-none bg-status-delivered animate-pulse" />
          Live
        </span>
      </div>
      <motion.dl
        variants={staggerContainer}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        className="grid grid-cols-2 gap-y-6 p-5 lg:grid-cols-4"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              variants={staggerItem}
              whileHover={shouldReduceMotion ? {} : microGestures.hoverLift}
              className="group px-1 lg:border-l lg:px-6 lg:first:border-0 lg:first:pl-0 transition-colors"
            >
              <dt className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground/80 transition-transform duration-150 group-hover:scale-110 group-hover:text-primary" />
                <Link
                  href={metric.href}
                  className="hover:text-foreground hover:underline transition-colors"
                >
                  {metric.label}
                </Link>
              </dt>
              <dd className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-foreground">
                <AnimatedCounter value={metric.value} />
              </dd>
            </motion.div>
          )
        })}
      </motion.dl>
    </section>
  )
}
