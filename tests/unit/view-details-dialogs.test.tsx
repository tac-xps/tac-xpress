// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { getShipmentDetailsSchema } from "@/app/dashboard/shipments/schemas"
import { ShipmentDetailDialog } from "@/app/dashboard/shipments/shipment-detail-dialog"
import { JobDetailDialog } from "@/app/dashboard/jobs/job-detail-dialog"
import { CustomerLedgerDialog } from "@/app/dashboard/customers/customer-ledger-dialog"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// Mock server-only and actions for JSDOM test runner
vi.mock("server-only", () => ({}))
vi.mock("@/auth", () => ({ auth: vi.fn() }))
vi.mock("@/auth.config", () => ({ authConfig: {} }))
vi.mock("@/app/dashboard/shipments/actions", () => ({
  getShipmentDetailsAction: vi.fn(),
}))
vi.mock("@/app/dashboard/customers/actions", () => ({
  getCustomerLedgerAction: vi.fn(),
}))

// Mock next-safe-action hook
vi.mock("next-safe-action/hooks", () => ({
  useAction: () => ({
    execute: vi.fn(),
    isExecuting: false,
  }),
}))

// Mock CargoDocuments
vi.mock("@/components/documents/cargo-documents", () => ({
  CargoDocuments: () => <div data-testid="cargo-documents">Cargo Documents Vault</div>,
}))

describe("getShipmentDetailsSchema", () => {
  it("validates when an ID is provided", () => {
    const valid = getShipmentDetailsSchema.safeParse({
      id: "a7d9e295-7dba-4d4a-916c-9167401f2f03",
    })
    expect(valid.success).toBe(true)
  })

  it("validates when an AWB number is provided", () => {
    const valid = getShipmentDetailsSchema.safeParse({
      awbNumber: "TAC-20261005-001",
    })
    expect(valid.success).toBe(true)
  })

  it("rejects when neither ID nor AWB number is provided", () => {
    const invalid = getShipmentDetailsSchema.safeParse({})
    expect(invalid.success).toBe(false)
  })
})

describe("ShipmentDetailDialog Component", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it("renders shipment details dialog when open with initial data", () => {
    const mockShipment = {
      id: "a7d9e295-7dba-4d4a-916c-9167401f2f03",
      awbNumber: "TAC-20261005-001",
      origin: "DEL",
      destination: "BOM",
      serviceType: "express_air",
      status: "in-transit",
      weightKg: 25.5,
      chargedWeightKg: 30,
      pieces: 2,
      consignorName: "Acme Logistics",
      consignorPhone: "+91 98765 43210",
      consignorAddress: "Aerocity, New Delhi",
      consigneeName: "Best Cargo Co",
      consigneePhone: "+91 91234 56789",
      consigneeAddress: "Andheri East, Mumbai",
      trackingEvents: [],
      manifestItems: [],
    }

    act(() => {
      root.render(
        <ShipmentDetailDialog
          open={true}
          onOpenChange={vi.fn()}
          initialData={mockShipment}
        />
      )
    })

    const dialog = document.querySelector('[data-slot="shipment-detail-dialog"]')
    expect(dialog).not.toBeNull()
    const closeBtn = document.querySelector('[data-slot="dialog-close"]')
    expect(closeBtn).not.toBeNull()
    expect(document.body.textContent).toContain("TAC-20261005-001")
    expect(document.body.textContent).toContain("DEL → BOM")
    expect(document.body.textContent).toContain("Acme Logistics")
    expect(document.body.textContent).toContain("Best Cargo Co")
  })
})

describe("JobDetailDialog Component", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it("renders failed job error output and payload", () => {
    const mockJob = {
      id: "job-12345",
      kind: "sync_manifest_telemetry",
      dedupeKey: "telemetry-manifest-99",
      status: "failed",
      attempts: 3,
      availableAt: new Date("2026-10-06T12:00:00Z"),
      completedAt: null,
      lockedUntil: null,
      leaseToken: null,
      lastError: "Connection timeout while contacting GPS telemetry provider",
      payload: { manifestId: "manifest-99", provider: "teltonika" },
      createdAt: new Date("2026-10-06T12:00:00Z"),
    }

    act(() => {
      root.render(
        <JobDetailDialog
          open={true}
          onOpenChange={vi.fn()}
          job={mockJob}
        />
      )
    })

    const dialog = document.querySelector('[data-slot="job-detail-dialog"]')
    expect(dialog).not.toBeNull()
    expect(document.body.textContent).toContain("Failed Job: sync_manifest_telemetry")
    expect(document.body.textContent).toContain("Connection timeout while contacting GPS telemetry provider")
    expect(document.body.textContent).toContain("teltonika")
  })
})

describe("CustomerLedgerDialog Component", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it("renders ledger dialog and displays recent subset indicator when total exceeds shown count", () => {
    const mockLedgerData = {
      customer: {
        id: "c-123",
        name: "Acme Industrial Corp",
        email: "billing@acme.test",
        phone: "+91 98765 00000",
      },
      invoices: [
        {
          id: "inv-1",
          amount: 50000,
          advancePaid: 20000,
          balanceDue: 30000,
          status: "pending",
          createdAt: new Date("2026-10-06"),
          awbNumber: "TAC-20261005-001",
        },
      ],
      totals: {
        totalBilled: 5000000,
        totalAdvance: 2000000,
        totalDue: 3000000,
        totalCount: 75,
      },
    }

    act(() => {
      root.render(
        <CustomerLedgerDialog
          open={true}
          customerId="c-123"
          customerName="Acme Industrial Corp"
          onOpenChange={vi.fn()}
          initialData={mockLedgerData}
        />
      )
    })

    const dialog = document.querySelector('[data-slot="customer-ledger-dialog"]')
    expect(dialog).not.toBeNull()
    expect(document.body.textContent).toContain("Showing 1 most recent of 75 invoices")
    expect(document.body.textContent).toContain("Displaying the 50 most recent invoices")
    expect(document.body.textContent).toContain("Acme Industrial Corp")
  })
})
