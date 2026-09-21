"use client"

import Link from "next/link"
import { Tag } from "lucide-react"
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
        {!isPreview && (
          <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
            <PrintButton />
            <Link
              href={`/invoice/${invoice.id}/label`}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50 hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              <Tag className="size-3.5" />
              View 4″ × 6″ Shipping Label
            </Link>
          </div>
        )}
        <InvoiceDocument invoice={invoice} shipment={shipment} appOrigin={appOrigin} />
      </div>
    </div>
  )
}
