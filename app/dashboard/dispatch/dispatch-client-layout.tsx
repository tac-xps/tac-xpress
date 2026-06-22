"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Truck,
  MapPin,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  Map,
  KanbanSquare,
  FileText,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { CreateDispatchDialog } from "./create-dispatch-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban"
import { DispatchIcon } from "@/components/icons/sidebar-icons"
import { DispatchClientTable } from "./dispatch-client-table"

import { type Shipment, type Manifest } from "@/lib/db/schema"

export interface QueueItem {
  id: string
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
}: {
  pendingShipments: Shipment[]
  queueItems: QueueItem[]
  dispatchRuns: Manifest[]
}) {
  const [items, setItems] = useState(queueItems)

  const columns = [
    { id: "pending", name: "Pending", color: "#6B7280" },
    { id: "in_transit", name: "In Transit", color: "#3B82F6" },
    { id: "delivered", name: "Delivered", color: "#10B981" },
    { id: "delayed", name: "Delayed", color: "#EF4444" },
  ]

  return (
    <div className="flex w-full flex-col gap-4 md:gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <DispatchIcon className="size-8 text-primary" />
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Dispatch Command
            </h1>
            <p className="text-sm text-muted-foreground">
              Line-haul assignment and route tracking.
            </p>
          </div>
        </div>
        <div>
          <CreateDispatchDialog pendingShipments={pendingShipments} />
        </div>
      </div>

      <Tabs defaultValue="kanban" className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <TabsList className="border border-border/50 bg-muted/50">
            <TabsTrigger
              value="kanban"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <KanbanSquare className="size-4" /> Board
            </TabsTrigger>
            <TabsTrigger
              value="runs"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <FileText className="size-4" /> Runs
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kanban" className="mt-0 h-[70vh]">
          <KanbanProvider
            columns={columns}
            data={items as any}
            onDataChange={setItems as any}
          >
            {(column) => (
              <KanbanBoard
                id={column.id}
                key={column.id}
                className="w-[85vw] max-w-[320px] shrink-0 snap-center border-border/40 bg-muted/10 shadow-inner md:w-auto"
              >
                <KanbanHeader className="border-b border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between gap-2 p-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                      <span className="text-xs font-bold tracking-tight uppercase">
                        {column.name}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex h-5 min-w-5 justify-center px-1.5 text-[10px] tabular-nums"
                    >
                      {items.filter((i) => i.column === column.id).length}
                    </Badge>
                  </div>
                </KanbanHeader>
                <KanbanCards id={column.id} className="gap-3 p-3">
                  {(item: any) => (
                    <KanbanCard
                      column={column.id}
                      id={item.id}
                      key={item.id}
                      name={item.name || ""}
                      className="overflow-hidden border-border/50 bg-background p-0 shadow-sm transition-colors hover:border-primary/50"
                    >
                      <div
                        className="border-l-4 p-3"
                        style={{ borderLeftColor: column.color }}
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold tracking-tight">
                            {item.id}
                          </p>
                          <Badge
                            variant="outline"
                            className="h-5 text-[10px] tracking-wider uppercase"
                          >
                            {item.type}
                          </Badge>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <MapPin className="size-3.5 text-primary/70" />
                            <span className="truncate">{item.route}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Clock className="size-3.5 text-primary/70" />
                            <span>{item.time}</span>
                          </div>
                        </div>

                        {item.column === "pending" && !item.isAssigned && (
                          <div className="mt-4 flex justify-end border-t border-border/40 pt-3">
                            <CreateDispatchDialog
                              pendingShipments={pendingShipments.filter(
                                (s) => s.awbNumber === item.id
                              )}
                            />
                          </div>
                        )}
                        {item.column === "pending" && item.isAssigned && (
                          <div className="mt-4 flex justify-end border-t border-border/40 pt-3">
                            <Badge variant="secondary">Assigned to Run</Badge>
                          </div>
                        )}
                      </div>
                    </KanbanCard>
                  )}
                </KanbanCards>
              </KanbanBoard>
            )}
          </KanbanProvider>
        </TabsContent>

        <TabsContent value="runs" className="mt-0">
          <Card className="border-border/40 bg-background shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20 p-4">
              <CardTitle className="text-base font-semibold tracking-tight">
                Active Dispatch Runs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DispatchClientTable dispatchRuns={dispatchRuns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
