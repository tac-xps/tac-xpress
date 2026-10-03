"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface InvoiceHeaderProps {
  doc: TaxInvoiceDocument
}

export function InvoiceHeader({ doc }: InvoiceHeaderProps) {
  const { commercial, shipment, routing } = doc
  const statusLabel =
    commercial.status === "paid"
      ? "PAID IN FULL"
      : commercial.status === "partially_paid"
      ? "PARTIALLY PAID"
      : commercial.status === "void"
      ? "CANCELLED / VOID"
      : "ISSUED"

  const statusColorClass =
    commercial.status === "paid"
      ? "text-emerald-700 border-emerald-700 bg-emerald-50"
      : commercial.status === "partially_paid"
      ? "text-amber-800 border-amber-700 bg-amber-50"
      : commercial.status === "void"
      ? "text-red-700 border-red-700 bg-red-50"
      : "text-neutral-800 border-neutral-300 bg-neutral-100"

  return (
    <header className="invoice-section flex flex-col gap-2 border-b border-[#e2dedc] pb-2.5">
      {/* ── TOP IDENTITY & DOCUMENT STATUS RAIL ── */}
      <div className="flex items-center justify-between text-[8px] font-mono tracking-wider uppercase text-neutral-500">
        <span>TAX INVOICE • ORIGINAL FOR RECIPIENT</span>
        <div className="flex items-center gap-2">
          <span>SUPPLY: {routing.isInterstate ? "INTERSTATE" : "INTRASTATE"}</span>
          <span
            className={`border px-1.5 py-0.5 font-bold tracking-widest text-[7.5px] ${statusColorClass}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between">
        {/* Left: Brand Identity */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <h1 className="font-heading text-2xl font-black tracking-tight text-[#191716]">
              {commercial.supplier.brandName}
            </h1>
            <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
              LOGISTICS &amp; SUPPLY CHAIN
            </span>
          </div>
          <p className="text-[9.5px] font-bold text-neutral-900 leading-tight">
            {commercial.supplier.legalName}
          </p>
          <p className="text-[8px] text-neutral-700 leading-tight">
            {commercial.supplier.addressLine1}, {commercial.supplier.addressLine2}
          </p>
          <p className="text-[8px] text-neutral-700 leading-tight font-mono">
            {commercial.supplier.city}, {commercial.supplier.state} - {commercial.supplier.pinCode}
            {commercial.supplier.phone && <span> • Desk: {commercial.supplier.phone}</span>}
          </p>
        </div>

        {/* Right: Operational Hero Identifier (AWB) & Invoice Reference */}
        <div className="flex flex-col items-end text-right">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">
              AIRWAY BILL (AWB) NUMBER
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-[#191716] leading-none my-0.5">
              {shipment.awbNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-[9.5px]">
            <span className="font-mono text-neutral-600">
              Inv: <strong className="text-black">{commercial.invoiceNumber}</strong>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-600">
              Date: <strong className="text-black">{commercial.invoiceDate}</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
