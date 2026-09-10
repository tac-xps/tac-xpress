import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  recordExists: vi.fn(),
  bucket: vi.fn(),
  list: vi.fn(),
  upload: vi.fn(),
  remove: vi.fn(),
  audit: vi.fn(),
  captureException: vi.fn(),
}))

vi.mock("@/lib/auth/guards", () => ({ requireDashboardApi: mocks.authorize }))
vi.mock("@/lib/documents/cargo-storage", () => ({
  existingCargoRecord: mocks.recordExists,
}))
vi.mock("@/lib/supabase/clients", () => ({
  supabaseAdmin: { storage: { from: mocks.bucket } },
}))
vi.mock("@/lib/audit", () => ({ logAudit: mocks.audit }))
vi.mock("@sentry/nextjs", () => ({ captureException: mocks.captureException }))

const { GET, POST } =
  await import("@/app/api/cargo-documents/[entity]/[id]/route")
const { MAX_CARGO_FILE_BYTES } = await import("@/lib/documents/cargo-file")
const id = "11111111-1111-4111-8111-111111111111"
const userId = "22222222-2222-4222-8222-222222222222"
const origin = "https://cargo.example"
const url = `${origin}/api/cargo-documents/shipments/${id}?filename=bill.pdf`
const pdf = new TextEncoder().encode("%PDF-1.7\nA sample document")
const context = () => ({ params: Promise.resolve({ entity: "shipments", id }) })

function uploadRequest(
  options: { body?: BodyInit; headers?: Record<string, string> } = {}
) {
  return new Request(url, {
    method: "POST",
    headers: { origin, "content-type": "application/pdf", ...options.headers },
    body: options.body ?? pdf,
    duplex: "half",
  } as RequestInit)
}

describe("cargo document routes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.authorize.mockResolvedValue({
      ok: true,
      session: {
        user: { id: userId, email: "staff@example.com", role: "staff" },
      },
    })
    mocks.recordExists.mockResolvedValue(true)
    mocks.bucket.mockReturnValue({
      list: mocks.list,
      upload: mocks.upload,
      remove: mocks.remove,
    })
    mocks.list.mockResolvedValue({ data: [], error: null })
    mocks.upload.mockResolvedValue({ error: null })
    mocks.remove.mockResolvedValue({ error: null })
    mocks.audit.mockResolvedValue(undefined)
  })

  it.each(["https://attacker.example", ""])(
    "rejects invalid origin %s before authentication, body reads or storage",
    async (requestOrigin) => {
      const request = uploadRequest({ headers: { origin: requestOrigin } })
      const reader = vi.spyOn(request.body!, "getReader")
      const response = await POST(request, context())
      expect(response.status).toBe(403)
      expect(await response.json()).toEqual({
        error: "Invalid request origin.",
      })
      expect(mocks.authorize).not.toHaveBeenCalled()
      expect(mocks.recordExists).not.toHaveBeenCalled()
      expect(reader).not.toHaveBeenCalled()
      expect(mocks.bucket).not.toHaveBeenCalled()
    }
  )

  it.each([
    ["GET", 401],
    ["POST", 401],
    ["GET", 403],
    ["POST", 403],
  ] as const)(
    "preserves the authorization denial for %s (%s)",
    async (method, status) => {
      const denial = Response.json(
        { error: status === 401 ? "Unauthorized" : "Forbidden" },
        { status }
      )
      mocks.authorize.mockResolvedValue({ ok: false, response: denial })
      const request = method === "POST" ? uploadRequest() : new Request(url)
      const reader = request.body
        ? vi.spyOn(request.body, "getReader")
        : undefined
      const response = await (method === "POST" ? POST : GET)(
        request,
        context()
      )
      expect(response).toBe(denial)
      expect(mocks.recordExists).not.toHaveBeenCalled()
      expect(mocks.bucket).not.toHaveBeenCalled()
      if (reader) expect(reader).not.toHaveBeenCalled()
    }
  )

  it.each(["GET", "POST"] as const)(
    "rejects unavailable records before %s storage access",
    async (method) => {
      mocks.recordExists.mockResolvedValue(false)
      const response = await (method === "POST" ? POST : GET)(
        method === "POST" ? uploadRequest() : new Request(url),
        context()
      )
      expect(response.status).toBe(404)
      expect(mocks.recordExists).toHaveBeenCalledWith("shipments", id)
      expect(mocks.bucket).not.toHaveBeenCalled()
    }
  )

  it("rejects an oversized stream despite an understated Content-Length and cancels the reader", async () => {
    const cancel = vi.fn()
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(pdf)
        controller.enqueue(new Uint8Array(MAX_CARGO_FILE_BYTES))
      },
      cancel,
    })
    const response = await POST(
      uploadRequest({ body, headers: { "content-length": "1" } }),
      context()
    )
    expect(response.status).toBe(413)
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(mocks.bucket).not.toHaveBeenCalled()
    expect(mocks.audit).not.toHaveBeenCalled()
  })

  it("rejects an oversized declared length before reading the body", async () => {
    const request = uploadRequest({
      headers: { "content-length": String(MAX_CARGO_FILE_BYTES + 1) },
    })
    const reader = vi.spyOn(request.body!, "getReader")
    expect((await POST(request, context())).status).toBe(413)
    expect(reader).not.toHaveBeenCalled()
    expect(mocks.bucket).not.toHaveBeenCalled()
  })

  it("rejects HTML renamed as a PDF before storage access", async () => {
    const response = await POST(
      uploadRequest({ body: "<script>alert('not a PDF')</script>" }),
      context()
    )
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: "Choose a valid PDF, JPEG or PNG.",
    })
    expect(mocks.bucket).not.toHaveBeenCalled()
    expect(mocks.audit).not.toHaveBeenCalled()
  })

  it("uploads one document under its record and audits the exact saved object", async () => {
    const response = await POST(uploadRequest(), context())
    expect(response.status).toBe(201)
    expect(response.headers.get("cache-control")).toBe("private, no-store")
    expect(await response.json()).toEqual({ success: true })
    expect(mocks.bucket).toHaveBeenCalledWith("cargo-documents")
    expect(mocks.upload).toHaveBeenCalledTimes(1)
    const [path, bytes, options] = mocks.upload.mock.calls[0]
    expect(path).toMatch(
      new RegExp(`^shipments/${id}/[a-f0-9-]{36}_bill\\.pdf$`)
    )
    expect(bytes).toEqual(Buffer.from(pdf))
    expect(options).toEqual({ contentType: "application/pdf", upsert: false })
    expect(mocks.audit).toHaveBeenCalledWith({
      action: "upload_document",
      entity: "shipments",
      entityId: id,
      userId,
      userEmail: "staff@example.com",
      after: { path, size: pdf.byteLength },
    })
    expect(mocks.remove).not.toHaveBeenCalled()
  })

  it("removes only the just-created object when audit persistence fails", async () => {
    const auditFailure = new Error("Audit insert failed")
    mocks.audit.mockRejectedValue(auditFailure)
    const response = await POST(uploadRequest(), context())
    const uploadedPath = mocks.upload.mock.calls[0][0]
    expect(mocks.remove).toHaveBeenCalledExactlyOnceWith([uploadedPath])
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: "Unable to upload document. Try again.",
    })
    expect(mocks.captureException).toHaveBeenCalledWith(auditFailure, {
      tags: { area: "cargo_document_upload" },
    })
  })

  it("reports the saved document with a warning when audit compensation fails", async () => {
    const cleanupFailure = new Error("Storage removal failed")
    mocks.audit.mockRejectedValue(new Error("Audit insert failed"))
    mocks.remove.mockResolvedValue({ error: cleanupFailure })
    const response = await POST(uploadRequest(), context())
    expect(mocks.remove).toHaveBeenCalledExactlyOnceWith([
      mocks.upload.mock.calls[0][0],
    ])
    expect(response.status).toBe(201)
    expect(response.headers.get("cache-control")).toBe("private, no-store")
    const result = await response.json()
    expect(result).toMatchObject({
      success: true,
      warning: expect.stringContaining("Do not upload it again"),
    })
    expect(result).not.toHaveProperty("error")
    expect(mocks.captureException).toHaveBeenCalledWith(cleanupFailure, {
      tags: { area: "cargo_document_audit_cleanup" },
    })
  })
})
