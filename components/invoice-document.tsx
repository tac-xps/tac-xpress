"use client"

import React, { useSyncExternalStore } from "react"
import type { Invoice, Shipment } from "@/lib/db/schema"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"
import { normalizeInvoiceDomain } from "@/lib/documents/invoice/engine/domain-normalizer"
import { InvoiceDocument as InvoiceDocumentInner } from "@/components/invoice/invoice-document"
import { getAppUrl } from "@/lib/config/app-url"

export interface InvoiceDocumentProps {
  invoice?: Invoice
  shipment?: Shipment
  doc?: TaxInvoiceDocument
  appOrigin?: string
}

const subscribe = () => () => {}
const browserOrigin = () => getAppUrl(window.location.origin, "development")
const serverOrigin = () => null

/**
 * Master Tax Invoice Document Component (GST / B2B / B2C).
 *
 * Implements the Nordic Lagom Document System:
 * - Delhi Central Dispatch Hub (07) on Top Section.
 * - Manipur Regional Delivery Station (Singjamei Top Leikai, Kakwa, Imphal-795003) on Bottom Section.
 * - Concise, contextual freight conditions for Air & Surface linehaul.
 * - Multi-item intelligent aggregation & geometric height budgeting with Page 2 Continuation sheet.
 * - Strict integer-paise monetary calculations & auditable GST tax engine.
 */
export function InvoiceDocument({
  invoice,
  shipment,
  doc,
  appOrigin,
}: InvoiceDocumentProps) {
  const currentOrigin = useSyncExternalStore(
    subscribe,
    browserOrigin,
    serverOrigin
  )
  const origin = appOrigin ?? currentOrigin ?? "https://tacservice.in"

  // 1. If pre-normalized TaxInvoiceDocument DTO is provided, use directly
  if (doc) {
    return <InvoiceDocumentInner doc={doc} />
  }

  // 2. Otherwise normalize from raw DB records
  if (!invoice || !shipment) {
    return null
  }

  const normalizedDoc = normalizeInvoiceDomain(invoice, shipment, {
    appOrigin: origin,
  })

  return <InvoiceDocumentInner doc={normalizedDoc} />
}
