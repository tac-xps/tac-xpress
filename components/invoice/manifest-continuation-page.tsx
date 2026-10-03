"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface ManifestContinuationPageProps {
  doc: TaxInvoiceDocument
  /** Rows for this sheet. Defaults to the full manifest. */
  items?: TaxInvoiceDocument["shipment"]["manifest"]
  /** Global index of the first row on this sheet. */
  startIndex?: number
  pageNumber?: number
  totalPages?: number
  /** Totals row and shipper declaration render on the last sheet only. */
  isLastSheet?: boolean
}

export function ManifestContinuationPage({
  doc,
  items,
  startIndex = 0,
  pageNumber = 2,
  totalPages = 2,
  isLastSheet = true,
}: ManifestContinuationPageProps) {
  const { commercial, shipment, routing } = doc
  const { manifest, metrics } = shipment
  const rows = items ?? manifest

  return (
    <article
      data-invoice-document={`page-${pageNumber}`}
      className="invoice-page mx-auto box-border flex min-h-[297mm] w-[210mm] shrink-0 flex-col justify-between bg-white p-[8mm] font-sans text-xs leading-normal text-[#191716] shadow-sm [print-color-adjust:exact] print:shadow-none select-none mt-6 print:mt-0"
      aria-label={`Consignment Manifest Continuation Page ${pageNumber} of ${totalPages} for AWB ${shipment.awbNumber}`}
    >
      <div className="flex flex-col gap-2">
        {/* Page 2 Header */}
        <header className="invoice-section flex items-start justify-between border-b-2 border-[#191716] pb-2.5">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-xl font-black tracking-tight text-[#191716]">
                {commercial.supplier.brandName}
              </span>
              <span className="border border-[#191716] bg-[#191716] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-white">
                CONSIGNMENT MANIFEST • CONTINUATION SHEET
              </span>
            </div>
            <p className="font-mono text-[8px] text-neutral-500 mt-0.5">
              LINE-BY-LINE ITEMIZED PACKING SLIP &amp; OPERATIONAL AUDIT LOG
            </p>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="font-mono text-[8px] font-bold text-neutral-500 uppercase">
              MASTER AWB NUMBER
            </span>
            <span className="font-heading text-lg font-black text-[#191716] leading-none my-0.5">
              {shipment.awbNumber}
            </span>
            <div className="flex items-center gap-2 text-[8px] font-mono text-neutral-600 mt-0.5">
              <span>Inv: {commercial.invoiceNumber}</span>
              <span>•</span>
              <span>Route: {routing.originHubCode} → {routing.destHubCode}</span>
            </div>
          </div>
        </header>

        {/* Operational Corridor & Recipient Confirmation Strip */}
        <section className="invoice-section grid grid-cols-3 gap-2 border border-[#e2dedc] bg-[#f7f5f3]/60 p-2 text-[8.5px]">
          <div>
            <span className="font-mono text-[7px] font-bold uppercase text-neutral-500 block">
              CONSIGNOR / SHIPPER
            </span>
            <strong className="text-[#191716] block truncate">{commercial.billTo.name}</strong>
            <span className="text-neutral-600 font-mono text-[7.5px]">
              {routing.originName} ({routing.originStateCode})
            </span>
          </div>

          <div>
            <span className="font-mono text-[7px] font-bold uppercase text-neutral-500 block">
              CONSIGNEE / DELIVER TO
            </span>
            <strong className="text-[#191716] block truncate">{shipment.deliverTo.name}</strong>
            <span className="text-neutral-600 font-mono text-[7.5px]">
              {routing.destName} ({routing.destStateCode})
            </span>
          </div>

          <div className="text-right">
            <span className="font-mono text-[7px] font-bold uppercase text-neutral-500 block">
              TOTAL CONSIGNMENT SCALE
            </span>
            <strong className="text-[#191716] block font-mono">
              {metrics.pieces} Pkgs • {metrics.chargeableWeightKg.toFixed(2)} kg Chg. Wt
            </strong>
            <span className="text-neutral-600 font-mono text-[7.5px]">
              Mode: {shipment.serviceMode === "express_air" ? "Express Air" : "Surface Road"}
            </span>
          </div>
        </section>

        {/* Complete Manifest Table */}
        <section className="invoice-section flex flex-col mt-1">
          <div className="overflow-hidden border border-[#e2dedc]">
            <table className="w-full border-collapse text-left text-[8px]">
              <thead>
                <tr className="border-b border-[#e2dedc] bg-[#f7f5f3] font-mono text-[7px] uppercase tracking-wider text-neutral-600">
                  <th className="py-1 px-2 font-bold w-8">#</th>
                  <th className="py-1 px-2 font-bold">Item Description / Nature of Contents</th>
                  <th className="py-1 px-2 font-bold text-center w-14">Qty</th>
                  <th className="py-1 px-2 font-bold text-center w-14">Unit</th>
                  <th className="py-1 px-2 font-bold text-right w-16">Weight (kg)</th>
                  <th className="py-1 px-2 font-bold text-right w-24">Dimensions (cm)</th>
                  <th className="py-1 px-2 font-bold text-center w-16">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2dedc]">
                {rows.map((item, idx) => (
                  <tr key={item.id || startIndex + idx} className="hover:bg-neutral-50/50">
                    <td className="py-1 px-2 font-mono text-neutral-500">{startIndex + idx + 1}</td>
                    <td className="py-1 px-2 font-medium text-[#191716]">
                      {item.description}
                      {item.confidenceReason && (
                        <span className="font-mono text-[6.5px] text-neutral-400 block">
                          {item.confidenceReason}
                        </span>
                      )}
                    </td>
                    <td className="py-1 px-2 text-center font-mono font-medium text-neutral-800">
                      {item.quantity}
                    </td>
                    <td className="py-1 px-2 text-center font-mono text-neutral-600 uppercase">
                      {item.unit}
                    </td>
                    <td className="py-1 px-2 text-right font-mono text-neutral-800">
                      {item.weightKg ? item.weightKg.toFixed(2) : "—"}
                    </td>
                    <td className="py-1 px-2 text-right font-mono text-neutral-700">
                      {item.dimensions
                        ? `${item.dimensions.l}×${item.dimensions.w}×${item.dimensions.h}`
                        : "Standard"}
                    </td>
                    <td className="py-1 px-2 text-center">
                      <span className="font-mono text-[6.5px] uppercase tracking-wider text-neutral-600 bg-neutral-100 px-1 py-0.2 rounded-none">
                        {item.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {isLastSheet && (
              <tfoot className="border-t-2 border-[#e2dedc] bg-[#f7f5f3]/80 font-mono text-[8px]">
                <tr>
                  <td colSpan={2} className="py-1.5 px-2 font-bold uppercase text-neutral-700">
                    Manifest Totals (Verified at Origin Hub)
                  </td>
                  <td className="py-1.5 px-2 text-center font-bold text-[#191716]">
                    {manifest.reduce((acc, curr) => acc + (curr.quantity || 1), 0)}
                  </td>
                  <td className="py-1.5 px-2 text-center text-neutral-500">Units</td>
                  <td className="py-1.5 px-2 text-right font-bold text-[#191716]">
                    {metrics.actualWeightKg.toFixed(2)}
                  </td>
                  <td colSpan={2} className="py-1.5 px-2 text-right text-neutral-500">
                    Chargeable: <strong>{metrics.chargeableWeightKg.toFixed(2)} kg</strong>
                  </td>
                </tr>
              </tfoot>
              )}
            </table>
          </div>
        </section>

        {/* Shipper Declaration & Inspection Endorsement */}
        {isLastSheet && (
        <section className="invoice-section mt-2 border border-[#e2dedc] p-2 bg-[#f7f5f3]/40 text-[7.5px] leading-tight text-neutral-600">
          <p className="font-bold text-[#191716] uppercase text-[7px] tracking-wider mb-0.5">
            CONSIGNMENT SECURITY &amp; ACCURACY DECLARATION:
          </p>
          <p>
            The shipper/consignor warrants that the description, value, and particulars of goods
            tendered for carriage herein are correct, properly packaged, and contain no contraband,
            undeclared lithium batteries, or IATA dangerous cargo. TAC-XPRESS reserves the right to
            x-ray scan and inspect all packages prior to linehaul departure.
          </p>
        </section>
        )}
      </div>

      {/* Footer / Dual Endorsement */}
      <footer className="invoice-section mt-auto pt-2 border-t border-[#191716] flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#e2dedc] p-2 text-center flex flex-col justify-between h-18">
            <span className="text-[7px] font-mono font-bold uppercase text-neutral-500">
              ORIGIN SECURITY SCAN &amp; HUB TENDER
            </span>
            <div className="font-serif italic text-[10px] text-neutral-400">
              Verified by Station Handler
            </div>
            <span className="text-[6.5px] font-mono text-neutral-400">
              {commercial.invoiceDate} • Kotla Mubarakpur Dispatch
            </span>
          </div>

          <div className="border border-[#e2dedc] p-2 text-center flex flex-col justify-between h-18">
            <span className="text-[7px] font-mono font-bold uppercase text-neutral-500">
              DESTINATION HUB STAGING &amp; HANDOVER
            </span>
            <div className="font-serif italic text-[10px] text-neutral-400">
              Singjamei Top Leikai Hub Incharge
            </div>
            <span className="text-[6.5px] font-mono text-neutral-400">
              Kakwa, Imphal - 795003 • Delivery Station
            </span>
          </div>
        </div>

        <div className="border-t border-[#e2dedc] pt-1 flex items-center justify-between text-[7px] font-mono text-neutral-400">
          <span>TAC-XPRESS LOGISTICS NETWORK • CONTINUATION MANIFEST</span>
          <span>PAGE {pageNumber} OF {totalPages}</span>
        </div>
      </footer>
    </article>
  )
}
