"use client"

import React, { useState, useMemo } from "react"
import { DriverActions } from "./driver-actions"
import { DataTablePagination } from "@/components/ui/data-table-pagination"

export function DriversClientTable({ drivers }: { drivers: any[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const totalPages = Math.ceil(drivers.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return drivers.slice(start, start + pageSize)
  }, [drivers, currentPage, pageSize])

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Drivers Directory
        </h2>
      </div>
      <div className="flex-1 rounded-md border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                Name
              </th>
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                License
              </th>
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="h-24 text-center">
                  No drivers found.
                </td>
              </tr>
            ) : (
              paginatedData.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle font-medium">
                    {driver.name}
                  </td>
                  <td className="p-4 align-middle">{driver.licenseNumber}</td>
                  <td className="p-4 align-middle capitalize">
                    {driver.status.replace("_", " ")}
                  </td>
                  <td className="p-4 text-right align-middle">
                    <DriverActions driver={driver} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
