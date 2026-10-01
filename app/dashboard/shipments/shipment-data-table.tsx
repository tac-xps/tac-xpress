"use client"
import Link from "next/link"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { ShipmentActions, type ShipmentWithRelations } from "./shipment-actions"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/logistics/status-badge"
const columns: ColumnDef<ShipmentWithRelations>[] = [
  {
    accessorKey: "awbNumber",
    header: ({ column }) => <ColumnHeader column={column} title="AWB / reference" />,
    cell: ({ row }) => (
      <Link
        href={`/dashboard/shipments/${row.original.id}`}
        className="font-mono text-xs font-semibold text-primary hover:underline underline-offset-4"
      >
        {row.original.awbNumber}
      </Link>
    ),
  },
  {
    accessorKey: "origin",
    header: ({ column }) => <ColumnHeader column={column} title="Route" />,
    cell: ({ row }) => (
      <div className="min-w-[180px]">
        <p className="font-medium text-foreground text-sm">
          {row.original.origin} → {row.original.destination}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {row.original.serviceType === "express_air" ? "Air cargo" : "Surface cargo"} · {row.original.weightKg} kg
        </p>
      </div>
    ),
  },
  {
    id: "handling",
    header: "Handling",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center gap-1.5">
        {row.original.isFragile && <Badge variant="outline" className="text-[11px]">Fragile</Badge>}
        {row.original.insuranceOptIn && <Badge variant="outline" className="text-[11px]">Insured</Badge>}
        {!row.original.isFragile && !row.original.insuranceOptIn && (
          <span className="text-xs text-muted-foreground">Standard</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <ColumnHeader column={column} title="Created" />,
    cell: ({ row }) => (
      <time
        dateTime={new Date(row.original.createdAt).toISOString()}
        className="text-xs text-muted-foreground whitespace-nowrap"
      >
        {format(new Date(row.original.createdAt), "dd MMM yyyy")}
      </time>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ShipmentActions shipment={row.original} />,
  },
]

export function ShipmentsDataTable({
  data,
  pageCount,
  bordered = true,
}: {
  data: ShipmentWithRelations[]
  pageCount: number
  bordered?: boolean
}) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })
  return <DataTable table={table} columnsLength={columns.length} bordered={bordered} />
}


