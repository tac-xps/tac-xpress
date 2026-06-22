"use client"

import React from "react"
import Link from "next/link"
import type { Manifest } from "@/lib/db/schema"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DISPATCH_DATA = [
  {
    awb: "AWB-9DAB95F8AA1E",
    route: "DEL → BOM",
    carrier: "Delhivery / Tommy Garza",
    progress: 80,
    status: "In Transit",
  },
  {
    awb: "AWB-3F4G82C1XX9M",
    route: "BLR → CCU",
    carrier: "Bluedart / Sarah Connor",
    progress: 45,
    status: "Delayed",
  },
  {
    awb: "AWB-7R1T99H4KL2P",
    route: "BOM → HYD",
    carrier: "FedEx / Marcus Reed",
    progress: 100,
    status: "Delivered",
  },
  {
    awb: "AWB-1L5P66V3BQ8N",
    route: "DEL → MAA",
    carrier: "DHL / Emma Frost",
    progress: 15,
    status: "At Origin",
  },
]

interface ActiveDispatchTableProps {
  data: any[] // Accepts populated manifest runs
}

export function ActiveDispatchTable({ data }: ActiveDispatchTableProps) {
  return (
    <Card className="h-full delay-700">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 p-6">
        <div>
          <CardTitle className="text-base font-semibold tracking-tight">
            Active Dispatch Runs
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Real-time deployment tracking for active line-haul routes.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
            <TableRow>
              <TableHead className="px-5">Run ID</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Carrier / Driver</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="px-5 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No active dispatch runs.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className="group transition-colors hover:bg-background/40"
                >
                  <TableCell className="px-5 font-medium tracking-tight tabular-nums">
                    {item.referenceId}
                  </TableCell>
                  <TableCell>
                    {item.originHub?.name || "Unknown"} →{" "}
                    {item.destinationHub?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {item.driver?.name
                      ? `${item.driver.name} / ${item.vehicle?.registrationNumber || "Unassigned"}`
                      : "Unassigned"}
                  </TableCell>
                  <TableCell className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          item.status === "finalized"
                            ? 100
                            : item.status === "in-transit"
                              ? 50
                              : 10
                        }
                        className="h-1.5 w-full bg-muted/50"
                      />
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        {item.status === "finalized"
                          ? 100
                          : item.status === "in-transit"
                            ? 50
                            : 10}
                        %
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="relative flex size-2 items-center justify-center">
                        {item.status === "in-transit" && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                        )}
                        <span
                          className={`relative inline-flex size-2 rounded-full ${
                            item.status === "finalized"
                              ? "bg-muted-foreground"
                              : item.status === "in-transit"
                                ? "bg-primary"
                                : "bg-primary/50"
                          }`}
                        ></span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground capitalize">
                        {item.status ?? "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 group-hover:bg-background/60"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-border/50 bg-background/60 backdrop-blur-md"
                      >
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/shipments/${item.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
