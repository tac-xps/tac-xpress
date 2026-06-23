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
import { format } from "date-fns"
import { DispatchActions } from "./dispatch-actions"
import { FileText, Play, CheckCheck, Loader2 } from "lucide-react"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Button } from "@/components/ui/button"
import { useAction } from "next-safe-action/hooks"
import { startDispatchRunAction, completeDispatchRunAction } from "./actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function DispatchClientTable({ dispatchRuns }: { dispatchRuns: any[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const totalPages = Math.ceil(dispatchRuns.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return dispatchRuns.slice(start, start + pageSize)
  }, [dispatchRuns, currentPage, pageSize])

  return (
    <div className="flex w-full flex-col">
      <div className="w-full scrollbar-thin overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead className="px-5">Run ID</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No dispatch runs found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((run) => {
                  const driver = run.driver
                  const vehicle = run.vehicle

                  return (
                    <TableRow
                      key={run.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="px-5 font-mono font-medium whitespace-nowrap tabular-nums">
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 text-muted-foreground" />
                          {run.referenceId}
                        </div>
                      </TableCell>
                      <TableCell>{driver?.name || "Unassigned"}</TableCell>
                      <TableCell>
                        {vehicle?.registrationNumber || "Unassigned"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">
                        {format(new Date(run.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                            run.status === "finalized"
                              ? "bg-primary/10 text-status-delivered"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {run.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <RunButtons run={run} />
                          <DispatchActions dispatchRun={run} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
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
    </div>
  )
}

function RunButtons({ run }: { run: any }) {
  const { executeAsync: startRun, isExecuting: isStarting } = useAction(
    startDispatchRunAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success)
          toast.success("Run started — shipments moved to In-Transit")
        else toast.error(data?.error || "Failed to start run")
      },
      onError: () => toast.error("Failed to start run"),
    }
  )

  const { executeAsync: completeRun, isExecuting: isCompleting } = useAction(
    completeDispatchRunAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success)
          toast.success("Run completed — shipments marked as Delivered")
        else toast.error(data?.error || "Failed to complete run")
      },
      onError: () => toast.error("Failed to complete run"),
    }
  )

  if (run.status === "draft") {
    return (
      <Button
        size="sm"
        variant="default"
        className="h-7 bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        disabled={isStarting}
        onClick={() => startRun({ id: run.id })}
      >
        {isStarting ? (
          <Loader2 className="mr-1.5 size-3 animate-spin" />
        ) : (
          <Play className="mr-1.5 size-3" />
        )}
        Start Run
      </Button>
    )
  }

  if (run.status === "finalized") {
    return (
      <Button
        size="sm"
        variant="outline"
        className="h-7 border-primary/30 px-3 text-xs font-semibold text-primary hover:bg-primary/10"
        disabled={isCompleting}
        onClick={() => completeRun({ id: run.id })}
      >
        {isCompleting ? (
          <Loader2 className="mr-1.5 size-3 animate-spin" />
        ) : (
          <CheckCheck className="mr-1.5 size-3" />
        )}
        Mark Delivered
      </Button>
    )
  }

  return null
}
