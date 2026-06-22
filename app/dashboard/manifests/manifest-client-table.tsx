"use client"

import React, { useState, useMemo } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ManifestActions } from "./manifest-actions"
import { DataTablePagination } from "@/components/ui/data-table-pagination"

export function ManifestClientTable({ manifests }: { manifests: any[] }) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const filteredData = useMemo(() => {
    if (!globalFilter) return manifests
    const lowerFilter = globalFilter.toLowerCase()
    return manifests.filter(
      (m) =>
        (m.referenceId?.toLowerCase() || "").includes(lowerFilter) ||
        (m.originHubId?.toLowerCase() || "").includes(lowerFilter) ||
        (m.destinationHubId?.toLowerCase() || "").includes(lowerFilter)
    )
  }, [manifests, globalFilter])

  useMemo(() => {
    setCurrentPage(1)
  }, [globalFilter])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  return (
    <>
      <div className="absolute top-0 right-0 z-10 w-[calc(100%-2rem)] md:top-4 md:right-4 md:w-[300px]">
        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reference ID or Hub..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 border-border/50 bg-background pl-8"
          />
        </div>
      </div>

      <div className="w-full scrollbar-thin overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="w-[200px] px-5">Manifest ID</TableHead>
                <TableHead>Origin Hub</TableHead>
                <TableHead>Dest Hub</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="w-[80px] px-5 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No manifests found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((manifest) => (
                  <TableRow
                    key={manifest.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="px-5 font-mono font-medium whitespace-nowrap tabular-nums">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        {manifest.referenceId}
                      </div>
                    </TableCell>
                    <TableCell>
                      {manifest.originHubId?.slice(0, 8) || "N/A"}
                    </TableCell>
                    <TableCell>
                      {manifest.destinationHubId?.slice(0, 8) || "N/A"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">
                      {format(new Date(manifest.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          manifest.status === "finalized"
                            ? "bg-primary/10 text-status-delivered"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {manifest.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {manifest.createdBy?.slice(0, 8) || "System"}
                    </TableCell>
                    <TableCell className="px-5 text-right">
                      <ManifestActions manifest={manifest} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  )
}
