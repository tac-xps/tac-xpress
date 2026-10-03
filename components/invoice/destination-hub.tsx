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
    <section className="invoice-section my-1 rounded-none border border-[#e2dedc] bg-[#f7f5f3]/80 p-1.5 text-[8px]">
      <div className="flex items-center justify-between border-b border-[#e2dedc] pb-1">
        <div className="flex items-center gap-2">
          <span className="font-heading text-[8.5px] font-bold uppercase tracking-wider text-[#191716]">
            DESTINATION DELIVERY STATION &amp; OPERATIONAL HUB (MANIPUR)
          </span>
          <span className="border border-neutral-300 bg-white px-1.5 py-0.2 font-mono text-[7px] font-bold uppercase text-neutral-800">
            SUPPLIER GSTIN: {supplier.gstin}
          </span>
          <span className="border border-neutral-300 bg-white px-1.5 py-0.2 font-mono text-[7px] font-semibold text-neutral-700">
            DEST. STATE: {destinationHub.stateCode} (MANIPUR)
          </span>
        </div>
        <span className="font-mono text-[7px] font-semibold text-neutral-500">
          DESTINATION CODE: {destinationHub.code}
        </span>
      </div>

      <div className="mt-1 grid grid-cols-12 gap-2.5">
        {/* Left: Station Address */}
        <div className="col-span-8 flex flex-col justify-between">
          <div>
            <p className="font-bold text-[#191716] text-[9px] leading-tight">
              {destinationHub.name}
            </p>
            <p className="font-medium text-neutral-800 leading-tight mt-0.5">
              <strong>{destinationHub.addressLine1}</strong>, {destinationHub.addressLine2}
            </p>
            <p className="text-neutral-700 leading-tight font-mono text-[7.5px]">
              {destinationHub.city}, {destinationHub.state} - <strong>{destinationHub.pinCode}</strong>
            </p>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-3 font-mono text-[7px] text-neutral-600">
            <span>
              Hub Helpline: <strong className="text-neutral-800">{destinationHub.phone}</strong>
            </span>
            <span>Email: {destinationHub.email}</span>
            <span>Operating Hours: 08:30 – 19:30 IST</span>
          </div>
        </div>

        {/* Right: Operational Instruction & Station Protocol */}
        <div className="col-span-4 border-l border-[#e2dedc] pl-2.5 flex flex-col justify-center">
          <span className="font-mono text-[6.5px] font-bold uppercase tracking-wider text-neutral-500">
            PARCEL STAGING &amp; LAST MILE
          </span>
          <p className="text-[7px] text-neutral-600 leading-tight mt-0.5">
            Express consignment received &amp; scanned at Singjamei Top Leikai Hub for customer counter handover and scheduled Manipur valley/hill doorstep delivery.
          </p>
        </div>
      </div>
    </section>
  )
}
