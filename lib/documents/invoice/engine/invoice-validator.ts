import type { TaxInvoiceDocument } from "../domain/types"
import { calculateDocumentLayoutBudget, type DocumentLayoutBudget } from "./layout-engine"

export interface ValidationIssue {
  code: string
  field: string
  message: string
  severity: "error" | "warning"
}

export interface InvoicePreflightResult {
  valid: boolean
  riskLevel: "GREEN" | "AMBER" | "RED"
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  budget: DocumentLayoutBudget
  readability: {
    smallestBodyFontPx: number
    smallestLegalFontPx: number
    qrSizeMm: number
    meetsFloors: boolean
  }
}

/**
 * First-Class Preflight Document QA Validator.
 *
 * Checks:
 * 1. GST & Statutory Field Completeness.
 * 2. Mathematical Reconciliation (Total = Advance + Balance).
 * 3. Operational Integrity (AWB, Hubs, Chargeable >= Actual Weight).
 * 4. Geometric Containment (Page-level & Section-level).
 * 5. Minimum Readability Floor Enforcement.
 */
export function validateInvoiceDocument(doc: TaxInvoiceDocument): InvoicePreflightResult {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []

  const budget = calculateDocumentLayoutBudget(doc)

  // 1. Mandatory GST & Statutory Checks
  if (!doc.commercial.supplier.gstin) {
    errors.push({
      code: "GSTIN_MISSING",
      field: "commercial.supplier.gstin",
      message: "Supplier GSTIN is mandatory on tax invoices.",
      severity: "error",
    })
  } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(doc.commercial.supplier.gstin)) {
    warnings.push({
      code: "GSTIN_FORMAT_WARNING",
      field: "commercial.supplier.gstin",
      message: "Supplier GSTIN does not strictly conform to standard 15-character format.",
      severity: "warning",
    })
  }

  if (!doc.commercial.invoiceNumber) {
    errors.push({
      code: "INVOICE_NUMBER_MISSING",
      field: "commercial.invoiceNumber",
      message: "Invoice number is mandatory.",
      severity: "error",
    })
  }

  if (!doc.commercial.taxDecision.placeOfSupplyStateCode) {
    errors.push({
      code: "PLACE_OF_SUPPLY_MISSING",
      field: "commercial.taxDecision.placeOfSupplyStateCode",
      message: "Place of Supply State Code is mandatory for GST compliance.",
      severity: "error",
    })
  }

  // 2. Financial Reconciliation Checks
  const total = doc.commercial.financials.totalInvoiceValue.paise
  const advance = doc.commercial.financials.advancePaid.paise
  const balance = doc.commercial.financials.balanceDue.paise

  if (total !== advance + balance) {
    errors.push({
      code: "FINANCIAL_MATH_MISMATCH",
      field: "commercial.financials",
      message: `Financial mismatch: Total (${total}) does not equal Advance (${advance}) + Balance (${balance}).`,
      severity: "error",
    })
  }

  if (doc.commercial.financials.taxableAmount.paise < 0) {
    errors.push({
      code: "NEGATIVE_TAXABLE_AMOUNT",
      field: "commercial.financials.taxableAmount",
      message: "Taxable amount cannot be negative.",
      severity: "error",
    })
  }

  // 3. Operational Logistics Checks
  if (!doc.shipment.awbNumber || doc.shipment.awbNumber.trim().length === 0) {
    errors.push({
      code: "AWB_NUMBER_MISSING",
      field: "shipment.awbNumber",
      message: "AWB number is required as the operational hero identifier.",
      severity: "error",
    })
  }

  if (doc.shipment.metrics.pieces < 1) {
    errors.push({
      code: "INVALID_PIECES_COUNT",
      field: "shipment.metrics.pieces",
      message: "Shipment pieces must be at least 1.",
      severity: "error",
    })
  }

  if (doc.shipment.metrics.chargeableWeightKg < doc.shipment.metrics.actualWeightKg) {
    errors.push({
      code: "CHARGEABLE_WEIGHT_DEFICIT",
      field: "shipment.metrics.chargeableWeightKg",
      message: "Chargeable weight cannot be less than gross actual weight.",
      severity: "error",
    })
  }

  // 4. Geometric & Readability Floor Checks
  const smallestBodyFontPx = budget.typography.bodyPx
  const smallestLegalFontPx = budget.typography.legalPx
  const qrSizeMm = budget.geometry.qrSizeMm

  const meetsFloors =
    smallestBodyFontPx >= 8.5 && smallestLegalFontPx >= 7.5 && qrSizeMm >= 18

  if (!meetsFloors) {
    errors.push({
      code: "READABILITY_FLOOR_VIOLATION",
      field: "budget.typography",
      message: "Typography or QR size violates strict readability floors.",
      severity: "error",
    })
  }

  if (budget.riskState === "Overflow") {
    errors.push({
      code: "DOCUMENT_GEOMETRY_OVERFLOW",
      field: "budget.usedHeightMm",
      message: `Document height (${budget.usedHeightMm}mm) exceeds safe printable limit (${budget.contentTargetMm}mm).`,
      severity: "error",
    })
  } else if (budget.riskState === "Tight") {
    warnings.push({
      code: "DOCUMENT_GEOMETRY_TIGHT",
      field: "budget.remainingHeightMm",
      message: `Document geometry is tight (${budget.remainingHeightMm}mm remaining buffer).`,
      severity: "warning",
    })
  }

  // 5. Determine Overall Risk Level
  let riskLevel: "GREEN" | "AMBER" | "RED"
  if (errors.length > 0) {
    riskLevel = "RED"
  } else if (warnings.length > 0 || budget.riskState === "Tight") {
    riskLevel = "AMBER"
  } else {
    riskLevel = "GREEN"
  }

  return {
    valid: errors.length === 0,
    riskLevel,
    errors,
    warnings,
    budget,
    readability: {
      smallestBodyFontPx,
      smallestLegalFontPx,
      qrSizeMm,
      meetsFloors,
    },
  }
}
