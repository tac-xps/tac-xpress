import "server-only"
import { getAppUrl } from "@/lib/config/app-url"
import { signDocumentToken } from "@/lib/auth/document-token"
import { isAbsolute } from "node:path"

interface CacheEntry {
  buffer: Buffer
  timestamp: number
}

// In-memory short-lived buffer cache (prevents duplicate rendering spikes)
const pdfCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 30_000 // 30 seconds

export function invalidateInvoicePdfCache(id: string) {
  pdfCache.delete(id)
}

const OPTIMIZED_LAUNCH_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--disable-extensions",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-background-networking",
  "--disable-sync",
  "--disable-translate",
  "--metrics-recording-only",
]

type BrowserInstance = any

let cachedBrowser: BrowserInstance | null = null
let idleTimer: NodeJS.Timeout | null = null
const IDLE_TIMEOUT_MS = 60_000 // Keep browser warm for 60 seconds

async function getBrowser(): Promise<BrowserInstance> {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }

  if (cachedBrowser && cachedBrowser.isConnected && cachedBrowser.isConnected()) {
    return cachedBrowser
  }

  cachedBrowser = null

  const configuredBrowser = process.env.PDF_BROWSER_EXECUTABLE_PATH
  if (configuredBrowser && !isAbsolute(configuredBrowser)) {
    throw new Error("PDF_BROWSER_EXECUTABLE_PATH must be absolute.")
  }

  if (configuredBrowser) {
    const puppeteerCore = (await import("puppeteer-core")).default
    cachedBrowser = await puppeteerCore.launch({
      headless: true,
      executablePath: configuredBrowser,
      args: OPTIMIZED_LAUNCH_ARGS,
    })
  } else if (process.env.NODE_ENV === "development") {
    const puppeteer = (await import("puppeteer")).default
    cachedBrowser = await puppeteer.launch({
      headless: true,
      args: OPTIMIZED_LAUNCH_ARGS,
    })
  } else {
    const puppeteerCore = (await import("puppeteer-core")).default
    const chromium = (await import("@sparticuz/chromium")).default
    cachedBrowser = await puppeteerCore.launch({
      args: [...chromium.args, ...OPTIMIZED_LAUNCH_ARGS],
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  }

  cachedBrowser.on("disconnected", () => {
    cachedBrowser = null
  })

  return cachedBrowser
}

function scheduleBrowserReap() {
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(async () => {
    if (cachedBrowser) {
      try {
        await cachedBrowser.close()
      } catch {
        // Ignore close errors
      } finally {
        cachedBrowser = null
      }
    }
  }, IDLE_TIMEOUT_MS)
}

export interface RenderInvoicePdfOptions {
  forceFresh?: boolean
}

export async function renderInvoicePdf(
  id: string,
  options: RenderInvoicePdfOptions = {}
): Promise<Buffer> {
  // 1. Check in-memory short-lived cache
  if (!options.forceFresh) {
    const cached = pdfCache.get(id)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.buffer
    }
  }

  const url = `${getAppUrl()}/invoice/${encodeURIComponent(id)}?preview=true`
  const browser = await getBrowser()
  const page = await browser.newPage()

  try {
    await page.emulateMediaType("print")
    await page.setExtraHTTPHeaders({
      "x-internal-document-token": signDocumentToken(id, "render"),
    })

    // Filter out non-essential external requests (analytics, web vitals, HMR)
    await page.setRequestInterception(true)
    page.on("request", (req: any) => {
      const resourceType = req.resourceType()
      const reqUrl = req.url()

      // Abort background analytics, error reporting, and dev server hot-reload websocket
      if (
        reqUrl.includes("posthog") ||
        reqUrl.includes("sentry") ||
        reqUrl.includes("analytics") ||
        reqUrl.includes("telemetry") ||
        reqUrl.includes("/_next/webpack-hmr")
      ) {
        return req.abort()
      }

      // Abort video / media streaming
      if (resourceType === "media" || resourceType === "video") {
        return req.abort()
      }

      req.continue()
    })

    // Fast navigation without waiting for arbitrary background network tasks
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    })

    if (
      response?.status() !== 200 ||
      new URL(page.url()).pathname !== `/invoice/${id}`
    ) {
      throw new Error("Invoice render did not reach the authorized document.")
    }

    await page.waitForSelector("[data-invoice-document]", { timeout: 10_000 })
    await page.evaluate(() => document.fonts.ready)

    const pdfUint8Array = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    const buffer = Buffer.from(pdfUint8Array)
    pdfCache.set(id, { buffer, timestamp: Date.now() })
    return buffer
  } finally {
    await page.close()
    scheduleBrowserReap()
  }
}
