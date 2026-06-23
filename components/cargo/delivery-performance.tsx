"use client"

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard-card"
import {
  ShareBarList,
  ShareBarListContent,
  ShareBarListFill,
  ShareBarListItem,
  ShareBarListLabel,
  ShareBarListValue,
} from "@/components/share-bar-list"

const performanceMetrics = [
  { label: "On Time", share: 88 },
  { label: "Delayed", share: 9 },
  { label: "Failed / Returned", share: 3 },
] as const

export function DeliveryPerformance() {
  return (
    <DashboardCard className="">
      <CardHeader className="border-b">
        <CardTitle className="text-balance">Delivery Performance</CardTitle>
        <CardDescription className="text-pretty">
          Share of shipments by delivery outcome.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 py-1">
        <ShareBarList aria-label="Shipments by delivery performance">
          {performanceMetrics.map((row) => (
            <ShareBarListItem key={row.label} value={row.share}>
              <ShareBarListContent>
                <ShareBarListLabel>{row.label}</ShareBarListLabel>
                <ShareBarListValue>
                  <span className="tracking-tight tabular-nums">
                    {row.share}%
                  </span>
                </ShareBarListValue>
              </ShareBarListContent>
              <ShareBarListFill />
            </ShareBarListItem>
          ))}
        </ShareBarList>
      </CardContent>
    </DashboardCard>
  )
}
