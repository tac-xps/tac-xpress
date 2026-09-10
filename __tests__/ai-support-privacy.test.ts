import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  publicTracking: vi.fn(),
  completion: vi.fn(),
  sendEmail: vi.fn(),
  applySLA: vi.fn(),
  from: vi.fn(),
}))

vi.mock("server-only", () => ({}))
vi.mock("@/lib/tracking/public-query", () => ({
  publicTrackingQuery: mocks.publicTracking,
}))
vi.mock("openai", () => ({
  OpenAI: class {
    chat = { completions: { create: mocks.completion } }
  },
}))
vi.mock("@/lib/supabase/clients", () => ({
  supabaseAdmin: { from: mocks.from },
}))
vi.mock("@/lib/queue", () => ({
  withRetry: (operation: () => Promise<unknown>) => operation(),
}))
vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn().mockResolvedValue(undefined),
}))
vi.mock("@/app/actions/sla", () => ({ applySLA: mocks.applySLA }))
vi.mock("@/app/actions/email-notifications", () => ({
  sendTicketNotification: mocks.sendEmail,
}))
vi.mock("@/lib/whatsapp/service", () => ({
  normalizeWhatsAppPhone: vi.fn(),
  sendWhatsAppTextMessage: vi.fn(),
}))
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  startSpan: (
    _options: unknown,
    operation: (span: { setAttribute: () => void }) => unknown
  ) => operation({ setAttribute: vi.fn() }),
}))

const { triageTicket } = await import("@/app/actions/ai-triage")
const { generateAutoReply } = await import("@/app/actions/ai-responder")
const ticketId = "11111111-1111-4111-8111-111111111111"
const awb = "TAC-123456"

describe("AI support shipment privacy", () => {
  beforeEach(() => {
    vi.stubEnv("AI_AUTO_REPLY_ENABLED", "true")
    vi.clearAllMocks()
    mocks.publicTracking.mockResolvedValue([])
    mocks.applySLA.mockResolvedValue(undefined)
    mocks.sendEmail.mockResolvedValue({ success: true })
    mocks.from.mockImplementation((table: string) => {
      if (table === "tickets")
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: {
                  ai_auto_reply_enabled: true,
                  source: "landing",
                  customer_email: "guest@example.com",
                  subject: "Shipment inquiry",
                },
                error: null,
              }),
            }),
          }),
          update: () => ({ eq: async () => ({ error: null }) }),
        }
      if (table === "ticket_replies")
        return { insert: async () => ({ error: null }) }
      throw new Error(`Unexpected privileged lookup: ${table}`)
    })
    mocks.completion.mockImplementation(
      async (request: {
        response_format?: unknown
        messages: { content: string }[]
      }) => ({
        choices: [
          {
            message: {
              content: request.response_format
                ? JSON.stringify({
                    category: "general",
                    priority: "low",
                    reason: "general inquiry",
                  })
                : request.messages[1].content,
            },
          },
        ],
      })
    )
  })
  afterEach(() => vi.unstubAllEnvs())

  it("sends no shipment details when the public projection excludes unpublished or deleted records", async () => {
    await triageTicket(
      ticketId,
      "Shipment inquiry",
      "Please share a delivery update.",
      awb
    )
    expect(mocks.publicTracking).toHaveBeenCalledTimes(2)
    expect(mocks.publicTracking).toHaveBeenCalledWith(awb)
    for (const [request] of mocks.completion.mock.calls) {
      expect(request.messages[1].content).toContain(
        "No public shipment updates are available."
      )
      expect(request.messages[1].content).not.toContain(awb)
    }
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "guest@example.com",
        body: expect.stringContaining(
          "No public shipment updates are available."
        ),
      })
    )
    expect(mocks.from).not.toHaveBeenCalledWith("shipments")
  })

  it("uses the published event status and excludes private record fields from prompts and email", async () => {
    mocks.publicTracking.mockResolvedValue([
      {
        awb_number: awb,
        origin: "Delhi",
        destination: "Mumbai",
        service: "express_air",
        estimated_delivery: new Date("2026-09-08T10:00:00Z"),
        event: { status: "in_transit" },
        status: "private-investigation",
        consignee_email: "private-person@example.com",
        weight_kg: "private-weight",
        internal_notes: "private-investigation-notes",
      },
    ])
    await triageTicket(
      ticketId,
      "Shipment inquiry",
      "Please share a delivery update.",
      awb
    )
    for (const [request] of mocks.completion.mock.calls) {
      expect(request.messages[1].content).toContain('"status":"in_transit"')
      expect(request.messages[1].content).not.toContain("private-")
    }
    expect(mocks.sendEmail.mock.calls[0][0].body).toContain(
      '"status":"in_transit"'
    )
    expect(mocks.sendEmail.mock.calls[0][0].body).not.toContain("private-")
    expect(mocks.from).not.toHaveBeenCalledWith("shipments")
  })

  it("propagates an SLA failure to the durable worker before sending an auto-reply", async () => {
    mocks.applySLA.mockRejectedValue(new Error("SLA database unavailable"))
    await expect(
      triageTicket(ticketId, "Shipment inquiry", "Please share an update.", awb)
    ).rejects.toThrow("SLA database unavailable")
    expect(mocks.sendEmail).not.toHaveBeenCalled()
  })

  it("rejects a raw shipment object at the auto-reply boundary", async () => {
    await expect(
      generateAutoReply(ticketId, "general", {
        awb_number: awb,
        status: "private-status",
      } as never)
    ).rejects.toThrow()
    expect(mocks.completion).not.toHaveBeenCalled()
    expect(mocks.sendEmail).not.toHaveBeenCalled()
  })

  it("keeps the triage promise pending until its email follow-up finishes", async () => {
    let releaseEmail!: (value: { success: true }) => void
    let emailStarted!: () => void
    const started = new Promise<void>((resolve) => {
      emailStarted = resolve
    })
    mocks.sendEmail.mockImplementation(() => {
      emailStarted()
      return new Promise((resolve) => {
        releaseEmail = resolve
      })
    })
    let complete = false
    const result = triageTicket(
      ticketId,
      "Shipment inquiry",
      "Please share a delivery update.",
      awb
    ).then(() => {
      complete = true
    })
    await started
    expect(complete).toBe(false)
    releaseEmail({ success: true })
    await result
    expect(complete).toBe(true)
  })
})
