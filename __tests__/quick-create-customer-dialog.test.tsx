// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import type { UseFormReturn } from "react-hook-form"

const { createCustomer, captureWizardError } = vi.hoisted(() => ({
  createCustomer: vi.fn(),
  captureWizardError: vi.fn(),
}))
vi.mock("@/app/dashboard/customers/actions", () => ({
  createCustomerAction: createCustomer,
}))
vi.mock("@/app/dashboard/invoices/actions", () => ({
  lookupPincodeAction: vi.fn(),
}))
vi.mock("@/app/dashboard/invoices/create/capture-wizard-error", () => ({
  captureWizardError,
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { QuickCreateCustomerDialog } from "@/app/dashboard/invoices/create/components/quick-create-customer-dialog"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root
let container: HTMLDivElement

beforeEach(() => {
  createCustomer.mockReset()
  captureWizardError.mockReset()
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function typeInto(id: string, value: string) {
  const input = document.getElementById(id) as HTMLInputElement
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set
  setValue?.call(input, value)
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

async function submitCustomer() {
  const form = {} as UseFormReturn
  act(() => {
    root.render(
      <QuickCreateCustomerDialog role="consignor" onClose={vi.fn()} form={form} />
    )
  })
  act(() => {
    typeInto("quick-name", "Test Customer")
    typeInto("quick-phone", "9876543210")
  })
  await act(async () => {
    document
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
  })
}

it("shows a duplicate customer message inline without capturing it", async () => {
  const message = "A customer with this email or phone already exists."
  createCustomer.mockResolvedValue({ data: { success: false, error: message } })
  await submitCustomer()
  expect(document.body.textContent).toContain(message)
  expect(captureWizardError).not.toHaveBeenCalled()
})

it("shows a validation message inline without capturing it", async () => {
  createCustomer.mockResolvedValue({
    validationErrors: { phone: { _errors: ["Enter a valid phone number."] } },
  })
  await submitCustomer()
  expect(document.body.textContent).toContain("Enter a valid phone number.")
  expect(captureWizardError).not.toHaveBeenCalled()
})

it("captures a server error", async () => {
  createCustomer.mockResolvedValue({ serverError: "Something went wrong" })
  await submitCustomer()
  expect(captureWizardError).toHaveBeenCalledWith(
    "customer_create",
    "Something went wrong",
    { customer_role: "consignor" }
  )
})
