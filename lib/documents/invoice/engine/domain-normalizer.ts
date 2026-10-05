import { format } from "date-fns"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { getAppUrl } from "@/lib/config/app-url"
import { money, toRupees, subtractMoney, zeroMoney } from "../domain/money"
import {
  DELHI_CENTRAL_HUB,
  MANIPUR_REGIONAL_HUB,
  SAC_CLASSIFICATIONS,
  INDIAN_STATE_CODES,
  getStateCode,
} from "../domain/master-data"

/**
 * Resolves Indian State and GST State Code from a 6-digit postal PIN code.
 */
export function getStateFromPinCode(pinCode?: string | null): { state: string; stateCode: string } | undefined {
  if (!pinCode || !/^\d{6}$/.test(pinCode.trim())) return undefined
  const pin = pinCode.trim()
  const p2 = pin.substring(0, 2)
  const p3 = pin.substring(0, 3)

  if (p3 === "795") return { state: "Manipur", stateCode: "14" }
  if (p3 === "796") return { state: "Mizoram", stateCode: "15" }
  if (p3 === "797") return { state: "Nagaland", stateCode: "13" }
  if (p3 === "798") return { state: "Tripura", stateCode: "16" }
  if (p3 === "793" || p3 === "794") return { state: "Meghalaya", stateCode: "17" }
  if (p3 >= "790" && p3 <= "792") return { state: "Arunachal Pradesh", stateCode: "12" }
  if (p2 === "78") return { state: "Assam", stateCode: "18" }
  if (p2 === "11") return { state: "Delhi", stateCode: "07" }
  if (p2 === "12" || p2 === "13") return { state: "Haryana", stateCode: "06" }
  if (p2 >= "14" && p2 <= "16") return { state: "Punjab", stateCode: "03" }
  if (p2 === "17") return { state: "Himachal Pradesh", stateCode: "02" }
  if (p2 === "18" || p2 === "19") return { state: "Jammu and Kashmir", stateCode: "01" }
  if (p2 >= "20" && p2 <= "28") return { state: "Uttar Pradesh", stateCode: "09" }
  if (p2 >= "30" && p2 <= "34") return { state: "Rajasthan", stateCode: "08" }
  if (p2 >= "36" && p2 <= "39") return { state: "Gujarat", stateCode: "24" }
  if (p2 >= "40" && p2 <= "44") return { state: "Maharashtra", stateCode: "27" }
  if (p2 >= "45" && p2 <= "48") return { state: "Madhya Pradesh", stateCode: "23" }
  if (p2 === "49") return { state: "Chhattisgarh", stateCode: "22" }
  if (p2 === "50") return { state: "Telangana", stateCode: "36" }
  if (p2 >= "51" && p2 <= "53") return { state: "Andhra Pradesh", stateCode: "37" }
  if (p2 >= "56" && p2 <= "59") return { state: "Karnataka", stateCode: "29" }
  if (p2 >= "60" && p2 <= "64") return { state: "Tamil Nadu", stateCode: "33" }
  if (p2 >= "67" && p2 <= "69") return { state: "Kerala", stateCode: "32" }
  if (p2 >= "70" && p2 <= "74") return { state: "West Bengal", stateCode: "19" }
  if (p2 >= "75" && p2 <= "77") return { state: "Odisha", stateCode: "21" }
  if (p2 >= "80" && p2 <= "85") return { state: "Bihar", stateCode: "10" }

  return undefined
}
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

/** Base64 encode ASCII input in both Node and browser runtimes. */
function toBase64(value: string): string {
  if (typeof Buffer !== "undefined") return Buffer.from(value).toString("base64")
  return btoa(value)
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
      if (options.appOrigin) {
        return {
          ...snapshot,
          verification: {
            ...snapshot.verification,
            trackingUrl: `${options.appOrigin}/track?awb=${encodeURIComponent(snapshot.shipment.awbNumber)}`,
            verificationUrl: `${options.appOrigin}/invoice/${encodeURIComponent(invoice.id)}?v=${encodeURIComponent(
              snapshot.verification.verificationToken
            )}`,
          },
        }
      }
      return snapshot
    }
  }

  let origin = options.appOrigin
  if (!origin) {
    try {
      origin = getAppUrl()
    } catch {
      origin = "https://tacservice.in"
    }
  }
  const verificationToken =
    options.verificationToken ||
    toBase64(`${invoice.id}-${shipment.awbNumber}`).substring(0, 16)

  // 1. Format Dates
  const invoiceDate = invoice.createdAt
    ? format(new Date(invoice.createdAt), "dd MMM yyyy")
    : format(new Date(), "dd MMM yyyy")
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

  const rawShipment = shipment as any
  let destState: string | undefined = rawShipment.destinationState?.trim()
  let destStateCode: string | undefined

  if (destState) {
    destStateCode = getStateCode(destState)
  }

  if (!destState && shipment.destination) {
    const matchedCode = getStateCode(shipment.destination)
    if (matchedCode) {
      destState = shipment.destination.trim()
      destStateCode = matchedCode
    }
  }

  if (!destState && shipment.consigneeAddress) {
    const lowerAddr = shipment.consigneeAddress.toLowerCase()
    for (const [stateName, code] of Object.entries(INDIAN_STATE_CODES)) {
      if (lowerAddr.includes(stateName)) {
        destState = stateName.charAt(0).toUpperCase() + stateName.slice(1)
        destStateCode = code
        break
      }
    }
  }

  if (!destState && shipment.consigneePinCode) {
    const pinMatch = getStateFromPinCode(shipment.consigneePinCode)
    if (pinMatch) {
      destState = pinMatch.state
      destStateCode = pinMatch.stateCode
    }
  }

  // Intrastate reconciliation: If invoice was persisted with CGST/SGST and 0 IGST,
  // the supply was strictly intrastate within Delhi.
  const isPersistedIntrastate =
    (invoice.igst ?? 0) === 0 && ((invoice.cgst ?? 0) > 0 || (invoice.sgst ?? 0) > 0)

  if (!destState && isPersistedIntrastate) {
    destState = "Delhi"
    destStateCode = "07"
  }

  const resolvedState = destState || "Manipur"
  const resolvedStateCode = destStateCode || getStateCode(resolvedState) || (shipment.consigneePinCode?.startsWith("795") ? "14" : "14")

  const deliverTo: PartyInfo = {
    name: shipment.consigneeName || "Consignee On Record",
    addressLine: shipment.consigneeAddress || "Delivery Address On File",
    city: shipment.destination || "Imphal",
    state: resolvedState,
    stateCode: resolvedStateCode,
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

  // Preserve zero-tax classification for stored invoices without GST
  const gstRate =
    invoice.gstRate !== null && invoice.gstRate !== undefined
      ? invoice.gstRate
      : (invoice.cgst ?? 0) === 0 && (invoice.sgst ?? 0) === 0 && (invoice.igst ?? 0) === 0
      ? 0
      : 18

  const ancillaryPaise =
    (invoice.pickupCharge ?? 0) +
    (invoice.packingCharge ?? 0) +
    (invoice.docketCharge ?? 0) +
    (invoice.insuranceCharge ?? 0) +
    (invoice.otherCharges ?? 0)

  // Taxable base: stored subtotal, else back out GST from the gross amount.
  const taxableBasePaise =
    invoice.subtotal && invoice.subtotal > 0
      ? invoice.subtotal
      : invoice.amount && invoice.amount > 0
      ? Math.round((invoice.amount * 100) / (100 + gstRate))
      : 0

  // Freight is the explicit charge, else the residual after ancillary charges.
  // Never substitute the full subtotal: it already contains ancillary charges.
  const freightAmountPaise =
    invoice.freightCharge && invoice.freightCharge > 0
      ? invoice.freightCharge
      : Math.max(0, taxableBasePaise - ancillaryPaise)

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

  // Place of supply follows the persisted classification (lib/invoices/persistence:
  // interstate === igst > 0). Intrastate rows store CGST/SGST with zero IGST.
  const persistedIntrastate =
    (invoice.igst ?? 0) === 0 && ((invoice.cgst ?? 0) > 0 || (invoice.sgst ?? 0) > 0)
  const placeOfSupplyStateCode = persistedIntrastate
    ? DELHI_CENTRAL_HUB.stateCode
    : deliverTo.stateCode || "14"

  const taxEngineResult = calculateInvoiceTaxes({
    supplierStateCode: DELHI_CENTRAL_HUB.stateCode,
    supplierGSTIN: DELHI_CENTRAL_HUB.gstin,
    recipientStateCode: deliverTo.stateCode || "14",
    placeOfSupplyStateCode,
    rawChargeLines,
    defaultGstRate: gstRate,
  })

  // 6. Payment Financials Reconciliation
  const advancePaid = money(invoice.advancePaid)
  const totalValue = taxEngineResult.totalInvoiceValue
  const balanceDue =
    advancePaid.paise >= totalValue.paise
      ? zeroMoney()
      : subtractMoney(totalValue, advancePaid, false)

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
