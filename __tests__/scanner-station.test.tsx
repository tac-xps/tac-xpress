// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"

vi.mock("server-only", () => ({}))

vi.mock("@/app/actions/scanner-actions", () => ({
  getScannedShipmentDetails: vi.fn(),
  updateScannedShipmentStatus: vi.fn(),
}))

vi.mock("@/app/dashboard/shipments/actions", () => ({
  createTrackingEventAction: vi.fn(),
}))

vi.mock("@/components/scanner/scanner-provider", () => ({
  useScannerContext: () => ({ setOverrideHandler: vi.fn() }),
  triggerScanHaptic: vi.fn(),
}))

import { ScannerStation } from "@/components/operations/scanner-station"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  )
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("ScannerStation 2-Section Layout", () => {
  it("renders both the search terminal and the tracking result update panel", async () => {
    await act(async () => {
      root.render(<ScannerStation initialAwb="" />)
    })

    // Section 1: Search Terminal
    expect(container.textContent).toContain("Shipment search & barcode terminal")
    expect(container.textContent).toContain("AWB or shipment ID")
    expect(container.textContent).toContain("Quick references:")
    expect(container.textContent).toContain("Scanner station ready")

    // Section 2: Update Tracking Result Panel
    expect(container.textContent).toContain("Update tracking result")
    expect(container.textContent).toContain("Awaiting shipment scan")
    expect(container.textContent).toContain("Standard workflow:")
  })
})

