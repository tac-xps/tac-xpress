"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, type TableSort } from "@/components/operations/data-table"
import { ColumnHeader } from "@/components/operations/column-header"
import { StaffActions } from "./staff-actions"
import { Badge } from "@/components/ui/badge"

export type StaffData = { 
  id: string; 
  name: string | null; 
  phone: string | null; 
  email: string | null; 
  role: "admin" | "staff" | "customer";
}

const columns: ColumnDef<StaffData>[] = [
  { 
    accessorKey: "name", 
    header: ({ column }) => <ColumnHeader column={column} title="Name" />, 
    cell: ({ row }) => <span className="font-medium">{row.original.name || "Name not recorded"}</span> 
  },
  { 
    accessorKey: "email", 
    header: ({ column }) => <ColumnHeader column={column} title="Email" />, 
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email || "Not recorded"}</span> 
  },
  { 
    accessorKey: "phone", 
    header: "Phone", 
    cell: ({ row }) => row.original.phone || "Not recorded" 
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "admin" ? "default" : "secondary"} className="capitalize">
        {row.original.role}
      </Badge>
    )
  },
  { 
    id: "actions", 
    header: "Actions", 
    cell: ({ row }) => <StaffActions staff={{ ...row.original, name: row.original.name || "" }} /> 
  },
]

export function StaffClientTable({ data, ...sort }: { data: StaffData[] } & TableSort) { 
  return <DataTable data={data} columns={columns} {...sort} /> 
}
