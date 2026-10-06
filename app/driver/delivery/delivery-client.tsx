"use client"

import { useState, useMemo, useCallback, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useScannerContext } from "@/components/scanner/scanner-provider"
import {
  Truck,
  MapPin,
  Box,
  CheckCircle2,
  Clock,
  Search,
  Phone,
  ArrowUpRight,
  Barcode,
  Navigation,
  Copy,
  Check,
  Building2,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  FileText,
  RefreshCw,
  WifiOff,
} from "lucide-react"
import { PageHeader } from "@/components/operations/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export interface ManifestSummaryItem {
  id: string
  referenceId: string
  status: string
  originHub: string
  destinationHub: string
  driverName: string
  driverPhone: string | null
  vehicleReg: string
  createdAt: string
}

export interface DeliveryShipmentItem {
  id: string
  awbNumber: string
  status: string
  consigneeName: string
  consigneePhone: string | null
  consigneeAddress: string
  consigneePinCode: string | null
  pieces: number
  weightKg: number
  serviceType: string
  declaredValue: number
  edd: string | null
  invoiceAmount: number | null
  paymentStatus: string
}

export interface RouteSummaryMetrics {
  totalStops: number
  completedStops: number
  inTransitStops: number
  pendingStops: number
  totalWeightKg: number
  totalPieces: number
  codPendingAmount: number
}

interface DeliveryClientProps {
  manifests: ManifestSummaryItem[]
  activeManifest: ManifestSummaryItem | null
  shipments: DeliveryShipmentItem[]
  summary: RouteSummaryMetrics
}

function subscribeToOnline(callback: () => void) {
  window.addEventListener("online", callback)
  window.addEventListener("offline", callback)
  return () => {
    window.removeEventListener("online", callback)
    window.removeEventListener("offline", callback)
  }
}

function getOnlineSnapshot() {
  return typeof navigator !== "undefined" ? navigator.onLine : true
}

function getServerSnapshot() {
  return true
}

export function DeliveryClient({
  manifests,
  activeManifest,
  shipments,
  summary,
}: DeliveryClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "sequence">("list")
  const [isScanOpen, setIsScanOpen] = useState(false)
  const [scanAwb, setScanAwb] = useState("")
  const [copiedAwb, setCopiedAwb] = useState<string | null>(null)
  const isOnline = useSyncExternalStore(subscribeToOnline, getOnlineSnapshot, getServerSnapshot)

  const handleCopyAwb = (awb: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(awb)
    setCopiedAwb(awb)
    toast.success(`Copied ${awb} to clipboard`)
    setTimeout(() => setCopiedAwb(null), 2000)
  }

  const { setOverrideHandler } = useScannerContext()

  const processDriverScan = useCallback(
    async (code: string) => {
      const trimmed = code.trim().toUpperCase()
      if (!trimmed) return false

      const match = shipments.find(
        (s) =>
          s.awbNumber.toUpperCase() === trimmed ||
          s.awbNumber.replace(/-/g, "").toUpperCase() === trimmed.replace(/-/g, "")
      )

      if (match) {
        setIsScanOpen(false)
        setScanAwb("")
        toast.success(`Scanned AWB ${match.awbNumber}`)
        router.push(`/driver/delivery/${match.id}`)
        return true
      } else {
        toast.error(`AWB "${trimmed}" not found on current manifest`)
        return false
      }
    },
    [shipments, router]
  )

  useEffect(() => {
    setOverrideHandler(processDriverScan)
    return () => setOverrideHandler(null)
  }, [setOverrideHandler, processDriverScan])

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void processDriverScan(scanAwb)
  }

  // Filter shipments based on search query and status tab
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      // Tab filter
      if (activeTab === "pending" && s.status === "delivered") return false
      if (activeTab === "in-transit" && s.status !== "in-transit" && s.status !== "out-for-delivery") return false
      if (activeTab === "delivered" && s.status !== "delivered") return false

      // Search query filter
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()
      return (
        s.awbNumber.toLowerCase().includes(q) ||
        s.consigneeName.toLowerCase().includes(q) ||
        s.consigneeAddress.toLowerCase().includes(q) ||
        (s.consigneePhone && s.consigneePhone.toLowerCase().includes(q)) ||
        (s.consigneePinCode && s.consigneePinCode.includes(q))
      )
    })
  }, [shipments, activeTab, searchQuery])

  const completionPercent = summary.totalStops > 0
    ? Math.round((summary.completedStops / summary.totalStops) * 100)
    : 0

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* ── Page Header & Quick Actions ── */}
      <PageHeader
        title="Delivery & Route Dispatch"
        description="Driver route manifest, consignee deliveries, digital signature capture, and delivery verification."
      >
        {/* Manifest Switcher */}
        {manifests.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Manifest:</span>
            <select
              aria-label="Select delivery manifest"
              value={activeManifest?.id ?? ""}
              onChange={(e) => {
                router.push(`/driver/delivery?manifestId=${e.target.value}`)
              }}
              className="h-9 rounded-none border border-border bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {manifests.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.referenceId} ({m.originHub} → {m.destinationHub})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Actions */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs"
          onClick={() => setIsScanOpen(true)}
        >
          <Barcode className="size-3.5" />
          <span>Quick Scan</span>
        </Button>

        <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
          <Link href="/dashboard/dispatch">
            <Navigation className="size-3.5" />
            <span className="hidden sm:inline">Dispatch Board</span>
            <span className="sm:hidden">Dispatch</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 size-9 p-0"
          onClick={() => router.refresh()}
          title="Refresh route data"
        >
          <RefreshCw className="size-3.5" />
        </Button>
      </PageHeader>
      
      {/* ── Offline Network Warning Banner ── */}
      {!isOnline && (
        <div className="flex items-center gap-2 rounded-none border border-status-pending/30 bg-status-pending-wash p-3 text-xs text-status-pending">
          <WifiOff className="size-4 shrink-0 text-status-pending" />
          <span>
            Offline Mode Active: Scans and POD captures will be cached locally on your device and synchronized once cellular connection is restored.
          </span>
        </div>
      )}

      {/* ── Route Telemetry / KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* KPI 1: Stops Progress */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Route Progress</CardTitle>
            <CheckCircle2 className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold tracking-tight tabular-nums">
              {summary.completedStops} / {summary.totalStops}
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-full rounded-none bg-muted overflow-hidden">
                <div
                  className="h-full rounded-none bg-primary transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground tabular-nums">
                {completionPercent}% completed • {summary.pendingStops} pending
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Active Route Manifest */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Manifest</CardTitle>
            <Truck className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold font-mono truncate">
                {activeManifest?.referenceId ?? "None"}
              </span>
              {activeManifest && (
                <Badge
                  variant={activeManifest.status === "finalized" ? "default" : "outline"}
                  className="text-[10px] uppercase"
                >
                  {activeManifest.status}
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {activeManifest ? `${activeManifest.originHub} → ${activeManifest.destinationHub}` : "No active route"}
            </p>
            <p className="text-[11px] font-mono text-muted-foreground/80 truncate">
              {activeManifest?.vehicleReg ?? "No vehicle assigned"}
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Cargo Load */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Cargo Onboard</CardTitle>
            <Box className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight tabular-nums">
              {summary.totalPieces} <span className="text-sm font-normal text-muted-foreground">pcs</span>
            </div>
            <p className="text-[11px] text-muted-foreground tabular-nums">
              {summary.totalWeightKg} kg total weight
            </p>
            <p className="text-[11px] text-muted-foreground/80 truncate">
              Assigned Driver: {activeManifest?.driverName ?? "Staff"}
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Invoices & Payment Collection */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Payment Collections</CardTitle>
            <FileText className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight tabular-nums">
              ₹{summary.codPendingAmount.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {summary.codPendingAmount > 0 ? "Pending collection at delivery" : "All shipments prepaid"}
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              Receipts generated on handoff
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Toolbar: Search, Status Filter & View Mode ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-y border-border py-3">
        {/* Status Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-2.5">
              All ({summary.totalStops})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs px-2.5">
              Pending ({summary.pendingStops})
            </TabsTrigger>
            <TabsTrigger value="in-transit" className="text-xs px-2.5">
              Active ({summary.inTransitStops})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs px-2.5">
              Delivered ({summary.completedStops})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by AWB, consignee, pin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-card"
            />
          </div>

          <div className="flex items-center border border-border rounded-none overflow-hidden bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === "list"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("sequence")}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === "sequence"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sequence
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Area: List View vs Route Sequence ── */}
      {filteredShipments.length === 0 ? (
        <Card className="shadow-none">
          <CardContent className="p-8">
            <Empty>
              <EmptyMedia variant="icon">
                <Truck className="size-5 text-muted-foreground" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No shipments match current filter</EmptyTitle>
                <EmptyDescription>
                  {searchQuery
                    ? `No deliveries found matching "${searchQuery}". Try clearing the search query.`
                    : activeTab !== "all"
                      ? `No stops currently in "${activeTab}" status on this manifest.`
                      : "No consignments have been added to this dispatch manifest yet."}
                </EmptyDescription>
              </EmptyHeader>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {searchQuery && (
                  <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
                <Button asChild size="sm">
                  <Link href="/dashboard/dispatch">View Dispatch Console</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/manifests">Manage Manifests</Link>
                </Button>
              </div>
            </Empty>
          </CardContent>
        </Card>
      ) : viewMode === "list" ? (
        /* ── Delivery Cards Grid ── */
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {filteredShipments.map((shipment, index) => {
            const isDelivered = shipment.status === "delivered"
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${shipment.consigneeAddress} ${shipment.consigneePinCode ?? ""}`
            )}`

            return (
              <Card
                key={shipment.id}
                className={`relative shadow-none transition-all hover:border-primary/60 ${
                  isDelivered ? "bg-muted/20 opacity-90" : "bg-card"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-none bg-muted font-mono text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyAwb(shipment.awbNumber, e)}
                        className="group flex items-center gap-1 font-mono text-sm font-bold text-foreground hover:text-primary transition-colors truncate"
                        title="Click to copy AWB"
                      >
                        <span className="truncate">{shipment.awbNumber}</span>
                        {copiedAwb === shipment.awbNumber ? (
                          <Check className="size-3 text-status-delivered shrink-0" />
                        ) : (
                          <Copy className="size-3 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant={
                          isDelivered
                            ? "success"
                            : shipment.status === "in-transit" || shipment.status === "out-for-delivery"
                              ? "warning"
                              : "neutral"
                        }
                        className="text-[11px]"
                      >
                        {isDelivered ? "Delivered" : shipment.status.replace(/-/g, " ")}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-[10px] hidden sm:inline-flex">
                        {shipment.serviceType.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5">
                  {/* Consignee Name & Phone */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {shipment.consigneeName}
                      </p>
                      {shipment.consigneePhone ? (
                        <a
                          href={`tel:${shipment.consigneePhone}`}
                          className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                          title="Call consignee"
                        >
                          <Phone className="size-3" />
                          <span>{shipment.consigneePhone}</span>
                        </a>
                      ) : (
                        <p className="text-xs text-muted-foreground">Phone not on record</p>
                      )}
                    </div>

                    {/* COD / Payment Badge */}
                    {shipment.invoiceAmount !== null && (
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                          ₹{shipment.invoiceAmount.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          {shipment.paymentStatus === "paid" ? "Prepaid" : "Collect COD"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Destination Address */}
                  <div className="flex items-start justify-between gap-2 rounded-none bg-muted/30 p-2.5 text-xs text-muted-foreground">
                    <div className="flex items-start gap-1.5 min-w-0">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span className="line-clamp-2 leading-relaxed text-foreground/90">
                        {shipment.consigneeAddress}
                        {shipment.consigneePinCode && ` - ${shipment.consigneePinCode}`}
                      </span>
                    </div>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Open in Google Maps"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>

                  {/* Cargo specs */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1 font-mono">
                      <Box className="size-3.5 text-muted-foreground/70" />
                      {shipment.pieces} pc{shipment.pieces > 1 ? "s" : ""} • {shipment.weightKg} kg
                    </span>

                    {/* Action Button */}
                    <Button
                      asChild
                      size="sm"
                      variant={isDelivered ? "outline" : "default"}
                      className="h-8 gap-1 text-xs"
                    >
                      <Link href={`/driver/delivery/${shipment.id}`}>
                        <span>{isDelivered ? "View Details" : "Confirm Delivery"}</span>
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* ── Route Sequence View ── */
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Route Delivery Sequence</CardTitle>
            <CardDescription className="text-xs">
              Sequential stops configured for route manifest {activeManifest?.referenceId}.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {/* Origin Hub Departure */}
              <div className="flex items-center gap-3 p-4 bg-muted/20">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-none bg-primary text-primary-foreground font-semibold text-xs">
                  <Building2 className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Origin Departure
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {activeManifest?.originHub ?? "Dispatch Hub"}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  Origin Hub
                </Badge>
              </div>

              {/* Stops list */}
              {filteredShipments.map((shipment, index) => {
                const isDelivered = shipment.status === "delivered"
                return (
                  <div
                    key={shipment.id}
                    className={`flex items-start justify-between gap-3 p-4 transition-colors hover:bg-muted/40 ${
                      isDelivered ? "bg-muted/10 opacity-80" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-none text-xs font-bold ${
                          isDelivered
                            ? "bg-status-delivered text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {isDelivered ? <Check className="size-3.5" /> : index + 1}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {shipment.awbNumber}
                          </span>
                          <span className="text-xs font-medium text-foreground truncate">
                            • {shipment.consigneeName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {shipment.consigneeAddress}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground/80 font-mono">
                          <span>{shipment.pieces} pcs</span>
                          <span>{shipment.weightKg} kg</span>
                          {shipment.consigneePhone && (
                            <a href={`tel:${shipment.consigneePhone}`} className="text-primary hover:underline">
                              {shipment.consigneePhone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge
                        variant={
                          isDelivered
                            ? "success"
                            : shipment.status === "in-transit"
                              ? "warning"
                              : "neutral"
                        }
                        className="text-[10px]"
                      >
                        {shipment.status.replace(/-/g, " ")}
                      </Badge>
                      <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                        <Link href={`/driver/delivery/${shipment.id}`}>
                          <span>Handoff</span>
                          <ChevronRight className="size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}

              {/* Destination Hub Arrival */}
              <div className="flex items-center gap-3 p-4 bg-muted/20">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-none bg-muted text-foreground font-semibold text-xs">
                  <Building2 className="size-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Destination Hub Handover
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {activeManifest?.destinationHub ?? "Terminal Hub"}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  Final Hub
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Quick Scan Modal ── */}
      <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Barcode className="size-5 text-primary" />
              <span>Scan or Enter AWB</span>
            </DialogTitle>
            <DialogDescription>
              Scan barcode with handheld scanner or enter the Airway Bill number to jump directly to delivery verification.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScanSubmit} className="space-y-4 pt-2">
            <Input
              autoFocus
              type="text"
              placeholder="e.g. TAC-948210 or WB1002"
              value={scanAwb}
              onChange={(e) => setScanAwb(e.target.value)}
              className="h-11 font-mono uppercase text-base"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsScanOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!scanAwb.trim()}>
                Find Consignment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
