import * as React from "react"
import { cn } from "@/lib/utils"

export interface DataLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

export function DataLabel({ className, children, ...props }: DataLabelProps) {
  return (
    <span
      className={cn(
        "text-sm font-medium tracking-wider text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
