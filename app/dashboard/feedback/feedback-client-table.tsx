"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, type TableSort } from "@/components/operations/data-table"
import { ColumnHeader } from "@/components/operations/column-header"
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

export function FeedbackClientTable({ data, ...sort }: { data: FeedbackData[] } & TableSort) { 
  return <DataTable data={data} columns={columns} {...sort} /> 
}
