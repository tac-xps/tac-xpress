"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  Calendar,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Shipment = {
  id: string
  awb_number: string
  status: string
  origin: string
  destination: string
  service_type: string
  weight_kg: number
  created_at: string
  edd?: string | null
  customer_name?: string | null
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in-transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
]

const STATUS_BADGE: Record<string, string> = {
  pending: "border-status-pending/20 bg-status-pending/10 text-status-pending",
  "in-transit": "border-primary/20 bg-primary/10 text-status-transit",
  delivered: "border-primary/20 bg-primary/10 text-status-delivered",
}

function StatusBadgePill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_BADGE[status] ?? "border-border bg-muted text-muted-foreground"
      )}
    >
      {status.replace(/-/g, " ")}
    </span>
  )
}

export default function ShipmentsTable({
  shipments,
  total,
  page,
  pageSize,
  hasMore,
}: {
  shipments: Shipment[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}) {
  const router = useRouter()
  const [awbSearch, setAwbSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const matchesAwb =
        !awbSearch ||
        s.awb_number.toLowerCase().includes(awbSearch.toLowerCase())
      const matchesStatus = statusFilter === "all" || s.status === statusFilter
      return matchesAwb && matchesStatus
    })
  }, [shipments, awbSearch, statusFilter])

  function goToPage(nextPage: number) {
    router.push(`/portal/shipments?page=${nextPage}`)
  }

  const startItem = page * pageSize + 1
  const endItem = Math.min((page + 1) * pageSize, total)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by AWB number..."
            value={awbSearch}
            onChange={(e) => setAwbSearch(e.target.value)}
            className="pl-9 font-mono"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AWB</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Booked</TableHead>
              <TableHead>EDD</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-muted-foreground"
                >
                  No shipments match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono font-medium text-primary">
                    {s.awb_number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {s.origin} → {s.destination}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">
                    {s.service_type.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>{s.weight_kg} kg</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(s.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.edd ? format(new Date(s.edd), "dd MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadgePill status={s.status} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/portal/track`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Track <ExternalLink className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-lg border py-12 text-center text-muted-foreground">
            No shipments match your filters.
          </div>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="space-y-3 rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between">
                <span className="font-mono font-medium text-primary">
                  {s.awb_number}
                </span>
                <StatusBadgePill status={s.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Route</p>
                  <p className="font-medium">
                    {s.origin} → {s.destination}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="capitalize">
                    {s.service_type.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p>{s.weight_kg} kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Booked</p>
                  <p>{format(new Date(s.created_at), "dd MMM yyyy")}</p>
                </div>
              </div>
              <Link
                href="/portal/track"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Package className="h-4 w-4" />
                Track this shipment
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
          <span>
            Showing {startItem}–{endItem} of {total} shipments
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => goToPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore}
              onClick={() => goToPage(page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
