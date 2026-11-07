"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface FreightConditionsProps {
  doc: TaxInvoiceDocument
}

export function FreightConditions({ doc }: FreightConditionsProps) {
  const { serviceMode } = doc.shipment
  const isAir = serviceMode === "express_air"

  return (
    <section className="invoice-section my-1.5 pt-1 text-[7px] leading-tight text-print-muted">
      <div className="flex items-center justify-between border-b border-print-border pb-0.5 mb-1">
        <span className="font-heading text-[7.5px] font-bold uppercase tracking-wider text-print-ink">
          CONDITIONS OF CARRIAGE &amp; STATUTORY DECLARATION ({isAir ? "EXPRESS AIR" : "SURFACE ROAD"})
        </span>
        <span className="font-mono text-[6.5px] text-print-muted">
          Statutory GTA Framework / SAC 9965 / GST Reverse Charge: No
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <p className="flex-1">
          {isAir
            ? "Consignment booked under Carriage by Air Act, 1972 & Montreal Convention. Chargeable weight evaluated on higher of gross or volumetric weight (L×W×H cm ÷ 5000). Hazardous/contraband cargo prohibited. Carrier liability restricted to statutory SDR limits unless value declared & insurance levied."
            : "Consignment booked under Carriage by Road Act, 2007. Chargeable weight evaluated on higher of gross or volumetric weight (L×W×H cm ÷ 4500). Consignor certifies packaging sufficiency for mountain transit. Damage endorsement required within 24 hours of delivery."}
        </p>
        <div className="shrink-0 flex flex-col items-end text-right font-mono text-[6.5px] text-print-muted">
          <span>Jurisdiction: Delhi / Imphal Courts</span>
          <span>
            Full Terms:{" "}
            <a
              href="https://tacservice.in/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-print-ink font-bold"
            >
              tacservice.in/terms
            </a>
          </span>
        </div>
      </div>
    </section>
  )
}
