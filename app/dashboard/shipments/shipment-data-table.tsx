"use client"

import { useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from "@/components/kibo-ui/table"
import type { ColumnDef } from "@/components/kibo-ui/table"
import { ShipmentActions } from "./shipment-actions"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Badge } from "@/components/ui/badge"
import { Pill, PillIndicator } from "@/components/kibo-ui/pill"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

import { type ShipmentWithRelations } from "./shipment-actions"

export function ShipmentsDataTable({
  data,
}: {
  data: ShipmentWithRelations[]
}) {
  const [globalFilter, setGlobalFilter] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const filteredData = useMemo(() => {
    if (!globalFilter) return data
    const lowerFilter = globalFilter.toLowerCase()
    return data.filter(
      (item) =>
        item.awbNumber.toLowerCase().includes(lowerFilter) ||
        item.destination.toLowerCase().includes(lowerFilter) ||
        item.origin.toLowerCase().includes(lowerFilter)
    )
  }, [data, globalFilter])

  // Reset to page 1 when filter changes
  useMemo(() => {
    setCurrentPage(1)
  }, [globalFilter])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const columns = useMemo<ColumnDef<ShipmentWithRelations>[]>(
    () => [
      {
        accessorKey: "awbNumber",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Tracking ID" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium whitespace-nowrap tabular-nums">
            {row.getValue("awbNumber")}
          </span>
        ),
      },
      {
        accessorKey: "origin",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Route" />
        ),
        cell: ({ row }) => {
          const origin = row.getValue("origin") as string
          const destination = row.original.destination ?? "—"
          return (
            <span className="text-xs font-medium">
              {origin} <span className="mx-1 text-muted-foreground">→</span>{" "}
              {destination}
            </span>
          )
        },
      },
      {
        id: "tags",
        header: () => (
          <span className="px-2 text-xs text-muted-foreground">Flags</span>
        ),
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center gap-1.5">
              {item.isFragile && (
                <Pill
                  variant="outline"
                  className="h-auto gap-1 border-status-pending/50 bg-status-pending/10 px-2 py-0.5 text-[10px] text-status-pending"
                >
                  <PillIndicator variant="warning" />
                  Fragile
                </Pill>
              )}
              {item.insuranceOptIn && (
                <Pill
                  variant="outline"
                  className="h-auto gap-1 border-sky-400/50 bg-sky-50 px-2 py-0.5 text-[10px] text-sky-600 dark:bg-sky-950/20"
                >
                  <PillIndicator variant="info" />
                  Insured
                </Pill>
              )}
              {!item.isFragile && !item.insuranceOptIn && (
                <span className="text-[10px] text-muted-foreground/50">—</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"))
          return (
            <span
              className="text-xs whitespace-nowrap text-muted-foreground tabular-nums"
              title={date.toLocaleString()}
            >
              {formatDistanceToNow(date, { addSuffix: true })}
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string
          let variant: "neutral" | "success" | "warning" | "error" = "neutral"
          if (status === "delivered") variant = "success"
          else if (status === "in-transit" || status === "in_transit")
            variant = "warning"
          else if (status === "delayed" || status === "cancelled")
            variant = "error"
          else variant = "neutral"

          return (
            <Badge variant={variant} className="capitalize">
              {status.replace(/_/g, " ")}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="w-[80px] px-5 text-right">Actions</div>,
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex justify-end">
              <ShipmentActions shipment={item} />
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="relative flex w-full flex-col">
      <div className="z-10 border-b border-border/50 p-4 sm:absolute sm:-top-12 sm:right-4 sm:border-none sm:p-0">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search AWB or Destination..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 border-border/50 bg-background pl-8"
          />
        </div>
      </div>
      <div className="w-full scrollbar-thin overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          <TableProvider columns={columns} data={paginatedData}>
            <TableHeader>
              {({ headerGroup }) => (
                <TableHeaderGroup
                  key={headerGroup.id}
                  headerGroup={headerGroup}
                >
                  {({ header }) => (
                    <TableHead key={header.id} header={header} />
                  )}
                </TableHeaderGroup>
              )}
            </TableHeader>
            <TableBody>
              {({ row }) => (
                <TableRow
                  key={row.id}
                  row={row}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {({ cell }) => <TableCell key={cell.id} cell={cell} />}
                </TableRow>
              )}
            </TableBody>
          </TableProvider>
        </div>
      </div>
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
