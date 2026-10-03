"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface RouteStripProps {
  doc: TaxInvoiceDocument
}

export function RouteStrip({ doc }: RouteStripProps) {
  const { routing, shipment } = doc

  return (
    <div className="invoice-section my-1 rounded-none border border-[#e2dedc] bg-[#f7f5f3]/80 px-2.5 py-1">
      <div className="flex items-center justify-between">
        {/* Origin */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[9px] font-bold text-neutral-500">
              ORIGIN [{routing.originStateCode}]
            </span>
            <span className="font-heading text-xs font-bold text-[#191716]">
              {routing.originHubCode} • DELHI
            </span>
          </div>
          <span className="text-[8.5px] text-neutral-600 leading-tight">
            Kotla Mubarakpur, New Delhi - 110003
          </span>
        </div>

        {/* Corridor Arrow & Service Mode Indicator */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative flex w-full max-w-[220px] items-center">
            <div className="h-[1px] w-full bg-[#e2dedc]" />
            <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#f7f5f3] px-2 text-center">
              <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-neutral-600">
                {shipment.serviceMode === "express_air" ? "✈ Express Air Linehaul" : "🚛 Surface Road Corridor"}
              </span>
            </div>
            <span className="text-neutral-400 -ml-1 text-[10px] leading-none">►</span>
          </div>
        </div>

        {/* Destination */}
        <div className="flex flex-col text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="font-heading text-xs font-bold text-[#191716]">
              {routing.destHubCode} • MANIPUR
            </span>
            <span className="font-mono text-[9px] font-bold text-neutral-500">
              [{routing.destStateCode}] DEST
            </span>
          </div>
          <span className="text-[8.5px] text-neutral-600 leading-tight">
            Singjamei Top Leikai, Kakwa, Imphal - 795003
          </span>
        </div>
      </div>
    </div>
  )
}
