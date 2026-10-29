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
    <section className="invoice-section my-1 rounded-none border border-print-border bg-print-paper-subtle/80 p-1.5 text-[8px]">
      <div className="flex items-center justify-between border-b border-print-border pb-1">
        <div className="flex items-center gap-2">
          <span className="font-heading text-[8.5px] font-bold uppercase tracking-wider text-print-ink">
            DESTINATION DELIVERY STATION &amp; OPERATIONAL HUB (MANIPUR)
          </span>
          <span className="border border-print-border bg-print-paper px-1.5 py-0.2 font-mono text-[7px] font-bold uppercase text-print-ink">
            SUPPLIER GSTIN: {supplier.gstin}
          </span>
          <span className="border border-print-border bg-print-paper px-1.5 py-0.2 font-mono text-[7px] font-semibold text-print-muted">
            DEST. STATE: {destinationHub.stateCode} (MANIPUR)
          </span>
        </div>
        <span className="font-mono text-[7px] font-semibold text-print-muted">
          DESTINATION CODE: {destinationHub.code}
        </span>
      </div>

      <div className="mt-1 grid grid-cols-12 gap-2.5">
        {/* Left: Station Address */}
        <div className="col-span-8 flex flex-col justify-between">
          <div>
            <p className="font-bold text-print-ink text-[9px] leading-tight">
              {destinationHub.name}
            </p>
            <p className="font-medium text-print-ink leading-tight mt-0.5">
              <strong>{destinationHub.addressLine1}</strong>, {destinationHub.addressLine2}
            </p>
            <p className="text-print-muted leading-tight font-mono text-[7.5px]">
              {destinationHub.city}, {destinationHub.state} - <strong>{destinationHub.pinCode}</strong>
            </p>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-3 font-mono text-[7px] text-print-muted">
            <span>
              Hub Helpline: <strong className="text-print-ink">{destinationHub.phone}</strong>
            </span>
            <span>Email: {destinationHub.email}</span>
            <span>Operating Hours: 08:30 – 19:30 IST</span>
          </div>
        </div>

        {/* Right: Operational Instruction & Station Protocol */}
        <div className="col-span-4 border-l border-print-border pl-2.5 flex flex-col justify-center">
          <span className="font-mono text-[6.5px] font-bold uppercase tracking-wider text-print-muted">
            PARCEL STAGING &amp; LAST MILE
          </span>
          <p className="text-[7px] text-print-muted leading-tight mt-0.5">
            Express consignment received &amp; scanned at Singjamei Top Leikai Hub for customer counter handover and scheduled Manipur valley/hill doorstep delivery.
          </p>
        </div>
      </div>
    </section>
  )
}
