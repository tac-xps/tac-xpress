// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"

const state = vi.hoisted(() => ({
  create: vi.fn(),
  refresh: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))
vi.mock("sonner", () => ({
  toast: { success: state.success, error: state.error },
}))
vi.mock("@/app/dashboard/manifests/actions", () => ({
  createManifestAction: state.create,
}))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: state.refresh }),
}))
vi.mock("@/components/scanner/scanner-provider", () => ({
  useScannerContext: () => ({ setOverrideHandler: vi.fn() }),
}))
import { useCreateManifestForm } from "@/app/dashboard/manifests/use-create-manifest-form"
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root
let container: HTMLDivElement
const closed = vi.fn()
const values = {
  originHubId: "origin",
  destinationHubId: "destination",
  vehicleId: "vehicle",
  driverId: "driver",
  shipmentIds: ["shipment"],
}
function Harness() {
  const { onSubmit } = useCreateManifestForm([], closed)
  return <button type="button" onClick={() => void onSubmit(values)}>Submit</button>
}
const submit = () => container.querySelector("button")?.click()
beforeEach(async () => {
  vi.clearAllMocks()
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  await act(async () => root.render(<Harness />))
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
})
it("keeps the manifest dialog open and exposes transactional failures", async () => {
  state.create.mockResolvedValueOnce({
    data: { success: false, error: "Shipment already assigned" },
  })
  await act(async () => submit())
  expect(state.error).toHaveBeenCalledWith("Shipment already assigned")
  expect(state.success).not.toHaveBeenCalled()
  expect(closed).not.toHaveBeenCalled()
})
it("closes the dialog only after a committed manifest", async () => {
  state.create.mockResolvedValueOnce({ data: { success: true, whatsAppDispatched: false } })
  await act(async () => submit())
  expect(state.success).toHaveBeenCalledWith("Manifest created successfully")
  expect(closed).toHaveBeenCalledOnce()
  expect(state.refresh).toHaveBeenCalledOnce()
})

it("reuses the same submission ID after an interrupted response", async () => {
  state.create.mockRejectedValueOnce(new Error("Connection interrupted"))
    .mockResolvedValueOnce({ data: { success: true } })
  await act(async () => submit())
  expect(closed).not.toHaveBeenCalled()
  await act(async () => submit())
  expect(state.create).toHaveBeenCalledTimes(2)
  expect(state.create.mock.calls[0][0]).toEqual(state.create.mock.calls[1][0])
  expect(closed).toHaveBeenCalledOnce()
})
