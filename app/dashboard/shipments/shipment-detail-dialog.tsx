"use client"

import React, { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { useAction } from "next-safe-action/hooks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/logistics/status-badge"
import { ShipmentTimeline } from "@/components/shipments/realtime-tracker"
import { CargoDocuments } from "@/components/documents/cargo-documents"
import { AddTrackingEventDialog } from "./add-tracking-event-dialog"
import { getShipmentDetailsAction } from "./actions"
import { toast } from "sonner"
import {
  MapPin,
  Plane,
  Truck,
  Ship,
  Scale,
  Package,
  Phone,
  User,
  Building2,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react"

export interface ShipmentDetailDialogProps {
  shipmentId?: string | null
  awbNumber?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
}

export function ShipmentDetailDialog({
  shipmentId,
  awbNumber,
  open,
  onOpenChange,
  initialData,
}: ShipmentDetailDialogProps) {
  const [data, setData] = useState<any>(initialData ?? null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "documents">("overview")

  const { execute, isExecuting } = useAction(getShipmentDetailsAction, {
    onSuccess: ({ data: result }) => {
      if (result) {
        setData(result)
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to load shipment details")
    },
  })

  const fetchDetails = useCallback(() => {
    if (shipmentId || awbNumber) {
      execute({
        id: shipmentId || undefined,
        awbNumber: awbNumber || undefined,
      })
    }
  }, [shipmentId, awbNumber, execute])

  useEffect(() => {
    if (open) {
      fetchDetails()
    }
  }, [open, fetchDetails])

  const effectiveShipment = data || initialData
  const displayAwb = effectiveShipment?.awbNumber || awbNumber || "Shipment"

  const handleCopyAwb = async () => {
    if (!effectiveShipment?.awbNumber) return
    try {
      await navigator.clipboard.writeText(effectiveShipment.awbNumber)
      setCopied(true)
      toast.success("AWB copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  const getServiceMeta = (type?: string) => {
    switch (type) {
      case "express_air":
        return { label: "Air Cargo Express", icon: Plane }
      case "standard_ocean":
        return { label: "Ocean Freight", icon: Ship }
      case "road_freight":
      default:
        return { label: "Surface Cargo Freight", icon: Truck }
    }
  }

  const serviceMeta = getServiceMeta(effectiveShipment?.serviceType)
  const ServiceIcon = serviceMeta.icon

  const facts = effectiveShipment
    ? [
        {
          label: "Corridor Route",
          value: `${effectiveShipment.origin} → ${effectiveShipment.destination}`,
          isMono: false,
          icon: MapPin,
        },
        {
          label: "Service Type",
          value: serviceMeta.label,
          isMono: false,
          icon: ServiceIcon,
        },
        {
          label: "Actual Weight",
          value: `${effectiveShipment.weightKg} kg`,
          isMono: true,
          icon: Scale,
        },
        {
          label: "Charged Weight",
          value: `${effectiveShipment.chargedWeightKg ?? effectiveShipment.weightKg} kg`,
          isMono: true,
          icon: Scale,
        },
        {
          label: "Packages / Pieces",
          value: `${effectiveShipment.pieces ?? 1} colli`,
          isMono: false,
          icon: Package,
        },
        {
          label: "Dimensions (L×W×H)",
          value:
            effectiveShipment.dimensionsL && effectiveShipment.dimensionsW && effectiveShipment.dimensionsH
              ? `${effectiveShipment.dimensionsL}×${effectiveShipment.dimensionsW}×${effectiveShipment.dimensionsH} cm`
              : "Standard packaging",
          isMono: true,
          icon: Package,
        },
      ]
    : []

  const manifestItem = effectiveShipment?.manifestItems?.[0]
  const assignedManifest = manifestItem?.manifest

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="shipment-detail-dialog"
        className="sm:max-w-3xl md:max-w-4xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden"
      >
        {/* Header Strip with clearance for close button */}
        <DialogHeader className="px-6 py-3.5 border-b border-border/80 bg-muted/20 flex flex-row items-center justify-between gap-4 space-y-0 shrink-0 pr-14">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <DialogTitle className="font-mono text-base font-bold text-foreground tracking-tight flex items-center gap-2">
              <span>{displayAwb}</span>
              <button
                type="button"
                onClick={handleCopyAwb}
                className="p-1 rounded-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                title="Copy AWB number"
                aria-label="Copy AWB number"
              >
                {copied ? <Check className="size-3.5 text-status-delivered" /> : <Copy className="size-3.5" />}
              </button>
            </DialogTitle>
            {effectiveShipment?.status && <StatusBadge status={effectiveShipment.status} />}
            {effectiveShipment?.serviceType && (
              <Badge variant="outline" className="hidden sm:inline-flex text-[11px] gap-1 items-center">
                <ServiceIcon className="size-3" />
                {serviceMeta.label}
              </Badge>
            )}
            <DialogDescription className="sr-only">
              Details, tracking history, and operational documents for shipment {displayAwb}
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {effectiveShipment?.id && (
              <>
                <AddTrackingEventDialog
                  shipmentId={effectiveShipment.id}
                  awbNumber={effectiveShipment.awbNumber}
                  onSuccess={fetchDetails}
                  triggerVariant="outline"
                  triggerClassName="h-7 text-xs gap-1.5 px-2.5 font-normal"
                />
                <Button
                  asChild
                  variant="outline"
                  size="icon-sm"
                  className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  title="Open full page in new tab"
                >
                  <a
                    href={`/dashboard/shipments/${effectiveShipment.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open full shipment page in new tab"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        {/* Tabs Bar & Scrollable Content */}
        {isExecuting && !effectiveShipment ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground flex-1">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-sm">Retrieving consignment details…</p>
          </div>
        ) : !effectiveShipment ? (
          <div className="py-16 text-center text-sm text-muted-foreground flex-1">
            Shipment record not found or inaccessible.
          </div>
        ) : (
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "overview" | "timeline" | "documents")}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Pinned Subheader Tabs Bar */}
            <div className="px-6 border-b border-border/70 bg-muted/10 shrink-0 flex items-center justify-between py-2">
              <TabsList className="h-8 max-w-sm grid grid-cols-3">
                <TabsTrigger value="overview" className="text-xs h-7">Overview</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs h-7">
                  Tracking ({effectiveShipment.trackingEvents?.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs h-7">Documents</TabsTrigger>
              </TabsList>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 pb-8 min-h-0">
              {/* Tab: Overview */}
              <TabsContent value="overview" className="mt-0 space-y-5">
                {/* Specifications Card */}
                <section
                  aria-label="Shipment Specifications"
                  className="overflow-hidden rounded-none border border-border/80 bg-card shadow-none"
                >
                  <div className="border-b border-border/80 bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/80">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      Booked:{" "}
                      {effectiveShipment.createdAt
                        ? format(new Date(effectiveShipment.createdAt), "dd MMM yyyy")
                        : "Not recorded"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {effectiveShipment.isFragile && (
                        <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30">
                          Fragile
                        </Badge>
                      )}
                      {effectiveShipment.insuranceOptIn && (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          Insurance
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 p-4 sm:grid-cols-3">
                    {facts.map((fact) => {
                      const Icon = fact.icon
                      return (
                        <div key={fact.label} className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Icon className="size-3.5 text-muted-foreground/80 shrink-0" />
                            <span>{fact.label}</span>
                          </div>
                          <div
                            className={
                              fact.isMono
                                ? "font-mono text-sm font-semibold text-foreground tracking-tight"
                                : "font-medium text-sm text-foreground"
                            }
                          >
                            {fact.value}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Integrated Commodity & Packaging Strip */}
                  {(effectiveShipment.natureOfGoods ||
                    effectiveShipment.packagingType ||
                    effectiveShipment.itemCondition) && (
                    <div className="border-t border-border/70 bg-muted/15 px-4 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs">
                      {effectiveShipment.natureOfGoods && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Commodity:</span>
                          <span className="font-medium text-foreground capitalize">
                            {effectiveShipment.natureOfGoods.replaceAll("_", " ")}
                          </span>
                        </div>
                      )}
                      {effectiveShipment.packagingType && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Packaging:</span>
                          <span className="font-medium text-foreground capitalize">
                            {effectiveShipment.packagingType.replaceAll("_", " ")}
                          </span>
                        </div>
                      )}
                      {effectiveShipment.itemCondition && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-medium text-foreground capitalize">
                            {effectiveShipment.itemCondition}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* Consignor & Consignee Parties */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Consignor / Sender */}
                  <div className="rounded-none border border-border/80 bg-card overflow-hidden">
                    <div className="border-b border-border/70 bg-muted/15 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-primary" />
                        Sender (Consignor)
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">
                        {effectiveShipment.origin}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground">
                            {effectiveShipment.consignorName || "Name not recorded"}
                          </p>
                          {effectiveShipment.consignorPhone && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground font-mono mt-0.5">
                              <Phone className="size-3" />
                              {effectiveShipment.consignorPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                        <MapPin className="size-4 shrink-0 mt-0.5 text-muted-foreground/70" />
                        <p className="leading-relaxed">
                          {effectiveShipment.consignorAddress || "Address details not recorded"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consignee / Recipient */}
                  <div className="rounded-none border border-border/80 bg-card overflow-hidden">
                    <div className="border-b border-border/70 bg-muted/15 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <User className="size-3.5 text-primary" />
                        Recipient (Consignee)
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">
                        {effectiveShipment.destination}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground">
                            {effectiveShipment.consigneeName || "Name not recorded"}
                          </p>
                          {effectiveShipment.consigneePhone && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground font-mono mt-0.5">
                              <Phone className="size-3" />
                              {effectiveShipment.consigneePhone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                        <MapPin className="size-4 shrink-0 mt-0.5 text-muted-foreground/70" />
                        <p className="leading-relaxed">
                          {effectiveShipment.consigneeAddress || "Delivery address not recorded"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operational Assignment & Billing Metadata */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Manifest Route Assignment */}
                  <div className="rounded-none border border-border/80 bg-card overflow-hidden">
                    <div className="border-b border-border/70 bg-muted/15 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Layers className="size-3.5 text-primary" />
                        Manifest Assignment
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      {assignedManifest ? (
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Manifest:</span>
                            <span className="font-mono font-medium">{assignedManifest.referenceId}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="outline" className="capitalize text-[10px]">
                              {assignedManifest.status}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Not assigned to an active route manifest. Ready for dispatch planning.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Invoice Billing Status */}
                  <div className="rounded-none border border-border/80 bg-card overflow-hidden">
                    <div className="border-b border-border/70 bg-muted/15 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FileText className="size-3.5 text-primary" />
                        Billing & Invoicing
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      {effectiveShipment.invoice ? (
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Invoice ID:</span>
                            <span className="font-mono font-medium">
                              {effectiveShipment.invoice.id ? effectiveShipment.invoice.id.slice(0, 8).toUpperCase() : "Generated"}
                            </span>
                          </div>
                          {effectiveShipment.invoice.status && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Payment Status:</span>
                              <Badge
                                variant={
                                  effectiveShipment.invoice.status === "paid" ? "success" : "outline"
                                }
                                className="capitalize text-[10px]"
                              >
                                {effectiveShipment.invoice.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          No invoice generated yet for this consignment.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab: Tracking History */}
              <TabsContent value="timeline" className="mt-0">
                <ShipmentTimeline
                  events={(effectiveShipment.trackingEvents || []).map((event: any) => ({
                    id: event.id,
                    type: event.status,
                    occurredAt: new Date(event.createdAt).toISOString(),
                    payload: {
                      location: event.location,
                      description: event.description,
                    },
                    eventHash: event.id,
                    isPublic: event.isPublic,
                  }))}
                />
              </TabsContent>

              {/* Tab: Cargo Documents */}
              <TabsContent value="documents" className="mt-0">
                <CargoDocuments entity="shipments" id={effectiveShipment.id} />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
