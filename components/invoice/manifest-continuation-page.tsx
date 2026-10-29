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
      className="invoice-page mx-auto box-border flex min-h-[297mm] w-[210mm] shrink-0 flex-col justify-between bg-print-paper p-[8mm] font-sans text-xs leading-normal text-print-ink shadow-sm [print-color-adjust:exact] print:shadow-none select-none mt-6 print:mt-0"
      aria-label={`Consignment Manifest Continuation Page ${pageNumber} of ${totalPages} for AWB ${shipment.awbNumber}`}
    >
      <div className="flex flex-col gap-2">
        {/* Page 2 Header */}
        <header className="invoice-section flex items-start justify-between border-b-2 border-print-ink pb-2.5">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-xl font-black tracking-tight text-print-ink">
                {commercial.supplier.brandName}
              </span>
              <span className="border border-print-ink bg-print-ink px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-print-paper">
                CONSIGNMENT MANIFEST • CONTINUATION SHEET
              </span>
            </div>
            <p className="font-mono text-[8px] text-print-muted mt-0.5">
              LINE-BY-LINE ITEMIZED PACKING SLIP &amp; OPERATIONAL AUDIT LOG
            </p>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="font-mono text-[8px] font-bold text-print-muted uppercase">
              MASTER AWB NUMBER
            </span>
            <span className="font-heading text-lg font-black text-print-ink leading-none my-0.5">
              {shipment.awbNumber}
            </span>
            <div className="flex items-center gap-2 text-[8px] font-mono text-print-muted mt-0.5">
              <span>Inv: {commercial.invoiceNumber}</span>
              <span>•</span>
              <span>Route: {routing.originHubCode} → {routing.destHubCode}</span>
            </div>
          </div>
        </header>

        {/* Operational Corridor & Recipient Confirmation Strip */}
        <section className="invoice-section grid grid-cols-3 gap-2 border border-print-border bg-print-paper-subtle/60 p-2 text-[8.5px]">
          <div>
            <span className="font-mono text-[7px] font-bold uppercase text-print-muted block">
              CONSIGNOR / SHIPPER
            </span>
            <strong className="text-print-ink block truncate">{commercial.billTo.name}</strong>
            <span className="text-print-muted font-mono text-[7.5px]">
              {routing.originName} ({routing.originStateCode})
            </span>
          </div>

          <div>
            <span className="font-mono text-[7px] font-bold uppercase text-print-muted block">
              CONSIGNEE / DELIVER TO
            </span>
            <strong className="text-print-ink block truncate">{shipment.deliverTo.name}</strong>
            <span className="text-print-muted font-mono text-[7.5px]">
              {routing.destName} ({routing.destStateCode})
            </span>
          </div>

          <div className="text-right">
            <span className="font-mono text-[7px] font-bold uppercase text-print-muted block">
              TOTAL CONSIGNMENT SCALE
            </span>
            <strong className="text-print-ink block font-mono">
              {metrics.pieces} Pkgs • {metrics.chargeableWeightKg.toFixed(2)} kg Chg. Wt
            </strong>
            <span className="text-print-muted font-mono text-[7.5px]">
              Mode: {shipment.serviceMode === "express_air" ? "Express Air" : "Surface Road"}
            </span>
          </div>
        </section>

        {/* Complete Manifest Table */}
        <section className="invoice-section flex flex-col mt-1">
          <div className="overflow-hidden border border-print-border">
            <table className="w-full border-collapse text-left text-[8px]">
              <thead>
                <tr className="border-b border-print-border bg-print-paper-subtle font-mono text-[7px] uppercase tracking-wider text-print-muted">
                  <th className="py-1 px-2 font-bold w-8">#</th>
                  <th className="py-1 px-2 font-bold">Item Description / Nature of Contents</th>
                  <th className="py-1 px-2 font-bold text-center w-14">Qty</th>
                  <th className="py-1 px-2 font-bold text-center w-14">Unit</th>
                  <th className="py-1 px-2 font-bold text-right w-16">Weight (kg)</th>
                  <th className="py-1 px-2 font-bold text-right w-24">Dimensions (cm)</th>
                  <th className="py-1 px-2 font-bold text-center w-16">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-print-border">
                {rows.map((item, idx) => (
                  <tr key={item.id || startIndex + idx} className="hover:bg-print-paper-subtle">
                    <td className="py-1 px-2 font-mono text-print-muted">{startIndex + idx + 1}</td>
                    <td className="py-1 px-2 font-medium text-print-ink">
                      {item.description}
                      {item.confidenceReason && (
                        <span className="block font-mono text-[6.5px] text-print-muted">
                          {item.confidenceReason}
                        </span>
                      )}
                    </td>
                    <td className="py-1 px-2 text-center font-mono font-medium text-print-ink">
                      {item.quantity}
                    </td>
                    <td className="py-1 px-2 text-center font-mono text-print-muted uppercase">
                      {item.unit}
                    </td>
                    <td className="py-1 px-2 text-right font-mono text-print-ink">
                      {item.weightKg ? item.weightKg.toFixed(2) : "-"}
                    </td>
                    <td className="py-1 px-2 text-right font-mono text-print-muted">
                      {item.dimensions
                        ? `${item.dimensions.l}×${item.dimensions.w}×${item.dimensions.h}`
                        : "Standard"}
                    </td>
                    <td className="py-1 px-2 text-center">
                      <span className="font-mono text-[6.5px] uppercase tracking-wider text-print-muted bg-print-paper-subtle px-1 py-0.2 rounded-none">
                        {item.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {isLastSheet && (
              <tfoot className="border-t-2 border-print-border bg-print-paper-subtle/80 font-mono text-[8px]">
                <tr>
                  <td colSpan={2} className="py-1.5 px-2 font-bold uppercase text-print-muted">
                    Manifest Totals (Verified at Origin Hub)
                  </td>
                  <td className="py-1.5 px-2 text-center font-bold text-print-ink">
                    {manifest.reduce((acc, curr) => acc + (curr.quantity || 1), 0)}
                  </td>
                  <td className="py-1.5 px-2 text-center text-print-muted">Units</td>
                  <td className="py-1.5 px-2 text-right font-bold text-print-ink">
                    {metrics.actualWeightKg.toFixed(2)}
                  </td>
                  <td colSpan={2} className="py-1.5 px-2 text-right text-print-muted">
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
        <section className="invoice-section mt-2 border border-print-border p-2 bg-print-paper-subtle/40 text-[7.5px] leading-tight text-print-muted">
          <p className="font-bold text-print-ink uppercase text-[7px] tracking-wider mb-0.5">
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
      <footer className="invoice-section mt-auto pt-2 border-t border-print-ink flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-print-border p-2 text-center flex flex-col justify-between h-18">
            <span className="text-[7px] font-mono font-bold uppercase text-print-muted">
              ORIGIN SECURITY SCAN &amp; HUB TENDER
            </span>
            <div className="font-serif italic text-[10px] text-print-muted">
              Verified by Station Handler
            </div>
            <span className="text-[6.5px] font-mono text-print-muted">
              {commercial.invoiceDate} • Kotla Mubarakpur Dispatch
            </span>
          </div>

          <div className="border border-print-border p-2 text-center flex flex-col justify-between h-18">
            <span className="text-[7px] font-mono font-bold uppercase text-print-muted">
              DESTINATION HUB STAGING &amp; HANDOVER
            </span>
            <div className="font-serif italic text-[10px] text-print-muted">
              Singjamei Top Leikai Hub Incharge
            </div>
            <span className="text-[6.5px] font-mono text-print-muted">
              Kakwa, Imphal - 795003 • Delivery Station
            </span>
          </div>
        </div>

        <div className="border-t border-print-border pt-1 flex items-center justify-between text-[7px] font-mono text-print-muted">
          <span>TAC-XPRESS LOGISTICS NETWORK • CONTINUATION MANIFEST</span>
          <span>PAGE {pageNumber} OF {totalPages}</span>
        </div>
      </footer>
    </article>
  )
}
