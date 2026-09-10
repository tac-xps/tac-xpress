"use client"

import { InvoiceDocument } from "@/components/invoice-document"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { PrintButton } from "./print-button"

export function InvoiceView({
  invoice,
  shipment,
  isPreview,
  appOrigin,
}: {
  invoice: Invoice
  shipment: Shipment
  isPreview: boolean
  appOrigin: string
}) {
  return (
    <div className="flex min-h-screen justify-center bg-neutral-100 py-8 print:bg-white print:p-0">
      <div className="relative">
        {!isPreview && <div className="mb-4 print:hidden"><PrintButton /></div>}
        <InvoiceDocument invoice={invoice} shipment={shipment} appOrigin={appOrigin} />
      </div>
    </div>
  )
}
