// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot } from "react-dom/client"
import type { z } from "zod"
import type { useWizardForm as WizardHook } from "@/app/dashboard/invoices/create/use-wizard-form"

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
}))
vi.mock("server-only", () => ({}))
vi.mock("@/lib/db", () => ({ db: { transaction: mocks.transaction } }))
vi.mock("@/lib/supabase/clients", () => ({ supabaseAdmin: {} }))
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn() }))
vi.mock("@/lib/audit", () => ({ logAuditInTransaction: vi.fn() }))
vi.mock("@/lib/auth/guards", () => ({
  requireDashboardAction: async () => ({
    ok: true,
    session: {
      user: {
        id: "11111111-1111-4111-8111-111111111111",
        email: "staff@example.test",
      },
    },
  }),
  requireDashboardSession: vi.fn(),
}))
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  startSpan: (_options: unknown, callback: () => unknown) => callback(),
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/headers", () => ({ headers: vi.fn(), cookies: vi.fn() }))
vi.mock("next/server", () => ({ after: vi.fn() }))
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock("next-safe-action/hooks", () => ({
  useAction: () => ({ executeAsync: vi.fn(), isExecuting: false }),
}))
vi.mock("sonner", () => ({
  toast: { error: mocks.error, success: mocks.success },
}))
vi.mock("@/lib/whatsapp/service", () => ({
  normalizeWhatsAppPhone: vi.fn(),
  sendWhatsAppTemplateMessage: vi.fn(),
}))
vi.mock("@/lib/posthog-server", () => ({ capturePostHogEvent: vi.fn() }))
vi.mock("@/components/forms/search-select", () => ({
  SearchSelect: ({
    options,
    onSelect,
  }: {
    options: { value: string }[]
    onSelect: (value: string) => void
  }) => (
    <>
      {options.map(({ value }) => (
        <button key={value} onClick={() => onSelect(value)}>
          {value}
        </button>
      ))}
    </>
  ),
}))

import {
  freightRouteSchema,
  normalizeFreightCity,
} from "@/lib/schemas/freight-route"
import { invoiceWizardSchema } from "@/lib/schemas/invoice-wizard"
import {
  createShipmentSchema,
  updateShipmentSchema,
} from "@/app/dashboard/shipments/schemas"
import { createShipmentSchema as clientShipmentSchema } from "@/app/dashboard/shipments/validations"
import {
  createShipmentAction,
  updateShipmentAction,
} from "@/app/dashboard/shipments/actions"
import * as invoiceActions from "@/app/dashboard/invoices/actions"
import { useWizardForm } from "@/app/dashboard/invoices/create/use-wizard-form"
import { CityCombobox } from "@/components/forms/city-combobox"
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const wizard: z.input<typeof invoiceWizardSchema> = {
  serviceType: "express_air",
  origin: "New Delhi",
  destination: "Imphal",
  consignorName: "Synthetic Sender",
  consignorPhone: "+919876543210",
  consignorIdType: "none",
  consigneeName: "Synthetic Receiver",
  consigneePhone: "+919876543211",
  consignorAddress: "Synthetic billing office, Mumbai",
  consigneeAddress: "Synthetic contact office, Kolkata",
  consignorPinCode: "400001",
  consigneePinCode: "700001",
  contentDescription: "Synthetic books",
  natureOfGoods: "others",
  itemCondition: "new",
  declaredValue: 100,
  pieces: 1,
  weightKg: 1,
  packagingType: "none",
  freightCharge: 100,
  pickupCharge: 0,
  packingCharge: 0,
  docketCharge: 0,
  insuranceCharge: 0,
  otherCharges: 0,
  gstRate: 18,
  paymentMode: "cash",
  advancePaid: 0,
  termsAccepted: true,
  prohibitedAccepted: true,
}
const shipment: z.input<typeof createShipmentSchema> = {
  customerId: "22222222-2222-4222-8222-222222222222",
  origin: "New Delhi",
  destination: "Imphal",
  serviceType: "express_air",
  weightKg: 1,
}
const invalidRoutes = [
  ["New Delhi", "New Delhi"],
  ["Imphal", "Imphal"],
  ["Mumbai", "Imphal"],
  ["New Delhi", "Mumbai"],
  ["", "Imphal"],
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Network access forbidden in this test")
    })
  )
  mocks.transaction.mockRejectedValue(
    new Error("No writes allowed in boundary tests")
  )
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("shared freight corridor contract", () => {
  it.each([
    ["New Delhi", "Imphal"],
    ["Imphal", "New Delhi"],
  ])("accepts %s to %s in all booking schemas", (origin, destination) => {
    const route = { origin, destination }
    expect(freightRouteSchema.parse(route)).toEqual(route)
    expect(invoiceWizardSchema.safeParse({ ...wizard, ...route }).success).toBe(
      true
    )
    expect(
      createShipmentSchema.safeParse({ ...shipment, ...route }).success
    ).toBe(true)
    expect(
      clientShipmentSchema.safeParse({ ...shipment, ...route }).success
    ).toBe(true)
    expect(
      updateShipmentSchema.safeParse({
        ...shipment,
        ...route,
        id: shipment.customerId,
      }).success
    ).toBe(true)
  })

  it("normalizes existing city names and airport codes without inventing new endpoint names", () => {
    expect(
      freightRouteSchema.parse({ origin: "  new   DELHI ", destination: "imf" })
    ).toEqual({ origin: "New Delhi", destination: "Imphal" })
    expect(
      freightRouteSchema.parse({ origin: "IMPHAL", destination: "Delhi" })
    ).toEqual({ origin: "Imphal", destination: "New Delhi" })
    expect(normalizeFreightCity("Mumbai")).toBeNull()
    expect(
      freightRouteSchema.safeParse({ origin: "Delhi", destination: "DEL" })
        .success
    ).toBe(false)
  })

  it.each(invalidRoutes)(
    "rejects %s to %s before every action transaction",
    async (origin, destination) => {
      const route = { origin, destination }
      expect(freightRouteSchema.safeParse(route).success).toBe(false)
      const results = await Promise.all([
        createShipmentAction({ ...shipment, ...route }),
        updateShipmentAction({
          ...shipment,
          ...route,
          id: shipment.customerId,
        }),
        invoiceActions.createWizardInvoiceAction({ ...wizard, ...route }),
      ])
      for (const result of results)
        expect(result).toHaveProperty("validationErrors")
      expect(mocks.transaction).not.toHaveBeenCalled()
    }
  )

  it("validates same-city endpoints while unrelated required wizard fields are still empty", () => {
    const result = invoiceWizardSchema.safeParse({
      origin: "Imphal",
      destination: "Imphal",
    })
    expect(result.success).toBe(false)
    if (result.success) throw new Error("Expected invalid wizard")
    expect(
      result.error.issues.some(
        (issue) =>
          issue.path[0] === "destination" &&
          issue.message.includes("opposite endpoints")
      )
    ).toBe(true)
  })

  it("allows contact and billing addresses outside the corridor", () => {
    const result = invoiceWizardSchema.parse(wizard)
    expect(result.consignorAddress).toContain("Mumbai")
    expect(result.consigneeAddress).toContain("Kolkata")
    expect(result.consignorPinCode).toBe("400001")
  })
})

describe("freight endpoint controls", () => {
  it("limits freight options while retaining unrestricted customer address options", async () => {
    const container = document.createElement("div")
    const root = createRoot(container)
    const selected = vi.fn()
    try {
      await act(async () =>
        root.render(
          <CityCombobox freightOnly value="Mumbai" onSelect={selected} />
        )
      )
      expect(
        Array.from(
          container.querySelectorAll("button"),
          (button) => button.textContent
        )
      ).toEqual(["Imphal", "New Delhi"])
      await act(async () => container.querySelector("button")?.click())
      expect(selected).toHaveBeenCalledWith({
        city: "Imphal",
        state: "Manipur",
        pinCode: "",
      })
      await act(async () =>
        root.render(<CityCombobox value="Outside City" onSelect={selected} />)
      )
      expect(container.textContent).toContain("Mumbai")
      expect(container.textContent).toContain("Outside City")
    } finally {
      await act(async () => root.unmount())
    }
  })

  it.each(["origin", "destination"] as const)(
    "prevents an unsupported PIN from changing %s or contact PIN data",
    async (endpoint) => {
      vi.spyOn(invoiceActions, "lookupPincodeAction").mockResolvedValue({
        data: {
          success: true,
          city: "Mumbai",
          state: "Maharashtra",
          officeName: "Synthetic office",
        },
      })
      const container = document.createElement("div")
      const root = createRoot(container)
      let hook: ReturnType<typeof WizardHook> | undefined
      function Probe() {
        hook = useWizardForm()
        return null
      }
      try {
        await act(async () => root.render(<Probe />))
        const current = hook
        if (!current) throw new Error("Expected wizard hook")
        await act(async () => {
          current.form.setValue("origin", "New Delhi")
          current.form.setValue("destination", "Imphal")
          current.form.setValue("consignorPinCode", "110001")
          current.form.setValue("consigneePinCode", "795001")
          current.setOriginPinQuery("400001")
          current.setDestinationPinQuery("400001")
        })
        await act(async () => {
          if (endpoint === "origin") await hook?.handleOriginPinLookup()
          else await hook?.handleDestinationPinLookup()
        })
        expect(current.form.getValues("origin")).toBe("New Delhi")
        expect(current.form.getValues("destination")).toBe("Imphal")
        expect(current.form.getValues("consignorPinCode")).toBe("110001")
        expect(current.form.getValues("consigneePinCode")).toBe("795001")
        expect(mocks.error).toHaveBeenCalledWith(
          expect.stringContaining("outside the freight corridor")
        )
        expect(mocks.transaction).not.toHaveBeenCalled()
      } finally {
        await act(async () => root.unmount())
      }
    }
  )
})
