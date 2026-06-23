"use server"

import * as Sentry from "@sentry/nextjs"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { verifyPortalSession } from "@/app/actions/portal-auth"
import { writeAuditLog } from "@/lib/audit"

export async function getPortalInvoices() {
  try {
    const session = await verifyPortalSession()
    if (!session) return { success: false, error: "Unauthorized" }

    const { data, error } = await supabaseAdmin
      .from("invoices")
      .select(
        `
        id,
        amount,
        status,
        pdf_url,
        created_at,
        updated_at,
        payment_mode,
        balance_due,
        subtotal,
        shipment_id,
        shipment:shipments(awb_number, origin, destination, status)
      `
      )
      .eq("customer_email", session.email)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[getPortalInvoices]", error)
      return { success: false, error: "Failed to load invoices" }
    }

    writeAuditLog({ userEmail: session.email, action: "invoice_view" })

    return { success: true, data: data ?? [] }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "portal_invoices" },
    })
    return { success: false, error: "Failed to load invoices" }
  }
}

export async function downloadInvoice(invoiceId: string) {
  try {
    const session = await verifyPortalSession()
    if (!session) return { success: false, error: "Unauthorized" }

    // CRITICAL: Verify this invoice belongs to the authenticated session email.
    // Never trust the invoiceId param alone — must match session.email.
    const { data: invoice, error } = await supabaseAdmin
      .from("invoices")
      .select("id, customer_email, pdf_url, shipment_id")
      .eq("id", invoiceId)
      .single()

    if (error || !invoice) {
      return { success: false, error: "Invoice not found" }
    }

    if (invoice.customer_email !== session.email) {
      // Log the attempted unauthorized access
      writeAuditLog({
        userEmail: session.email,
        action: "invoice_download",
        resourceId: invoiceId,
        metadata: { authorized: false, reason: "email_mismatch" },
      })
      return { success: false, error: "Unauthorized" }
    }

    // Audit log the authorized download
    writeAuditLog({
      userEmail: session.email,
      action: "invoice_download",
      resourceId: invoiceId,
      metadata: { authorized: true, shipment_id: invoice.shipment_id },
    })

    // If there's a stored PDF, generate a signed URL (expires in 5 minutes)
    if (invoice.pdf_url) {
      const filePath = invoice.pdf_url.replace(
        /^.*\/storage\/v1\/object\/public\/invoices\//,
        ""
      )
      const { data: signedUrl } = await supabaseAdmin.storage
        .from("cargo-documents")
        .createSignedUrl(filePath, 300) // 5 minute expiry

      if (signedUrl) {
        return { success: true, data: { url: signedUrl.signedUrl } }
      }
    }

    // No PDF stored — return null so UI can show "Invoice not available yet"
    return { success: true, data: { url: null } }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "portal_invoice_download" },
      extra: { invoiceId },
    })
    return { success: false, error: "Failed to download invoice" }
  }
}
