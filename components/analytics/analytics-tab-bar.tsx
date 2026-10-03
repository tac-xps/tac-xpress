"use client"

import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs"
import { Package, Truck, Activity, Landmark } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { springs } from "@/lib/animations"

interface AnalyticsTabBarProps {
  value: string
  onValueChange: (value: string) => void
}

const TABS = [
  { value: "shipments", label: "Shipments", icon: Package },
  { value: "fleet", label: "Fleet", icon: Truck },
  { value: "sla", label: "SLA", icon: Activity },
  { value: "revenue", label: "Revenue", icon: Landmark },
] as const

export function AnalyticsTabBar({ value, onValueChange }: AnalyticsTabBarProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="h-9 inline-flex items-center justify-start rounded-none bg-muted/80 p-1 text-muted-foreground relative">
        {TABS.map(({ value: tabVal, label, icon: Icon }) => {
          const isActive = value === tabVal
          return (
            <TabsTrigger
              key={tabVal}
              value={tabVal}
              className="relative inline-flex items-center justify-center rounded-none px-3.5 py-1 text-xs font-medium whitespace-nowrap gap-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground z-10 transition-colors"
            >
              <Icon className="size-3.5 relative z-10 shrink-0" />
              <span className="relative z-10">{label}</span>
              {isActive && (
                <motion.span
                  layoutId="analytics-active-tab-pill"
                  className="absolute inset-0 rounded-none bg-background shadow-xs z-0"
                  transition={shouldReduceMotion ? { duration: 0 } : springs.smooth}
                  aria-hidden="true"
                />
              )}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
