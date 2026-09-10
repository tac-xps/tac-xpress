"use client"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, type TableSort } from "@/components/operations/data-table"
import { ColumnHeader } from "@/components/operations/column-header"
import { CustomerActions } from "./customer-actions"
type CustomerData = { id: string; name: string | null; phone: string | null; email: string | null; city: string | null; state: string | null; pinCode: string | null; address: string | null }
const columns: ColumnDef<CustomerData>[] = [
  { accessorKey: "name", header: ({ column }) => <ColumnHeader column={column} title="Customer" />, cell: ({ row }) => <Link href={`/dashboard/customers/${row.original.id}/ledger`} className="font-medium underline-offset-4 hover:underline">{row.original.name || "Name not recorded"}</Link> },
  { accessorKey: "email", header: ({ column }) => <ColumnHeader column={column} title="Email" />, cell: ({ row }) => <span className="text-muted-foreground">{row.original.email || "Not recorded"}</span> },
  { accessorKey: "phone", header: "Phone", cell: ({ row }) => row.original.phone || "Not recorded" },
  { accessorKey: "city", header: ({ column }) => <ColumnHeader column={column} title="Location" />, cell: ({ row }) => [row.original.city, row.original.state].filter(Boolean).join(", ") || "Not recorded" },
  { accessorKey: "address", header: "Address", cell: ({ row }) => <p className="max-w-64 whitespace-normal text-muted-foreground">{row.original.address || "Not recorded"}</p> },
  { id: "actions", header: "Actions", cell: ({ row }) => <CustomerActions customer={{ ...row.original, name: row.original.name || "" }} /> },
]
export function CustomerDataTable({ data, ...sort }: { data: CustomerData[] } & TableSort) { return <DataTable data={data} columns={columns} {...sort} /> }

