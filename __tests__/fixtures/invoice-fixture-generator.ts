import type { Invoice, Shipment } from "@/lib/db/schema"
import { normalizeInvoiceDomain } from "@/lib/documents/invoice/engine/domain-normalizer"
import type { TaxInvoiceDocument } from "@/lib/documents/invoice/domain/types"

export type FixtureScenario =
  | "standard_air_unpaid"
  | "multi_item_surface_partial"
  | "identical_20_items"
  | "extreme_20_unique_items"
  | "pathological_long_text"
  | "zero_balance_paid"
  | "intrastate_delhi"
  | "void_cancelled"

export interface RawInvoiceFixture {
  rawInvoice: Invoice
  rawShipment: Shipment
}

/**
 * Generates raw DB invoice and shipment fixtures for a given scenario.
 */
export function generateRawInvoiceFixture(scenario: FixtureScenario): RawInvoiceFixture {
  const baseShipment: Partial<Shipment> = {
    id: "shipment-test-1",
    awbNumber: "TACX-202610-8842",
    customerId: "cust-1",
    origin: "Delhi",
    destination: "Imphal",
    serviceType: "express_air",
    status: "in-transit",
    weightKg: 12.5,
    pieces: 2,
    dimensionsL: 40,
    dimensionsW: 30,
    dimensionsH: 25,
    consignorName: "Apex Electronics Pvt Ltd",
    consignorCompany: "Apex Tech Hub",
    consignorAddress: "Plot 42, Okhla Industrial Area Phase III",
    consignorPinCode: "110020",
    consignorPhone: "+91 98110 55432",
    consignorEmail: "dispatch@apextech.in",
    consigneeName: "Manipur Tech Diagnostics",
    consigneeAddress: "Near RIMS Gate, Lamphelpat, Imphal West",
    consigneePinCode: "795004",
    consigneePhone: "+91 98620 99887",
    consigneeEmail: "store@manipurtech.com",
    contentDescription: "2 x Medical Diagnostic Monitors (12.5kg)",
    natureOfGoods: "electronics",
    createdAt: new Date("2026-10-02T10:00:00Z"),
    updatedAt: new Date("2026-10-02T10:00:00Z"),
  }

  const baseInvoice: Partial<Invoice> = {
    id: "inv-test-8842-del",
    shipmentId: "shipment-test-1",
    customerId: "cust-1",
    amount: 542800, // 5428.00 INR (542800 paise)
    status: "unpaid",
    freightCharge: 420000,
    pickupCharge: 20000,
    packingCharge: 15000,
    docketCharge: 5000,
    insuranceCharge: 0,
    otherCharges: 0,
    subtotal: 460000,
    gstRate: 18,
    advancePaid: 0,
    balanceDue: 542800,
    paymentMode: "cash",
    createdAt: new Date("2026-10-02T10:15:00Z"),
    updatedAt: new Date("2026-10-02T10:15:00Z"),
  }

  switch (scenario) {
    case "multi_item_surface_partial":
      return {
        rawInvoice: {
          ...baseInvoice,
          id: "inv-test-surface-partial",
          status: "unpaid",
          advancePaid: 200000,
          paymentMode: "upi",
        } as Invoice,
        rawShipment: {
          ...baseShipment,
          serviceType: "road_freight",
          weightKg: 28.0,
          pieces: 5,
          dimensionsL: 50,
          dimensionsW: 40,
          dimensionsH: 30,
          contentDescription:
            "1. 2 x Industrial Pumps (12kg)\n2. 1 x Steel Valves (6kg)\n3. 2 pcs Copper Piping (10kg)",
        } as Shipment,
      }

    case "identical_20_items": {
      const repeatedItems = Array(20)
        .fill(null)
        .map((_, i) => `${i + 1}. 1 x Running Shoes Box (1.2kg)`)
        .join("\n")

      return {
        rawInvoice: {
          ...baseInvoice,
          id: "inv-test-identical-20",
          status: "paid",
          advancePaid: 542800,
        } as Invoice,
        rawShipment: {
          ...baseShipment,
          pieces: 20,
          weightKg: 24.0,
          contentDescription: repeatedItems,
        } as Shipment,
      }
    }

    case "extreme_20_unique_items": {
      const uniqueItems = Array(20)
        .fill(null)
        .map((_, i) => `${i + 1}. Hardware Part SKU-${1000 + i} Type-${String.fromCharCode(65 + (i % 26))} (1.5kg)`)
        .join("\n")

      return {
        rawInvoice: {
          ...baseInvoice,
          id: "inv-test-extreme-20-unique",
          status: "paid",
          advancePaid: 542800,
        } as Invoice,
        rawShipment: {
          ...baseShipment,
          pieces: 20,
          weightKg: 30.0,
          contentDescription: uniqueItems,
        } as Shipment,
      }
    }

    case "pathological_long_text":
      return {
        rawInvoice: {
          ...baseInvoice,
          id: "inv-test-pathological",
        } as Invoice,
        rawShipment: {
          ...baseShipment,
          consignorName:
            "Shri Tapan Kumar Associates Global Freight Solutions & Logistics Logistics Logistics Corporation Ltd",
          consignorAddress:
            "Building 49B, Fourth Cross Street, Near Major Water Tower, Behind Sector 18 Commercial Complex, Near Northern Bypass Junction, New Delhi, India",
          consigneeName:
            "M/s Kangla Engineering & Construction Infrastructure Development Corporation Regional Branch Office",
          consigneeAddress:
            "Building 12, Singjamei Top Leikai Main Highway Road, Opposite Government Boys Secondary High School, Kakwa, Imphal West District, Manipur",
          contentDescription:
            "Specialized high-precision optical laser measuring instruments for geodetic surveying, including tripod mounting brackets, lithium-ion calibration batteries, protective moisture-resistant transport casing, dual-frequency receiver antennas, and technical user manuals for field engineers.",
        } as Shipment,
      }

    case "zero_balance_paid":
      return {
        rawInvoice: {
          ...baseInvoice,
          id: "inv-test-paid-full",
          status: "paid",
          advancePaid: 542800,
          paymentMode: "upi",
        } as Invoice,
        rawShipment: baseShipment as Shipment,
      }

    case "intrastate_delhi":
      return {
        rawInvoice: {
          ...baseInvoice,
          id: "inv-test-intrastate",
        } as Invoice,
        rawShipment: {
          ...baseShipment,
          destination: "Delhi",
          consigneeAddress: "Connaught Place, Central Delhi",
          consigneePinCode: "110001",
        } as Shipment,
      }

    case "void_cancelled":
      return {
        rawInvoice: {
          ...baseInvoice,
          id: "inv-test-void",
          status: "void",
        } as Invoice,
        rawShipment: baseShipment as Shipment,
      }

    case "standard_air_unpaid":
    default:
      return {
        rawInvoice: baseInvoice as Invoice,
        rawShipment: baseShipment as Shipment,
      }
  }
}

/**
 * Automated Stress-Test Invoice Fixture Generator.
 * Creates deterministic mock invoices covering edge cases, large manifest lists,
 * and pathological inputs.
 */
export function generateTestInvoice(scenario: FixtureScenario): TaxInvoiceDocument {
  const { rawInvoice, rawShipment } = generateRawInvoiceFixture(scenario)
  return normalizeInvoiceDomain(rawInvoice, rawShipment)
}
