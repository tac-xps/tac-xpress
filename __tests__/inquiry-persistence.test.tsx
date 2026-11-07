// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"

const mocks = vi.hoisted(() => ({
  configured: true,
  connectionFails: false,
  audit: vi.fn(),
  enqueue: vi.fn(),
  worker: vi.fn(),
  after: vi.fn(),
  revalidate: vi.fn(),
  capture: vi.fn(),
  transaction: vi.fn(),
  persisted: [] as { id: string }[],
  jobs: new Set<string>(),
  callbacks: [] as (() => Promise<void>)[],
}))
vi.mock("server-only", () => ({}))
vi.mock("@/lib/db", () => ({
  get isDatabaseConfigured() {
    return mocks.configured
  },
  db: { transaction: mocks.transaction, insert: vi.fn() },
}))
vi.mock("@/auth", () => ({ auth: vi.fn() }))
vi.mock("@/lib/auth/guards", () => ({ requireDashboardSession: vi.fn() }))
vi.mock("@/app/actions/portal-auth", () => ({ verifyPortalSession: vi.fn() }))
vi.mock("@/lib/supabase/clients", () => ({ supabaseAdmin: {} }))
vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
  logAuditInTransaction: mocks.audit,
}))
vi.mock("@/lib/jobs/store", () => ({ enqueueTicketJobs: mocks.enqueue }))
vi.mock("@/lib/jobs/worker", () => ({ processBackgroundJobs: mocks.worker }))
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }))
vi.mock("next/server", () => ({ after: mocks.after }))
vi.mock("next/headers", () => ({ headers: vi.fn() }))
vi.mock("@sentry/nextjs", () => ({
  captureException: mocks.capture,
  captureMessage: mocks.capture,
}))
vi.mock("@arcjet/next", () => ({
  default: vi.fn(() => ({})),
  slidingWindow: vi.fn(),
  request: vi.fn(),
}))
vi.mock("@/lib/server/rate-limit", () => ({
  isArcjetBypassed: () => true,
  isArcjetMisconfigured: () => false,
}))

import { createTicket } from "@/app/actions/tickets"
import { ContactSection } from "@/components/public/landing/contact-section"
import { saveContactTicket } from "@/lib/support/create-ticket"
import { enqueueTicketJobs } from "@/lib/jobs/store"
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function inquiry() {
  const data = new FormData()
  for (const [key, value] of Object.entries({
    customer_name: "Synthetic Sender",
    customer_email: "sender@example.test",
    subject: "Synthetic packing inquiry",
    message: "Please explain the packing requirements.",
    category: "shipment",
  }))
    data.set(key, value)
  return data
}

let root: Root | undefined
let container: HTMLDivElement | undefined

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Network access forbidden in this test")
    })
  )
  mocks.configured = true
  mocks.connectionFails = false
  mocks.persisted = []
  mocks.jobs = new Set()
  mocks.callbacks = []
  mocks.after.mockImplementation((callback: () => Promise<void>) =>
    mocks.callbacks.push(callback)
  )
  mocks.enqueue.mockImplementation(async (_tx: unknown, id: string) => {
    mocks.jobs.add(`support_email/${id}`)
    mocks.jobs.add(`support_triage/${id}`)
  })
  // Model commit/rollback in memory; never execute SQL or open a database connection.
  mocks.transaction.mockImplementation(
    async (callback: (tx: unknown) => Promise<unknown>) => {
      if (mocks.connectionFails) throw new Error("Synthetic connection failure")
      const previousJobs = new Set(mocks.jobs)
      const ticket = { id: crypto.randomUUID() }
      const tx = {
        insert: () => ({ values: () => ({ returning: async () => [ticket] }) }),
      }
      try {
        const result = await callback(tx)
        mocks.persisted.push(ticket)
        return result
      } catch (error) {
        mocks.jobs = previousJobs
        throw error
      }
    }
  )
})
afterEach(async () => {
  if (root) await act(async () => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
  vi.unstubAllGlobals()
})

async function submitForm() {
  if (!container) throw new Error("Expected a mounted form")
  await act(async () => {
    container
      ?.querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
  })
}

async function mountForm() {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  await act(async () => root?.render(<ContactSection />))
  for (const [id, value] of [
    ["contact-name", "Synthetic Sender"],
    ["contact-email", "sender@example.test"],
  ]) {
    const input = container.querySelector(`#${id}`)
    if (!(input instanceof HTMLInputElement))
      throw new Error("Expected contact input")
    await act(async () => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set?.call(input, value)
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
  }
}

describe("truthful inquiry persistence", () => {
  it("confirms only a committed ticket, audit and both durable jobs", async () => {
    const response = await createTicket(inquiry())
    expect(response).toMatchObject({
      success: true,
      ticketId: mocks.persisted[0]?.id,
    })
    expect(mocks.persisted).toHaveLength(1)
    expect(mocks.audit).toHaveBeenCalledOnce()
    expect(mocks.jobs.size).toBe(2)
    expect(mocks.worker).not.toHaveBeenCalled()
  })

  it.each(["configuration", "connection", "audit", "outbox"])(
    "shows a recoverable error and no confirmation after %s failure",
    async (failure) => {
      mocks.configured = failure !== "configuration"
      mocks.connectionFails = failure === "connection"
      if (failure === "audit")
        mocks.audit.mockRejectedValueOnce(new Error("Synthetic audit failure"))
      if (failure === "outbox")
        mocks.enqueue.mockRejectedValueOnce(
          new Error("Synthetic outbox failure")
        )
      await mountForm()
      await submitForm()
      expect(container?.textContent).toContain("We could not save your request")
      expect(container?.textContent).not.toContain("Inquiry Registered")
      expect(container?.querySelector('[role="alert"]')?.textContent).toContain("We could not save your request")
      expect(container?.querySelector<HTMLInputElement>("#contact-name")?.value).toBe("Synthetic Sender")
      expect(container?.querySelector<HTMLInputElement>("#contact-email")?.value).toBe("sender@example.test")
      expect(container?.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false)
      expect(mocks.persisted).toHaveLength(0)
      expect(mocks.jobs.size).toBe(0)
      if (failure === "configuration")
        expect(mocks.transaction).not.toHaveBeenCalled()
      expect(mocks.capture).toHaveBeenCalled()
    }
  )

  it("associates server validation with the retained field and focuses it before retry", async () => {
    await mountForm()
    const input = container?.querySelector("#contact-name")
    if (!(input instanceof HTMLInputElement)) throw new Error("Expected contact name")
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "A")
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
    await submitForm()
    expect(input.value).toBe("A")
    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(input.getAttribute("aria-describedby")).toBe("contact-name-error")
    expect(document.getElementById("contact-name-error")?.textContent).toBeTruthy()
    expect(document.activeElement).toBe(input)
    expect(container?.querySelector("#contact-email")?.getAttribute("aria-invalid")).toBe("false")
    expect(container?.querySelector('[role="alert"]')).not.toBeNull()
    expect(container?.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false)
    expect(mocks.transaction).not.toHaveBeenCalled()
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "Synthetic Sender")
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
    await submitForm()
    expect(container?.textContent).toContain("Inquiry Registered")
    expect(mocks.persisted).toHaveLength(1)
  })

  it("keeps the committed inquiry and jobs when the follow-up worker fails", async () => {
    mocks.worker.mockRejectedValueOnce(new Error("Synthetic delivery failure"))
    const response = await createTicket(inquiry())
    for (const callback of mocks.callbacks) await callback()
    expect(response).toMatchObject({ success: true })
    expect(mocks.persisted).toHaveLength(1)
    expect(mocks.jobs.size).toBe(2)
    expect(mocks.capture).toHaveBeenCalled()
  })

  it.each(["schedule", "cache"])(
    "keeps committed success after %s failure",
    async (failure) => {
      const target = failure === "schedule" ? mocks.after : mocks.revalidate
      target.mockImplementationOnce(() => {
        throw new Error("Synthetic post-commit failure")
      })
      const response = await createTicket(inquiry())
      expect(response).toMatchObject({
        success: true,
        ticketId: mocks.persisted[0]?.id,
      })
      expect(mocks.persisted).toHaveLength(1)
      expect(mocks.jobs.size).toBe(2)
    }
  )

  it("retries a failed transaction without a phantom reference or duplicate committed ticket", async () => {
    mocks.audit.mockRejectedValueOnce(new Error("Synthetic transient failure"))
    const failed = await createTicket(inquiry())
    expect(failed).not.toHaveProperty("ticketId")
    expect(failed).not.toHaveProperty("success")
    const saved = await createTicket(inquiry())
    expect(saved).toMatchObject({
      success: true,
      ticketId: mocks.persisted[0]?.id,
    })
    expect(mocks.persisted).toHaveLength(1)
    expect(mocks.jobs.size).toBe(2)
  })

  it("preserves separate duplicate inquiries and per-ticket job keys", async () => {
    const first = await createTicket(inquiry())
    const second = await createTicket(inquiry())
    expect(first.ticketId).not.toBe(second.ticketId)
    expect(mocks.persisted).toHaveLength(2)
    expect(mocks.jobs.size).toBe(4)
    if (!first.ticketId) throw new Error("Expected persisted ticket")
    await enqueueTicketJobs({ execute: async () => undefined }, first.ticketId)
    expect(mocks.jobs.size).toBe(4)
  })

  it("retains the honeypot response without fabricating a reference or saving data", async () => {
    const data = inquiry()
    data.set("website", "synthetic bot")
    expect(await createTicket(data)).toEqual({ success: true })
    expect(mocks.transaction).not.toHaveBeenCalled()
  })

  it("does not return from persistence before the outbox step completes", async () => {
    mocks.enqueue.mockRejectedValueOnce(new Error("Synthetic queue failure"))
    await expect(
      saveContactTicket({
        customer_name: "Synthetic Sender",
        customer_email: "sender@example.test",
        subject: "Packing inquiry",
        message: "Synthetic packing question",
        category: "general",
      })
    ).rejects.toThrow("Synthetic queue failure")
    expect(mocks.persisted).toHaveLength(0)
  })
})
