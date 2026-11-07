"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface RouteStripProps {
  doc: TaxInvoiceDocument
}

export function RouteStrip({ doc }: RouteStripProps) {
  const { routing, shipment } = doc
  const isAir = shipment.serviceMode === "express_air"

  return (
    <div className="invoice-section my-1.5 border-b border-print-border pb-1.5">
      <div className="flex items-center justify-between text-[8px]">
        {/* Origin Hub */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8px] font-bold text-print-muted">
              ORIGIN [{routing.originStateCode}]
            </span>
            <span className="font-heading text-xs font-bold text-print-ink">
              {routing.originHubCode} / DELHI
            </span>
          </div>
          <span className="text-[7.5px] text-print-muted leading-tight mt-0.5">
            Kotla Mubarakpur, New Delhi 110003
          </span>
        </div>

        {/* Central Route & Corridor Classification */}
        <div className="flex flex-col items-center text-center">
          <span className="border border-print-ink bg-print-ink text-print-paper px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider">
            {isAir ? "EXPRESS AIR LINEHAUL" : "SURFACE ROAD CORRIDOR"}
          </span>
          <span className="font-mono text-[7px] text-print-muted mt-0.5">
            DELHI (DEL) TO IMPHAL (IMF)
          </span>
        </div>

        {/* Destination Hub */}
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1.5">
            <span className="font-heading text-xs font-bold text-print-ink">
              {routing.destHubCode} / MANIPUR
            </span>
            <span className="font-mono text-[8px] font-bold text-print-muted">
              [{routing.destStateCode}] DEST
            </span>
          </div>
          <span className="text-[7.5px] text-print-muted leading-tight mt-0.5">
            Singjamei Top Leikai, Imphal 795003
          </span>
        </div>
      </div>
    </div>
  )
}
