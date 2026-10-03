import { format } from "date-fns"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { money, toRupees, subtractMoney } from "../domain/money"
import {
  DELHI_CENTRAL_HUB,
  MANIPUR_REGIONAL_HUB,
  SAC_CLASSIFICATIONS,
} from "../domain/master-data"
import type {
  TaxInvoiceDocument,
  CommercialDocument,
  ShipmentReference,
  PartyInfo,
} from "../domain/types"
import { parseConsignmentManifest } from "./item-parser"
import { calculateConsignmentWeights } from "./weight-engine"
import { calculateInvoiceTaxes } from "./tax-engine"
import { amountInWords } from "@/lib/documents/number-to-words"

export interface NormalizerOptions {
  appOrigin?: string
  verificationToken?: string
  forceFresh?: boolean
}

/**
 * Domain Normalizer: Transforms raw database records into the decoupled
 * CommercialDocument and ShipmentReference structures of TaxInvoiceDocument.
 *
 * Invariants:
 * - Commercial transactions are decoupled from operational logistics.
 * - Payment status is strictly derived from total - advance.
 * - Tax decisions and weight bases are computed through pure stateless engines.
 * - If an immutable documentSnapshot is already recorded on the invoice, honors it.
 */
export function normalizeInvoiceDomain(
  invoice: Invoice,
  shipment: Shipment,
  options: NormalizerOptions = {}
): TaxInvoiceDocument {
  // If an immutable document snapshot was previously saved, honor it
  if (!options.forceFresh && invoice.documentSnapshot && typeof invoice.documentSnapshot === "object") {
    const snapshot = invoice.documentSnapshot as unknown as TaxInvoiceDocument
    if (snapshot.commercial && snapshot.shipment && snapshot.routing) {
      return snapshot
    }
  }

  const origin = options.appOrigin || "https://tacservice.in"
  const verificationToken =
    options.verificationToken ||
    Buffer.from(`${invoice.id}-${shipment.awbNumber}`).toString("base64").substring(0, 16)

  // 1. Format Dates
  const invoiceDate = format(new Date(invoice.createdAt), "dd MMM yyyy")
  const bookingDate = shipment.bookingDate
    ? format(new Date(shipment.bookingDate), "dd MMM yyyy")
    : invoiceDate

  // 2. Normalize Parties
  const billTo: PartyInfo = {
    name: shipment.consignorName || "Walk-in Consignor",
    company: shipment.consignorCompany || undefined,
    addressLine: shipment.consignorAddress || "Customer Address On File",
    city: shipment.origin || "Delhi",
    state: "Delhi",
    stateCode: "07",
    pinCode: shipment.consignorPinCode || undefined,
    phone: shipment.consignorPhone || undefined,
    altPhone: shipment.consignorAltPhone || undefined,
    email: shipment.consignorEmail || undefined,
    gstin: undefined,
  }

  const deliverTo: PartyInfo = {
    name: shipment.consigneeName || "Consignee On Record",
    addressLine: shipment.consigneeAddress || "Delivery Address On File",
    city: shipment.destination || "Imphal",
    state: "Manipur",
    stateCode: "14",
    pinCode: shipment.consigneePinCode || MANIPUR_REGIONAL_HUB.pinCode,
    phone: shipment.consigneePhone || undefined,
    altPhone: shipment.consigneeAltPhone || undefined,
    email: shipment.consigneeEmail || undefined,
  }

  // 3. Weight Engine Execution
  const serviceMode = (shipment.serviceType || "express_air") as "express_air" | "surface"
  const weights = calculateConsignmentWeights({
    actualWeightKg: shipment.weightKg,
    dimensions: {
      l: shipment.dimensionsL,
      w: shipment.dimensionsW,
      h: shipment.dimensionsH,
    },
    pieces: shipment.pieces ?? 1,
    serviceMode,
  })

  // 4. Manifest Engine Execution
  const manifest = parseConsignmentManifest(shipment.contentDescription, {
    totalPieces: shipment.pieces ?? 1,
    totalWeightKg: weights.actualWeightKg,
  })

  // 5. Tax Engine Execution
  const freightSac =
    serviceMode === "express_air"
      ? SAC_CLASSIFICATIONS.AIR_FREIGHT.code
      : SAC_CLASSIFICATIONS.SURFACE_FREIGHT.code

  const freightAmountPaise =
    invoice.freightCharge && invoice.freightCharge > 0
      ? invoice.freightCharge
      : invoice.subtotal && invoice.subtotal > 0
      ? invoice.subtotal
      : invoice.amount

  const rawChargeLines = [
    {
      id: "charge-freight",
      classificationCode: freightSac,
      label: `Scheduled Linehaul Cargo (${serviceMode === "express_air" ? "Express Air" : "Surface Linehaul"})`,
      taxableAmount: money(freightAmountPaise),
    },
    {
      id: "charge-pickup",
      classificationCode: SAC_CLASSIFICATIONS.HANDLING_DOCKET.code,
      label: "Consignment Origin Handling & Pickup",
      taxableAmount: money(invoice.pickupCharge),
    },
    {
      id: "charge-packaging",
      classificationCode: SAC_CLASSIFICATIONS.PACKAGING.code,
      label: "Protective Packaging & Security Strapping",
      taxableAmount: money(invoice.packingCharge),
    },
    {
      id: "charge-docket",
      classificationCode: SAC_CLASSIFICATIONS.HANDLING_DOCKET.code,
      label: "Airway Bill (AWB) & Docket Processing",
      taxableAmount: money(invoice.docketCharge),
    },
    {
      id: "charge-insurance",
      classificationCode: SAC_CLASSIFICATIONS.TRANSIT_INSURANCE.code,
      label: "Transit Risk Protection & Valuation Cover",
      taxableAmount: money(invoice.insuranceCharge),
    },
    {
      id: "charge-other",
      classificationCode: SAC_CLASSIFICATIONS.HANDLING_DOCKET.code,
      label: "Terminal Surcharges & Operational Fees",
      taxableAmount: money(invoice.otherCharges),
    },
  ].filter((line) => line.taxableAmount.paise > 0)

  const taxEngineResult = calculateInvoiceTaxes({
    supplierStateCode: DELHI_CENTRAL_HUB.stateCode,
    supplierGSTIN: DELHI_CENTRAL_HUB.gstin,
    recipientStateCode: deliverTo.stateCode || "14",
    placeOfSupplyStateCode: "14",
    rawChargeLines,
    defaultGstRate: invoice.gstRate || 18,
  })

  // 6. Payment Financials Reconciliation
  const advancePaid = money(invoice.advancePaid)
  const totalValue = taxEngineResult.totalInvoiceValue
  const balanceDue = subtractMoney(totalValue, advancePaid, false)

  let paymentStatus: "unpaid" | "partially_paid" | "paid" | "void"
  if (invoice.status === "void") {
    paymentStatus = "void"
  } else if (advancePaid.paise >= totalValue.paise || balanceDue.paise === 0) {
    paymentStatus = "paid"
  } else if (advancePaid.paise > 0) {
    paymentStatus = "partially_paid"
  } else {
    paymentStatus = "unpaid"
  }

  const invoiceNumber = `TAC-INV-${invoice.id.split("-")[0].toUpperCase()}`
  const formattedWords = amountInWords(toRupees(totalValue))

  // UPI Payload for instant payment if balance is due
  let upiPayload: string | undefined
  if (paymentStatus !== "paid" && paymentStatus !== "void" && balanceDue.paise > 0) {
    const dueRupees = toRupees(balanceDue).toFixed(2)
    upiPayload = `upi://pay?pa=tapan.cargo@icici&pn=TAC-XPRESS&am=${dueRupees}&tr=${encodeURIComponent(
      invoice.id
    )}&tn=${encodeURIComponent(`AWB-${shipment.awbNumber}`)}&cu=INR`
  }

  // 7. Assemble Commercial Document
  const commercial: CommercialDocument = {
    invoiceNumber,
    invoiceDate,
    status: paymentStatus,
    supplier: DELHI_CENTRAL_HUB,
    billTo,
    charges: taxEngineResult.lines,
    taxDecision: taxEngineResult.decision,
    taxAudit: taxEngineResult.audit,
    financials: {
      taxableAmount: taxEngineResult.subtotalTaxable,
      totalTax: taxEngineResult.totalTax,
      totalInvoiceValue: totalValue,
      advancePaid,
      balanceDue,
    },
    paymentMode: (invoice.paymentMode || "cash").toUpperCase(),
    amountInWords: formattedWords,
    upiPayload,
  }

  // 8. Assemble Shipment Reference
  const shipmentRef: ShipmentReference = {
    awbNumber: shipment.awbNumber,
    bookingDate,
    serviceMode,
    dispatchFrom: DELHI_CENTRAL_HUB,
    deliverTo,
    destinationHub: MANIPUR_REGIONAL_HUB,
    metrics: {
      pieces: shipment.pieces ?? 1,
      actualWeightKg: weights.actualWeightKg,
      volumetricWeightKg: weights.volumetricWeightKg,
      chargeableWeightKg: weights.chargeableWeightKg,
      weightBasis: weights.weightBasis,
    },
    manifest,
    natureOfGoods: shipment.natureOfGoods || undefined,
    isFragile: shipment.isFragile || false,
  }

  // 9. Assemble Unified Document DTO
  return {
    metadata: {
      documentVersion: "3.0",
      templateVersion: "2026.10",
      taxPolicyVersion: "2026.10",
      termsVersion: "2026.10",
      issuedAt: invoice.createdAt ? new Date(invoice.createdAt).toISOString() : undefined,
    },
    commercial,
    shipment: shipmentRef,
    routing: {
      originHubCode: DELHI_CENTRAL_HUB.code,
      originStateCode: DELHI_CENTRAL_HUB.stateCode,
      originName: "Delhi Central Dispatch Hub",
      destHubCode: MANIPUR_REGIONAL_HUB.code,
      destStateCode: MANIPUR_REGIONAL_HUB.stateCode,
      destName: "Manipur Regional Hub & Station",
      isInterstate: taxEngineResult.decision.supplyType === "interstate",
    },
    verification: {
      trackingUrl: `${origin}/track?awb=${encodeURIComponent(shipment.awbNumber)}`,
      verificationUrl: `${origin}/invoice/${encodeURIComponent(invoice.id)}?v=${encodeURIComponent(
        verificationToken
      )}`,
      verificationToken,
    },
  }
}
