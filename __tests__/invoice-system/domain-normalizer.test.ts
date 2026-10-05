import { describe, it, expect } from "vitest"
import {
  normalizeInvoiceDomain,
  getStateFromPinCode,
} from "@/lib/documents/invoice/engine/domain-normalizer"
import { generateRawInvoiceFixture } from "../fixtures/invoice-fixture-generator"
import { calculateDocumentLayoutBudget } from "@/lib/documents/invoice/engine/layout-engine"

describe("Domain Normalizer", () => {
  it("normalizes a standard single-item shipment correctly", () => {
    const { rawInvoice, rawShipment } = generateRawInvoiceFixture("standard_air_unpaid")
    const doc = normalizeInvoiceDomain(rawInvoice, rawShipment)

    expect(doc.commercial.invoiceNumber).toMatch(/^TAC-INV-/)
    expect(doc.shipment.awbNumber).toBe(rawShipment.awbNumber)
    expect(doc.routing.originStateCode).toBe("07")
    expect(doc.routing.destStateCode).toBe("14")
    expect(doc.routing.isInterstate).toBe(true)
    expect(doc.shipment.destinationHub.name).toContain("Manipur Regional Hub")
    expect(doc.shipment.destinationHub.addressLine1).toBe("Singjamei Top Leikai")
    expect(doc.shipment.destinationHub.addressLine2).toBe("Kakwa")
    expect(doc.shipment.destinationHub.pinCode).toBe("795003")
    expect(doc.commercial.financials.balanceDue.paise).toBe(
      doc.commercial.financials.totalInvoiceValue.paise - doc.commercial.financials.advancePaid.paise
    )
  })

  it("handles identical item aggregation for multi-item shipments", () => {
    const { rawInvoice, rawShipment } = generateRawInvoiceFixture("identical_20_items")
    const doc = normalizeInvoiceDomain(rawInvoice, rawShipment)

    // Identical items aggregated into a clean single line item
    expect(doc.shipment.manifest.length).toBe(1)
    expect(doc.shipment.manifest[0].quantity).toBe(20)
    expect(doc.shipment.manifest[0].description).toContain("Running Shoes Box")
  })

  it("triggers continuation page when unique packages exceed the Page 1 budget", () => {
    const { rawInvoice, rawShipment } = generateRawInvoiceFixture("extreme_20_unique_items")
    const doc = normalizeInvoiceDomain(rawInvoice, rawShipment)
    const budget = calculateDocumentLayoutBudget(doc)

    expect(doc.shipment.manifest.length).toBeGreaterThan(15)
    expect(budget.requiresContinuationPage).toBe(true)
    expect(budget.pageCount).toBe(2)
    expect(budget.visiblePage1ManifestLimit).toBe(3)
  })

  it("honors immutable documentSnapshot if already stored on invoice", () => {
    const { rawInvoice, rawShipment } = generateRawInvoiceFixture("standard_air_unpaid")
    const preGeneratedDoc = normalizeInvoiceDomain(rawInvoice, rawShipment)
    
    // Mutate raw invoice with the snapshot
    const invoiceWithSnapshot = {
      ...rawInvoice,
      documentSnapshot: preGeneratedDoc,
    }

    const doc = normalizeInvoiceDomain(invoiceWithSnapshot, rawShipment)
    expect(doc).toEqual(preGeneratedDoc)
  })

  it("reconciles live payment status and void status onto cached documentSnapshot", () => {
    const { rawInvoice, rawShipment } = generateRawInvoiceFixture("standard_air_unpaid")
    const preGeneratedDoc = normalizeInvoiceDomain(rawInvoice, rawShipment)

    // Test void transition
    const voidedInvoice = {
      ...rawInvoice,
      status: "void" as const,
      documentSnapshot: preGeneratedDoc,
    }
    const voidDoc = normalizeInvoiceDomain(voidedInvoice, rawShipment)
    expect(voidDoc.commercial.status).toBe("void")
    expect(voidDoc.commercial.upiPayload).toBeUndefined()

    // Test payment transition
    const paidInvoice = {
      ...rawInvoice,
      status: "paid" as const,
      advancePaid: rawInvoice.amount,
      balanceDue: 0,
      documentSnapshot: preGeneratedDoc,
    }
    const paidDoc = normalizeInvoiceDomain(paidInvoice, rawShipment)
    expect(paidDoc.commercial.status).toBe("paid")
    expect(paidDoc.commercial.financials.balanceDue.paise).toBe(0)
    expect(paidDoc.commercial.financials.advancePaid.paise).toBe(rawInvoice.amount)
  })

  it("resolves Indian states and GST codes accurately from postal PIN codes", () => {
    // Goa vs Maharashtra
    expect(getStateFromPinCode("403001")).toEqual({ state: "Goa", stateCode: "30" })
    expect(getStateFromPinCode("400001")).toEqual({ state: "Maharashtra", stateCode: "27" })

    // Jharkhand vs Bihar
    expect(getStateFromPinCode("834001")).toEqual({ state: "Jharkhand", stateCode: "20" })
    expect(getStateFromPinCode("826001")).toEqual({ state: "Jharkhand", stateCode: "20" })
    expect(getStateFromPinCode("800001")).toEqual({ state: "Bihar", stateCode: "10" })

    // Sikkim, Ladakh, Chandigarh, Uttarakhand, DNH/DD, Puducherry, Lakshadweep
    expect(getStateFromPinCode("737101")).toEqual({ state: "Sikkim", stateCode: "11" })
    expect(getStateFromPinCode("194101")).toEqual({ state: "Ladakh", stateCode: "38" })
    expect(getStateFromPinCode("160001")).toEqual({ state: "Chandigarh", stateCode: "04" })
    expect(getStateFromPinCode("248001")).toEqual({ state: "Uttarakhand", stateCode: "05" })
    expect(getStateFromPinCode("396210")).toEqual({
      state: "Dadra and Nagar Haveli and Daman and Diu",
      stateCode: "26",
    })
    expect(getStateFromPinCode("605001")).toEqual({ state: "Puducherry", stateCode: "34" })
    expect(getStateFromPinCode("682555")).toEqual({ state: "Lakshadweep", stateCode: "31" })
    expect(getStateFromPinCode("744101")).toEqual({
      state: "Andaman and Nicobar Islands",
      stateCode: "35",
    })
  })

  it("prioritizes consignee PIN code over address text when resolving destination", () => {
    const { rawInvoice, rawShipment } = generateRawInvoiceFixture("standard_air_unpaid")
    const shipmentWithAmbiguousAddress = {
      ...rawShipment,
      consigneePinCode: "834001", // Ranchi, Jharkhand
      consigneeAddress: "Near Delhi Public School, Main Road", // Mentions Delhi
      destination: "Ranchi",
    }

    const doc = normalizeInvoiceDomain(rawInvoice, shipmentWithAmbiguousAddress)
    expect(doc.routing.destStateCode).toBe("20")
    expect(doc.shipment.deliverTo.state).toBe("Jharkhand")
    expect(doc.routing.isInterstate).toBe(true)
  })
})

