"use client"

import { cn } from "@/lib/utils"
import { Pill, PillIndicator } from "@/components/kibo-ui/pill"

type StatusType =
  | "pending"
  | "in-transit"
  | "out-for-delivery"
  | "delivered"
  | "failed"
  | "cancelled"
  | "active"
  | "inactive"
  | "unpaid"
  | "paid"
  | "processing"
  | "draft"

interface StatusBadgeProps {
  status?: StatusType
  label?: string
  className?: string
  showDot?: boolean
  pulse?: boolean
}

export function StatusBadge({
  status = "pending",
  label,
  className,
  showDot = true,
  pulse = false,
}: StatusBadgeProps) {
  let indicatorVariant: "success" | "error" | "warning" | "info" = "info"
  let pillClass = ""

  switch (status) {
    case "delivered":
    case "active":
    case "paid":
      indicatorVariant = "success"
      pillClass = "border-primary/20 bg-primary/10 text-status-delivered"
      break
    case "failed":
    case "unpaid":
      indicatorVariant = "error"
      pillClass = "border-destructive/20 bg-destructive/10 text-status-failed"
      break
    case "in-transit":
    case "out-for-delivery":
    case "processing":
      indicatorVariant = "warning"
      pillClass =
        "border-status-pending/20 bg-status-pending/10 text-status-pending"
      break
    case "pending":
    case "draft":
    case "cancelled":
    case "inactive":
    default:
      indicatorVariant = "info"
      pillClass =
        "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
      break
  }

  return (
    <Pill
      variant="outline"
      className={cn(
        "h-auto gap-1.5 px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase",
        pillClass,
        className
      )}
    >
      {showDot && <PillIndicator variant={indicatorVariant} pulse={pulse} />}
      {label || status.replace(/-/g, " ")}
    </Pill>
  )
}
