"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"
import { formatMoney } from "@/lib/documents/invoice/domain/money"

interface ChargesTableProps {
  doc: TaxInvoiceDocument
}

export function ChargesTable({ doc }: ChargesTableProps) {
  const { commercial, routing } = doc
  const { charges, financials, taxDecision } = commercial
  const isInterstate = routing.isInterstate
  const totalCols = isInterstate ? 6 : 7
  const leadingColSpan = totalCols - 1

  return (
    <section className="invoice-section my-1 flex flex-col">
      <div className="flex items-center justify-between border-b border-print-border pb-0.5">
        <span className="font-heading text-[8.5px] font-bold uppercase tracking-wider text-print-ink">
          ITEMIZED LOGISTICS CHARGES &amp; STATUTORY GST SCHEDULE
        </span>
        <span className="font-mono text-[7.5px] text-print-muted">
          Place of Supply: <strong>{doc.shipment.deliverTo.state || "Manipur"} (State Code: {taxDecision.placeOfSupplyStateCode})</strong>
        </span>
      </div>

      <div className="mt-0.5 overflow-hidden border border-print-border">
        <table className="w-full border-collapse text-left text-[8px]">
          <thead>
            <tr className="border-b border-print-border bg-print-paper-subtle font-mono text-[7px] uppercase tracking-wider text-print-muted">
              <th className="py-1 px-2 font-bold w-12">SAC</th>
              <th className="py-1 px-2 font-bold">Service Classification &amp; Description</th>
              <th className="py-1 px-2 font-bold text-right w-20">Taxable Value</th>
              <th className="py-1 px-2 font-bold text-center w-12">Rate</th>
              {isInterstate ? (
                <th className="py-1 px-2 font-bold text-right w-16">IGST</th>
              ) : (
                <>
                  <th className="py-1 px-2 font-bold text-right w-14">CGST</th>
                  <th className="py-1 px-2 font-bold text-right w-14">SGST</th>
                </>
              )}
              <th className="py-1 px-2 font-bold text-right w-22">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-print-border">
            {charges.map((charge) => (
              <tr key={charge.id} className="hover:bg-print-paper-subtle">
                <td className="py-0.5 px-2 font-mono font-medium text-print-muted">
                  {charge.classificationCode}
                </td>
                <td className="py-0.5 px-2">
                  <span className="font-medium text-print-ink leading-tight block">
                    {charge.label}
                  </span>
                </td>
                <td className="py-0.5 px-2 text-right font-mono text-print-ink">
                  {formatMoney(charge.taxableAmount)}
                </td>
                <td className="py-0.5 px-2 text-center font-mono text-print-muted">
                  {charge.taxRate}%
                </td>
                {isInterstate ? (
                  <td className="py-0.5 px-2 text-right font-mono text-print-muted">
                    {formatMoney(charge.taxAmount)}
                  </td>
                ) : (
                  <>
                    <td className="py-0.5 px-2 text-right font-mono text-print-muted">
                      {formatMoney({ paise: charge.taxAmount.paise - Math.floor(charge.taxAmount.paise / 2), currency: "INR" })}
                    </td>
                    <td className="py-0.5 px-2 text-right font-mono text-print-muted">
                      {formatMoney({ paise: Math.floor(charge.taxAmount.paise / 2), currency: "INR" })}
                    </td>
                  </>
                )}
                <td className="py-0.5 px-2 text-right font-mono font-semibold text-print-ink">
                  {formatMoney(charge.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-print-border bg-print-paper-subtle/70 font-mono text-[8px]">
            {/* Taxable Subtotal */}
            <tr className="border-b border-print-border">
              <td colSpan={2} className="py-0.5 px-2 font-bold uppercase text-print-muted">
                Subtotal (Taxable Freight Value)
              </td>
              <td className="py-0.5 px-2 text-right font-bold text-print-ink">
                {formatMoney(financials.taxableAmount)}
              </td>
              <td className="py-0.5 px-2 text-center text-print-muted">-</td>
              {isInterstate ? (
                <td className="py-0.5 px-2 text-right font-bold text-print-muted">
                  {formatMoney(taxDecision.igst)}
                </td>
              ) : (
                <>
                  <td className="py-0.5 px-2 text-right font-bold text-print-muted">
                    {formatMoney(taxDecision.cgst)}
                  </td>
                  <td className="py-0.5 px-2 text-right font-bold text-print-muted">
                    {formatMoney(taxDecision.sgst)}
                  </td>
                </>
              )}
              <td className="py-0.5 px-2 text-right font-bold text-print-ink">
                {formatMoney(financials.totalInvoiceValue)}
              </td>
            </tr>

            {/* Total Tax Row */}
            <tr className="border-b border-print-border bg-print-paper-subtle/40">
              <td
                colSpan={leadingColSpan}
                className="py-0.5 px-2 text-right font-bold text-print-muted uppercase text-[7.5px]"
              >
                Total Goods &amp; Services Tax ({isInterstate ? "Integrated GST 18%" : "CGST 9% + SGST 9%"}):
              </td>
              <td className="py-0.5 px-2 text-right font-bold text-print-ink">
                {formatMoney(financials.totalTax)}
              </td>
            </tr>

            {/* Total Invoice Value (Net Payable) */}
            <tr className="bg-print-ink text-print-paper">
              <td
                colSpan={leadingColSpan}
                className="py-1 px-2 text-right font-heading text-[8.5px] font-bold uppercase tracking-wider text-print-muted"
              >
                TOTAL INVOICE VALUE (NET PAYABLE):
              </td>
              <td className="py-1 px-2 text-right font-heading text-[10px] font-black tracking-tight text-print-paper">
                {formatMoney(financials.totalInvoiceValue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Amount in words */}
      <div className="mt-0.5 flex items-baseline gap-1.5 rounded-none border border-t-0 border-print-border bg-print-paper-subtle/50 px-2 py-0.5 text-[8px]">
        <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-print-muted shrink-0">
          Amount in Words:
        </span>
        <span className="font-serif italic font-semibold text-print-ink leading-tight">
          {commercial.amountInWords}
        </span>
      </div>
    </section>
  )
}
