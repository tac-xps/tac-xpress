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
import { Package, ExternalLink, QrCode } from "lucide-react"
import type { ScannedShipment } from "@/app/actions/scanner-actions"
import Link from "next/link"

interface ScannerResultModalProps {
  isOpen: boolean
  onClose: () => void
  shipmentData: ScannedShipment | null
  onStatusUpdate: () => void
}

export function ScannerResultModal({
  isOpen,
  onClose,
  shipmentData,
}: ScannerResultModalProps) {
  if (!shipmentData) return null
  const activeLoad = shipmentData.manifestItems[0]?.manifest
  const handoverPath =
    activeLoad?.legType === "line_haul"
      ? "/dashboard/manifests"
      : "/dashboard/dispatch?view=runs"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[96vw] flex-col gap-0 overflow-hidden rounded-none border border-border bg-background p-0 text-foreground shadow-2xl sm:max-w-4xl lg:max-w-6xl">
        {/* Modal Header */}
        <div className="flex shrink-0 flex-col gap-3 border-b bg-card px-5 py-4 pr-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <Package className="size-5 shrink-0 text-primary" />
              <DialogTitle className="font-mono text-xl font-black tracking-tight text-foreground uppercase sm:text-2xl">
                {shipmentData.awbNumber}
              </DialogTitle>
              <StatusBadge
                status={shipmentData.status}
                pulse={shipmentData.status === "in-transit"}
              />
            </div>
            <DialogDescription className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <span>
                Dossier:{" "}
                <span className="text-foreground">{shipmentData.id}</span>
              </span>
              <span>•</span>
              <span>Scanned via Scanner Terminal</span>
            </DialogDescription>
          </div>

          {/* Action Toolbar */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap">
            {shipmentData.status !== "delivered" && (
              <Button asChild size="sm">
                <Link href={handoverPath} onClick={onClose}>
                  {shipmentData.status === "pending"
                    ? "Open dispatch controls"
                    : "Record cargo handover"}
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none text-xs"
            >
              <Link href={`/dashboard/shipments/${shipmentData.id}`}>
                <ExternalLink className="mr-1.5 size-3.5" />
                Full Dossier
              </Link>
            </Button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto bg-muted/10 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Left Column: Routing & Financials */}
            <div className="flex flex-col space-y-5">
              <ModalRoutingParties shipment={shipmentData} />
              <ModalFinancials
                shipmentId={shipmentData.id}
                invoice={shipmentData.invoice}
              />
            </div>

            {/* Right Column: Cargo Details & Scan History */}
            <div className="flex flex-col space-y-5">
              <ModalCargoDetails shipment={shipmentData} />
              <ModalTimeline events={shipmentData.trackingEvents} />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 items-center justify-between border-t bg-card px-5 py-3 text-xs text-muted-foreground sm:px-6">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <QrCode className="size-3.5 text-primary" />
            <span>TAC-XPRESS SCANNER ENGINE</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 rounded-none px-3 font-mono text-xs"
          >
            Close Dossier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
