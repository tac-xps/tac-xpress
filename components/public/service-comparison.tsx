"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rows = [
  [
    "Operational fit",
    "Priority 24 to 48 hour transit when schedule speed and time-critical delivery are paramount.",
    "High-capacity road linehaul when volume freight, heavy machinery, or cost optimization is primary.",
  ],
  [
    "Consignment specs",
    "Piece count, gross weight, L × W × H external dimensions, and required flight departure date.",
    "Pallet count, total cubic volume, gross tonnage, and destination dock loading constraints.",
  ],
  [
    "Corridor routing",
    "Commercial scheduled flight belly-hold capacity, terminal security screening, and onward station sortation.",
    "National highway arterial routes, multi-axle freight vehicles, and all-weather regional transit.",
  ],
  [
    "Statutory declarations",
    "Mandatory IATA DG check (lithium batteries UN 3480/3481, liquids) and consignor identity declarations.",
    "Stackability constraints, center-of-gravity stencil markers, and transit-grade pallet banding.",
  ],
  [
    "Tariff basis",
    "Calculated on chargeable volumetric weight (1:6000 ratio vs gross weight), plus statutory 18% GST.",
    "Determined by gross cubic volume, truckload class, corridor mileage index, and freight tariff.",
  ],
]

export function ServiceComparison() {
  return (
    <section
      id="comparison"
      className="w-full border-b border-border bg-background py-16 lg:py-24"
      aria-labelledby="comparison-title"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-primary font-medium">
              <span className="size-1.5 rounded-none bg-primary" aria-hidden="true" />
              Corridor evaluation
            </div>
            <h2 id="comparison-title" className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-4xl">
              Choose with the details in view
            </h2>
          </div>
          <p className="max-w-md text-xs font-sans text-muted-foreground">
            Planning criteria across both modes for the New Delhi and Imphal corridor. Confirm route availability and spot tariffs with our operations desk.
          </p>
        </div>

        <div className="rounded-none border border-border bg-card shadow-xs overflow-hidden">
          <Table>
            <caption className="sr-only">
              Air and surface cargo planning comparison
            </caption>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/40">
                <TableHead className="min-w-40 font-mono text-xs font-semibold text-foreground py-3.5">
                  Planning criteria
                </TableHead>
                <TableHead className="min-w-64 font-mono text-xs font-semibold text-primary py-3.5">
                  Air cargo: Express flight
                </TableHead>
                <TableHead className="min-w-64 font-mono text-xs font-semibold text-foreground py-3.5">
                  Surface cargo: Arterial linehaul
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {rows.map(([label, air, surface]) => (
                <TableRow key={label} className="transition-colors hover:bg-muted/20">
                  <TableCell className="font-medium text-xs font-mono text-foreground py-3.5 align-top">
                    {label}
                  </TableCell>
                  <TableCell className="leading-relaxed whitespace-normal text-xs font-sans text-muted-foreground py-3.5 align-top">
                    {air}
                  </TableCell>
                  <TableCell className="leading-relaxed whitespace-normal text-xs font-sans text-muted-foreground py-3.5 align-top">
                    {surface}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
