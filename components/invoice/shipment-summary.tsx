"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface ShipmentSummaryProps {
  doc: TaxInvoiceDocument
}

export function ShipmentSummary({ doc }: ShipmentSummaryProps) {
  const { metrics, serviceMode } = doc.shipment

  return (
    <section className="invoice-section my-1 grid grid-cols-5 gap-2 border border-print-border bg-print-paper-subtle/60 px-2.5 py-1 text-center text-[8.5px]">
      {/* Service Class */}
      <div className="flex flex-col items-center justify-center border-r border-print-border pr-2">
        <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-print-muted">
          SERVICE MODE
        </span>
        <span className="font-heading text-[10px] font-bold uppercase text-print-ink mt-0.5">
          {serviceMode === "express_air" ? "Express Air" : "Surface Road"}
        </span>
      </div>

      {/* Pieces */}
      <div className="flex flex-col items-center justify-center border-r border-print-border pr-2">
        <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-print-muted">
          PACKAGES / PIECES
        </span>
        <span className="font-mono text-[11px] font-bold text-print-ink mt-0.5">
          {metrics.pieces} {metrics.pieces === 1 ? "Unit" : "Units"}
        </span>
      </div>

      {/* Actual Weight */}
      <div className="flex flex-col items-center justify-center border-r border-print-border pr-2">
        <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-print-muted">
          ACTUAL WEIGHT
        </span>
        <span className="font-mono text-[11px] font-bold text-print-ink mt-0.5">
          {metrics.actualWeightKg.toFixed(2)} kg
        </span>
      </div>

      {/* Volumetric Weight */}
      <div className="flex flex-col items-center justify-center border-r border-print-border pr-2">
        <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-print-muted">
          VOLUMETRIC WEIGHT
        </span>
        <span className="font-mono text-[11px] font-bold text-print-muted mt-0.5">
          {metrics.volumetricWeightKg > 0 ? `${metrics.volumetricWeightKg.toFixed(2)} kg` : "-"}
        </span>
      </div>

      {/* Chargeable Weight & Basis */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-print-muted">
          CHARGEABLE WEIGHT
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="font-mono text-[11px] font-black text-print-ink">
            {metrics.chargeableWeightKg.toFixed(2)} kg
          </span>
          <span className="border border-print-border bg-print-paper px-1 py-0.2 text-[7px] font-mono font-bold uppercase tracking-wider text-print-muted">
            {metrics.weightBasis}
          </span>
        </div>
      </div>
    </section>
  )
}
