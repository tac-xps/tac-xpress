// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Step4Cargo } from "@/app/dashboard/invoices/create/steps/step-4-cargo"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root | undefined

function Harness() {
  const form = useForm()
  return (
    <Form {...form}>
      <Step4Cargo
        form={form}
        calculations={{ volumetricWeight: 0, volumeCbm: 0, chargeableWeight: 0 }}
      />
    </Form>
  )
}

afterEach(() => {
  act(() => root?.unmount())
  document.body.innerHTML = ""
})

it("renders the cargo step with the carton presets heading", () => {
  const container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(<Harness />))
  expect(container.textContent).toContain("Carton Presets")
})
