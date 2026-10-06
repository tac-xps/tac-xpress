"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { StaffActions } from "./staff-actions"
import { Badge } from "@/components/ui/badge"

export type StaffData = { 
  id: string; 
  name: string | null; 
  phone: string | null; 
  email: string | null; 
  role: "admin" | "staff" | "customer";
}

import React, { useMemo } from "react"

export function StaffClientTable({
  data,
  pageCount,
  currentUserId,
}: {
  data: StaffData[]
  pageCount: number
  currentUserId?: string
}) {
  const columns = useMemo<ColumnDef<StaffData>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <ColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.name || "Name not recorded"}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => <ColumnHeader column={column} title="Email" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.email || "Not recorded"}
          </span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => row.original.phone || "Not recorded",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge
            variant={row.original.role === "admin" ? "default" : "secondary"}
            className="capitalize"
          >
            {row.original.role}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <StaffActions
            staff={{ ...row.original, name: row.original.name || "" }}
            isSelf={Boolean(currentUserId && row.original.id === currentUserId)}
          />
        ),
      },
    ],
    [currentUserId]
  )

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })
  return <DataTable table={table} columnsLength={columns.length} />
}
