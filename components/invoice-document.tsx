"use client"

import { useSyncExternalStore } from "react"
import { format } from "date-fns"
import { QRCode } from "@/components/documents/document-qr"
import { InvoiceCharges } from "@/components/documents/invoice-charges"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { getAppUrl } from "@/lib/config/app-url"

interface InvoiceDocumentProps {
  invoice: Invoice
  shipment: Shipment
  appOrigin?: string
}
const subscribe = () => () => {}
const browserOrigin = () => getAppUrl(window.location.origin, "development")
const serverOrigin = () => null

/** Print documents deliberately use paper white and black in both UI themes. */
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
  const date = format(new Date(invoice.createdAt), "dd MMM yyyy")
  return (
    <article
      data-invoice-document
      className="mx-auto box-border flex min-h-[297mm] w-[210mm] shrink-0 flex-col gap-5 bg-white p-[12mm] font-sans text-xs leading-relaxed text-black shadow-sm [print-color-adjust:exact] print:shadow-none"
    >
      <header className="flex items-start justify-between border-b-2 border-black pb-5">
        <div>
          <p className="text-2xl font-bold tracking-tight">TAC-XPRESS</p>
          <p className="text-xs">TAPAN ASSOCIATE CARGO SERVICE</p>
          <p>GSTIN: 07AAMFT6165B1Z3</p>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-semibold">Invoice</h1>
          <p className="font-mono uppercase">{invoice.id.split("-")[0]}</p>
          <p>{date}</p>
          <p className="font-semibold uppercase">{invoice.status}</p>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-6">
        <section className="min-w-0 break-words">
          <h2 className="mb-2 font-semibold uppercase">Bill to / Sender</h2>
          <p className="font-semibold">
            {shipment.consignorName || "Not recorded"}
          </p>
          <p>{shipment.consignorAddress}</p>
          <p>{shipment.consignorPinCode}</p>
          <p>{shipment.consignorPhone}</p>
          <p>{shipment.consignorEmail}</p>
        </section>
        <section className="min-w-0 break-words">
          <h2 className="mb-2 font-semibold uppercase">Deliver to</h2>
          <p className="font-semibold">
            {shipment.consigneeName || "Not recorded"}
          </p>
          <p>{shipment.consigneeAddress}</p>
          <p>{shipment.consigneePinCode}</p>
          <p>{shipment.consigneePhone}</p>
        </section>
      </div>
      <section
        className="grid grid-cols-3 gap-3 border-y border-black py-3"
        aria-label="Shipment details"
      >
        <div>
          <p>Air waybill</p>
          <p className="font-mono font-bold break-all">{shipment.awbNumber}</p>
        </div>
        <div>
          <p>Route</p>
          <p className="font-semibold">
            {shipment.origin} → {shipment.destination}
          </p>
        </div>
        <div>
          <p>Service</p>
          <p className="font-semibold">
            {shipment.serviceType === "express_air"
              ? "Air cargo"
              : shipment.serviceType === "standard_ocean"
                ? "Ocean cargo"
                : "Surface cargo"}
          </p>
        </div>
        <div>
          <p>Pieces / actual weight</p>
          <p className="font-semibold">
            {shipment.pieces ?? 1} pcs / {shipment.weightKg} kg
          </p>
        </div>
        <div>
          <p>Chargeable weight</p>
          <p className="font-semibold">
            {shipment.chargedWeightKg ?? shipment.weightKg} kg
          </p>
        </div>
        <div>
          <p>Payment mode</p>
          <p className="font-semibold uppercase">
            {invoice.paymentMode || "Not recorded"}
          </p>
        </div>
      </section>
      <p className="break-words">
        <strong>Contents:</strong>{" "}
        {shipment.contentDescription ||
          shipment.natureOfGoods ||
          "Not recorded"}
      </p>
      <InvoiceCharges invoice={invoice} />
      <footer className="mt-auto flex items-end justify-between gap-8 border-t border-black pt-4 text-[10px]">
        <div className="max-w-[130mm] space-y-2">
          <p>
            Tax breakdown and payments are shown as recorded. Contact TAC-XPRESS
            with the invoice number for billing corrections.
          </p>
          <p>
            Track published shipment updates without an account. For delivery
            documents or support, contact our team.
          </p>
          <p>
            Booking terms:{" "}
            {origin ? (
              <a className="underline" href={`${origin}/terms`}>
                {origin}/terms
              </a>
            ) : (
              "Available on the TAC-XPRESS website."
            )}
          </p>
          <p className="font-semibold">Thank you for choosing TAC-XPRESS.</p>
        </div>
        {origin && (
          <div
            data-invoice-qr
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <QRCode
              data={`${origin}/track?awb=${encodeURIComponent(shipment.awbNumber)}`}
              className="size-20"
            />
            <span>Scan to track</span>
          </div>
        )}
      </footer>
    </article>
  )
}
