import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type LogisticsStatus =
  | "pending"
  | "draft"
  | "booked"
  | "in-transit"
  | "in_transit"
  | "processing"
  | "out-for-delivery"
  | "delivered"
  | "active"
  | "paid"
  | "failed"
  | "unpaid"
  | "delayed"
  | "at-risk"
  | "at_risk"
  | "corridor"
  | string

export interface StatusBadgeProps {
  status?: LogisticsStatus
  label?: string
  className?: string
  showDot?: boolean
  pulse?: boolean
}

type BadgeLogisticsVariant =
  | "pending"
  | "transit"
  | "delivered"
  | "failed"
  | "corridor"
  | "neutral"

function resolveBadgeVariant(status: string): {
  variant: BadgeLogisticsVariant
  isTransit: boolean
} {
  const norm = status.toLowerCase().trim()
  if (["delivered", "active", "paid"].includes(norm)) {
    return { variant: "delivered", isTransit: false }
  }
  if (["failed", "unpaid", "delayed", "at-risk", "at_risk"].includes(norm)) {
    return { variant: "failed", isTransit: false }
  }
  if (
    ["in-transit", "in_transit", "processing", "out-for-delivery"].includes(
      norm
    )
  ) {
    return { variant: "transit", isTransit: true }
  }
  if (["pending", "draft", "booked"].includes(norm)) {
    return { variant: "pending", isTransit: false }
  }
  if (["corridor"].includes(norm)) {
    return { variant: "corridor", isTransit: false }
  }
  return { variant: "neutral", isTransit: false }
}

export function StatusBadge({
  status = "pending",
  label,
  className,
  showDot = true,
  pulse,
}: StatusBadgeProps) {
  const { variant, isTransit } = resolveBadgeVariant(status)
  const isPulsing =
    pulse !== undefined ? pulse : isTransit || status === "active"

  return (
    <Badge
      variant={variant}
      className={cn(
        "gap-1.5 text-xs font-medium capitalize transition-colors duration-200",
        className
      )}
    >
      {showDot && (
        <span
          className="relative flex size-2 items-center justify-center shrink-0"
          aria-hidden="true"
        >
          {isPulsing && (
            <span className="absolute inline-flex size-full animate-ping rounded-none bg-current opacity-70" />
          )}
          <span className="relative inline-flex size-1.5 rounded-none bg-current" />
        </span>
      )}
      <span>{label || status.replaceAll("-", " ").replaceAll("_", " ")}</span>
    </Badge>
  )
}
