"use client"

import React from "react"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"
import { formatMoney } from "@/lib/documents/invoice/domain/money"

interface PaymentReconciliationProps {
  doc: TaxInvoiceDocument
}

export function PaymentReconciliation({ doc }: PaymentReconciliationProps) {
  const { financials, status, paymentMode } = doc.commercial
  const isPaid = status === "paid"
  const isPartiallyPaid = status === "partially_paid"

  return (
    <section className="invoice-section my-1 grid grid-cols-4 gap-2 border border-[#e2dedc] bg-[#f7f5f3]/40 p-1.5 text-[8.5px]">
      {/* 1. Total Bill Amount */}
      <div className="flex flex-col border-r border-[#e2dedc] pr-2">
        <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-neutral-500">
          TOTAL INVOICE VALUE
        </span>
        <span className="font-mono text-[11px] font-bold text-neutral-800 mt-0.5">
          {formatMoney(financials.totalInvoiceValue)}
        </span>
        <span className="font-mono text-[7px] text-neutral-400">Inclusive of all taxes</span>
      </div>

      {/* 2. Advance / Amount Received */}
      <div className="flex flex-col border-r border-[#e2dedc] pr-2">
        <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-neutral-500">
          ADVANCE / RECEIVED
        </span>
        <span className="font-mono text-[11px] font-bold text-neutral-700 mt-0.5">
          {formatMoney(financials.advancePaid)}
        </span>
        <span className="font-mono text-[7px] text-neutral-400">
          Mode: <strong className="text-neutral-600">{paymentMode || "CASH"}</strong>
        </span>
      </div>

      {/* 3. Hero Balance Due */}
      <div className="flex flex-col border-r border-[#e2dedc] pr-2">
        <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-neutral-500">
          NET BALANCE DUE
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span
            className={`font-mono text-xs font-black ${
              isPaid
                ? "text-emerald-700"
                : financials.balanceDue.paise > 0
                ? "text-[#191716]"
                : "text-neutral-700"
            }`}
          >
            {formatMoney(financials.balanceDue)}
          </span>
          {isPaid && (
            <span className="font-mono text-[7px] font-bold text-emerald-600">✓ ZERO DUE</span>
          )}
        </div>
        <span className="font-mono text-[7px] text-neutral-400">
          {isPaid
            ? "Settled in full"
            : isPartiallyPaid
            ? "Partial balance pending"
            : "Payable on delivery / presentation"}
        </span>
      </div>

      {/* 4. Payment Status Badge */}
      <div className="flex flex-col items-center justify-center pl-1">
        <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
          SETTLEMENT STATUS
        </span>
        <span
          className={`px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest border rounded-none ${
            isPaid
              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
              : isPartiallyPaid
              ? "border-amber-600 bg-amber-50 text-amber-800"
              : "border-neutral-400 bg-neutral-100 text-neutral-800"
          }`}
        >
          {isPaid ? "PAID IN FULL" : isPartiallyPaid ? "PARTIALLY PAID" : "PAYMENT PENDING"}
        </span>
      </div>
    </section>
  )
}
