"use client"

import React, { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { CustomerActions } from "./customer-actions"
import { CustomerLedgerDialog } from "./customer-ledger-dialog"

export type CustomerData = {
  id: string
  name: string | null
  phone: string | null
  email: string | null
  city: string | null
  state: string | null
  pinCode: string | null
  address: string | null
}

function CustomerNameCell({ customer }: { customer: CustomerData }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-medium underline-offset-4 hover:underline hover:text-primary cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={`View statement for ${customer.name || "customer"}`}
      >
        {customer.name || "Name not recorded"}
      </button>
      {open && (
        <CustomerLedgerDialog
          customerId={customer.id}
          customerName={customer.name}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  )
}

const columns: ColumnDef<CustomerData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => <CustomerNameCell customer={row.original} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email || "Not recorded"}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "Not recorded",
  },
  {
    accessorKey: "city",
    header: ({ column }) => <ColumnHeader column={column} title="Location" />,
    cell: ({ row }) =>
      [row.original.city, row.original.state].filter(Boolean).join(", ") || "Not recorded",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <p className="max-w-64 whitespace-normal text-muted-foreground">
        {row.original.address || "Not recorded"}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <CustomerActions customer={{ ...row.original, name: row.original.name || "" }} />
    ),
  },
]

export function CustomerDataTable({
  data,
  pageCount,
}: {
  data: CustomerData[]
  pageCount: number
}) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })
  return <DataTable table={table} columnsLength={columns.length} />
}
