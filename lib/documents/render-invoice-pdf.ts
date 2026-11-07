import "server-only"
import { getAppUrl } from "@/lib/config/app-url"
import { signDocumentToken } from "@/lib/auth/document-token"
import { isAbsolute } from "node:path"
import { db } from "@/lib/db"
import { invoices, shipments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { Browser } from "puppeteer-core"

interface CacheEntry {
  buffer: Buffer
  timestamp: number
}

// In-memory short-lived buffer cache (prevents duplicate rendering spikes)
const pdfCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 300_000 // 5 minutes

export function invalidateInvoicePdfCache(id: string) {
  pdfCache.delete(id)
  pdfCache.delete(`invoice:${id}`)
  pdfCache.delete(`label:${id}`)
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
  "--disable-logging",
  "--log-level=3",
  "--silent",
]

type BrowserInstance = Browser

let cachedBrowser: BrowserInstance | null = null
let browserStartup: Promise<BrowserInstance> | null = null
let idleTimer: NodeJS.Timeout | null = null
const IDLE_TIMEOUT_MS = 300_000 // Keep browser warm for 5 minutes

async function getBrowser(): Promise<BrowserInstance> {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }

  if (cachedBrowser?.connected) {
    return cachedBrowser
  }

  if (browserStartup) return browserStartup
  browserStartup = launchBrowser()
  try {
    return await browserStartup
  } finally {
    browserStartup = null
  }
}

async function launchBrowser(): Promise<BrowserInstance> {
  cachedBrowser = null

  const configuredBrowser = process.env.PDF_BROWSER_EXECUTABLE_PATH
  if (configuredBrowser && !isAbsolute(configuredBrowser)) {
    throw new Error("PDF_BROWSER_EXECUTABLE_PATH must be absolute.")
  }

  if (configuredBrowser) {
    const puppeteerCore = (await import("puppeteer-core")).default
    cachedBrowser = await puppeteerCore.launch({
      headless: true,
      dumpio: false,
      executablePath: configuredBrowser,
      args: OPTIMIZED_LAUNCH_ARGS,
    })
  } else if (process.env.NODE_ENV === "development") {
    const puppeteer = (await import("puppeteer")).default
    cachedBrowser = await puppeteer.launch({
      headless: true,
      dumpio: false,
      args: OPTIMIZED_LAUNCH_ARGS,
    })
  } else {
    const puppeteerCore = (await import("puppeteer-core")).default
    const chromium = (await import("@sparticuz/chromium")).default
    cachedBrowser = await puppeteerCore.launch({
      args: [...chromium.args, ...OPTIMIZED_LAUNCH_ARGS],
      executablePath: await chromium.executablePath(),
      headless: true,
      dumpio: false,
    })
  }

  const browser = cachedBrowser
  browser.on("disconnected", () => {
    if (cachedBrowser === browser) cachedBrowser = null
  })

  return browser
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
  lastModified?: Date | number
  protectionCookie?: string
}

export async function renderInvoicePdf(
  id: string,
  options: RenderInvoicePdfOptions = {}
): Promise<Buffer> {
  // 1. Check in-memory cache with database freshness guarantee
  if (!options.forceFresh) {
    const cached = pdfCache.get(id) || pdfCache.get(`invoice:${id}`)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      let modifiedTime = options.lastModified
        ? new Date(options.lastModified).getTime()
        : 0
      if (!modifiedTime) {
        try {
          const [inv] = await db
            .select({
              updatedAt: invoices.updatedAt,
              shipmentUpdatedAt: shipments.updatedAt,
            })
            .from(invoices)
            .leftJoin(shipments, eq(invoices.shipmentId, shipments.id))
            .where(eq(invoices.id, id))
          if (inv) {
            const invoiceTime = inv.updatedAt ? new Date(inv.updatedAt).getTime() : 0
            const shipmentTime = inv.shipmentUpdatedAt
              ? new Date(inv.shipmentUpdatedAt).getTime()
              : 0
            modifiedTime = Math.max(invoiceTime, shipmentTime)
          }
        } catch {
          // If DB is offline, continue with timestamp check
        }
      }
      if (!modifiedTime || cached.timestamp >= modifiedTime) {
        return cached.buffer
      }
    }
  }

  const url = `${getAppUrl()}/invoice/${encodeURIComponent(id)}?preview=true`
  const browser = await getBrowser()
  const page = await browser.newPage()

  try {
    await page.emulateMediaType("print")
    const documentToken = signDocumentToken(id, "render")
    const documentOrigin = new URL(url).origin

    // Filter out non-essential external requests (analytics, web vitals, HMR)
    await page.setRequestInterception(true)
    page.on("request", (req) => {
      const resourceType = req.resourceType()
      const reqUrl = req.url()

      // Abort background analytics, error reporting, and dev server hot-reload websocket
      if (
        reqUrl.includes("posthog") ||
        reqUrl.includes("sentry") ||
        reqUrl.includes("analytics") ||
        reqUrl.includes("telemetry") ||
        reqUrl.includes("/_next/webpack-hmr") ||
        reqUrl.includes("/_next/turbopack-hmr") ||
        reqUrl.includes("favicon.ico")
      ) {
        return req.abort()
      }

      // Abort video / media streaming
      if (resourceType === "media") {
        return req.abort()
      }

      const requestHeaders = { ...req.headers() }
      delete requestHeaders["x-internal-document-token"]
      delete requestHeaders.cookie
      if (new URL(reqUrl).origin === documentOrigin) {
        requestHeaders["x-internal-document-token"] = documentToken
        if (options.protectionCookie)
          requestHeaders.cookie = `_vercel_jwt=${encodeURIComponent(options.protectionCookie)}`
      }
      return req.continue({ headers: requestHeaders })
    })

    // Fast navigation with generous timeout during development cold compilation
    const navTimeout = process.env.NODE_ENV === "development" ? 60_000 : 25_000
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: navTimeout,
    })

    if (
      response?.status() !== 200 ||
      new URL(page.url()).pathname !== `/invoice/${id}`
    ) {
      throw new Error(
        `Invoice render did not reach the authorized document. Status: ${response?.status()}, URL: ${page.url()}`
      )
    }

    await page.waitForSelector("[data-invoice-document]", {
      timeout: navTimeout,
    })
    await page.evaluate(() => document.fonts.ready)

    const pdfUint8Array = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    const buffer = Buffer.from(pdfUint8Array)
    pdfCache.set(id, { buffer, timestamp: Date.now() })
    pdfCache.set(`invoice:${id}`, { buffer, timestamp: Date.now() })
    return buffer
  } finally {
    await page.close()
    scheduleBrowserReap()
  }
}

export async function renderLabelPdf(
  id: string,
  options: RenderInvoicePdfOptions = {}
): Promise<Buffer> {
  const cacheKey = `label:${id}`
  if (!options.forceFresh) {
    const cached = pdfCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      let modifiedTime = options.lastModified
        ? new Date(options.lastModified).getTime()
        : 0
      if (!modifiedTime) {
        try {
          const [inv] = await db
            .select({
              updatedAt: invoices.updatedAt,
              shipmentUpdatedAt: shipments.updatedAt,
            })
            .from(invoices)
            .leftJoin(shipments, eq(invoices.shipmentId, shipments.id))
            .where(eq(invoices.id, id))
          if (inv) {
            const invoiceTime = inv.updatedAt ? new Date(inv.updatedAt).getTime() : 0
            const shipmentTime = inv.shipmentUpdatedAt
              ? new Date(inv.shipmentUpdatedAt).getTime()
              : 0
            modifiedTime = Math.max(invoiceTime, shipmentTime)
          }
        } catch {
          // If DB is offline, continue with timestamp check
        }
      }
      if (!modifiedTime || cached.timestamp >= modifiedTime) {
        return cached.buffer
      }
    }
  }

  const url = `${getAppUrl()}/invoice/${encodeURIComponent(id)}/label?preview=true`
  const browser = await getBrowser()
  const page = await browser.newPage()

  try {
    await page.emulateMediaType("print")
    const documentToken = signDocumentToken(id, "render")
    const documentOrigin = new URL(url).origin

    await page.setRequestInterception(true)
    page.on("request", (req) => {
      const resourceType = req.resourceType()
      const reqUrl = req.url()

      if (
        reqUrl.includes("posthog") ||
        reqUrl.includes("sentry") ||
        reqUrl.includes("analytics") ||
        reqUrl.includes("telemetry") ||
        reqUrl.includes("/_next/webpack-hmr") ||
        reqUrl.includes("/_next/turbopack-hmr") ||
        reqUrl.includes("favicon.ico")
      ) {
        return req.abort()
      }

      if (resourceType === "media") {
        return req.abort()
      }

      const requestHeaders = { ...req.headers() }
      delete requestHeaders["x-internal-document-token"]
      delete requestHeaders.cookie
      if (new URL(reqUrl).origin === documentOrigin) {
        requestHeaders["x-internal-document-token"] = documentToken
        if (options.protectionCookie)
          requestHeaders.cookie = `_vercel_jwt=${encodeURIComponent(options.protectionCookie)}`
      }
      return req.continue({ headers: requestHeaders })
    })

    const navTimeout = process.env.NODE_ENV === "development" ? 60_000 : 25_000
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: navTimeout,
    })

    if (
      response?.status() !== 200 ||
      new URL(page.url()).pathname !== `/invoice/${id}/label`
    ) {
      throw new Error(
        `Label render did not reach the authorized document. Status: ${response?.status()}, URL: ${page.url()}`
      )
    }

    await page.waitForSelector("[data-shipping-label]", {
      timeout: navTimeout,
    })
    await page.evaluate(() => document.fonts.ready)

    const pdfUint8Array = await page.pdf({
      width: "4in",
      height: "3in",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    const buffer = Buffer.from(pdfUint8Array)
    pdfCache.set(cacheKey, { buffer, timestamp: Date.now() })
    return buffer
  } finally {
    await page.close()
    scheduleBrowserReap()
  }
}
