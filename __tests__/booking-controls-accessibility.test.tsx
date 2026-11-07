// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, createRef } from "react"
import { createRoot, type Root } from "react-dom/client"
import { useForm, type UseFormReturn } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CityCombobox } from "@/components/forms/city-combobox"
import { CustomerCombobox } from "@/components/forms/customer-combobox"
import { DriverCombobox } from "@/components/forms/driver-combobox"
import { VehicleCombobox } from "@/components/forms/vehicle-combobox"
import { HubCombobox } from "@/components/forms/hub-combobox"
import { useRecordLookup } from "@/components/forms/use-record-lookup"

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
vi.mock("posthog-js", () => ({ default: { captureException: vi.fn() } }))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
const recordSchema = z.object({ id: z.string() })
let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Unexpected network request")
    })
  )
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  })
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("booking field accessibility", () => {
  it("preserves distinct labels, validation descriptions, blur and form error focus on actual city buttons", async () => {
    let form: UseFormReturn<{ origin: string; destination: string }> | undefined
    function Booking() {
      const current = useForm({
        defaultValues: { origin: "New Delhi", destination: "Imphal" },
      })
      form = current
      return (
        <Form {...current}>
          {(["origin", "destination"] as const).map((name) => (
            <FormField
              key={name}
              control={current.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {name === "origin" ? "Origin city" : "Destination city"}
                  </FormLabel>
                  <FormControl>
                    <CityCombobox
                      freightOnly
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value}
                      onSelect={(city) => field.onChange(city.city)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </Form>
      )
    }
    await act(async () => root.render(<Booking />))
    const current = form
    if (!current) throw new Error("Expected booking form")
    const buttons = Array.from(container.querySelectorAll("button"))
    expect(buttons.map((button) => button.labels?.[0]?.textContent)).toEqual([
      "Origin city",
      "Destination city",
    ])
    expect(buttons[0].id).not.toBe(buttons[1].id)
    expect(buttons[0].hasAttribute("aria-label")).toBe(false)
    await act(async () =>
      current.setError("origin", { message: "Choose opposite endpoints" })
    )
    expect(buttons[0].getAttribute("aria-invalid")).toBe("true")
    const descriptions =
      buttons[0].getAttribute("aria-describedby")?.split(" ") ?? []
    expect(
      descriptions.some(
        (id) =>
          document.getElementById(id)?.textContent ===
          "Choose opposite endpoints"
      )
    ).toBe(true)
    const focus = vi.spyOn(buttons[0], "focus")
    await act(async () => current.setFocus("origin"))
    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)))
    expect(focus).toHaveBeenCalled()
    expect(document.activeElement).toBe(buttons[0])
    await act(async () => buttons[0].blur())
    expect(current.getFieldState("origin").isTouched).toBe(true)
  })

  it.each(["customer", "driver", "vehicle", "hub"] as const)(
    "forwards label, ID, ref and validation state through the %s wrapper",
    async (kind) => {
      const ref = createRef<HTMLButtonElement>()
      const props = {
        id: "record-choice",
        ref,
        disabled: true,
        "aria-invalid": true,
        "aria-describedby": "record-error",
        onSelect: vi.fn(),
      }
      const selectors = {
        customer: <CustomerCombobox {...props} />,
        driver: <DriverCombobox {...props} />,
        vehicle: <VehicleCombobox {...props} />,
        hub: <HubCombobox {...props} />,
      }
      await act(async () =>
        root.render(
          <>
            <label htmlFor="record-choice">Record choice</label>
            {selectors[kind]}
            <p id="record-error">Select a record</p>
          </>
        )
      )
      expect(ref.current?.labels?.[0]?.textContent).toBe("Record choice")
      expect(ref.current?.getAttribute("aria-describedby")).toBe("record-error")
      expect(ref.current?.getAttribute("aria-invalid")).toBe("true")
      expect(fetch).not.toHaveBeenCalled()
    }
  )
})

describe("same-query record retry", () => {
  it("retries the same query and selected record after failure without changing search state", async () => {
    vi.useFakeTimers()
    const request = vi
      .fn()
      .mockResolvedValueOnce(Response.json({}, { status: 503 }))
      .mockResolvedValueOnce(Response.json([{ id: "synthetic-record" }]))
    vi.stubGlobal("fetch", request)
    let lookup: ReturnType<typeof useRecordLookup<{ id: string }>> | undefined
    function Probe() {
      lookup = useRecordLookup(
        "/synthetic-records",
        recordSchema,
        "synthetic-selected"
      )
      return null
    }
    await act(async () => root.render(<Probe />))
    const initial = lookup
    if (!initial) throw new Error("Expected lookup")
    await act(async () => initial.setQuery("same query"))
    await act(async () => vi.advanceTimersByTimeAsync(250))
    expect(lookup?.error).toContain("Unable to load")
    await act(async () => lookup?.retry())
    await act(async () => vi.advanceTimersByTimeAsync(250))
    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls[0][0]).toBe(request.mock.calls[1][0])
    expect(request.mock.calls[1][0]).toContain(
      "query=same+query&id=synthetic-selected"
    )
    expect(lookup?.records).toEqual([{ id: "synthetic-record" }])
    expect(lookup?.error).toBe("")
  })

  it.each(["customer", "driver", "vehicle", "hub"] as const)(
    "wires Retry through the actual %s selector and retains keyboard focus",
    async (kind) => {
      vi.useFakeTimers()
      const request = vi
        .fn()
        .mockResolvedValueOnce(Response.json({}, { status: 503 }))
        .mockResolvedValueOnce(Response.json([]))
      vi.stubGlobal("fetch", request)
      const selectors = {
        customer: <CustomerCombobox onSelect={vi.fn()} />,
        driver: <DriverCombobox onSelect={vi.fn()} />,
        vehicle: <VehicleCombobox onSelect={vi.fn()} />,
        hub: <HubCombobox onSelect={vi.fn()} />,
      }
      await act(async () => root.render(selectors[kind]))
      await act(async () => container.querySelector("button")?.click())
      await act(async () => vi.advanceTimersByTimeAsync(250))
      expect(document.querySelector('[role="alert"]')?.textContent).toContain(
        "Unable to load"
      )
      const retry = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Retry"
      )
      if (!retry) throw new Error("Expected Retry button")
      await act(async () => retry.click())
      expect(document.activeElement).toBe(
        document.querySelector("[cmdk-input]")
      )
      await act(async () => vi.advanceTimersByTimeAsync(250))
      expect(request).toHaveBeenCalledTimes(2)
      expect(request.mock.calls[0][0]).toBe(request.mock.calls[1][0])
      expect(document.querySelector('[role="alert"]')).toBeNull()
      expect(document.body.textContent).toContain("No matching records")
    }
  )
})
