import * as React from "react"
import { cn } from "@/lib/utils"

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  space?: "none" | "xs" | "sm" | "md" | "lg"
  align?: "start" | "center" | "end" | "baseline"
  justify?: "start" | "center" | "end" | "between" | "around"
}

const spaceMap = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
}

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
}

export function Cluster({
  className,
  space = "md",
  align = "center",
  justify = "start",
  ...props
}: ClusterProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap",
        spaceMap[space],
        alignMap[align],
        justifyMap[justify],
        className
      )}
      {...props}
    />
  )
}
