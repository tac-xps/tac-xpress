"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Box, Layers, Scale, Maximize2 } from "lucide-react"

interface ModalCargoDetailsProps {
  shipment: {
    serviceType?: string | null
    natureOfGoods?: string | null
    itemCondition?: string | null
    packagingType?: string | null
    pieces?: number | null
    weightKg?: number | string | null
    chargedWeightKg?: number | string | null
    dimensionsL?: number | string | null
    dimensionsW?: number | string | null
    dimensionsH?: number | string | null
    contentDescription?: string | null
  }
}

export function ModalCargoDetails({ shipment }: ModalCargoDetailsProps) {
  const pieces = shipment.pieces ?? 1
  const actualWeight = shipment.weightKg != null ? Number(shipment.weightKg) : 0
  const chargedWeight = shipment.chargedWeightKg != null
    ? Number(shipment.chargedWeightKg)
    : actualWeight
  const dimL = shipment.dimensionsL != null ? Number(shipment.dimensionsL) : 0
  const dimW = shipment.dimensionsW != null ? Number(shipment.dimensionsW) : 0
  const dimH = shipment.dimensionsH != null ? Number(shipment.dimensionsH) : 0

  return (
    <Card className="rounded-none border-border shadow-xs">
      <CardHeader className="border-b bg-muted/40 py-3.5 px-4 sm:px-5">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase">
          <Box className="size-4 text-primary shrink-0" />
          Cargo & Package Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Classification Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Service
            </span>
            <p className="font-semibold text-foreground capitalize">
              {shipment.serviceType ? shipment.serviceType.replace(/_/g, " ") : "Standard"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Nature of Goods
            </span>
            <p className="font-semibold text-foreground capitalize">
              {shipment.natureOfGoods ? shipment.natureOfGoods.replace(/_/g, " ") : "General"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Condition
            </span>
            <p className="font-semibold text-foreground capitalize">
              {shipment.itemCondition ? shipment.itemCondition.replace(/_/g, " ") : "Good"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Packaging
            </span>
            <p className="font-semibold text-foreground capitalize">
              {shipment.packagingType ? shipment.packagingType.replace(/_/g, " ") : "Standard"}
            </p>
          </div>
        </div>

        <Separator />

        {/* Physical Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-border/80 bg-muted/20 p-2.5 space-y-1">
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              <Layers className="size-3 text-primary" /> Pieces
            </span>
            <p className="font-mono text-lg font-bold text-foreground">{pieces}</p>
          </div>
          <div className="border border-border/80 bg-muted/20 p-2.5 space-y-1">
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              <Scale className="size-3 text-primary" /> Actual Wt
            </span>
            <p className="font-mono text-lg font-bold text-foreground">
              {actualWeight} <span className="text-xs font-normal text-muted-foreground">KG</span>
            </p>
          </div>
          <div className="border border-border/80 bg-muted/20 p-2.5 space-y-1">
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              <Scale className="size-3 text-status-pending" /> Charged Wt
            </span>
            <p className="font-mono text-lg font-bold text-foreground">
              {chargedWeight} <span className="text-xs font-normal text-muted-foreground">KG</span>
            </p>
          </div>
          <div className="border border-border/80 bg-muted/20 p-2.5 space-y-1">
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              <Maximize2 className="size-3 text-primary" /> Dimensions
            </span>
            <p className="font-mono text-xs font-semibold text-foreground pt-1 truncate">
              {dimL} × {dimW} × {dimH} <span className="text-[10px] font-normal text-muted-foreground">cm</span>
            </p>
          </div>
        </div>

        {/* Content Description */}
        {shipment.contentDescription && (
          <div className="border border-border bg-card p-3 text-xs space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Cargo Manifest Description
            </span>
            <p className="text-foreground leading-relaxed">{shipment.contentDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
