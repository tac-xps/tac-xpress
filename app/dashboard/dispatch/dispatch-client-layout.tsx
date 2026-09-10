"use client"
import { DispatchBoardItem } from "./dispatch-board-item"
import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/operations/page-header"
import { CreateDispatchDialog } from "./create-dispatch-dialog"
import { DispatchClientTable } from "./dispatch-client-table"
import { PageNavigation } from "@/components/ui/page-navigation"
import type { Shipment, Manifest } from "@/lib/db/schema"
export interface QueueItem {
  id: string
  shipmentId?: string
  type: string
  route: string
  time: string
  column: string
  name?: string
  isAssigned?: boolean
}
export function DispatchClientLayout({
  pendingShipments,
  queueItems,
  dispatchRuns,
  page,
  hasNext,
  view,
}: {
  pendingShipments: Shipment[]
  queueItems: QueueItem[]
  dispatchRuns: Manifest[]
  page: number
  hasNext: boolean
  view: string
}) {
  const [query, setQuery] = useState("")
  const items = useMemo(
    () =>
      queueItems.filter((item) =>
        (item.id + " " + item.route).toLowerCase().includes(query.toLowerCase())
      ),
    [query, queueItems]
  )
  const columns = [
    {
      id: "pending",
      name: "Pending handover",
      detail: "Prepare a run or review the existing assignment",
    },
    {
      id: "in_transit",
      name: "In transit",
      detail: "Follow recorded shipment progress",
    },
  ]
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Dispatch"
        description="Plan pickup and delivery runs, assign the load and follow recorded progress."
      >
        <CreateDispatchDialog pendingShipments={pendingShipments} />
      </PageHeader>
      <Tabs defaultValue={view}>
        <TabsList>
          <TabsTrigger value="board">Active shipment board</TabsTrigger>
          <TabsTrigger value="runs">Dispatch runs</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="mt-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              Latest 100 active shipments. Status changes are recorded through
              shipment events and manifest finalization.
            </p>
            <div className="grid gap-2 sm:w-72">
              <Label htmlFor="dispatch-filter">Find on this board</Label>
              <Input
                id="dispatch-filter"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="AWB or route"
              />
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {columns.map((column) => (
              <Card key={column.id} className="h-fit shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{column.name}</CardTitle>
                    <Badge variant="secondary">
                      {items.filter((item) => item.column === column.id).length}
                    </Badge>
                  </div>
                  <CardDescription>{column.detail}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {items
                    .filter((item) => item.column === column.id)
                    .map((item) => (
                      <DispatchBoardItem
                        key={item.id}
                        item={item}
                        pendingShipments={pendingShipments}
                      />
                    ))}
                  {!items.some((item) => item.column === column.id) && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No matching shipments in this queue.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="runs" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle>Pickup & delivery runs</CardTitle>
              <CardDescription>
                Review assignments and recorded run status
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <DispatchClientTable dispatchRuns={dispatchRuns} />
              <PageNavigation
                page={page}
                hasNext={hasNext}
                pathname="/dashboard/dispatch"
                query={{ view: "runs" }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
