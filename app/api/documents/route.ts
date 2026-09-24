import { NextResponse } from "next/server"
import { requireDashboardApi } from "@/lib/auth/guards"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { existingCargoRecord, parseCargoPath } from "@/lib/documents/cargo-storage"
import * as Sentry from "@sentry/nextjs"
export async function GET(request: Request) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  try {
    const path = new URL(request.url).searchParams.get("path") ?? ""
    const parsed = parseCargoPath(path)
    if (!parsed || !await existingCargoRecord(parsed.entity, parsed.id)) return NextResponse.json({ error: "Document not found." }, { status: 404 })
    const origin = request.headers.get("origin")
    const referer = request.headers.get("referer")
    const host = request.headers.get("host")
    
    // Basic origin/referer protection against hotlinking
    if (origin && !origin.includes(host ?? "")) {
      return NextResponse.json({ error: "Invalid origin." }, { status: 403 })
    }
    if (!origin && referer && !referer.includes(host ?? "")) {
      return NextResponse.json({ error: "Invalid referer." }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin.storage.from("cargo-documents").download(path)
    if (error || !data) return NextResponse.json({ error: "Document not found." }, { status: 404 })
    
    // Determine content type from filename to allow proper in-browser viewing when possible
    let contentType = "application/octet-stream"
    if (parsed.filename.toLowerCase().endsWith(".pdf")) contentType = "application/pdf"
    if (parsed.filename.toLowerCase().endsWith(".jpg") || parsed.filename.toLowerCase().endsWith(".jpeg")) contentType = "image/jpeg"
    if (parsed.filename.toLowerCase().endsWith(".png")) contentType = "image/png"

    return new NextResponse(Buffer.from(await data.arrayBuffer()), { 
      headers: { 
        "Content-Type": contentType, 
        "Content-Disposition": `inline; filename="${parsed.filename.replace(/^[a-f0-9-]{36}_/, "")}"`, 
        "Cache-Control": "private, max-age=3600, stale-while-revalidate=86400", 
        "X-Content-Type-Options": "nosniff" 
      } 
    })
  } catch (error) { Sentry.captureException(error, { tags: { area: "cargo_document_download" } }); return NextResponse.json({ error: "Unable to download document." }, { status: 500 }) }
}

