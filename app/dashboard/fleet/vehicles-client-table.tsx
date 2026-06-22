"use client"

import React, { useState, useMemo } from "react"
import { VehicleActions } from "./vehicle-actions"
import { DataTablePagination } from "@/components/ui/data-table-pagination"

export function VehiclesClientTable({
  vehicles,
  drivers,
}: {
  vehicles: any[]
  drivers: { id: string; name: string }[]
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const totalPages = Math.ceil(vehicles.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return vehicles.slice(start, start + pageSize)
  }, [vehicles, currentPage, pageSize])

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Vehicles Directory
        </h2>
      </div>
      <div className="flex-1 rounded-md border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                Registration
              </th>
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                Capacity
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
                  No vehicles found.
                </td>
              </tr>
            ) : (
              paginatedData.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle font-medium">
                    {vehicle.registrationNumber}
                  </td>
                  <td className="p-4 align-middle">{vehicle.capacityKg} kg</td>
                  <td className="p-4 align-middle capitalize">
                    {vehicle.status}
                  </td>
                  <td className="p-4 text-right align-middle">
                    <VehicleActions vehicle={vehicle} drivers={drivers} />
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
