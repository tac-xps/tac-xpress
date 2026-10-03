"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

interface ConsignmentManifestProps {
  doc: TaxInvoiceDocument
  visibleLimit?: number
}

export function ConsignmentManifest({ doc, visibleLimit }: ConsignmentManifestProps) {
  const { manifest, natureOfGoods, isFragile } = doc.shipment
  const hasItems = manifest && manifest.length > 0
  const displayedItems =
    visibleLimit && visibleLimit < manifest.length ? manifest.slice(0, visibleLimit) : manifest
  const overflowCount = manifest.length - displayedItems.length

  return (
    <section className="invoice-section my-1 flex flex-col">
      <div className="flex items-center justify-between border-b border-[#e2dedc] pb-0.5">
        <div className="flex items-center gap-2">
          <span className="font-heading text-[9px] font-bold uppercase tracking-wider text-[#191716]">
            CONSIGNMENT MANIFEST &amp; ITEM PARTICULARS
          </span>
          {natureOfGoods && (
            <span className="font-mono text-[8px] text-neutral-500">
              • Cargo Type: <strong className="text-neutral-800">{natureOfGoods}</strong>
            </span>
          )}
        </div>
        {isFragile && (
          <span className="border border-amber-300 bg-amber-50 px-1.5 py-0.2 font-mono text-[7px] font-bold uppercase tracking-wider text-amber-800">
            ⚠ FRAGILE / HANDLE WITH CARE
          </span>
        )}
      </div>

      <div className="mt-1 overflow-hidden border border-[#e2dedc]">
        <table className="w-full border-collapse text-left text-[8.5px]">
          <thead>
            <tr className="border-b border-[#e2dedc] bg-[#f7f5f3] font-mono text-[7.5px] uppercase tracking-wider text-neutral-600">
              <th className="py-1 px-2 font-bold w-8">#</th>
              <th className="py-1 px-2 font-bold">Package Description &amp; Item Details</th>
              <th className="py-1 px-2 font-bold text-center w-16">Qty / Unit</th>
              <th className="py-1 px-2 font-bold text-right w-16">Est. Wt</th>
              <th className="py-1 px-2 font-bold text-right w-24">Dimensions (cm)</th>
              <th className="py-1 px-2 font-bold text-center w-14">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2dedc]">
            {hasItems ? (
              displayedItems.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-neutral-50/50">
                  <td className="py-1 px-2 font-mono text-neutral-500">{idx + 1}</td>
                  <td className="py-1 px-2">
                    <span className="font-medium text-[#191716] leading-tight block">
                      {item.description}
                    </span>
                    {item.confidenceReason && (
                      <span className="font-mono text-[7px] text-neutral-400 block">
                        {item.confidenceReason}
                      </span>
                    )}
                  </td>
                  <td className="py-1 px-2 text-center font-mono font-medium text-neutral-800">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-1 px-2 text-right font-mono text-neutral-700">
                    {item.weightKg ? `${item.weightKg.toFixed(1)} kg` : "—"}
                  </td>
                  <td className="py-1 px-2 text-right font-mono text-neutral-700">
                    {item.dimensions
                      ? `${item.dimensions.l}×${item.dimensions.w}×${item.dimensions.h}`
                      : "Standard"}
                  </td>
                  <td className="py-1 px-2 text-center">
                    <span
                      className={`inline-block px-1 py-0.2 font-mono text-[6.5px] uppercase tracking-wider rounded-none ${
                        item.confidence === "explicit"
                          ? "bg-neutral-200 text-neutral-800"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {item.confidence === "explicit" ? "Pkg" : "Agg"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-2 px-2 text-center font-mono text-neutral-500">
                  Standard Commercial Freight Consignment • Single Package Manifest
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {overflowCount > 0 && (
        <div className="mt-1 flex items-center justify-between border border-dashed border-[#e2dedc] bg-[#f7f5f3]/50 px-2 py-0.5 text-[7.5px] font-mono text-neutral-600">
          <span>
            Showing top {displayedItems.length} items. <strong>+{overflowCount} additional package(s)</strong> itemized on Manifest Continuation Page 2.
          </span>
          <span className="font-bold text-[#191716]">SEE PAGE 2 ►</span>
        </div>
      )}
    </section>
  )
}
