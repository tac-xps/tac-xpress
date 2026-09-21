"use client"

import React, { useSyncExternalStore } from "react"
import { format } from "date-fns"
import { QRCode } from "@/components/documents/document-qr"
import { InvoiceCharges, invoiceMoney } from "@/components/documents/invoice-charges"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { getAppUrl } from "@/lib/config/app-url"
import { DELHI_HUB_ADDRESS, SINGJAMEI_HUB_ADDRESS } from "@/lib/documents/address-constants"
import { amountInWords } from "@/lib/documents/number-to-words"

interface InvoiceDocumentProps {
  invoice: Invoice
  shipment: Shipment
  appOrigin?: string
}

const subscribe = () => () => {}
const browserOrigin = () => getAppUrl(window.location.origin, "development")
const serverOrigin = () => null

/**
 * Standard A4 Tax Invoice (GST / B2B / B2C).
 *
 * Inspired by Amazon India Logistics Tax Invoice architecture:
 * - Top Section: Central Delhi Service Provider & Dispatch Hub (GSTIN: 07AAMFT6165B1Z3)
 * - Destination & Bill To Section: Singjamei Hub (Imphal, Manipur 795008, State Code: 14)
 * - Itemized GST SAC Table with Interstate IGST (18%) breakdown
 * - Legal Declarations & Amount in Words
 */
export function InvoiceDocument({
  invoice,
  shipment,
  appOrigin,
}: InvoiceDocumentProps) {
  const currentOrigin = useSyncExternalStore(
    subscribe,
    browserOrigin,
    serverOrigin
  )
  const origin = appOrigin ?? currentOrigin
  const invoiceDate = format(new Date(invoice.createdAt), "dd MMM yyyy")
  const bookingDate = shipment.bookingDate
    ? format(new Date(shipment.bookingDate), "dd MMM yyyy")
    : invoiceDate

  const invoiceNumber = `TAC-INV-${invoice.id.split("-")[0].toUpperCase()}`
  const totalRupees = (invoice.amount ?? 0) / 100
  const inWords = amountInWords(totalRupees)

  return (
    <article
      data-invoice-document
      className="mx-auto box-border flex min-h-[297mm] w-[210mm] shrink-0 flex-col justify-between bg-white p-[10mm] font-sans text-xs leading-normal text-black shadow-sm [print-color-adjust:exact] print:shadow-none select-none"
      aria-label={`Tax Invoice ${invoiceNumber}`}
    >
      <div className="flex flex-col gap-3">
        {/* ── HEADER: COMPANY IDENTITY & INVOICE TITLES ── */}
        <header className="flex items-start justify-between border-b-2 border-black pb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-black">
                {DELHI_HUB_ADDRESS.brandName}
              </span>
              <span className="border border-black bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                TAX INVOICE
              </span>
            </div>
            <p className="text-[11px] font-bold text-neutral-800">
              {DELHI_HUB_ADDRESS.legalName}
            </p>
            <p className="text-[10px] text-neutral-600">
              Scheduled Air & Surface Cargo Linehaul Services
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="border border-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-neutral-100 text-neutral-900">
              ORIGINAL FOR RECIPIENT
            </span>
            <p className="font-mono text-xs font-bold text-black mt-1">
              Invoice No: {invoiceNumber}
            </p>
            <p className="text-[10px] text-neutral-700">Date: {invoiceDate}</p>
            <p className="text-[10px] font-mono text-neutral-700">
              AWB: <span className="font-bold text-black">{shipment.awbNumber}</span>
            </p>
          </div>
        </header>

        {/* ── TOP SECTION: DISPATCHED BY / SERVICE PROVIDER (DELHI ADDRESS) ── */}
        <section className="grid grid-cols-2 gap-4 border-b border-black pb-2.5 text-[10.5px]">
          {/* Left Column: Official Delhi Registered Hub */}
          <div className="border border-neutral-300 p-2 bg-neutral-50/60">
            <p className="font-mono text-[9px] font-black uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-0.5 mb-1">
              SERVICE PROVIDER / DISPATCH HUB (DELHI):
            </p>
            <p className="font-bold text-black">{DELHI_HUB_ADDRESS.legalName}</p>
            <p className="text-neutral-800">
              {DELHI_HUB_ADDRESS.addressLine1}, {DELHI_HUB_ADDRESS.addressLine2}
            </p>
            <p className="text-neutral-800">
              {DELHI_HUB_ADDRESS.city}, {DELHI_HUB_ADDRESS.state} - {DELHI_HUB_ADDRESS.pinCode}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-3 text-[10px] font-mono text-neutral-800">
              <span><strong>GSTIN:</strong> {DELHI_HUB_ADDRESS.gstin}</span>
              <span><strong>PAN:</strong> {DELHI_HUB_ADDRESS.pan}</span>
              <span><strong>State Code:</strong> {DELHI_HUB_ADDRESS.stateCode} (Delhi)</span>
            </div>
            <p className="text-[9.5px] text-neutral-600 mt-0.5">
              Ph: {DELHI_HUB_ADDRESS.phone} | Email: {DELHI_HUB_ADDRESS.email}
            </p>
          </div>

          {/* Right Column: Invoice Metadata & Place of Supply */}
          <div className="border border-neutral-300 p-2 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[9px] font-black uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-0.5 mb-1">
                REGULATORY & SHIPMENT METRICS:
              </p>
              <div className="grid grid-cols-2 gap-y-1 text-[10px]">
                <div>
                  <span className="text-neutral-600">Booking Date:</span>{" "}
                  <span className="font-semibold">{bookingDate}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Place of Supply:</span>{" "}
                  <span className="font-bold">Manipur (14)</span>
                </div>
                <div>
                  <span className="text-neutral-600">Reverse Charge:</span>{" "}
                  <span className="font-semibold">No</span>
                </div>
                <div>
                  <span className="text-neutral-600">Payment Status:</span>{" "}
                  <span className="font-bold uppercase text-black">
                    {invoice.status}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Service Class:</span>{" "}
                  <span className="font-semibold uppercase">
                    {shipment.serviceType === "express_air" ? "Air Express" : "Surface Linehaul"}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Payment Mode:</span>{" "}
                  <span className="font-semibold uppercase font-mono">
                    {invoice.paymentMode || "Cash"}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-1 text-[9px] text-neutral-600 flex justify-between font-mono">
              <span>Origin: DEL (07)</span>
              <span>&#8594;</span>
              <span>Destination: SJM / IMF (14)</span>
              <span>Interstate Supply: Yes</span>
            </div>
          </div>
        </section>

        {/* ── TWO-COLUMN BILLING & DESTINATION DELIVERY HUB (SINGJAMEI ADDRESS) ── */}
        <section className="grid grid-cols-2 gap-4 border-b border-black pb-2.5 text-[10.5px]">
          {/* Bill To / Consignor */}
          <div className="border border-neutral-300 p-2">
            <p className="font-mono text-[9px] font-black uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-0.5 mb-1">
              BILL TO / CONSIGNOR (SENDER):
            </p>
            <p className="font-bold text-black text-xs">
              {shipment.consignorName || "Walk-in Consignor"}
            </p>
            <p className="text-neutral-800">
              {shipment.consignorAddress || "Customer Address On File"}
            </p>
            <p className="text-neutral-800">
              {shipment.origin} {shipment.consignorPinCode ? `- ${shipment.consignorPinCode}` : ""}
            </p>
            {shipment.consignorPhone && (
              <p className="font-mono text-[10px] text-neutral-700">
                Ph: {shipment.consignorPhone}
              </p>
            )}
            {shipment.consignorEmail && (
              <p className="text-[10px] text-neutral-700">Email: {shipment.consignorEmail}</p>
            )}
          </div>

          {/* Ship To / Destination Hub: Singjamei */}
          <div className="border border-neutral-300 p-2 bg-neutral-50/40">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-0.5 mb-1 font-mono text-[9px]">
              <span className="font-black uppercase tracking-wider text-neutral-700">
                DELIVER TO / DESTINATION HUB (SINGJAMEI):
              </span>
              <span className="font-bold text-black">PIN: 795008</span>
            </div>
            <p className="font-bold text-black text-xs">
              {shipment.consigneeName || "Consignee Not Recorded"}
            </p>
            <p className="text-neutral-800">
              {shipment.consigneeAddress || "Delivery Address On File"}
            </p>
            <div className="mt-1 border-t border-dashed border-neutral-300 pt-1 text-[9.5px]">
              <p className="font-semibold text-neutral-900">
                Delivery Branch: {SINGJAMEI_HUB_ADDRESS.name}
              </p>
              <p className="text-neutral-700">
                {SINGJAMEI_HUB_ADDRESS.addressLine1}, {SINGJAMEI_HUB_ADDRESS.city}, {SINGJAMEI_HUB_ADDRESS.state} {SINGJAMEI_HUB_ADDRESS.pinCode}
              </p>
              <p className="text-neutral-700 font-mono text-[9px]">
                Hub Hotline: {SINGJAMEI_HUB_ADDRESS.phone}
              </p>
            </div>
          </div>
        </section>

        {/* ── CONSIGNMENT SUMMARY BAR ── */}
        <section className="grid grid-cols-4 gap-2 border border-black bg-neutral-100 p-2 text-center text-[10px]">
          <div>
            <span className="block text-[8.5px] font-bold text-neutral-600 uppercase">
              Actual Weight
            </span>
            <span className="font-bold font-mono text-black">{shipment.weightKg} kg</span>
          </div>
          <div>
            <span className="block text-[8.5px] font-bold text-neutral-600 uppercase">
              Chargeable Weight
            </span>
            <span className="font-bold font-mono text-black">
              {shipment.chargedWeightKg ?? shipment.weightKg} kg
            </span>
          </div>
          <div>
            <span className="block text-[8.5px] font-bold text-neutral-600 uppercase">
              Pieces / Quantity
            </span>
            <span className="font-bold font-mono text-black">{shipment.pieces ?? 1} Units</span>
          </div>
          <div>
            <span className="block text-[8.5px] font-bold text-neutral-600 uppercase">
              Nature of Cargo
            </span>
            <span className="font-bold text-black truncate block">
              {shipment.contentDescription || shipment.natureOfGoods || "Commercial Freight"}
            </span>
          </div>
        </section>

        {/* ── LINE-ITEM CHARGES TABLE (AMAZON INDIA SAC GRID) ── */}
        <InvoiceCharges invoice={invoice} serviceType={shipment.serviceType} />

        {/* ── AMOUNT IN WORDS (STATUTORY GST COMPLIANCE) ── */}
        <div className="border border-neutral-300 bg-neutral-50 p-2 text-[10.5px]">
          <span className="font-bold text-neutral-700">Amount in Words: </span>
          <span className="font-bold text-black italic">{inWords}</span>
        </div>
      </div>

      {/* ── FOOTER: TERMS, DECLARATION & AUTHORIZED SIGNATURE ── */}
      <footer className="mt-4 border-t-2 border-black pt-3 flex flex-col gap-3 text-[9.5px]">
        <div className="grid grid-cols-12 gap-3 items-end">
          {/* Statutory Declaration & Terms */}
          <div className="col-span-8 space-y-1 text-neutral-700 leading-tight">
            <p className="font-bold text-black uppercase text-[9px] tracking-wider">
              DECLARATION &amp; TERMS OF CARRIAGE:
            </p>
            <p>
              1. We declare that this invoice shows the actual price of the freight services described and that all particulars are true and correct.
            </p>
            <p>
              2. Goods Transport Agency (GTA) services governed under the Carriage by Road Act, 2007. GST payable under reverse charge: <strong>No</strong>.
            </p>
            <p>
              3. All disputes subject to jurisdiction of courts in Delhi / Imphal.
            </p>
            <p>
              Terms &amp; support:{" "}
              {origin ? (
                <a className="underline font-mono text-black" href={`${origin}/terms`}>
                  {origin}/terms
                </a>
              ) : (
                "tacservice.in/terms"
              )}
            </p>
          </div>

          {/* Tracking QR Code & Authorized Signatory Box */}
          <div className="col-span-4 flex items-end justify-end gap-3">
            {/* Live Tracking QR */}
            <div data-invoice-qr className="flex flex-col items-center text-center">
              <QRCode
                data={`https://tacservice.in/track?awb=${encodeURIComponent(shipment.awbNumber)}`}
                className="size-16 border border-black p-0.5"
              />
              <span className="font-mono text-[7px] text-neutral-600 mt-0.5">
                Scan to Verify
              </span>
            </div>

            {/* Amazon-style Signatory Box */}
            <div className="border border-black p-1.5 w-36 text-center flex flex-col justify-between h-20 bg-neutral-50">
              <span className="text-[7.5px] font-bold uppercase text-neutral-700">
                For {DELHI_HUB_ADDRESS.legalName}
              </span>
              <div className="font-serif italic text-[11px] text-neutral-500 my-auto">
                Authorized Signatory
              </div>
              <span className="text-[7px] font-mono text-neutral-500 border-t border-neutral-300 pt-0.5">
                Computer Generated Invoice
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-1 flex justify-between font-mono text-[8px] text-neutral-500">
          <span>TAC-XPRESS LOGISTICS NETWORK • ISO 9001:2015 COMPLIANT OPERATION</span>
          <span>PAGE 1 OF 1</span>
        </div>
      </footer>
    </article>
  )
}
