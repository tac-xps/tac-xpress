"use client"

import React, { useState, useEffect, useCallback, Suspense } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  CheckCircle2,
  Circle,
  Truck,
  PackageX,
  ExternalLink,
  ArrowRight,
  Loader2,
  MapPin,
  Package,
  Calendar,
  Users,
  Box,
  DollarSign,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScannerContext } from "@/components/scanner/scanner-provider"
import { useSearchParams } from "next/navigation"
import {
  getScannedShipmentDetails,
  updateScannedShipmentStatus,
} from "@/app/actions/scanner-actions"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useTransition } from "react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from "date-fns"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount / 100)
}

function TrackingContent() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle")
  const [shipmentData, setShipmentData] = useState<any | null>(null)

  // Log Event Form State
  const [isPending, startTransition] = useTransition()
  const [eventStatus, setEventStatus] = useState<
    "pending" | "in-transit" | "delivered"
  >("in-transit")
  const [eventLocation, setEventLocation] = useState("")
  const [eventDesc, setEventDesc] = useState("")

  const isTypingError = query.length > 0 && query.length < 10
  const isValidLength = query.length >= 10

  const { setOverrideHandler } = useScannerContext()
  const searchParams = useSearchParams()
  const initialAwb = searchParams.get("awb") || ""

  const executeSearch = useCallback(async (code: string) => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setStatus("loading")
    setShipmentData(null)

    try {
      const result = await getScannedShipmentDetails(trimmed)
      if (result.success && result.data) {
        setShipmentData(result.data)
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }, [])

  // Auto-search if loaded with search params
  useEffect(() => {
    if (initialAwb) {
      setQuery(initialAwb.toUpperCase())
      executeSearch(initialAwb)
    }
  }, [initialAwb, executeSearch])

  // Context-aware global scanner override
  const processScan = useCallback(
    async (code: string) => {
      const trimmed = code.trim().toUpperCase()
      setQuery(trimmed)
      if (trimmed.length >= 10) {
        await executeSearch(trimmed)
      }
      return true // Always return true for success beep
    },
    [executeSearch]
  )

  useEffect(() => {
    setOverrideHandler(processScan)
    return () => setOverrideHandler(null)
  }, [setOverrideHandler, processScan])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidLength) return
    executeSearch(query)
  }

  const handleClear = () => {
    setQuery("")
    setShipmentData(null)
    setStatus("idle")
  }

  const handleLogEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shipmentData) return

    startTransition(async () => {
      const result = await updateScannedShipmentStatus(
        shipmentData.id,
        eventStatus,
        eventLocation,
        eventDesc
      )
      if (result.success) {
        toast.success(`Shipment updated to ${eventStatus}`)
        // Instantly refresh the shipment data
        await executeSearch(shipmentData.awbNumber)
        // Reset form
        setEventLocation("")
        setEventDesc("")
      } else {
        toast.error(result.error || "Failed to log tracking event")
      }
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-muted/10 p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Scanner Station</h1>
          <p className="text-muted-foreground">
            Scan an AWB barcode or enter it manually to view comprehensive
            shipment details and log updates.
          </p>
        </div>

        {/* Search Input Section */}
        <Card className="overflow-hidden border-border/50 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="text-trend-positive mb-4 flex items-center gap-2 text-sm font-medium">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-primary"></span>
              </span>
              SCANNER READY
            </div>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="AWB-XXXXXXXXXXXXXXXX"
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  className={`h-14 pl-12 font-mono text-lg tracking-wider shadow-inner ${
                    isTypingError
                      ? "border-destructive focus-visible:ring-destructive"
                      : "focus-visible:ring-primary"
                  }`}
                  maxLength={20}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={!isValidLength || status === "loading"}
                className="h-14 px-8 text-lg"
              >
                {status === "loading" ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  "Track"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="flex flex-col gap-6">
          {status === "loading" && (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}

          {status === "error" && (
            <Card className="animate-in border-border/50 shadow-sm duration-500 fade-in slide-in-from-bottom-4">
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-12 text-center">
                <div className="mb-2 flex size-20 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border/50">
                  <PackageX className="size-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    We couldn't find that shipment
                  </h3>
                  <p className="mx-auto max-w-sm leading-relaxed text-muted-foreground">
                    The AWB number{" "}
                    <span className="px-1 font-mono font-medium text-foreground">
                      {query}
                    </span>{" "}
                    doesn't match our records. Please check for typos.
                  </p>
                </div>
                <Button
                  onClick={handleClear}
                  variant="default"
                  className="mt-4"
                >
                  Clear & Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {status === "success" && shipmentData && (
            <div className="flex animate-in flex-col gap-6 duration-500 fade-in slide-in-from-bottom-4">
              {/* Comprehensive Grid from ScannerResultModal */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Routing & Timelines */}
                <Card className="border-border/50 shadow-md">
                  <CardHeader className="border-b bg-muted/30 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-primary" /> Routing &
                      Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="mb-2 flex items-center justify-between rounded-md bg-primary/10 px-3 py-2">
                      <span className="font-bold tracking-tight uppercase">
                        <Package className="mr-1 inline h-4 w-4" />
                        {shipmentData.awbNumber}
                      </span>
                      <Badge
                        variant={
                          shipmentData.status === "delivered"
                            ? "default"
                            : "secondary"
                        }
                        className="uppercase"
                      >
                        {shipmentData.status?.replace("_", " ")}
                      </Badge>
                    </div>
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
                      <p className="font-semibold">
                        {shipmentData.destination}
                      </p>
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
                          <Calendar className="h-3 w-3 text-status-pending" />{" "}
                          EDD
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
                      <Box className="h-5 w-5 text-primary" /> Cargo & Package
                      Details
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
                          {shipmentData.chargedWeightKg ||
                            shipmentData.weightKg}{" "}
                          KG
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
                        <span className="mr-2 font-bold">
                          Content Description:
                        </span>
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
                            {formatCurrency(
                              shipmentData.invoice.balanceDue || 0
                            )}
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
                              {shipmentData.invoice.paymentMode?.replace(
                                "_",
                                " "
                              ) || "N/A"}
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

              {/* Action Area: Log Event Form */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Empty space or additional info can go here to push the form right, or we just let it take full width on mobile, 1/3rd on desktop */}
                <Card className="border-primary/20 bg-primary/5 shadow-lg md:col-start-3">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Log Update Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleLogEvent}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">
                          Status Update
                        </label>
                        <Select
                          value={eventStatus}
                          onValueChange={(val: any) => setEventStatus(val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              Booked / Pending
                            </SelectItem>
                            <SelectItem value="in-transit">
                              In Transit
                            </SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">
                          Current Location
                        </label>
                        <Input
                          placeholder="e.g. Warehouse 5"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">
                          Event Description
                        </label>
                        <Textarea
                          placeholder="e.g. Consignment collected by customer."
                          value={eventDesc}
                          onChange={(e) => setEventDesc(e.target.value)}
                          className="min-h-[80px]"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="mt-2 w-full"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Submit Update
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-muted/10 p-6">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  )
}
