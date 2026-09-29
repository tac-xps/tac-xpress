"use client"
import type { Vehicle } from "@/lib/db/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { VehicleActions } from "./vehicle-actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type VehicleWithRelations = Vehicle & { driver?: { name: string } | null }

export function VehiclesDataTable({
  data,
  pageCount,
  drivers
}: {
  data: VehicleWithRelations[]
  pageCount: number
  drivers: { id: string; name: string }[]
}) {
  const columns: ColumnDef<VehicleWithRelations>[] = [
    { accessorKey: "registrationNumber", header: ({ column }) => <ColumnHeader column={column} title="Registration" />, cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.original.registrationNumber}</span> },
    { accessorKey: "capacityKg", header: ({ column }) => <ColumnHeader column={column} title="Capacity" />, cell: ({ row }) => `${row.original.capacityKg.toLocaleString("en-IN")} kg` },
    { id: "driver", header: "Assigned driver", cell: ({ row }) => row.original.driver?.name ?? "Not assigned" },
    { accessorKey: "status", header: ({ column }) => <ColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.status}</Badge> },
    { id: "actions", header: "Actions", cell: ({ row }) => <VehicleActions vehicle={row.original} drivers={drivers} /> },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Vehicles</CardTitle>
        <CardDescription>{data.length} records on this page</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable table={table} columnsLength={columns.length} />
      </CardContent>
    </Card>
  )
}
