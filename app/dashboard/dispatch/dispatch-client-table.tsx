"use client"
import type { Manifest } from "@/lib/db/schema"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DispatchActions } from "./dispatch-actions"
import { RunControls } from "./run-controls"
export type DispatchRunRecord = Manifest & {
  driver?: { name: string } | null
  vehicle?: { registrationNumber: string } | null
  items?: { shipment: { status: string } | null }[]
}
export function DispatchClientTable({
  dispatchRuns,
}: {
  dispatchRuns: DispatchRunRecord[]
}) {
  return (
    <Table aria-label="Dispatch runs">
      <TableHeader>
        <TableRow>
          <TableHead className="pl-5">Run</TableHead>
          <TableHead>Driver</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dispatchRuns.map((run) => (
          <TableRow key={run.id}>
            <TableCell className="py-4 pl-5 font-mono">
              {run.referenceId}
            </TableCell>
            <TableCell>{run.driver?.name || "Unassigned"}</TableCell>
            <TableCell>
              {run.vehicle?.registrationNumber || "Unassigned"}
            </TableCell>
            <TableCell>
              {new Date(run.createdAt).toLocaleDateString("en-IN")}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {run.status === "draft" ? "Draft" : "Started"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <RunControls run={run} />
                <DispatchActions dispatchRun={run} />
              </div>
            </TableCell>
          </TableRow>
        ))}
        {!dispatchRuns.length && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-10 text-center text-muted-foreground"
            >
              No dispatch runs on this page.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
