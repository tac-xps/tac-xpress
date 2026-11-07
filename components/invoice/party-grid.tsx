"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface PartyGridProps {
  doc: TaxInvoiceDocument
}

export function PartyGrid({ doc }: PartyGridProps) {
  const { commercial, shipment } = doc
  const { billTo } = commercial
  const { deliverTo } = shipment

  return (
    <section className="invoice-section my-2 grid grid-cols-2 gap-6 border-b border-print-border pb-2.5 text-[8.5px]">
      {/* ── 1. BILLED TO (COMMERCIAL RECIPIENT) ── */}
      <div className="flex flex-col">
        <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-print-muted mb-1">
          BILLED TO (COMMERCIAL RECIPIENT)
        </span>
        <p className="font-bold text-print-ink text-[11px] leading-tight truncate">
          {billTo.name}
        </p>
        {billTo.company && (
          <p className="font-medium text-print-muted leading-tight truncate mt-0.5">
            {billTo.company}
          </p>
        )}
        <p className="text-print-muted leading-tight mt-1">
          {billTo.addressLine}
        </p>
        <p className="text-print-muted font-mono text-[8px] mt-0.5">
          {billTo.city}, {billTo.state} {billTo.pinCode ? `- ${billTo.pinCode}` : ""}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-x-4 font-mono text-[7.5px] text-print-muted">
          {billTo.phone && <span>Ph: {billTo.phone}</span>}
          {billTo.email && <span className="truncate">Email: {billTo.email}</span>}
          {billTo.gstin && <span>GSTIN: <strong className="text-print-ink">{billTo.gstin}</strong></span>}
        </div>
      </div>

      {/* ── 2. DELIVER TO (PHYSICAL CONSIGNEE) ── */}
      <div className="flex flex-col">
        <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-print-muted mb-1">
          DELIVER TO (PHYSICAL CONSIGNEE)
        </span>
        <p className="font-bold text-print-ink text-[11px] leading-tight truncate">
          {deliverTo.name}
        </p>
        <p className="text-print-muted leading-tight mt-1">
          {deliverTo.addressLine}
        </p>
        <p className="text-print-muted font-mono text-[8px] mt-0.5">
          {deliverTo.city}, {deliverTo.state} - {deliverTo.pinCode}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-x-4 font-mono text-[7.5px] text-print-muted">
          {deliverTo.phone && <span>Ph: {deliverTo.phone}</span>}
          {deliverTo.altPhone && <span>Alt: {deliverTo.altPhone}</span>}
          {deliverTo.email && <span className="truncate">Email: {deliverTo.email}</span>}
        </div>
      </div>
    </section>
  )
}
