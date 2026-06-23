import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import puppeteer from "puppeteer"
import { requireDashboardApi } from "@/lib/auth/guards"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")

  if (!id) {
    return new NextResponse("Missing id parameter", { status: 400 })
  }

  const authResult = await requireDashboardApi()
  if (!authResult.ok) {
    return authResult.response
  }
  const user = authResult.session.user

  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from("invoices")
    .select("customer_id")
    .eq("id", id)
    .single()

  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 })
  }

  if (user.role === "customer" && invoice.customer_id !== user.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  let browser
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const url = `${appUrl}/invoice/${id}?preview=true`

    browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle0" })
    const pdfBytes = await page.pdf({ format: "A4", printBackground: true })

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`,
      },
    })
  } catch (err: any) {
    console.error("PDF generation failed:", err)
    return new NextResponse("PDF generation failed", { status: 500 })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
