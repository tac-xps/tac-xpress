import type { Money } from "./money"
import type { HubMasterData } from "./master-data"

export interface PartyInfo {
  name: string
  company?: string
  addressLine: string
  city?: string
  state?: string
  stateCode?: string
  pinCode?: string
  phone?: string
  altPhone?: string
  email?: string
  gstin?: string
  pan?: string
}

export interface ChargeLine {
  id: string
  classificationCode: string // SAC Code (e.g. 996512)
  label: string
  taxableAmount: Money
  taxRate: number
  taxAmount: Money
  totalAmount: Money
}

export interface TaxDecision {
  supplyType: "interstate" | "intrastate"
  placeOfSupplyStateCode: string
  taxPolicyId: string
  igst: Money
  cgst: Money
  sgst: Money
  effectiveGstRate: number
  reason: string
}

export interface TaxAudit {
  supplierStateCode: string
  recipientStateCode?: string
  placeOfSupplyStateCode: string
  serviceClassificationCode: string
  taxPolicyId: string
  taxableAmount: Money
  calculatedIgst: Money
  calculatedCgst: Money
  calculatedSgst: Money
  roundingAdjustment: Money
  calculatedAt: string
}

export interface ManifestItem {
  id: string
  description: string
  quantity: number
  unit: string
  weightKg?: number
  dimensions?: { l: number; w: number; h: number }
  source: "user_input" | "parser" | "system"
  confidence: "explicit" | "derived"
  confidenceReason?: string
}

export interface CommercialDocument {
  invoiceNumber: string
  invoiceDate: string
  status: "unpaid" | "partially_paid" | "paid" | "void"
  supplier: HubMasterData
  billTo: PartyInfo
  charges: ChargeLine[]
  taxDecision: TaxDecision
  taxAudit: TaxAudit
  financials: {
    taxableAmount: Money
    totalTax: Money
    totalInvoiceValue: Money
    advancePaid: Money
    balanceDue: Money // strictly total - advance
  }
  paymentMode: string
  amountInWords: string
  upiPayload?: string
}

export interface ShipmentReference {
  awbNumber: string // Hero operational identifier
  bookingDate: string
  serviceMode: "express_air" | "surface"
  dispatchFrom: HubMasterData // Delhi Hub
  deliverTo: PartyInfo // Physical Consignee
  destinationHub: HubMasterData // Manipur Regional Hub (Singjamei Top Leikai, Kakwa, Imphal-795003)
  metrics: {
    pieces: number
    actualWeightKg: number
    volumetricWeightKg: number
    chargeableWeightKg: number
    weightBasis: "ACTUAL" | "VOLUMETRIC"
  }
  manifest: ManifestItem[]
  natureOfGoods?: string
  isFragile?: boolean
}

export interface TaxInvoiceDocument {
  metadata: {
    documentVersion: "3.0"
    templateVersion: "2026.10"
    taxPolicyVersion: "2026.10"
    termsVersion: "2026.10"
    issuedAt?: string
  }
  commercial: CommercialDocument
  shipment: ShipmentReference
  routing: {
    originHubCode: string
    originStateCode: string
    originName: string
    destHubCode: string
    destStateCode: string
    destName: string
    isInterstate: boolean
  }
  verification: {
    trackingUrl: string
    verificationUrl: string
    verificationToken: string
  }
}
