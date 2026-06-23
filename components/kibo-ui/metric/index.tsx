"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

const kpiVariants = cva(
  "relative rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-l-4 border-l-primary",
        accent: "border-l-4 border-l-chart-1",
        success: "border-l-4 border-l-chart-2",
        warning: "border-l-4 border-l-chart-3",
        danger: "border-l-4 border-l-destructive",
        neutral: "border-l-4 border-l-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface KpiMetricProps extends VariantProps<typeof kpiVariants> {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  trendLabel?: string
  icon?: LucideIcon
  className?: string
  loading?: boolean
}

export function KpiMetric({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  trendLabel,
  icon: Icon,
  variant,
  className,
  loading,
}: KpiMetricProps) {
  if (loading) {
    return (
      <div className={cn(kpiVariants({ variant }), className)}>
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse bg-muted" />
          <div className="h-8 w-32 animate-pulse bg-muted" />
          <div className="h-3 w-24 animate-pulse bg-muted" />
        </div>
      </div>
    )
  }

  const trendConfig = {
    up: { icon: TrendingUp, color: "text-trend-positive", bg: "bg-primary/10" },
    down: {
      icon: TrendingDown,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted" },
  }

  const TrendIcon = trend ? trendConfig[trend].icon : null
  const trendColor = trend ? trendConfig[trend].color : ""

  return (
    <div className={cn(kpiVariants({ variant }), className)}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 space-y-1.5">
          <p className="truncate text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-[var(--font-data)] font-bold tracking-tight tabular-nums">
              {value}
            </span>
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="ml-2 shrink-0 bg-muted p-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {trend && TrendIcon && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              trendColor
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {trendValue}
          </span>
          {trendLabel && (
            <span className="text-muted-foreground">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
