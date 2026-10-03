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
    <section className="invoice-section my-1.5 flex flex-col border-t border-[#e2dedc] pt-1.5 text-[7.5px] leading-tight text-neutral-600">
      <div className="flex items-center justify-between mb-1">
        <span className="font-heading text-[8px] font-bold uppercase tracking-wider text-[#191716]">
          CONDITIONS OF CARRIAGE &amp; STATUTORY DECLARATION (AIR &amp; SURFACE)
        </span>
        <span className="font-mono text-[7px] text-neutral-400">
          Statutory GTA Framework • Updated Oct 2026
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Left Column: Air Logistics Framework */}
        <div
          className={`p-1.5 rounded-none border transition-colors ${
            isAir
              ? "border-[#191716] bg-[#f7f5f3] text-neutral-800"
              : "border-[#e2dedc] bg-white text-neutral-500 opacity-80"
          }`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-heading font-bold text-[8px] uppercase tracking-wide text-[#191716]">
              1. EXPRESS AIR CARGO (IATA / CARRIAGE BY AIR ACT)
            </span>
            {isAir && (
              <span className="border border-[#191716] bg-[#191716] px-1 py-0.2 font-mono text-[6.5px] font-bold uppercase text-white">
                ACTIVE SERVICE
              </span>
            )}
          </div>
          <p>
            Governed by the Carriage by Air Act, 1972 &amp; Montreal Convention. Chargeable weight
            evaluated on higher of gross weight or volumetric factor (L×W×H cm ÷ 5000). Hazardous,
            explosive, inflammable, perishable without dry ice, and contraband goods strictly
            prohibited under DGCA &amp; BCAS civil aviation security regulations. Maximum carrier
            liability limited to statutory SDR limits unless value declared &amp; transit insurance
            levied.
          </p>
        </div>

        {/* Right Column: Surface Logistics Framework */}
        <div
          className={`p-1.5 rounded-none border transition-colors ${
            !isAir
              ? "border-[#191716] bg-[#f7f5f3] text-neutral-800"
              : "border-[#e2dedc] bg-white text-neutral-500 opacity-80"
          }`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-heading font-bold text-[8px] uppercase tracking-wide text-[#191716]">
              2. SURFACE LINEHAUL FREIGHT (CARRIAGE BY ROAD ACT, 2007)
            </span>
            {!isAir && (
              <span className="border border-[#191716] bg-[#191716] px-1 py-0.2 font-mono text-[6.5px] font-bold uppercase text-white">
                ACTIVE SERVICE
              </span>
            )}
          </div>
          <p>
            Subject to the Carriage by Road Act, 2007. Volumetric density calculated at L×W×H cm ÷
            4500. Consignor guarantees packaging sufficiency for overland mountain terrain transit.
            Consignee must inspect parcel seals at destination prior to acknowledgment; damage or
            pilferage must be endorsed on delivery challan within 24 hours of delivery.
          </p>
        </div>
      </div>

      {/* General Terms Footer */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-1 border-t border-[#e2dedc] pt-1 text-[7px] text-neutral-500">
        <span>
          <strong>General:</strong> GTA service under SAC 9965. GST reverse charge:{" "}
          <strong className="text-black">No</strong>. E-way bill compliance verified.
        </span>
        <span>
          <strong>Jurisdiction:</strong> Disputes subject exclusively to competent courts in Delhi / Imphal.
        </span>
        <span>
          Full Terms:{" "}
          <a
            href="https://tacservice.in/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-mono text-neutral-700"
          >
            tacservice.in/terms
          </a>
        </span>
      </div>
    </section>
  )
}
