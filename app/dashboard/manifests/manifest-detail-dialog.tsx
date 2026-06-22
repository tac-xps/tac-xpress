"use client"

import React from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Printer,
  Share2,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export type ManifestItem = {
  id: string
  shipment: {
    id: string
    awbNumber: string
    origin: string
    destination: string
    weightKg: number | null
    status: string
    consigneeName: string | null
  } | null
}

export type ManifestDetail = {
  id: string
  referenceId: string
  status: "draft" | "finalized"
  createdAt: Date
  originHubId?: string | null
  destinationHubId?: string | null
  driverId?: string | null
  vehicleId?: string | null
  driver?: { name: string | null; phone: string | null } | null
  vehicle?: { registrationNumber: string | null } | null
  items?: ManifestItem[]
}

const statusColors: Record<string, string> = {
  pending: "bg-status-pending/10 text-status-pending",
  in_transit: "bg-primary/10 text-status-transit",
  delivered: "bg-primary/10 text-status-delivered",
  delayed: "bg-destructive/10 text-status-failed",
  cancelled: "bg-muted text-muted-foreground",
}

interface ManifestDetailDialogProps {
  manifest: ManifestDetail
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManifestDetailDialog({
  manifest,
  open,
  onOpenChange,
}: ManifestDetailDialogProps) {
  const handlePrint = () => {
    window.open(`/api/manifests/${manifest.id}/print`, "_blank")
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/api/manifests/${manifest.id}/print`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Manifest link copied to clipboard!")
    } catch {
      toast.error("Could not copy link. Please copy manually: " + url)
    }
  }

  const items = manifest.items ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:rounded-xl">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/20 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="font-mono text-xl font-bold tracking-tight">
                {manifest.referenceId}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Created{" "}
                {format(new Date(manifest.createdAt), "dd MMM yyyy, HH:mm")}
              </DialogDescription>
            </div>
            <Badge
              className={cn(
                "px-2 py-1 text-xs font-semibold tracking-wider uppercase",
                manifest.status === "finalized"
                  ? "border-primary/20 bg-primary/10 text-status-delivered"
                  : "bg-muted text-muted-foreground"
              )}
              variant="outline"
            >
              {manifest.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Meta Info */}
          <div className="grid grid-cols-4 gap-4 border-b border-border/50 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Driver
              </p>
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <Truck className="size-3.5 text-primary/70" />
                {manifest.driver?.name ?? "Unassigned"}
              </p>
              {manifest.driver?.phone && (
                <p className="text-xs text-muted-foreground">
                  {manifest.driver.phone}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Vehicle
              </p>
              <p className="text-sm font-medium">
                {manifest.vehicle?.registrationNumber ?? "Unassigned"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Total AWBs
              </p>
              <p className="text-2xl font-bold tabular-nums">{items.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Total Weight
              </p>
              <p className="text-2xl font-bold tabular-nums">
                {items
                  .reduce((sum, i) => sum + (i.shipment?.weightKg ?? 0), 0)
                  .toFixed(1)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  kg
                </span>
              </p>
            </div>
          </div>

          {/* Shipment List */}
          <div className="flex-1 p-6">
            <h3 className="mb-4 text-sm font-bold tracking-widest text-muted-foreground uppercase">
              Shipments ({items.length})
            </h3>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="mb-3 size-10 opacity-30" />
                <p className="text-sm">No shipments in this manifest</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border/50">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="px-4 text-xs font-bold tracking-wider uppercase">
                        AWB
                      </TableHead>
                      <TableHead className="text-xs font-bold tracking-wider uppercase">
                        Route
                      </TableHead>
                      <TableHead className="text-xs font-bold tracking-wider uppercase">
                        Weight
                      </TableHead>
                      <TableHead className="text-xs font-bold tracking-wider uppercase">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow
                        key={item.id}
                        className={
                          idx % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }
                      >
                        <TableCell className="px-4 font-mono text-sm font-medium">
                          {item.shipment?.awbNumber ?? "—"}
                        </TableCell>
                        <TableCell>
                          {item.shipment ? (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3 shrink-0 text-primary/60" />
                              <span className="max-w-[120px] truncate">
                                {item.shipment.origin} →{" "}
                                {item.shipment.destination}
                              </span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-sm tabular-nums">
                          {item.shipment?.weightKg != null
                            ? `${item.shipment.weightKg} kg`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {item.shipment ? (
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                                statusColors[item.shipment.status] ??
                                  "bg-muted text-muted-foreground"
                              )}
                            >
                              {item.shipment.status.replace("_", " ")}
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-border/50 bg-muted/10 p-6">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="w-32 font-semibold"
          >
            <Printer className="mr-2 size-4" />
            Print
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-32 font-semibold"
          >
            <Share2 className="mr-2 size-4" />
            Copy Link
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-32 font-semibold"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
