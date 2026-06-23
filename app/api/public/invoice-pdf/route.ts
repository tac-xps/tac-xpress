import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import {
  capturePublicError,
  createPublicErrorResponse,
} from "@/lib/server/public-errors"

export const maxDuration = 60 // Set max duration for Vercel Serverless Function

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")
  const sig = searchParams.get("sig")

  if (!id || !sig) {
    return new NextResponse("Missing parameters", { status: 400 })
  }

  const secret = process.env.INVOICE_PDF_SIGNING_SECRET
  if (!secret) {
    return new NextResponse("Server misconfiguration", { status: 500 })
  }

  // Verify signature
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(id)
    .digest("hex")
  const providedSig = Buffer.from(sig, "hex")
  const expectedSigBuffer = Buffer.from(expectedSig, "hex")

  if (
    providedSig.length !== expectedSigBuffer.length ||
    !crypto.timingSafeEqual(providedSig, expectedSigBuffer)
  ) {
    return new NextResponse("Invalid signature", { status: 403 })
  }

  try {
    let appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://tac-xpress.vercel.app"
    if (appUrl.includes("localhost") && process.env.NODE_ENV === "production") {
      appUrl = "https://tac-xpress.vercel.app"
    }
    const url = `${appUrl}/invoice/${id}?preview=true`

    const isDev = process.env.NODE_ENV === "development"
    let browser = null

    try {
      if (isDev) {
        console.log("Running local PDF generation with full puppeteer...")
        const puppeteer = await import("puppeteer")
        browser = await puppeteer.default.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        })
      } else {
        // In production (Vercel), use sparticuz to bypass 50MB limit
        const puppeteerCore = await import("puppeteer-core")
        const chromium = await import("@sparticuz/chromium")

        browser = await puppeteerCore.default.launch({
          args: chromium.default.args,
          defaultViewport: (chromium.default as any).defaultViewport,
          executablePath: await chromium.default.executablePath(),
          headless: (chromium.default as any).headless,
        })
      }

      const page = await browser.newPage()
      const bypassToken = crypto
        .createHash("sha256")
        .update(process.env.INVOICE_PDF_SIGNING_SECRET || "bypass")
        .digest("hex")
      await page.setExtraHTTPHeaders({
        "x-puppeteer-bypass": bypassToken,
      })
      await page.goto(url, { waitUntil: "networkidle0" })
      const pdfBytes = await page.pdf({ format: "A4", printBackground: true })

      // Upload to Supabase Storage
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase configuration")
      }

      const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

      const fileName = `whatsapp-invoice-${id}.pdf`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cargo-documents")
        .upload(fileName, pdfBytes, {
          contentType: "application/pdf",
          upsert: true,
        })

      if (uploadError) {
        throw new Error(
          `Failed to upload PDF to Supabase: ${uploadError.message}`
        )
      }

      // Create a long-lived signed URL for WPBox
      const { data: signedUrlData, error: signError } = await supabase.storage
        .from("cargo-documents")
        .createSignedUrl(fileName, 60 * 60 * 24 * 7)

      if (signError || !signedUrlData) {
        throw signError || new Error("Failed to create signed URL")
      }

      // Return the JSON with the Signed URL
      return NextResponse.json({
        success: true,
        fileName: fileName,
        path: uploadData.path,
        signedUrl: signedUrlData.signedUrl,
      })
    } finally {
      if (browser) {
        await browser.close().catch(() => undefined)
      }
    }
  } catch (error) {
    capturePublicError(error, {
      area: "public_invoice_pdf",
      extras: { invoiceId: id },
    })
    return createPublicErrorResponse("Failed to generate invoice PDF", 500)
  }
}
