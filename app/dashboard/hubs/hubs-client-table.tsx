"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { hubs as hubsSchema } from "@/lib/db/schema"
import { DataTable, type TableSort } from "@/components/operations/data-table"
import { ColumnHeader } from "@/components/operations/column-header"
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
  ...sorting
}: { hubs: Hub[] } & TableSort) {
  return <DataTable data={hubs} columns={columns} {...sorting} />
}
