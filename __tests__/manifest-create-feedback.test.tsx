// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"

const state = vi.hoisted(() => ({
  onSuccess: undefined as
    | undefined
    | ((result: {
        data?: {
          success: boolean
          error?: string
          whatsAppDispatched?: boolean
        }
      }) => void),
  success: vi.fn(),
  error: vi.fn(),
}))
vi.mock("sonner", () => ({
  toast: { success: state.success, error: state.error },
}))
vi.mock("@/app/dashboard/manifests/actions", () => ({
  createManifestAction: vi.fn(),
}))
vi.mock("next-safe-action/hooks", () => ({
  useAction: (
    _action: unknown,
    options: { onSuccess: NonNullable<typeof state.onSuccess> }
  ) => {
    state.onSuccess = options.onSuccess
    return { executeAsync: vi.fn(), isExecuting: false }
  },
}))
vi.mock("@/components/scanner/scanner-provider", () => ({
  useScannerContext: () => ({ setOverrideHandler: vi.fn() }),
}))
import { useCreateManifestForm } from "@/app/dashboard/manifests/use-create-manifest-form"
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root
let container: HTMLDivElement
const closed = vi.fn()
function Harness() {
  useCreateManifestForm([], closed)
  return null
}
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
it("keeps the manifest dialog open and exposes transactional failures", () => {
  if (!state.onSuccess) throw new Error("Hook callback was not registered")
  state.onSuccess({
    data: { success: false, error: "Shipment already assigned" },
  })
  expect(state.error).toHaveBeenCalledWith("Shipment already assigned")
  expect(state.success).not.toHaveBeenCalled()
  expect(closed).not.toHaveBeenCalled()
})
it("closes the dialog only after a committed manifest", () => {
  if (!state.onSuccess) throw new Error("Hook callback was not registered")
  state.onSuccess({ data: { success: true, whatsAppDispatched: false } })
  expect(state.success).toHaveBeenCalledWith("Manifest created successfully")
  expect(closed).toHaveBeenCalledOnce()
})
