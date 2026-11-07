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

  return (
    <section className="invoice-section my-2 grid grid-cols-4 gap-4 border-y border-print-border py-2 text-[8.5px]">
      {/* 1. Total Bill Amount */}
      <div className="flex flex-col border-r border-print-border/60 pr-2">
        <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-print-muted">
          TOTAL INVOICE VALUE
        </span>
        <span className="font-mono text-[11px] font-bold text-print-ink mt-0.5">
          {formatMoney(financials.totalInvoiceValue)}
        </span>
        <span className="font-mono text-[7px] text-print-muted">Inclusive of all taxes</span>
      </div>

      {/* 2. Advance / Amount Received */}
      <div className="flex flex-col border-r border-print-border/60 pr-2">
        <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-print-muted">
          ADVANCE / RECEIVED
        </span>
        <span className="font-mono text-[11px] font-bold text-print-muted mt-0.5">
          {formatMoney(financials.advancePaid)}
        </span>
        <span className="font-mono text-[7px] text-print-muted">
          Mode: <strong className="text-print-ink">{paymentMode || "CASH"}</strong>
        </span>
      </div>

      {/* 3. Hero Balance Due */}
      <div className="flex flex-col border-r border-print-border/60 pr-2">
        <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-print-muted">
          NET BALANCE DUE
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span
            className={`font-mono text-xs font-black ${
              isPaid
                ? "text-success"
                : financials.balanceDue.paise > 0
                ? "text-print-ink"
                : "text-print-muted"
            }`}
          >
            {formatMoney(financials.balanceDue)}
          </span>
          {isPaid && (
            <span className="font-mono text-[7px] font-bold text-success">ZERO DUE</span>
          )}
        </div>
        <span className="font-mono text-[7px] text-print-muted">
          {isPaid ? "Settled in full" : "Pending collection"}
        </span>
      </div>

      {/* 4. Settlement Status Badge */}
      <div className="flex flex-col items-center justify-center">
        <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-print-muted mb-1">
          SETTLEMENT STATUS
        </span>
        <span
          className={`border px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-widest ${
            isPaid
              ? "border-success bg-success-wash text-success"
              : "border-warning bg-warning-wash text-warning"
          }`}
        >
          {isPaid ? "PAID IN FULL" : "PAYMENT PENDING"}
        </span>
      </div>
    </section>
  )
}
