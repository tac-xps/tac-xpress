"use client"

import { cn } from "@/lib/utils"

interface ReviewItemProps {
  label: string
  value: string | number
  className?: string
}

export function ReviewItem({ label, value, className }: ReviewItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-dashed border-border/40 py-2 last:border-0",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground tabular-nums">
        {value || "—"}
      </span>
    </div>
  )
}
