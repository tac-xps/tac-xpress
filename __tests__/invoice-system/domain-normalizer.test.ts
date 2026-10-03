import { describe, it, expect } from "vitest"
import { normalizeInvoiceDomain } from "@/lib/documents/invoice/engine/domain-normalizer"
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
})
