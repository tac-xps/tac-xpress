import "server-only"
import { getAppUrl } from "@/lib/config/app-url"
import { signDocumentToken } from "@/lib/auth/document-token"
import { isAbsolute } from "node:path"

export async function renderInvoicePdf(id: string) {
  const url = `${getAppUrl()}/invoice/${encodeURIComponent(id)}?preview=true`
  const configuredBrowser = process.env.PDF_BROWSER_EXECUTABLE_PATH
  if (configuredBrowser && !isAbsolute(configuredBrowser)) throw new Error("PDF_BROWSER_EXECUTABLE_PATH must be absolute.")
  const browser =
    configuredBrowser
      ? await (await import("puppeteer-core")).default.launch({ headless: true, executablePath: configuredBrowser })
      : process.env.NODE_ENV === "development"
      ? await (await import("puppeteer")).default.launch({ headless: true })
      : await (async () => {
          const puppeteer = (await import("puppeteer-core")).default
          const chromium = (await import("@sparticuz/chromium")).default
          return puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
          })
        })()
  try {
    const page = await browser.newPage()
    await page.emulateMediaType("print")
    await page.setExtraHTTPHeaders({
      "x-internal-document-token": signDocumentToken(id, "render"),
    })
    const response = await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    })
    if (
      response?.status() !== 200 ||
      new URL(page.url()).pathname !== `/invoice/${id}`
    )
      throw new Error("Invoice render did not reach the authorized document.")
    await page.waitForSelector("[data-invoice-document]")
    await page.evaluate(() => document.fonts.ready)
    return await page.pdf({ format: "A4", printBackground: true })
  } finally {
    await browser.close()
  }
}
