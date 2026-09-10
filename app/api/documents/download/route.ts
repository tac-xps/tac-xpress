import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireDashboardApi } from "@/lib/auth/guards"
import { renderInvoicePdf } from "@/lib/documents/render-invoice-pdf"
import { capturePublicError, createPublicErrorResponse } from "@/lib/server/public-errors"
export const maxDuration = 60
export async function GET(request: NextRequest) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  const id = request.nextUrl.searchParams.get("id")
  if (!z.string().uuid().safeParse(id).success) return createPublicErrorResponse("Invalid invoice ID", 400)
  try {
    const pdf = await renderInvoicePdf(id!)
    return new NextResponse(Buffer.from(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`, "Cache-Control": "private, no-store" } })
  } catch (error) {
    capturePublicError(error, { area: "invoice_download" })
    return createPublicErrorResponse("Unable to download invoice", 500)
  }
}
