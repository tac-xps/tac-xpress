import { beforeEach, describe, expect, it, vi } from "vitest"
import InvoicePrintPage from "@/app/invoice/[id]/page"
import ShippingLabelPage from "@/app/invoice/[id]/label/page"
import { GET as getTrackingStream } from "@/app/api/stream/tracking/route"
import { NextRequest } from "next/server"

const { allowDocument, findInvoice, findShipment, allowStream } = vi.hoisted(
  () => ({
    allowDocument: vi.fn(),
    findInvoice: vi.fn(),
    findShipment: vi.fn(),
    allowStream: vi.fn(),
  })
)

vi.mock("@/lib/auth/page-access", () => ({
  requireDocumentPage: allowDocument,
}))
vi.mock("@/lib/auth/guards", () => ({
  requireDashboardApi: allowStream,
}))
vi.mock("@/lib/db", () => ({
  db: {
    query: {
      invoices: { findFirst: findInvoice },
      shipments: { findFirst: findShipment },
    },
  },
}))
vi.mock("@sentry/nextjs", () => ({}))
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("not found") },
}))
vi.mock("@/components/documents/shipping-label", () => ({
  ShippingLabel: () => null,
}))
vi.mock("@/app/invoice/[id]/print-button", () => ({
  PrintButton: () => null,
}))
vi.mock("@/app/invoice/[id]/invoice-view", () => ({
  InvoiceView: () => null,
}))

const route = (id: string) => ({ params: Promise.resolve({ id }) })

describe("document and tracking route identifiers", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    allowStream.mockResolvedValue({ ok: true, session: { user: { role: "staff" } } })
  })

  it("matches a label AWB against the text column only", async () => {
    findShipment.mockResolvedValue({ deletedAt: null })

    await expect(ShippingLabelPage(route("AWB-12345"))).resolves.toBeTruthy()
    expect(allowDocument).toHaveBeenCalledWith("AWB-12345")
    expect(findInvoice).not.toHaveBeenCalled()
    const [{ where }] = findShipment.mock.calls[0]
    const eq = vi.fn()
    where({ id: "uuid", awbNumber: "awb", deletedAt: "deleted" }, {
      eq, or: vi.fn(), and: vi.fn(), isNull: vi.fn(),
    })
    expect(eq).toHaveBeenCalledExactlyOnceWith("awb", "AWB-12345")
  })

  it("still checks the invoice first for a UUID label", async () => {
    const id = "11111111-1111-4111-8111-111111111111"
    findInvoice.mockResolvedValue({ shipment: { deletedAt: null } })
    await expect(ShippingLabelPage(route(id))).resolves.toBeTruthy()
    expect(allowDocument).toHaveBeenCalledWith(id)
    expect(findInvoice).toHaveBeenCalledOnce()
    expect(findShipment).not.toHaveBeenCalled()
  })

  it("keeps deleted shipments out of the label view", async () => {
    findShipment.mockResolvedValue({ deletedAt: new Date() })
    await expect(ShippingLabelPage(route("AWB-12345"))).rejects.toThrow("not found")
  })

  it("rejects an invalid invoice identifier before querying invoices", async () => {
    await expect(InvoicePrintPage(route("not-an-invoice"))).rejects.toThrow("not found")
    expect(allowDocument).toHaveBeenCalledWith("not-an-invoice")
    expect(findInvoice).not.toHaveBeenCalled()
  })

  it("returns a validation error for an invalid tracking identifier", async () => {
    const response = await getTrackingStream(new NextRequest(
      "https://quality.invalid/api/stream/tracking?shipmentId=not-a-shipment"
    ))
    expect(response.status).toBe(400)
    expect(allowStream).toHaveBeenCalledOnce()
    expect(findShipment).not.toHaveBeenCalled()
  })
})
