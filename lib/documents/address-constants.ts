/**
 * Canonical Hub & Corporate Address Definitions for TAC-XPRESS.
 *
 * Used consistently across Shipping Labels (4" x 6"), Tax Invoices (A4),
 * Manifests, and PDF generation.
 */

export interface HubAddress {
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
}

/**
 * Origin Hub / Central Dispatch Terminal: Delhi
 * Official Address: 1498, Wazir Nagar, Gali No 3, Kotla Mubarakpur, Delhi-110003
 */
export const DELHI_HUB_ADDRESS: HubAddress = {
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
}

/**
 * Destination Hub & Branch Office: Singjamei / Imphal
 * Official Address: Singjamei Top Leikai, Imphal, Manipur 795008
 */
export const SINGJAMEI_HUB_ADDRESS: HubAddress = {
  code: "SJM",
  name: "TAC-XPRESS Singjamei Delivery Station",
  legalName: "TAPAN ASSOCIATES CARGO SERVICE (MANIPUR BRANCH)",
  brandName: "TAC-XPRESS",
  addressLine1: "Singjamei Top Leikai",
  addressLine2: "Near Supermarket / NH-102 Junction",
  area: "Singjamei",
  city: "Imphal",
  state: "Manipur",
  stateCode: "14",
  pinCode: "795008",
  country: "India",
  phone: "+91 98620 12345",
  email: "imphal.hub@tacservice.in",
}
