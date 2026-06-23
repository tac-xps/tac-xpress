"use client"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Package,
  User,
  FileText,
  CheckCircle2,
  Truck,
  Calendar,
  Box,
  ShieldCheck,
  DollarSign,
  Users,
} from "lucide-react"
import { useState, useTransition } from "react"
import { updateScannedShipmentStatus } from "@/app/actions/scanner-actions"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"

export function ScannerResultModal({
  isOpen,
  onClose,
  shipmentData,
  onStatusUpdate,
}: {
  isOpen: boolean
  onClose: () => void
  shipmentData: any
  onStatusUpdate: () => void
}) {
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
        toast.success(`Shipment marked as ${status}`)
        onStatusUpdate()
      } else {
        toast.error(result.error)
      }
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount / 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl bg-muted/30 font-sans">
        <DialogHeader className="-mx-6 -mt-6 mb-4 rounded-t-lg border-b bg-background p-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-3 text-3xl font-black tracking-tight uppercase">
                <Package className="h-8 w-8 text-primary" />
                {shipmentData.awbNumber}
                <Badge
                  variant={
                    shipmentData.status === "delivered"
                      ? "default"
                      : shipmentData.status === "in-transit"
                        ? "secondary"
                        : "outline"
                  }
                  className="ml-2 px-3 py-1 text-sm"
                >
                  {shipmentData.status?.replace("_", " ")}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-2 text-base">
                Scanned via Internal Dashboard • ID:{" "}
                <span className="font-mono text-xs">{shipmentData.id}</span>
              </DialogDescription>
            </div>

            <div className="flex min-w-[200px] flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={
                  isPending ||
                  shipmentData.status === "in-transit" ||
                  shipmentData.status === "delivered"
                }
                onClick={() =>
                  handleUpdateStatus(
                    "in-transit",
                    "Warehouse Center",
                    "Received at sorting facility"
                  )
                }
              >
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Mark as In-Transit
              </Button>
              <Button
                variant="default"
                className="w-full justify-start"
                disabled={isPending || shipmentData.status === "delivered"}
                onClick={() =>
                  handleUpdateStatus(
                    "delivered",
                    shipmentData.destination,
                    "Delivered to consignee"
                  )
                }
              >
                <Truck className="mr-2 h-4 w-4" />
                Mark as Delivered
              </Button>
              <Button
                asChild
                variant="secondary"
                className="w-full justify-start"
              >
                <Link href={`/dashboard/shipments/${shipmentData.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Profile
                </Link>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto px-2 pb-2 md:grid-cols-2 lg:grid-cols-3">
          {/* Routing & Timelines */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" /> Routing & Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Origin
                </p>
                <p className="font-semibold">{shipmentData.origin}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Destination
                </p>
                <p className="font-semibold">{shipmentData.destination}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    <Calendar className="h-3 w-3" /> Booked On
                  </p>
                  <p className="text-sm font-medium">
                    {format(
                      new Date(
                        shipmentData.bookingDate || shipmentData.createdAt
                      ),
                      "dd MMM yyyy"
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    <Calendar className="h-3 w-3 text-status-pending" /> EDD
                  </p>
                  <p className="text-sm font-medium text-status-pending">
                    {shipmentData.edd
                      ? format(new Date(shipmentData.edd), "dd MMM yyyy")
                      : "Pending"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parties (Sender / Receiver) */}
          <Card className="border-border/50 shadow-md lg:col-span-2">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" /> Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Consignor */}
                <div className="space-y-3">
                  <div className="mb-1 inline-block rounded bg-primary/10 px-2 py-1 text-xs font-bold tracking-wider text-primary uppercase">
                    Sender (Consignor)
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {shipmentData.consignorName || "N/A"}
                    </p>
                    {shipmentData.consignorCompany && (
                      <p className="text-sm text-muted-foreground">
                        {shipmentData.consignorCompany}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {shipmentData.consignorPhone || "N/A"}
                    </p>
                    {shipmentData.consignorEmail && (
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {shipmentData.consignorEmail}
                      </p>
                    )}
                    <p className="mt-2 text-muted-foreground">
                      {shipmentData.consignorAddress}
                    </p>
                  </div>
                </div>

                {/* Consignee */}
                <div className="space-y-3">
                  <div className="mb-1 inline-block rounded bg-primary/10 px-2 py-1 text-xs font-bold tracking-wider text-primary uppercase">
                    Receiver (Consignee)
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {shipmentData.consigneeName || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {shipmentData.consigneePhone || "N/A"}
                    </p>
                    {shipmentData.consigneeEmail && (
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {shipmentData.consigneeEmail}
                      </p>
                    )}
                    <p className="mt-2 text-muted-foreground">
                      {shipmentData.consigneeAddress}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Details */}
          <Card className="border-border/50 shadow-md lg:col-span-2">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Box className="h-5 w-5 text-primary" /> Cargo & Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Service
                  </p>
                  <p className="font-semibold capitalize">
                    {shipmentData.serviceType?.replace("_", " ")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Nature of Goods
                  </p>
                  <p className="font-semibold capitalize">
                    {shipmentData.natureOfGoods?.replace("_", " ")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Condition
                  </p>
                  <p className="font-semibold capitalize">
                    {shipmentData.itemCondition?.replace("_", " ")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Packaging
                  </p>
                  <p className="font-semibold capitalize">
                    {shipmentData.packagingType?.replace("_", " ")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Total Pieces
                  </p>
                  <p className="font-mono text-xl">
                    {shipmentData.pieces || 1}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Actual Weight
                  </p>
                  <p className="font-mono text-xl">
                    {shipmentData.weightKg} KG
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Charged Weight
                  </p>
                  <p className="font-mono text-xl">
                    {shipmentData.chargedWeightKg || shipmentData.weightKg} KG
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Dimensions (cm)
                  </p>
                  <p className="mt-1 font-mono text-sm">
                    {shipmentData.dimensionsL || 0} x{" "}
                    {shipmentData.dimensionsW || 0} x{" "}
                    {shipmentData.dimensionsH || 0}
                  </p>
                </div>
              </div>

              {shipmentData.contentDescription && (
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <span className="mr-2 font-bold">Content Description:</span>
                  <span className="text-muted-foreground">
                    {shipmentData.contentDescription}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financials / Invoice */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" /> Invoice &
                Financials
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {shipmentData.invoice ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="font-mono text-xl font-bold">
                      {formatCurrency(shipmentData.invoice.amount)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Balance Due
                    </p>
                    <p
                      className={`font-mono text-xl font-bold ${shipmentData.invoice.balanceDue > 0 ? "text-destructive" : "text-trend-positive"}`}
                    >
                      {formatCurrency(shipmentData.invoice.balanceDue || 0)}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        Status
                      </p>
                      <Badge
                        variant={
                          shipmentData.invoice.status === "paid"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {shipmentData.invoice.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        Mode
                      </p>
                      <p className="text-sm font-semibold capitalize">
                        {shipmentData.invoice.paymentMode?.replace("_", " ") ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-2 py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 opacity-20" />
                  <p className="text-sm">No invoice generated</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
