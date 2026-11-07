import { resolve } from "node:path"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

interface RenderRequest {
  url(): string
  resourceType(): string
  headers(): Record<string, string>
  continue(options?: { headers: Record<string, string> }): Promise<void>
  abort(): Promise<void>
}
const mocks = vi.hoisted(() => ({
  launch: vi.fn(),
  on: vi.fn<
    (
      event: string,
      handler: (request: RenderRequest) => Promise<unknown>
    ) => void
  >(),
  globalHeaders: vi.fn(),
}))
vi.mock("server-only", () => ({}))
vi.mock("@/lib/db", () => ({ db: {} }))
vi.mock("puppeteer-core", () => ({ default: { launch: mocks.launch } }))

beforeEach(() => {
  vi.resetModules()
  vi.resetAllMocks()
  vi.useFakeTimers()
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://workspace.invalid")
  vi.stubEnv("VERCEL_ENV", "")
  vi.stubEnv("PDF_BROWSER_EXECUTABLE_PATH", resolve("fixture-browser"))
  vi.stubEnv(
    "INVOICE_PDF_SIGNING_SECRET",
    "fixture-signing-secret-for-render-tests"
  )
  let currentUrl = "https://workspace.invalid/invoice/fixture-invoice"
  const page = {
    emulateMediaType: vi.fn(),
    setExtraHTTPHeaders: mocks.globalHeaders,
    setRequestInterception: vi.fn(),
    on: mocks.on,
    goto: vi.fn().mockImplementation((dest: string) => {
      currentUrl = dest.split("?")[0]
      return { status: () => 200 }
    }),
    url: () => currentUrl,
    waitForSelector: vi.fn(),
    evaluate: vi.fn(),
    pdf: vi.fn().mockResolvedValue(Buffer.from("%PDF-fixture")),
    close: vi.fn(),
  }
  mocks.launch.mockResolvedValue({
    on: vi.fn(),
    newPage: vi.fn().mockResolvedValue(page),
    close: vi.fn(),
    connected: true,
  })
})
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

it("shares browser startup across simultaneous invoice renders", async () => {
  await import("puppeteer-core")
  const { renderInvoicePdf } =
    await import("@/lib/documents/render-invoice-pdf")
  await Promise.all([
    renderInvoicePdf("fixture-invoice", { forceFresh: true }),
    renderInvoicePdf("fixture-invoice", { forceFresh: true }),
  ])
  expect(mocks.launch).toHaveBeenCalledTimes(1)
})

it("renders label pdf with 4x3 dimensions and authorized document token", async () => {
  const { renderLabelPdf } = await import("@/lib/documents/render-invoice-pdf")
  const buffer = await renderLabelPdf("fixture-invoice", {
    protectionCookie: "fixture-preview-cookie",
    forceFresh: true,
  })
  expect(buffer).toBeDefined()
  expect(buffer.toString()).toContain("%PDF-fixture")
})

it("keeps rendering authorization on the invoice origin and forwards only its protection cookie", async () => {
  const { renderInvoicePdf } =
    await import("@/lib/documents/render-invoice-pdf")
  await renderInvoicePdf("fixture-invoice", {
    protectionCookie: "fixture-preview-cookie",
  })
  const registration = mocks.on.mock.calls.find(
    ([event]) => event === "request"
  )
  if (!registration)
    throw new Error("The request interceptor was not installed")
  const handler = registration[1]
  for (const origin of [
    "https://workspace.invalid",
    "https://assets.invalid",
  ]) {
    const proceed = vi.fn().mockResolvedValue(undefined)
    await handler({
      url: () => `${origin}/logo.png`,
      resourceType: () => "image",
      headers: () => ({
        accept: "image/png",
        cookie: "stale-cookie",
        "x-internal-document-token": "stale-token",
      }),
      continue: proceed,
      abort: vi.fn().mockResolvedValue(undefined),
    })
    if (origin === "https://workspace.invalid") {
      expect(proceed).toHaveBeenCalledWith({
        headers: {
          accept: "image/png",
          cookie: "_vercel_jwt=fixture-preview-cookie",
          "x-internal-document-token": expect.stringMatching(
            /^\d{10}\.[a-f0-9]{64}$/
          ),
        },
      })
    } else
      expect(proceed).toHaveBeenCalledWith({ headers: { accept: "image/png" } })
  }
  expect(mocks.globalHeaders).not.toHaveBeenCalled()
})
