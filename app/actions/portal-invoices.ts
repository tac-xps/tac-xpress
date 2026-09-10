"use server"
import * as Sentry from "@sentry/nextjs"
import { and, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { invoices, shipments } from "@/lib/db/schema"
import { invoiceOwnerFilter } from "@/lib/auth/portal-ownership"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { verifyPortalSession } from "@/app/actions/portal-auth"

export async function getPortalInvoices() {
  try {
    const session = await verifyPortalSession()
    if (!session) return { success: false, error: "Unauthorized" }
    const rows = await db.select({ id: invoices.id, amount: invoices.amount, status: invoices.status, created_at: invoices.createdAt, payment_mode: invoices.paymentMode, balance_due: invoices.balanceDue, shipment: { awb_number: shipments.awbNumber, origin: shipments.origin, destination: shipments.destination, status: shipments.status } }).from(invoices).innerJoin(shipments, eq(invoices.shipmentId, shipments.id)).where(invoiceOwnerFilter(session.email)).orderBy(desc(invoices.createdAt)).limit(100)
    return { success: true, data: rows.map(row => ({ ...row, created_at: row.created_at.toISOString() })) }
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "portal_invoices" } })
    return { success: false, error: "We couldn’t load your invoices. Please try again." }
  }
}
export async function downloadInvoice(invoiceId: string) {
  try {
    const session = await verifyPortalSession()
    if (!session) return { success: false, error: "Unauthorized" }
    const [invoice] = await db.select({ pdf: invoices.pdfUrl }).from(invoices).innerJoin(shipments, eq(invoices.shipmentId, shipments.id)).where(and(eq(invoices.id, invoiceId), invoiceOwnerFilter(session.email))).limit(1)
    if (!invoice) return { success: false, error: "Invoice not found" }
    if (!invoice.pdf) return { success: true, data: { url: null } }
    let filePath = invoice.pdf
    if (filePath.startsWith("https://")) {
      const url = new URL(filePath)
      if (url.origin !== new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin) return { success: false, error: "Invoice file unavailable" }
      const match = url.pathname.match(/^\/storage\/v1\/object\/(?:public|authenticated)\/cargo-documents\/(.+)$/)
      if (!match) return { success: false, error: "Invoice file unavailable" }
      filePath = match[1]
    }
    if (filePath.includes("..") || filePath.startsWith("/") || filePath.includes("://")) return { success: false, error: "Invoice file unavailable" }
    const { data, error } = await supabaseAdmin.storage.from("cargo-documents").createSignedUrl(filePath, 300)
    if (error) throw error
    return { success: true, data: { url: data.signedUrl } }
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "portal_invoice_download" } })
    return { success: false, error: "We couldn’t download your invoice. Please try again." }
  }
}
