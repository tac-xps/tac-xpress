"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface RouteStripProps {
  doc: TaxInvoiceDocument
}

export function RouteStrip({ doc }: RouteStripProps) {
  const { routing, shipment } = doc

  return (
    <div className="invoice-section my-1 rounded-none border border-print-border bg-print-paper-subtle/80 px-2.5 py-1">
      <div className="flex items-center justify-between">
        {/* Origin */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[9px] font-bold text-print-muted">
              ORIGIN [{routing.originStateCode}]
            </span>
            <span className="font-heading text-xs font-bold text-print-ink">
              {routing.originHubCode} • DELHI
            </span>
          </div>
          <span className="text-[8.5px] text-print-muted leading-tight">
            Kotla Mubarakpur, New Delhi - 110003
          </span>
        </div>

        {/* Corridor Arrow & Service Mode Indicator */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative flex w-full max-w-[220px] items-center">
            <div className="h-[1px] w-full bg-print-border" />
            <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-print-paper-subtle px-2 text-center">
              <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-print-muted">
                {shipment.serviceMode === "express_air" ? "✈ Express Air Linehaul" : "🚛 Surface Road Corridor"}
              </span>
            </div>
            <span className="text-print-muted -ml-1 text-[10px] leading-none">►</span>
          </div>
        </div>

        {/* Destination */}
        <div className="flex flex-col text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="font-heading text-xs font-bold text-print-ink">
              {routing.destHubCode} • MANIPUR
            </span>
            <span className="font-mono text-[9px] font-bold text-print-muted">
              [{routing.destStateCode}] DEST
            </span>
          </div>
          <span className="text-[8.5px] text-print-muted leading-tight">
            Singjamei Top Leikai, Kakwa, Imphal - 795003
          </span>
        </div>
      </div>
    </div>
  )
}
