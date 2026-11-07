// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { CorridorTariffsSection } from "@/components/public/landing/corridor-tariffs-section"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root

beforeEach(async () => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  await act(async () => root.render(<CorridorTariffsSection />))
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
})

async function enter(id: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(`#${id}`)
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set
  if (!input || !setter) throw new Error(`Expected calculator input ${id}`)
  await act(async () => {
    setter.call(input, value)
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })
}

describe("quoted rate calculator", () => {
  it("waits for a quoted rate and calculates freight, fuel, and GST from entered values", async () => {
    expect(container.querySelector("#tariff-rate")?.getAttribute("value")).toBe("")
    expect(container.querySelector("[role=status]")?.textContent).not.toContain("Calculated total")
    await enter("tariff-rate", "10")
    await enter("tariff-fuel", "10")
    expect(container.querySelector("[role=status]")?.textContent).toContain("₹389.40")
    await enter("tariff-weight", "2")
    expect(container.querySelector("[role=status]")?.textContent).toContain("₹25.96")
  })

  it("clears the result for unsupported inputs and recovers after correction", async () => {
    await enter("tariff-rate", "10")
    for (const [id, value] of [
      ["tariff-rate", "-1"],
      ["tariff-rate", "1000001"],
      ["tariff-weight", "2001"],
      ["tariff-fuel", "101"],
    ]) {
      await enter(id, value)
      expect(container.querySelector("[role=status]")?.textContent).not.toContain("Calculated total")
      await enter("tariff-rate", "10")
      await enter("tariff-weight", "30")
      await enter("tariff-fuel", "0")
      expect(container.querySelector("[role=status]")?.textContent).toContain("₹354.00")
    }
  })
})
