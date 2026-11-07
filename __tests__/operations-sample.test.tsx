import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

const mocks = vi.hoisted(() => ({ findMany: vi.fn(), requireStaff: vi.fn() }))
vi.mock("@/lib/db", () => ({ db: { query: { shipments: { findMany: mocks.findMany } } } }))
vi.mock("@/lib/auth/page-access", () => ({ requireStaffPage: mocks.requireStaff }))
vi.mock("@/components/operations/shipment-bar-interactive", () => ({ ShipmentBarInteractive: () => null }))
vi.mock("@/app/dashboard/shipments/shipment-data-table", () => ({
  ShipmentsDataTable: ({ data, bordered }: { data: unknown[]; bordered: boolean }) => (
    <p>Table rows: {data.length}. Own surface: {String(bordered)}.</p>
  ),
}))

import AirCargoPage from "@/app/dashboard/operations/air-cargo/page"
import SurfaceCargoPage from "@/app/dashboard/operations/surface-cargo/page"

beforeEach(() => {
  vi.resetAllMocks()
  mocks.findMany.mockResolvedValue([
    { id: "synthetic-transit", status: "in-transit", slaAtRisk: true },
    { id: "synthetic-delivered", status: "delivered", slaAtRisk: false },
    { id: "synthetic-pending", status: "pending", slaAtRisk: false },
  ])
})

describe("bounded operations summaries", () => {
  it.each([
    ["air", AirCargoPage],
    ["surface", SurfaceCargoPage],
  ] as const)("discloses the %s sample and keeps risk separate from status", async (mode, Page) => {
    const markup = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({}) }))
    expect(mocks.requireStaff).toHaveBeenCalledOnce()
    expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ limit: 100, with: { invoice: true } }))
    expect(markup).toContain(`latest up to 100 ${mode} shipments, including completed shipments`)
    expect(markup).toContain("Other statuses: 1 (33%)")
    expect(markup).toContain("At-risk flags can overlap any status")
    expect(markup).toContain("Own surface: false")
    expect(markup).not.toContain("active cargo consignments")
    expect(markup).not.toContain("Total active bookings in network")
    if (mode === "surface") expect(markup).not.toContain("air cargo consignments")
  })
})
