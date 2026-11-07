"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface DestinationHubProps {
  doc: TaxInvoiceDocument
}

export function DestinationHub({ doc }: DestinationHubProps) {
  const { destinationHub } = doc.shipment
  const { supplier } = doc.commercial

  return (
    <section className="invoice-section my-1.5 flex items-center justify-between border-b border-print-border pb-1.5 text-[7.5px]">
      <div className="flex items-center gap-2">
        <span className="font-heading text-[8px] font-bold uppercase tracking-wider text-print-ink">
          DESTINATION STATION [{destinationHub.code}]: {destinationHub.name}
        </span>
        <span className="font-mono text-[7px] text-print-muted">
          {destinationHub.addressLine1}, {destinationHub.city}, {destinationHub.state} - {destinationHub.pinCode}
        </span>
      </div>
      <div className="flex items-center gap-3 font-mono text-[7px] text-print-muted">
        <span>
          Hub Helpline: <strong className="text-print-ink">{destinationHub.phone}</strong>
        </span>
        <span>Hours: 08:30 to 19:30 IST</span>
        <span className="font-bold text-print-ink">
          GSTIN: {supplier.gstin}
        </span>
      </div>
    </section>
  )
}
