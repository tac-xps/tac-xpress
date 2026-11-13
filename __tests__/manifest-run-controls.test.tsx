// @vitest-environment jsdom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { RunControls } from "@/app/dashboard/dispatch/run-controls"

const mocks = vi.hoisted(() => ({ update: vi.fn(), refresh: vi.fn() }))
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: mocks.refresh }) }))
vi.mock("next-safe-action/hooks", () => ({ useAction: () => ({ isExecuting: false }) }))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
vi.mock("@/app/dashboard/manifests/actions", () => ({
  updateManifestAction: mocks.update,
  recordManifestItemHandoffAction: vi.fn(),
}))
vi.mock("@/app/dashboard/dispatch/actions", () => ({ startDispatchRunAction: vi.fn() }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
const run = {
  id: "run",
  status: "draft" as const,
  legType: "line_haul" as const,
  items: [{ id: "item", isActive: true, shipment: { status: "pending", awbNumber: "TEST" } }],
}
const committed = { data: { success: true, activeItemIds: ["item"] } }
const button = (label: string) =>
  [...document.querySelectorAll("button")].find((element) => element.textContent === label)
let container: HTMLDivElement
let root: Root

beforeEach(async () => {
  vi.resetAllMocks()
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  await act(async () => root.render(<RunControls run={run} />))
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
})

describe("line-haul departure controls", () => {
  it("suppresses double submission and switches to committed controls before refresh props arrive", async () => {
    const deferred = Promise.withResolvers<typeof committed>()
    mocks.update.mockReturnValueOnce(deferred.promise)
    await act(async () => button("Start run")?.click())
    await act(async () => {
      const confirm = button("Confirm departure")
      expect(confirm).toBeDefined()
      confirm?.click()
      confirm?.click()
    })
    expect(mocks.update).toHaveBeenCalledTimes(1)
    expect(button("Saving…")?.disabled).toBe(true)
    expect(button("Record handover")).toBeUndefined()
    await act(async () => deferred.resolve(committed))
    expect(button("Start run")).toBeUndefined()
    expect(button("Record handover")?.disabled).toBe(false)
    expect(mocks.refresh).toHaveBeenCalledTimes(1)
  })

  it("refreshes after an interrupted response and converges when a retry reads committed state", async () => {
    mocks.update.mockRejectedValueOnce(new Error("Connection interrupted"))
      .mockResolvedValueOnce(committed)
    await act(async () => button("Start run")?.click())
    await act(async () => button("Confirm departure")?.click())
    expect(button("Confirm departure")?.disabled).toBe(false)
    expect(mocks.refresh).toHaveBeenCalledTimes(1)
    await act(async () => button("Confirm departure")?.click())
    expect(mocks.update).toHaveBeenCalledTimes(2)
    expect(button("Start run")).toBeUndefined()
    expect(button("Record handover")).toBeDefined()
  })
})
