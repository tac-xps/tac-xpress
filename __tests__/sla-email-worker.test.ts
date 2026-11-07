import { beforeEach, expect, it, vi } from "vitest"
import type { BackgroundJob } from "@/lib/jobs/store"
const mocks = vi.hoisted(() => ({
  claim: vi.fn(),
  finish: vi.fn(),
  ticket: vi.fn(),
  email: vi.fn(),
  triage: vi.fn(),
}))
vi.mock("server-only", () => ({}))
vi.mock("@/lib/jobs/store", () => ({
  claimJob: mocks.claim,
  finishJob: mocks.finish,
}))
vi.mock("@/lib/db", () => ({
  db: { query: { tickets: { findFirst: mocks.ticket } } },
}))
vi.mock("@/app/actions/email-notifications", () => ({
  sendTicketNotification: mocks.email,
}))
vi.mock("@/app/actions/ai-triage", () => ({ triageTicket: mocks.triage }))
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}))
import { processBackgroundJobs } from "@/lib/jobs/worker"
beforeEach(() => {
  vi.resetAllMocks()
})
it("delivers the escalation template instead of a new-ticket email or AI triage", async () => {
  const job: BackgroundJob = {
    id: "synthetic-job",
    kind: "support_email",
    dedupe_key: "sla-breach/ticket",
    payload: { ticketId: "ticket", notificationType: "sla_breach" },
    attempts: 1,
    lease_token: "synthetic-lease",
    created_at: new Date(),
  }
  mocks.claim.mockResolvedValueOnce(job).mockResolvedValue(null)
  mocks.ticket.mockResolvedValue({
    id: "ticket",
    subject: "Synthetic inquiry",
    guestEmail: "synthetic@example.test",
  })
  mocks.email.mockResolvedValue({ success: true })
  await processBackgroundJobs()
  expect(mocks.email).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "sla_breach",
      idempotencyKey: "ticket-created/synthetic-job",
    })
  )
  expect(mocks.triage).not.toHaveBeenCalled()
  expect(mocks.finish).toHaveBeenCalledWith(job, true)
})
it("rejects unknown job kinds instead of running triage", async () => {
  const job = {
    id: "unknown-job",
    kind: "unsupported",
    payload: { ticketId: "ticket" },
  }
  mocks.claim.mockResolvedValueOnce(job).mockResolvedValue(null)
  mocks.ticket.mockResolvedValue({ id: "ticket" })
  await processBackgroundJobs()
  expect(mocks.triage).not.toHaveBeenCalled()
  expect(mocks.finish).toHaveBeenCalledWith(
    job,
    false,
    "Unsupported background job kind."
  )
})
it("keeps email work retryable when configuration skips the send", async () => {
  const job = {
    id: "skipped-job",
    kind: "support_email",
    payload: { ticketId: "ticket" },
    attempts: 1,
  }
  mocks.claim.mockResolvedValueOnce(job).mockResolvedValue(null)
  mocks.ticket.mockResolvedValue({
    id: "ticket",
    subject: "Synthetic",
    guestEmail: "synthetic@example.test",
  })
  mocks.email.mockResolvedValue({ success: true, skipped: true })
  await processBackgroundJobs()
  expect(mocks.finish).toHaveBeenCalledWith(
    job,
    false,
    "Email provider did not accept the notification."
  )
})
it("retains failed email work when its ticket has no recipient", async () => {
  const job = {
    id: "missing-recipient-job",
    kind: "support_email",
    payload: { ticketId: "ticket" },
    attempts: 1,
  }
  mocks.claim.mockResolvedValueOnce(job).mockResolvedValue(null)
  mocks.ticket.mockResolvedValue({ id: "ticket", subject: "Synthetic" })
  await processBackgroundJobs()
  expect(mocks.email).not.toHaveBeenCalled()
  expect(mocks.finish).toHaveBeenCalledWith(
    job,
    false,
    "Ticket notification recipient is missing or invalid."
  )
})
