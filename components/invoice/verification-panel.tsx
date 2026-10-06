"use client"

import React from "react"
import { QRCode } from "@/components/documents/document-qr"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"
import { formatMoney } from "@/lib/documents/invoice/domain/money"
import { useScannerContext } from "@/components/scanner/scanner-provider"

interface VerificationPanelProps {
  doc: TaxInvoiceDocument
  pageNumber?: number
  totalPages?: number
}

export function VerificationPanel({
  doc,
  pageNumber = 1,
  totalPages = 1,
}: VerificationPanelProps) {
  const { commercial, verification, shipment } = doc
  const { supplier, status, financials, upiPayload } = commercial
  const isPaid = status === "paid" || financials.balanceDue.paise === 0
  const { triggerScan } = useScannerContext()

  return (
    <footer className="invoice-section mt-auto pt-1.5 border-t border-[#191716] flex flex-col gap-1">
      <div className="flex items-end justify-between gap-4">
        {/* Dual QRs / Seals */}
        <div className="flex items-center gap-4">
          {/* 1. AWB Live Tracking QR (Protected 20mm) */}
          <div
            data-invoice-qr="tracking"
            role="button"
            tabIndex={0}
            onClick={() => triggerScan(shipment.awbNumber)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                triggerScan(shipment.awbNumber)
              }
            }}
            title="Scan with terminal or click to open live telemetry dossier"
            className="flex items-center gap-2 cursor-pointer group hover:bg-neutral-100/60 p-1 -m-1 transition-colors select-none print:m-0 print:p-0 print:cursor-default print:hover:bg-transparent"
          >
            <div className="size-[20mm] border border-[#191716] p-0.5 bg-white shrink-0 group-hover:border-primary transition-colors print:group-hover:border-[#191716]">
              <QRCode data={verification.trackingUrl} className="size-full" />
            </div>
            <div className="flex flex-col text-[7px] font-mono leading-tight">
              <span className="font-bold uppercase text-[#191716] group-hover:text-primary transition-colors print:group-hover:text-[#191716]">
                LIVE AWB TRACKING
              </span>
              <span className="text-neutral-500">
                Scan or click for milestone telemetry &amp; dossier
              </span>
              <span className="text-[6.5px] text-neutral-400 mt-0.5 font-bold">
                AWB: {shipment.awbNumber}
              </span>
            </div>
          </div>

          {/* 2. Either Dynamic UPI Pay QR or PAID IN FULL Official Seal */}
          {!isPaid && upiPayload ? (
            <div data-invoice-qr="upi" className="flex items-center gap-2 border-l border-[#e2dedc] pl-4">
              <div className="size-[20mm] border border-[#191716] p-0.5 bg-white shrink-0">
                <QRCode data={upiPayload} className="size-full" />
              </div>
              <div className="flex flex-col text-[7px] font-mono leading-tight">
                <span className="font-bold uppercase text-[#191716]">INSTANT UPI SETTLE</span>
                <span className="text-neutral-500">Scan with GPay / PhonePe / Paytm</span>
                <span className="font-bold text-neutral-800 mt-0.5">
                  Due: {formatMoney(financials.balanceDue)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-[#e2dedc] pl-4">
              <div className="flex flex-col items-center justify-center border-2 border-emerald-700 bg-emerald-50/50 p-1.5 rounded-none w-28 text-center">
                <span className="font-mono text-[6.5px] font-bold tracking-widest text-emerald-800 uppercase">
                  OFFICIAL RECEIPT
                </span>
                <span className="font-heading font-black text-[10px] tracking-wider text-emerald-900 leading-tight my-0.5">
                  PAID IN FULL
                </span>
                <span className="font-mono text-[6.5px] text-emerald-700">
                  {commercial.invoiceDate} • AUTH
                </span>
              </div>
              <div className="flex flex-col text-[7px] font-mono text-neutral-500 leading-tight">
                <span>Payment Verified</span>
                <span>Zero Balance Pending</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Amazon Logistics Inspired Signatory Box */}
        <div className="w-44 border border-[#191716] bg-[#f7f5f3]/40 p-1.5 text-center flex flex-col justify-between h-[21mm]">
          <span className="text-[7px] font-bold uppercase tracking-wider text-neutral-600">
            For {supplier.legalName}
          </span>
          <div className="font-serif italic text-[11px] text-neutral-600 my-auto">
            Authorized Signatory
          </div>
          <div className="border-t border-[#e2dedc] pt-0.5 text-[6.5px] font-mono text-neutral-400">
            Computer Generated Tax Invoice
          </div>
        </div>
      </div>

      {/* Footnote Bar: ISO compliance & Page X of Y */}
      <div className="border-t border-[#e2dedc] pt-1 flex items-center justify-between text-[7px] font-mono text-neutral-400">
        <span>TAC-XPRESS LOGISTICS NETWORK • ISO 9001:2015 CERTIFIED FREIGHT OPERATIONS</span>
        <span>
          PAGE {pageNumber} OF {totalPages}
        </span>
      </div>
    </footer>
  )
}
