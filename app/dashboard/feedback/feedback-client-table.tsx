"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { FeedbackActions, type FeedbackData } from "./feedback-actions"

const columns: ColumnDef<FeedbackData>[] = [
  { 
    accessorKey: "name", 
    header: ({ column }) => <ColumnHeader column={column} title="Name" />, 
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span> 
  },
  { 
    accessorKey: "email", 
    header: ({ column }) => <ColumnHeader column={column} title="Email" />, 
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span> 
  },
  { 
    accessorKey: "message", 
    header: "Message", 
    cell: ({ row }) => <p className="max-w-md line-clamp-2 text-muted-foreground" title={row.original.message}>{row.original.message}</p> 
  },
  { 
    accessorKey: "createdAt", 
    header: ({ column }) => <ColumnHeader column={column} title="Date" />, 
    cell: ({ row }) => <span className="whitespace-nowrap">{new Date(row.original.createdAt).toLocaleDateString()}</span> 
  },
  { 
    id: "actions", 
    header: "Actions", 
    cell: ({ row }) => <FeedbackActions feedback={row.original} /> 
  },
]

export function FeedbackClientTable({ data, pageCount }: { data: FeedbackData[], pageCount: number }) { 
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })
  return <DataTable table={table} columnsLength={columns.length} /> 
}
