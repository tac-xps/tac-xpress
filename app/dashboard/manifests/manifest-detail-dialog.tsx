"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Printer, Link as LinkIcon, MessageSquare, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { CargoDocuments } from "@/components/documents/cargo-documents"
import { ManifestPrintDialog } from "./manifest-print-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/logistics/status-badge"
import { messageDriverAction } from "@/app/dashboard/dispatch/whatsapp-actions"
import { ShipmentDetailDialog } from "@/app/dashboard/shipments/shipment-detail-dialog"

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
  originHub?: { name: string } | null
  destinationHub?: { name: string } | null
  driver?: { name: string | null; phone: string | null } | null
  vehicle?: { registrationNumber: string | null } | null
  items?: ManifestItem[]
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
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<{
    id: string
    awb: string
  } | null>(null)
  const items = manifest.items ?? []

  const handleSendWhatsApp = async () => {
    if (!manifest.driverId) {
      toast.error("No driver assigned to this manifest")
      return
    }
    setIsSendingWhatsApp(true)
    try {
      const res = await messageDriverAction(manifest.id, manifest.driverId)
      if (res?.success) {
        toast.success(
          `WhatsApp route dispatch sent to ${manifest.driver?.name ?? "driver"}`
        )
      } else {
        toast.error(res?.error || "Failed to send WhatsApp message")
      }
    } catch {
      toast.error("Failed to trigger WhatsApp message")
    } finally {
      setIsSendingWhatsApp(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/api/manifests/${manifest.id}/print`
      )
      toast.success("Staff document link copied")
    } catch {
      toast.error("Unable to copy link")
    }
  }

  const totalActualWeight = items
    .reduce((sum, item) => sum + (item.shipment?.weightKg ?? 0), 0)
    .toFixed(1)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90svh] flex-col overflow-hidden sm:max-w-3xl rounded-none">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="font-mono text-base font-bold">
              {manifest.referenceId}
            </DialogTitle>
            <Badge
              variant={manifest.status === "finalized" ? "default" : "outline"}
              className="capitalize rounded-none"
            >
              {manifest.status}
            </Badge>
          </div>
          <DialogDescription className="text-xs">
            Created{" "}
            {format(new Date(manifest.createdAt), "dd MMM yyyy, HH:mm")} · Staff
            access required for documents
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="min-h-0 flex-1 overflow-y-auto">
          <TabsList className="mb-4 rounded-none">
            <TabsTrigger value="overview" className="rounded-none text-xs">
              Load details
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-none text-xs">
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-5">
            <dl className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3 bg-muted/20 p-3 border border-border/70">
              {[
                ["Origin hub", manifest.originHub?.name ?? "Unassigned"],
                ["Destination hub", manifest.destinationHub?.name ?? "Unassigned"],
                [
                  "Driver",
                  manifest.driver?.name
                    ? `${manifest.driver.name} ${
                        manifest.driver.phone ? `(${manifest.driver.phone})` : ""
                      }`
                    : "Unassigned",
                ],
                [
                  "Vehicle",
                  manifest.vehicle?.registrationNumber ?? "Unassigned",
                ],
                ["Shipments", `${items.length} consignments`],
                ["Actual weight", `${totalActualWeight} kg`],
              ].map(([label, value]) => (
                <div key={label} className="space-y-0.5">
                  <dt className="text-muted-foreground font-mono text-[10px] uppercase">
                    {label}
                  </dt>
                  <dd className="font-semibold text-foreground truncate">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="overflow-hidden rounded-none border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">AWB</TableHead>
                    <TableHead className="text-xs">Route</TableHead>
                    <TableHead className="text-xs">Weight</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs">
                        {item.shipment ? (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedShipment({
                                id: item.shipment!.id,
                                awb: item.shipment!.awbNumber,
                              })
                            }
                            className="font-mono text-primary underline-offset-4 hover:underline cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            aria-label={`View details for ${item.shipment.awbNumber}`}
                          >
                            {item.shipment.awbNumber}
                          </button>
                        ) : (
                          "Unavailable"
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {item.shipment
                          ? `${item.shipment.origin} → ${item.shipment.destination}`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {item.shipment?.weightKg ?? "—"} kg
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.shipment && (
                          <StatusBadge status={item.shipment.status} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-xs text-muted-foreground"
                      >
                        No shipments assigned to this manifest yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <CargoDocuments entity="manifests" id={manifest.id} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!manifest.driverId || isSendingWhatsApp}
            onClick={handleSendWhatsApp}
            className="rounded-none text-xs text-status-delivered hover:text-status-delivered/80 border-status-delivered/30"
          >
            {isSendingWhatsApp ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <MessageSquare className="mr-1.5 size-3.5" />
            )}
            {isSendingWhatsApp ? "Sending..." : "WhatsApp Driver"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPrintDialog(true)}
            className="rounded-none text-xs"
          >
            <Printer className="mr-1.5 size-3.5" />
            Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-none text-xs"
          >
            <LinkIcon className="mr-1.5 size-3.5" />
            Copy link
          </Button>

          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-none text-xs font-semibold"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ManifestPrintDialog
      open={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      manifestId={manifest.id}
      referenceId={manifest.referenceId}
      status={manifest.status}
    />

    {selectedShipment && (
      <ShipmentDetailDialog
        shipmentId={selectedShipment.id}
        awbNumber={selectedShipment.awb}
        open={Boolean(selectedShipment)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedShipment(null)
        }}
      />
    )}
  </>
  )
}
