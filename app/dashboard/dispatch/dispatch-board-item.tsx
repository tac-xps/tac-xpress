"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CreateDispatchDialog } from "./create-dispatch-dialog"
import { ShipmentDetailDialog } from "@/app/dashboard/shipments/shipment-detail-dialog"
import type { Shipment } from "@/lib/db/schema"
import type { QueueItem } from "./dispatch-client-layout"

export function DispatchBoardItem({
  item,
  pendingShipments,
}: {
  item: QueueItem
  pendingShipments: Shipment[]
}) {
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <article className="rounded-none border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="font-mono text-xs font-semibold text-primary underline-offset-4 hover:underline cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={`View details for ${item.id}`}
        >
          {item.id}
        </button>
        <Badge variant="outline">{item.type}</Badge>
      </div>
      <p className="mt-3 text-sm font-medium">{item.route}</p>
      {item.legInfo && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-primary font-medium">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/30 text-primary font-mono">
            Leg {item.legInfo.legNumber}/{item.legInfo.totalLegs}
          </Badge>
          <span className="truncate text-muted-foreground">{item.legInfo.currentRoute}</span>
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
      {item.column === "pending" && (
        <div className="mt-4 border-t pt-3">
          {item.isAssigned ? (
            <p className="text-xs text-muted-foreground">
              Assigned to a manifest
            </p>
          ) : (
            <CreateDispatchDialog
              pendingShipments={pendingShipments.filter(
                (shipment) => shipment.awbNumber === item.id
              )}
            />
          )}
        </div>
      )}

      {detailOpen && (
        <ShipmentDetailDialog
          shipmentId={item.shipmentId}
          awbNumber={item.id}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}
    </article>
  )
}
