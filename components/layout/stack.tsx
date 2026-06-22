import * as React from "react"
import { cn } from "@/lib/utils"

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  space?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
}

const spaceMap = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
}

export function Stack({ className, space = "md", ...props }: StackProps) {
  return (
    <div
      className={cn("flex flex-col", spaceMap[space], className)}
      {...props}
    />
  )
}
