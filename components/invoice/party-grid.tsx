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
    <section className="invoice-section my-1 grid grid-cols-2 gap-3 border-b border-[#e2dedc] pb-1.5 text-[8.5px]">
      {/* ── 1. BILLED TO (COMMERCIAL RECIPIENT / CONSIGNOR) ── */}
      <div className="flex flex-col border border-[#e2dedc] p-2 bg-[#f7f5f3]/40">
        <span className="border-b border-[#e2dedc] pb-0.5 font-mono text-[7.5px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          BILLED TO (COMMERCIAL RECIPIENT)
        </span>
        <p className="font-bold text-[#191716] text-[9.5px] leading-tight truncate">
          {billTo.name}
        </p>
        {billTo.company && (
          <p className="font-semibold text-neutral-700 leading-tight truncate">
            {billTo.company}
          </p>
        )}
        <p className="text-neutral-700 leading-tight mt-0.5 line-clamp-2">
          {billTo.addressLine}
        </p>
        <p className="text-neutral-700 font-mono text-[8px]">
          {billTo.city}, {billTo.state} {billTo.pinCode ? `- ${billTo.pinCode}` : ""}
        </p>
        <div className="mt-1 pt-0.5 border-t border-[#e2dedc]/60 flex flex-wrap gap-x-3 font-mono text-[7.5px] text-neutral-600">
          {billTo.phone && <span>Ph: {billTo.phone}</span>}
          {billTo.email && <span className="truncate">Email: {billTo.email}</span>}
          {billTo.gstin && <span>GSTIN: <strong>{billTo.gstin}</strong></span>}
        </div>
      </div>

      {/* ── 2. DELIVER TO (PHYSICAL CONSIGNEE) ── */}
      <div className="flex flex-col border border-[#e2dedc] p-2 bg-[#f7f5f3]/40">
        <span className="border-b border-[#e2dedc] pb-0.5 font-mono text-[7.5px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          DELIVER TO (PHYSICAL CONSIGNEE)
        </span>
        <p className="font-bold text-[#191716] text-[9.5px] leading-tight truncate">
          {deliverTo.name}
        </p>
        <p className="text-neutral-700 leading-tight mt-0.5 line-clamp-2">
          {deliverTo.addressLine}
        </p>
        <p className="text-neutral-700 font-mono text-[8px]">
          {deliverTo.city}, {deliverTo.state} - {deliverTo.pinCode}
        </p>
        <div className="mt-1 pt-0.5 border-t border-[#e2dedc]/60 flex flex-wrap gap-x-3 font-mono text-[7.5px] text-neutral-600">
          {deliverTo.phone && <span>Ph: {deliverTo.phone}</span>}
          {deliverTo.altPhone && <span>Alt: {deliverTo.altPhone}</span>}
          {deliverTo.email && <span className="truncate">Email: {deliverTo.email}</span>}
        </div>
      </div>
    </section>
  )
}
