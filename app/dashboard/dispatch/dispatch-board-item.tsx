import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CreateDispatchDialog } from "./create-dispatch-dialog"
import type { Shipment } from "@/lib/db/schema"
import type { QueueItem } from "./dispatch-client-layout"
export function DispatchBoardItem({
  item,
  pendingShipments,
}: {
  item: QueueItem
  pendingShipments: Shipment[]
}) {
  return (
    <article className="rounded-none border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={
            item.shipmentId
              ? `/dashboard/shipments/${item.shipmentId}`
              : `/dashboard/tracking?awb=${encodeURIComponent(item.id)}`
          }
          className="font-mono text-xs font-medium underline-offset-4 hover:underline"
        >
          {item.id}
        </Link>
        <Badge variant="outline">{item.type}</Badge>
      </div>
      <p className="mt-3 text-sm">{item.route}</p>
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
    </article>
  )
}
