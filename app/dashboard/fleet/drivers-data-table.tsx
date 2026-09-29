"use client"
import type { Driver } from "@/lib/db/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { DriverActions } from "./driver-actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DriversDataTable({
  data,
  pageCount,
}: {
  data: Driver[]
  pageCount: number
}) {
  const columns: ColumnDef<Driver>[] = [
    { accessorKey: "name", header: ({ column }) => <ColumnHeader column={column} title="Driver" />, cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "phone", header: ({ column }) => <ColumnHeader column={column} title="Phone" />, cell: ({ row }) => row.original.phone },
    { accessorKey: "licenseNumber", header: ({ column }) => <ColumnHeader column={column} title="Licence" />, cell: ({ row }) => <span className="font-mono text-xs">{row.original.licenseNumber}</span> },
    { accessorKey: "status", header: ({ column }) => <ColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.status.replaceAll("_", " ")}</Badge> },
    { id: "actions", header: "Actions", cell: ({ row }) => <DriverActions driver={row.original} /> },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    pageKey: "driver_page",
    perPageKey: "driver_per_page",
    sortKey: "driver_sort",
  })

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Drivers</CardTitle>
        <CardDescription>{data.length} records on this page</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable table={table} columnsLength={columns.length} />
      </CardContent>
    </Card>
  )
}
