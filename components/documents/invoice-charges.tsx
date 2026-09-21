"use client"

import React from "react"
import type { Invoice } from "@/lib/db/schema"

export function invoiceMoney(paise: number | null) {
  return `₹${((paise ?? 0) / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

interface InvoiceChargesProps {
  invoice: Invoice
  serviceType?: string
}

export function InvoiceCharges({ invoice, serviceType }: InvoiceChargesProps) {
  const sacCode =
    invoice.hsnCode || (serviceType === "express_air" ? "996512" : "996511")
  
  // Interstate check: Delhi (07) to Manipur (14) = IGST 18%
  const isInterstate =
    (invoice.igst ?? 0) > 0 ||
    ((invoice.cgst ?? 0) === 0 && (invoice.sgst ?? 0) === 0)

  // Construct itemized service rows
  const rawItems = [
    {
      label: `Scheduled Linehaul Cargo (${serviceType === "express_air" ? "Express Air" : "Surface Road Freight"})`,
      sac: sacCode,
      amount: invoice.freightCharge || (invoice.subtotal ? invoice.subtotal : invoice.amount),
    },
    {
      label: "Consignment Pickup & Handling",
      sac: "996519",
      amount: invoice.pickupCharge,
    },
    {
      label: "Protective Packaging & Strapping",
      sac: "998540",
      amount: invoice.packingCharge,
    },
    {
      label: "Docket & AWB Documentation Fee",
      sac: "996519",
      amount: invoice.docketCharge,
    },
    {
      label: "Transit Risk Protection / Insurance",
      sac: "997139",
      amount: invoice.insuranceCharge,
    },
    {
      label: "Other Operational & Terminal Charges",
      sac: "996519",
      amount: invoice.otherCharges,
    },
  ].filter((item) => (item.amount ?? 0) > 0)

  const items =
    rawItems.length > 0
      ? rawItems
      : [
          {
            label: `Freight Transportation Service (${serviceType === "express_air" ? "Air Cargo" : "Surface Cargo"})`,
            sac: sacCode,
            amount: invoice.subtotal || invoice.amount,
          },
        ]

  const totalTaxable = items.reduce((sum, item) => sum + (item.amount ?? 0), 0)
  const gstRate = invoice.gstRate || 18

  return (
    <div className="w-full flex flex-col gap-2">
      {/* ── AMAZON-STYLE GST ITEMIZATION TABLE ── */}
      <table className="w-full border-collapse text-[11px] border border-black">
        <thead>
          <tr className="bg-neutral-100 border-b border-black text-left font-bold text-black">
            <th className="p-2 border-r border-black w-8 text-center">Sl.</th>
            <th className="p-2 border-r border-black">Description of Cargo Services</th>
            <th className="p-2 border-r border-black w-20 text-center font-mono">SAC Code</th>
            <th className="p-2 border-r border-black w-24 text-right">Taxable Value</th>
            {isInterstate ? (
              <th className="p-2 border-r border-black w-24 text-right">
                IGST ({gstRate}%)
              </th>
            ) : (
              <>
                <th className="p-2 border-r border-black w-20 text-right">
                  CGST ({gstRate / 2}%)
                </th>
                <th className="p-2 border-r border-black w-20 text-right">
                  SGST ({gstRate / 2}%)
                </th>
              </>
            )}
            <th className="p-2 text-right w-24">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const itemTaxable = item.amount ?? 0
            // Proportionate tax calculation per line item
            const itemTax = Math.round((itemTaxable * gstRate) / 100)
            const itemTotal = itemTaxable + itemTax

            return (
              <tr key={item.label} className="border-b border-neutral-300">
                <td className="p-2 border-r border-neutral-300 text-center text-neutral-600 font-mono">
                  {idx + 1}
                </td>
                <td className="p-2 border-r border-neutral-300 font-medium text-black">
                  {item.label}
                </td>
                <td className="p-2 border-r border-neutral-300 text-center font-mono text-neutral-800">
                  {item.sac}
                </td>
                <td className="p-2 border-r border-neutral-300 text-right font-mono">
                  {invoiceMoney(itemTaxable)}
                </td>
                {isInterstate ? (
                  <td className="p-2 border-r border-neutral-300 text-right font-mono">
                    {invoiceMoney(itemTax)}
                  </td>
                ) : (
                  <>
                    <td className="p-2 border-r border-neutral-300 text-right font-mono">
                      {invoiceMoney(Math.round(itemTax / 2))}
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-right font-mono">
                      {invoiceMoney(Math.round(itemTax / 2))}
                    </td>
                  </>
                )}
                <td className="p-2 text-right font-mono font-semibold text-black">
                  {invoiceMoney(itemTotal)}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="bg-neutral-50 font-bold border-t border-black text-black">
          <tr>
            <td colSpan={3} className="p-2 border-r border-black text-right uppercase tracking-wider text-[10px]">
              Subtotal (Taxable Value)
            </td>
            <td className="p-2 border-r border-black text-right font-mono">
              {invoiceMoney(totalTaxable)}
            </td>
            {isInterstate ? (
              <td className="p-2 border-r border-black text-right font-mono">
                {invoiceMoney(invoice.igst || Math.round((totalTaxable * gstRate) / 100))}
              </td>
            ) : (
              <>
                <td className="p-2 border-r border-black text-right font-mono">
                  {invoiceMoney(invoice.cgst || Math.round((totalTaxable * gstRate) / 200))}
                </td>
                <td className="p-2 border-r border-black text-right font-mono">
                  {invoiceMoney(invoice.sgst || Math.round((totalTaxable * gstRate) / 200))}
                </td>
              </>
            )}
            <td className="p-2 text-right font-mono font-black text-xs">
              {invoiceMoney(invoice.amount)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* ── PAYMENT STATUS & BALANCE DUE RECONCILIATION ── */}
      <div className="flex justify-end">
        <div className="w-72 border border-black text-[11px]">
          <div className="flex justify-between p-1.5 border-b border-neutral-200">
            <span className="font-semibold text-neutral-700">Total Invoice Value:</span>
            <span className="font-mono font-bold text-black">{invoiceMoney(invoice.amount)}</span>
          </div>
          <div className="flex justify-between p-1.5 border-b border-neutral-200 bg-neutral-50">
            <span className="font-semibold text-neutral-700">Advance / Payment Received:</span>
            <span className="font-mono text-emerald-700 font-semibold">{invoiceMoney(invoice.advancePaid)}</span>
          </div>
          <div className="flex justify-between p-1.5 bg-neutral-100 font-bold">
            <span className="uppercase tracking-tight text-black">Balance Amount Due:</span>
            <span className="font-mono text-xs font-black text-black">
              {invoiceMoney(
                invoice.status === "void" ? 0 : (invoice.balanceDue ?? (invoice.amount - (invoice.advancePaid ?? 0)))
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
