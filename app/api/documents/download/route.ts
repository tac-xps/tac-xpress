import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireDashboardApi } from "@/lib/auth/guards"
import { renderInvoicePdf, renderLabelPdf } from "@/lib/documents/render-invoice-pdf"
import { db } from "@/lib/db"
import { invoices, shipments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import {
  capturePublicError,
  createPublicErrorResponse,
} from "@/lib/server/public-errors"

export const maxDuration = 60

const querySchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["invoice", "label"]).default("invoice"),
})

export async function GET(request: NextRequest) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response

  const parsed = querySchema.safeParse({
    id: request.nextUrl.searchParams.get("id"),
    type: request.nextUrl.searchParams.get("type") || "invoice",
  })
  if (!parsed.success)
    return createPublicErrorResponse("Invalid document ID or type", 400)

  const { id, type } = parsed.data
  try {
    const protectionCookie = request.cookies.get("_vercel_jwt")?.value

    if (type === "label") {
      let awb = id.slice(0, 8).toUpperCase()
      try {
        const [inv] = await db
          .select({ shipmentId: invoices.shipmentId })
          .from(invoices)
          .where(eq(invoices.id, id))
        if (inv?.shipmentId) {
          const [ship] = await db
            .select({ awbNumber: shipments.awbNumber })
            .from(shipments)
            .where(eq(shipments.id, inv.shipmentId))
          if (ship?.awbNumber) {
            awb = ship.awbNumber
          }
        }
      } catch {
        // Fall back to short id slice
      }

      const pdf = await renderLabelPdf(id, { protectionCookie })
      return new NextResponse(new Uint8Array(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="shipping-label-${awb}.pdf"`,
          "Content-Length": String(pdf.length),
          "Cache-Control": "private, no-store",
        },
      })
    }

    const pdf = await renderInvoicePdf(id, { protectionCookie })
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`,
        "Content-Length": String(pdf.length),
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error(`[DocumentDownload] Failed to generate ${type} PDF for id:`, id, error)
    capturePublicError(error, { area: `${type}_download` })
    return createPublicErrorResponse(`Unable to download ${type}`, 500)
  }
}
