import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { requireDashboardApi } from "@/lib/auth/guards"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { existingCargoRecord } from "@/lib/documents/cargo-storage"
import {
  MAX_CARGO_FILE_BYTES,
  cargoFileExtension,
  safeCargoFilename,
} from "@/lib/documents/cargo-file"
import { logAudit } from "@/lib/audit"
import * as Sentry from "@sentry/nextjs"
type Context = { params: Promise<{ entity: string; id: string }> }
const responseHeaders = { "Cache-Control": "private, no-store" }
export async function GET(_request: Request, { params }: Context) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  try {
    const { entity, id } = await params
    if (!(await existingCargoRecord(entity, id)))
      return NextResponse.json({ error: "Record not found." }, { status: 404 })
    const prefix = `${entity}/${id}`
    const { data, error } = await supabaseAdmin.storage
      .from("cargo-documents")
      .list(prefix, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      })
    if (error) throw error
    return NextResponse.json(
      (data ?? [])
        .filter((item) => item.id)
        .map((item) => ({
          name: item.name.replace(/^[a-f0-9-]{36}_/, ""),
          path: `${prefix}/${item.name}`,
          size: Number(item.metadata?.size ?? 0),
          createdAt: item.created_at,
        })),
      { headers: responseHeaders }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "cargo_documents_list" } })
    return NextResponse.json(
      { error: "Unable to load documents." },
      { status: 500 }
    )
  }
}
export async function POST(request: Request, { params }: Context) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    )
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  try {
    const { entity, id } = await params
    if (!(await existingCargoRecord(entity, id)))
      return NextResponse.json({ error: "Record not found." }, { status: 404 })
    if (
      Number(request.headers.get("content-length") ?? 0) > MAX_CARGO_FILE_BYTES
    )
      return NextResponse.json(
        { error: "Choose a file under 5 MB." },
        { status: 413 }
      )
    const reader = request.body?.getReader()
    if (!reader)
      return NextResponse.json({ error: "Choose a document." }, { status: 400 })
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_CARGO_FILE_BYTES) {
        await reader.cancel()
        return NextResponse.json(
          { error: "Choose a file under 5 MB." },
          { status: 413 }
        )
      }
      chunks.push(value)
    }
    const bytes = Buffer.concat(chunks)
    const extension = cargoFileExtension(
      bytes,
      request.headers.get("content-type") ?? ""
    )
    if (!extension)
      return NextResponse.json(
        { error: "Choose a valid PDF, JPEG or PNG." },
        { status: 400 }
      )
    const filename = safeCargoFilename(
      new URL(request.url).searchParams.get("filename") ?? "document",
      extension
    )
    const path = `${entity}/${id}/${randomUUID()}_${filename}`
    const { error } = await supabaseAdmin.storage
      .from("cargo-documents")
      .upload(path, bytes, {
        contentType: request.headers.get("content-type")!,
        upsert: false,
      })
    if (error) throw error
    try {
      await logAudit({
        action: "upload_document",
        entity,
        entityId: id,
        userId: access.session.user.id,
        userEmail: access.session.user.email,
        after: { path, size },
      })
    } catch (auditError) {
      const cleanup = await supabaseAdmin.storage
        .from("cargo-documents")
        .remove([path])
      if (cleanup.error) {
        Sentry.captureException(cleanup.error, {
          tags: { area: "cargo_document_audit_cleanup" },
        })
        return NextResponse.json(
          {
            success: true,
            warning:
              "The document was saved, but audit logging failed. Do not upload it again; contact your administrator to reconcile the audit entry.",
          },
          { status: 201, headers: responseHeaders }
        )
      }
      throw auditError
    }
    return NextResponse.json(
      { success: true },
      { status: 201, headers: responseHeaders }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "cargo_document_upload" } })
    return NextResponse.json(
      { error: "Unable to upload document. Try again." },
      { status: 500 }
    )
  }
}
