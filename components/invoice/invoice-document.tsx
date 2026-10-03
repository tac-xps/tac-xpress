"use client"

import React from "react"
import "./styles/invoice.css"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"
import { calculateDocumentLayoutBudget } from "@/lib/documents/invoice/engine/layout-engine"
import { InvoiceHeader } from "./invoice-header"
import { RouteStrip } from "./route-strip"
import { PartyGrid } from "./party-grid"
import { ShipmentSummary } from "./shipment-summary"
import { ConsignmentManifest } from "./consignment-manifest"
import { ChargesTable } from "./charges-table"
import { PaymentReconciliation } from "./payment-reconciliation"
import { DestinationHub } from "./destination-hub"
import { FreightConditions } from "./freight-conditions"
import { VerificationPanel } from "./verification-panel"
import { ManifestContinuationPage } from "./manifest-continuation-page"

export interface InvoiceDocumentProps {
  doc: TaxInvoiceDocument
}

export function InvoiceDocument({ doc }: InvoiceDocumentProps) {
  const budget = calculateDocumentLayoutBudget(doc)

  return (
    <div className="flex flex-col items-center">
      {/* ── PAGE 1: PRIMARY TAX INVOICE ── */}
      <article
        data-invoice-document="page-1"
        className="invoice-page mx-auto box-border flex min-h-[297mm] w-[210mm] shrink-0 flex-col justify-between bg-white p-[6mm] sm:p-[7mm] font-sans text-xs leading-normal text-[#191716] shadow-sm [print-color-adjust:exact] print:shadow-none select-none print:m-0"
        aria-label={`Tax Invoice ${doc.commercial.invoiceNumber} for AWB ${doc.shipment.awbNumber}`}
      >
        <div className="flex flex-col">
          {/* 1. Header & Hero AWB */}
          <InvoiceHeader doc={doc} />

          {/* 2. Route Corridor Diagram (Delhi 07 → Manipur 14) */}
          <RouteStrip doc={doc} />

          {/* 3. 3-Column Party Grid (Billed To, Dispatch From, Deliver To) */}
          <PartyGrid doc={doc} />

          {/* 4. Shipment Summary & Weight Basis Badge */}
          <ShipmentSummary doc={doc} />

          {/* 5. Consignment Manifest Table (with Page 2 Continuation cap if needed) */}
          <ConsignmentManifest doc={doc} visibleLimit={budget.visiblePage1ManifestLimit} />

          {/* 6. Itemized SAC Charges & GST Table */}
          <ChargesTable doc={doc} />

          {/* 7. Payment Reconciliation & Hero Balance Due */}
          <PaymentReconciliation doc={doc} />

          {/* 8. Manipur Regional Delivery Station (Kakwa, Singjamei Top Leikai, Imphal-795003) */}
          <DestinationHub doc={doc} />

          {/* 9. Contextual Freight Conditions (Air & Surface) */}
          <FreightConditions doc={doc} />
        </div>

        {/* 10. Dual Verification QRs, Signatory Stamp & Pagination */}
        <VerificationPanel doc={doc} pageNumber={1} totalPages={budget.pageCount} />
      </article>

      {/* ── PAGE 2: MANIFEST CONTINUATION SHEET (ACTIVATED FOR EXTREME DENSITY) ── */}
      {budget.requiresContinuationPage && <ManifestContinuationPage doc={doc} />}
    </div>
  )
}
