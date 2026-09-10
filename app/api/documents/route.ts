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
    const { data, error } = await supabaseAdmin.storage.from("cargo-documents").download(path)
    if (error || !data) return NextResponse.json({ error: "Document not found." }, { status: 404 })
    return new NextResponse(Buffer.from(await data.arrayBuffer()), { headers: { "Content-Type": "application/octet-stream", "Content-Disposition": `attachment; filename="${parsed.filename.replace(/^[a-f0-9-]{36}_/, "")}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } })
  } catch (error) { Sentry.captureException(error, { tags: { area: "cargo_document_download" } }); return NextResponse.json({ error: "Unable to download document." }, { status: 500 }) }
}

