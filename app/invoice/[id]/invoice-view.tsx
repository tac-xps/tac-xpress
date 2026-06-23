"use client"

import { InvoiceDocument } from "@/components/invoice-document"
import type { Invoice, Shipment } from "@/lib/db/schema"

export function InvoiceView({
  invoice,
  shipment,
  isPreview,
}: {
  invoice: Invoice
  shipment: Shipment
  isPreview: boolean
}) {
  return (
    <div className="flex min-h-screen justify-center bg-neutral-100 py-8 print:bg-white print:p-0">
      <div className="relative">
        <InvoiceDocument invoice={invoice} shipment={shipment} />
      </div>
    </div>
  )
}
