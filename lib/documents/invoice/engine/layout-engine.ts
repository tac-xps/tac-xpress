import type { TaxInvoiceDocument } from "../domain/types"

export interface SectionBudget {
  name: string
  minHeightMm: number
  preferredHeightMm: number
  maxHeightMm?: number
  flexible: boolean
  calculatedHeightMm: number
}

export interface DocumentLayoutBudget {
  printableHeightMm: number // 281mm
  contentTargetMm: number // 270mm
  safetyReserveMm: number // 11mm
  usedHeightMm: number
  remainingHeightMm: number
  riskState: "Safe" | "Tight" | "Overflow"
  requiresContinuationPage: boolean
  pageCount: number
  visiblePage1ManifestLimit: number
  sections: Record<string, SectionBudget>
  typography: {
    heroAwbPx: number
    titlePx: number
    sectionHeaderPx: number
    bodyPx: number
    legalPx: number
    microPx: number
  }
  geometry: {
    pageWidthMm: number
    printableWidthMm: number
    qrSizeMm: number
  }
}

/**
 * Geometric Height Budgeting Engine for A4 Deterministic Printing.
 *
 * Invariants:
 * - A4 Dimensions: 210mm × 297mm.
 * - Printable Area: 281mm (8mm top & bottom margins).
 * - Safety Reserve: Strictly reserves 11mm buffer (Content Target: 270mm).
 * - Readability Floor: Body ≥ 9px, Legal ≥ 7.5px, QR ≥ 18mm (Default: 20mm).
 * - If manifest items exceed available height, cleanly activates Manifest Continuation Page 2
 *   rather than shrinking text below the readability floor.
 */
export function calculateDocumentLayoutBudget(doc: TaxInvoiceDocument): DocumentLayoutBudget {
  const printableHeightMm = 281
  const contentTargetMm = 270
  const safetyReserveMm = 11

  // 1. Calculate Section Heights
  const headerHeightMm = 30
  const routeStripHeightMm = 10
  const partiesHeightMm = 22
  const shipmentSummaryHeightMm = 14

  // Charges table: base 18mm + 4mm per line item
  const chargeLinesCount = doc.commercial.charges.length
  const chargesTableHeightMm = Math.max(22, 14 + chargeLinesCount * 4)

  const paymentHeightMm = 14
  const destinationHubHeightMm = 16
  const termsHeightMm = 18
  const verificationHeightMm = 20

  const fixedAndSemiFixedTotal =
    headerHeightMm +
    routeStripHeightMm +
    partiesHeightMm +
    shipmentSummaryHeightMm +
    chargesTableHeightMm +
    paymentHeightMm +
    destinationHubHeightMm +
    termsHeightMm +
    verificationHeightMm

  // Available height dedicated to manifest on Page 1 (capped at 50mm budget per spec)
  const maxPage1ManifestBudgetMm = 50
  const availableManifestHeightMm = Math.min(
    maxPage1ManifestBudgetMm,
    Math.max(20, contentTargetMm - fixedAndSemiFixedTotal)
  )

  // Manifest row sizing: ~4.5mm per item row + 6mm header
  const manifestItems = doc.shipment.manifest
  const manifestItemCount = manifestItems.length
  const fullManifestHeightMm = 6 + manifestItemCount * 4.5

  let requiresContinuationPage = false
  let calculatedManifestHeightMm = fullManifestHeightMm
  let visiblePage1ManifestLimit = manifestItemCount

  // If manifest exceeds available budget, cap at 3 rows on Page 1 and generate Continuation Page 2
  if (fullManifestHeightMm > availableManifestHeightMm) {
    requiresContinuationPage = true
    visiblePage1ManifestLimit = 3
    calculatedManifestHeightMm = 8 + 3 * 5.2 + 5 // +5mm for continuation badge
  }

  const usedHeightMm = Math.round((fixedAndSemiFixedTotal + calculatedManifestHeightMm) * 10) / 10
  const remainingHeightMm = Math.round((contentTargetMm - usedHeightMm + safetyReserveMm) * 10) / 10

  let riskState: "Safe" | "Tight" | "Overflow"
  if (usedHeightMm <= 265) {
    riskState = "Safe"
  } else if (usedHeightMm <= contentTargetMm) {
    riskState = "Tight"
  } else {
    riskState = "Overflow"
  }

  return {
    printableHeightMm,
    contentTargetMm,
    safetyReserveMm,
    usedHeightMm,
    remainingHeightMm,
    riskState,
    requiresContinuationPage,
    pageCount: requiresContinuationPage ? 2 : 1,
    visiblePage1ManifestLimit,
    sections: {
      header: {
        name: "Header & Hero AWB",
        minHeightMm: 36,
        preferredHeightMm: headerHeightMm,
        flexible: false,
        calculatedHeightMm: headerHeightMm,
      },
      routeStrip: {
        name: "Network Route Diagram",
        minHeightMm: 10,
        preferredHeightMm: routeStripHeightMm,
        flexible: false,
        calculatedHeightMm: routeStripHeightMm,
      },
      parties: {
        name: "Parties 3-Column Grid",
        minHeightMm: 30,
        preferredHeightMm: partiesHeightMm,
        flexible: false,
        calculatedHeightMm: partiesHeightMm,
      },
      shipmentSummary: {
        name: "Shipment Metrics Strip",
        minHeightMm: 16,
        preferredHeightMm: shipmentSummaryHeightMm,
        flexible: false,
        calculatedHeightMm: shipmentSummaryHeightMm,
      },
      manifest: {
        name: "Consignment Manifest",
        minHeightMm: 20,
        preferredHeightMm: calculatedManifestHeightMm,
        flexible: true,
        calculatedHeightMm: calculatedManifestHeightMm,
      },
      charges: {
        name: "Charges Table & Financials",
        minHeightMm: 28,
        preferredHeightMm: chargesTableHeightMm,
        flexible: false,
        calculatedHeightMm: chargesTableHeightMm,
      },
      payment: {
        name: "Payment Reconciliation & Balance Due",
        minHeightMm: 14,
        preferredHeightMm: paymentHeightMm,
        flexible: false,
        calculatedHeightMm: paymentHeightMm,
      },
      destinationHub: {
        name: "Manipur Regional Delivery Station",
        minHeightMm: 16,
        preferredHeightMm: destinationHubHeightMm,
        flexible: false,
        calculatedHeightMm: destinationHubHeightMm,
      },
      terms: {
        name: "Contextual Freight Conditions",
        minHeightMm: 20,
        preferredHeightMm: termsHeightMm,
        flexible: false,
        calculatedHeightMm: termsHeightMm,
      },
      verification: {
        name: "Dual Verification QRs & Signatory",
        minHeightMm: 18,
        preferredHeightMm: verificationHeightMm,
        flexible: false,
        calculatedHeightMm: verificationHeightMm,
      },
    },
    typography: {
      heroAwbPx: 22,
      titlePx: 14,
      sectionHeaderPx: 9.5,
      bodyPx: 9,
      legalPx: 7.5,
      microPx: 7,
    },
    geometry: {
      pageWidthMm: 210,
      printableWidthMm: 194, // 210mm - 8mm left - 8mm right
      qrSizeMm: 20,
    },
  }
}
