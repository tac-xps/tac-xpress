"use client"

import React, { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HubActions } from "./hub-actions"
import { DataTablePagination } from "@/components/ui/data-table-pagination"

export function HubsClientTable({ hubs }: { hubs: any[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const totalPages = Math.ceil(hubs.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return hubs.slice(start, start + pageSize)
  }, [hubs, currentPage, pageSize])

  return (
    <div className="flex w-full flex-col">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No transit hubs found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((hub) => (
                <TableRow key={hub.id}>
                  <TableCell className="font-medium">{hub.name}</TableCell>
                  <TableCell className="capitalize">
                    {hub.type.replace("_", " ")}
                  </TableCell>
                  <TableCell>{hub.location}</TableCell>
                  <TableCell>{hub.contact || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <HubActions hub={hub} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
