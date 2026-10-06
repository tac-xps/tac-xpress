"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/logistics/status-badge"
import { ModalRoutingParties } from "./modal-routing-parties"
import { ModalCargoDetails } from "./modal-cargo-details"
import { ModalFinancials } from "./modal-financials"
import { ModalTimeline } from "./modal-timeline"
import {
  Package,
  Truck,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Loader2,
} from "lucide-react"
import { useTransition } from "react"
import { updateScannedShipmentStatus } from "@/app/actions/scanner-actions"
import { toast } from "sonner"
import Link from "next/link"

interface ScannerResultModalProps {
  isOpen: boolean
  onClose: () => void
  shipmentData: any
  onStatusUpdate: () => void
}

export function ScannerResultModal({
  isOpen,
  onClose,
  shipmentData,
  onStatusUpdate,
}: ScannerResultModalProps) {
  const [isPending, startTransition] = useTransition()

  if (!shipmentData) return null

  const handleUpdateStatus = (
    status: "pending" | "in-transit" | "delivered",
    location: string,
    desc: string
  ) => {
    startTransition(async () => {
      const result = await updateScannedShipmentStatus(
        shipmentData.id,
        status,
        location,
        desc
      )
      if (result.success) {
        toast.success(`Shipment status updated to ${status}`)
        onStatusUpdate()
      } else {
        toast.error(result.error || "Failed to update shipment status")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[96vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] p-0 flex flex-col gap-0 overflow-hidden bg-background text-foreground shadow-2xl border border-border rounded-none"
      >
        {/* Modal Header */}
        <div className="border-b bg-card px-5 py-4 sm:px-6 sm:py-5 pr-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Package className="size-5 text-primary shrink-0" />
              <DialogTitle className="font-mono text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase">
                {shipmentData.awbNumber}
              </DialogTitle>
              <StatusBadge
                status={shipmentData.status}
                pulse={shipmentData.status === "in-transit"}
              />
            </div>
            <DialogDescription className="font-mono text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>
                Dossier: <span className="text-foreground">{shipmentData.id}</span>
              </span>
              <span>•</span>
              <span>Scanned via Scanner Terminal</span>
            </DialogDescription>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {shipmentData.status === "pending" && (
              <Button
                size="sm"
                className="rounded-none font-semibold text-xs"
                disabled={isPending}
                onClick={() =>
                  handleUpdateStatus(
                    "in-transit",
                    "Warehouse Sorting Facility",
                    "Manifest scanned and inbound to transit corridor"
                  )
                }
              >
                {isPending ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Truck className="size-3.5 mr-1.5" />
                )}
                Mark In-Transit
              </Button>
            )}

            {shipmentData.status === "in-transit" && (
              <Button
                size="sm"
                className="rounded-none font-semibold text-xs bg-status-delivered hover:bg-status-delivered/90 text-primary-foreground"
                disabled={isPending}
                onClick={() =>
                  handleUpdateStatus(
                    "delivered",
                    shipmentData.destination || "Destination Hub",
                    "Delivered to consignee and verified"
                  )
                }
              >
                {isPending ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-3.5 mr-1.5" />
                )}
                Mark Delivered
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none text-xs"
            >
              <Link href={`/dashboard/shipments/${shipmentData.id}`}>
                <ExternalLink className="size-3.5 mr-1.5" />
                Full Dossier
              </Link>
            </Button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column: Routing & Financials */}
            <div className="space-y-5 flex flex-col">
              <ModalRoutingParties shipment={shipmentData} />
              <ModalFinancials
                shipmentId={shipmentData.id}
                invoice={shipmentData.invoice}
              />
            </div>

            {/* Right Column: Cargo Details & Scan History */}
            <div className="space-y-5 flex flex-col">
              <ModalCargoDetails shipment={shipmentData} />
              <ModalTimeline events={shipmentData.trackingEvents} />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t bg-card px-5 py-3 sm:px-6 flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <QrCode className="size-3.5 text-primary" />
            <span>TAC-XPRESS SCANNER ENGINE</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-none text-xs font-mono h-8 px-3"
          >
            Close Dossier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
