// @vitest-environment jsdom
import { act } from "react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { expect, it, vi } from "vitest"
import { DeliveryDetails } from "@/app/driver/delivery/[id]/delivery-details"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock("@/app/driver/delivery/[id]/actions", () => ({
  completeDeliveryAction: vi.fn(),
}))

it("presents the signature pad only once it can accept a stroke", async () => {
  const content = (
    <DeliveryDetails shipment={{ status: "in-transit" }} invoice={null} />
  )
  const container = document.createElement("div")
  container.innerHTML = renderToString(content)
  document.body.append(container)
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
  let root: Root | undefined

  try {
    expect(container.querySelector("[role=status]")?.textContent).toBe(
      "Loading signature pad"
    )
    expect(container.querySelector("canvas")).toBeNull()

    await act(async () => {
      root = hydrateRoot(container, content)
    })

    expect(container.querySelector("[role=status]")).toBeNull()
    const canvas = container.querySelector("canvas")
    expect(canvas?.getAttribute("aria-label")).toBe("Consignee signature")
    expect(
      [...container.querySelectorAll("button")].map((button) => [
        button.textContent,
        button.disabled,
      ])
    ).toEqual([["Clear", false], ["Complete Delivery", true]])
  } finally {
    if (root) act(() => root?.unmount())
    container.remove()
    vi.unstubAllGlobals()
  }
})
