import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { verifyDocumentToken } from "@/lib/auth/document-token"
import { renderInvoicePdf } from "@/lib/documents/render-invoice-pdf"
import { capturePublicError, createPublicErrorResponse } from "@/lib/server/public-errors"
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")
  const sig = request.nextUrl.searchParams.get("sig")
  if (!z.string().uuid().safeParse(id).success) return createPublicErrorResponse("Invalid invoice ID", 400)
  if (!verifyDocumentToken(sig, id!, "pdf")) return createPublicErrorResponse("Invalid or expired document authorization", 403)
  try {
    const pdf = await renderInvoicePdf(id!)
    const fileName = `whatsapp-invoice-${id}.pdf`
    const { data, error } = await supabaseAdmin.storage.from("cargo-documents").upload(fileName, pdf, { contentType: "application/pdf", upsert: true })
    if (error) throw error
    const { data: link, error: linkError } = await supabaseAdmin.storage.from("cargo-documents").createSignedUrl(fileName, 3600)
    if (linkError || !link) throw linkError || new Error("Document URL unavailable")
    return NextResponse.json({ success: true, fileName, path: data.path, signedUrl: link.signedUrl }, { headers: { "Cache-Control": "private, no-store" } })
  } catch (error) {
    capturePublicError(error, { area: "invoice_pdf" })
    return createPublicErrorResponse("Unable to generate invoice PDF", 500)
  }
}
