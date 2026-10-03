/**
 * Master Data Definitions & Tax Policies for TAC-XPRESS Invoicing.
 *
 * Provides versioned and effective-dated classifications for:
 * - Hub Master Data (Delhi Origin, Manipur Kakwa Destination)
 * - Service Accounting Codes (SAC)
 * - GST Tax Policies & Place of Supply Rules
 */

export interface HubMasterData {
  id: string
  code: string
  name: string
  legalName: string
  brandName: string
  addressLine1: string
  addressLine2: string
  area: string
  city: string
  state: string
  stateCode: string
  pinCode: string
  country: string
  phone: string
  email: string
  gstin?: string
  pan?: string
  effectiveFrom: string
  effectiveTo?: string
}

export interface TaxPolicy {
  policyId: string
  serviceClassificationCode: string
  name: string
  gstRate: number
  taxComponents: {
    igst: boolean
    cgst: boolean
    sgst: boolean
  }
  reverseChargeApplicable: boolean
  placeOfSupplyRule: "B2B_RECIPIENT_LOCATION" | "B2C_HANDOVER_LOCATION"
  effectiveFrom: string
  effectiveTo?: string
  sourceReference?: string
}

export interface ServiceClassification {
  code: string
  label: string
  category: "freight" | "handling" | "insurance" | "packaging" | "terminal"
  defaultPolicyId: string
}

/**
 * Origin Hub / Central Dispatch Terminal: Delhi
 * Official Address: 1498, Wazir Nagar, Gali No 3, Kotla Mubarakpur, Delhi-110003
 */
export const DELHI_CENTRAL_HUB: HubMasterData = {
  id: "hub_del_central",
  code: "DEL",
  name: "TAC-XPRESS Central Dispatch Hub (Delhi)",
  legalName: "TAPAN ASSOCIATES CARGO SERVICE",
  brandName: "TAC-XPRESS",
  addressLine1: "1498, Wazir Nagar, Gali No 3",
  addressLine2: "Kotla Mubarakpur",
  area: "South Delhi",
  city: "New Delhi",
  state: "Delhi",
  stateCode: "07",
  pinCode: "110003",
  country: "India",
  phone: "+91 11 4982 3000",
  email: "delhi.hub@tacservice.in",
  gstin: "07AAMFT6165B1Z3",
  pan: "AAMFT6165B",
  effectiveFrom: "2024-01-01",
}

/**
 * Destination Hub & Regional Delivery Station: Manipur
 * Official Address: Singjamei Top Leikai, Kakwa, Imphal-795003, Manipur
 */
export const MANIPUR_REGIONAL_HUB: HubMasterData = {
  id: "hub_sjm_kakwa",
  code: "SJM",
  name: "TAC-XPRESS Manipur Regional Hub & Delivery Station",
  legalName: "TAPAN ASSOCIATES CARGO SERVICE (MANIPUR BRANCH)",
  brandName: "TAC-XPRESS",
  addressLine1: "Singjamei Top Leikai",
  addressLine2: "Kakwa",
  area: "Kakwa / Singjamei",
  city: "Imphal",
  state: "Manipur",
  stateCode: "14",
  pinCode: "795003",
  country: "India",
  phone: "+91 98620 12345",
  email: "imphal.hub@tacservice.in",
  effectiveFrom: "2024-01-01",
}

/**
 * Service Accounting Code (SAC) Classifications
 */
export const SAC_CLASSIFICATIONS: Record<string, ServiceClassification> = {
  AIR_FREIGHT: {
    code: "996512",
    label: "Scheduled Express Air Cargo Linehaul",
    category: "freight",
    defaultPolicyId: "POL_GST_18",
  },
  SURFACE_FREIGHT: {
    code: "996511",
    label: "Scheduled Surface Road Linehaul Freight",
    category: "freight",
    defaultPolicyId: "POL_GST_18",
  },
  HANDLING_DOCKET: {
    code: "996519",
    label: "Consignment Handling & Terminal Operations",
    category: "handling",
    defaultPolicyId: "POL_GST_18",
  },
  TRANSIT_INSURANCE: {
    code: "997139",
    label: "Transit Risk Protection & Cargo Insurance",
    category: "insurance",
    defaultPolicyId: "POL_GST_18",
  },
  PACKAGING: {
    code: "998540",
    label: "Protective Packaging & Secure Strapping",
    category: "packaging",
    defaultPolicyId: "POL_GST_18",
  },
}

/**
 * Default Tax Policy Definitions
 */
export const TAX_POLICIES: Record<string, TaxPolicy> = {
  POL_GST_18: {
    policyId: "POL_GST_18",
    serviceClassificationCode: "996511",
    name: "Goods Transportation Agency (GTA) Standard GST 18%",
    gstRate: 18,
    taxComponents: { igst: true, cgst: false, sgst: false },
    reverseChargeApplicable: false,
    placeOfSupplyRule: "B2B_RECIPIENT_LOCATION",
    effectiveFrom: "2024-01-01",
    sourceReference: "Notification No. 11/2017 - Integrated Tax (Rate)",
  },
  POL_GST_18_INTER: {
    policyId: "POL_GST_18_INTER",
    serviceClassificationCode: "996511",
    name: "Goods Transportation Agency (GTA) Interstate IGST 18%",
    gstRate: 18,
    taxComponents: { igst: true, cgst: false, sgst: false },
    reverseChargeApplicable: false,
    placeOfSupplyRule: "B2B_RECIPIENT_LOCATION",
    effectiveFrom: "2024-01-01",
    sourceReference: "Notification No. 11/2017 - Integrated Tax (Rate)",
  },
  POL_GST_18_INTRA: {
    policyId: "POL_GST_18_INTRA",
    serviceClassificationCode: "996511",
    name: "Goods Transportation Agency (GTA) Intrastate CGST 9% + SGST 9%",
    gstRate: 18,
    taxComponents: { igst: false, cgst: true, sgst: true },
    reverseChargeApplicable: false,
    placeOfSupplyRule: "B2B_RECIPIENT_LOCATION",
    effectiveFrom: "2024-01-01",
    sourceReference: "Notification No. 11/2017 - Central Tax (Rate)",
  },
}

/**
 * Standard 2-digit Indian GST State / Union Territory Codes.
 */
export const INDIAN_STATE_CODES: Record<string, string> = {
  "jammu and kashmir": "01",
  "himachal pradesh": "02",
  punjab: "03",
  chandigarh: "04",
  uttarakhand: "05",
  haryana: "06",
  delhi: "07",
  rajasthan: "08",
  "uttar pradesh": "09",
  bihar: "10",
  sikkim: "11",
  "arunachal pradesh": "12",
  nagaland: "13",
  manipur: "14",
  mizoram: "15",
  tripura: "16",
  meghalaya: "17",
  assam: "18",
  "west bengal": "19",
  jharkhand: "20",
  odisha: "21",
  chhattisgarh: "22",
  "madhya pradesh": "23",
  gujarat: "24",
  "dadra and nagar haveli and daman and diu": "26",
  maharashtra: "27",
  karnataka: "29",
  goa: "30",
  lakshadweep: "31",
  kerala: "32",
  "tamil nadu": "33",
  puducherry: "34",
  "andaman and nicobar islands": "35",
  telangana: "36",
  "andhra pradesh": "37",
  ladakh: "38",
}

/**
 * Resolves the 2-digit GST state code for a given state name or code.
 */
export function getStateCode(stateNameOrCode?: string | null): string | undefined {
  if (!stateNameOrCode || !stateNameOrCode.trim()) return undefined
  const cleaned = stateNameOrCode.trim().toLowerCase()
  if (/^\d{2}$/.test(cleaned)) return cleaned
  return INDIAN_STATE_CODES[cleaned]
}

