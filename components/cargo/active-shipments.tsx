"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard-card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { StatusIndicator } from "@/components/indicator"
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta"
import {
  ShareBarList,
  ShareBarListContent,
  ShareBarListFill,
  ShareBarListItem,
  ShareBarListLabel,
  ShareBarListValue,
} from "@/components/share-bar-list"

const statuses = [
  { label: "In Transit", share: 45 },
  { label: "Out for Delivery", share: 35 },
  { label: "Pending Pickup", share: 20 },
] as const

export function ActiveShipments() {
  return (
    <DashboardCard className="gap-0 pb-0 md:col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b">
        <div className="flex min-w-0 flex-col gap-0">
          <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">
            142
          </CardTitle>
          <CardDescription>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn(
                    "cursor-help px-1 py-px font-normal text-muted-foreground",
                    "hover:underline-0"
                  )}
                  type="button"
                  variant="link"
                >
                  <StatusIndicator />
                  <span>active shipments</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Currently in transit or processing.
              </TooltipContent>
            </Tooltip>
          </CardDescription>
        </div>
        <Delta value={8.5} variant="badge">
          <DeltaIcon variant="trend" />
          <DeltaValue suffix="%" />
        </Delta>
      </CardHeader>
      <CardContent
        className={cn("relative flex h-full items-center px-0 py-2")}
      >
        <ShareBarList>
          {statuses.map((s) => (
            <ShareBarListItem key={s.label} value={s.share}>
              <ShareBarListContent>
                <ShareBarListLabel>{s.label}</ShareBarListLabel>
                <ShareBarListValue>
                  <span className="tracking-tight tabular-nums">
                    {s.share}%
                  </span>
                </ShareBarListValue>
              </ShareBarListContent>
              <ShareBarListFill data-online-bar />
            </ShareBarListItem>
          ))}
        </ShareBarList>
      </CardContent>
    </DashboardCard>
  )
}
