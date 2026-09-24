"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { hubs as hubsSchema } from "@/lib/db/schema"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { Badge } from "@/components/ui/badge"
import { HubActions } from "./hub-actions"
type Hub = typeof hubsSchema.$inferSelect
const columns: ColumnDef<Hub>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Hub" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.type.replaceAll("_", " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => <ColumnHeader column={column} title="Location" />,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => row.original.contact || "Not provided",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <HubActions hub={row.original} />,
  },
]
export function HubsClientTable({
  hubs,
  pageCount,
}: { hubs: Hub[], pageCount: number }) {
  const { table } = useDataTable({
    data: hubs,
    columns,
    pageCount,
  })
  return <DataTable table={table} columnsLength={columns.length} />
}
