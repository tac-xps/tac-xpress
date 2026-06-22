"use client"

import { useMemo, useState } from "react"
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from "@/components/kibo-ui/table"
import type { ColumnDef } from "@/components/kibo-ui/table"
import { CustomerActions } from "./customer-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type CustomerData = {
  id: string
  name: string | null
  phone: string | null
  email: string | null
  city: string | null
  state: string | null
  pinCode: string | null
  address: string | null
}

export function CustomerDataTable({ data }: { data: CustomerData[] }) {
  const [globalFilter, setGlobalFilter] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const filteredData = useMemo(() => {
    if (!globalFilter) return data
    const lowerFilter = globalFilter.toLowerCase()
    return data.filter(
      (item) =>
        (item.name?.toLowerCase() || "").includes(lowerFilter) ||
        (item.email?.toLowerCase() || "").includes(lowerFilter) ||
        (item.phone?.toLowerCase() || "").includes(lowerFilter) ||
        (item.city?.toLowerCase() || "").includes(lowerFilter)
    )
  }, [data, globalFilter])

  // Reset to page 1 when filter changes
  useMemo(() => {
    setCurrentPage(1)
  }, [globalFilter])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const columns = useMemo<ColumnDef<CustomerData>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Customer ID" />
        ),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap text-muted-foreground tabular-nums">
            {String(row.getValue("id")).slice(0, 8).toUpperCase()}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Client Name" />
        ),
        cell: ({ row }) => {
          const name = String(row.getValue("name") || "")
          return (
            <div className="flex items-center gap-3 whitespace-nowrap">
              <Avatar className="h-8 w-8 ring-1 ring-border/50">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=000000`}
                />
                <AvatarFallback>{(name || "C").charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{name}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => <span>{row.getValue("phone")}</span>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.getValue("email") || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <div className="text-right">
            <TableColumnHeader
              column={column}
              title="City"
              className="justify-end"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-medium tabular-nums">
            {row.getValue("city") || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: ({ column }) => (
          <div className="text-center">
            <TableColumnHeader
              column={column}
              title="Address"
              className="justify-center"
            />
          </div>
        ),
        cell: ({ row }) => {
          const address = row.getValue("address") as string | null
          return (
            <div className="text-center tabular-nums">
              {address ? address.slice(0, 20) + "..." : "N/A"}
            </div>
          )
        },
      },
      {
        id: "status",
        header: () => <div className="w-[120px]">Status</div>,
        cell: () => <Badge variant="success">Active</Badge>,
      },
      {
        id: "actions",
        header: () => <div className="w-[80px] px-5 text-right">Actions</div>,
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex justify-end">
              <CustomerActions
                customer={{
                  id: item.id,
                  name: item.name || "",
                  email: item.email,
                  phone: item.phone,
                  address: item.address,
                  city: item.city,
                  state: item.state,
                  pinCode: item.pinCode,
                }}
              />
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="relative flex w-full flex-col">
      <div className="absolute -top-12 right-0 z-10 w-[calc(100%-2rem)] md:right-4 md:w-auto">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 border-border/50 bg-background pl-8"
          />
        </div>
      </div>
      <div className="w-full scrollbar-thin overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          <TableProvider columns={columns} data={paginatedData}>
            <TableHeader>
              {({ headerGroup }) => (
                <TableHeaderGroup
                  key={headerGroup.id}
                  headerGroup={headerGroup}
                >
                  {({ header }) => (
                    <TableHead key={header.id} header={header} />
                  )}
                </TableHeaderGroup>
              )}
            </TableHeader>
            <TableBody>
              {({ row }) => (
                <TableRow
                  key={row.id}
                  row={row}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {({ cell }) => <TableCell key={cell.id} cell={cell} />}
                </TableRow>
              )}
            </TableBody>
          </TableProvider>
        </div>
      </div>
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
