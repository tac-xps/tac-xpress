import "server-only"

import { OpenAI } from "openai"
import { supabaseAdmin } from "@/lib/supabase/clients"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { logAudit } from "@/lib/audit"
import { safeParse } from "@/lib/validation/guard"
import { getPublicShipmentContext } from "@/lib/support/public-shipment-context"
import { evaluateTicketWithJev, isJevEnabled, type JevTriageResult } from "@/lib/jev"
import { routeTicket } from "@/lib/routing"
import { withRetry } from "@/lib/queue"

// ─── Shared types ─────────────────────────────────────────────────────────────

type TriageCategory = "delay" | "damage" | "billing" | "general" | "lost"
type TriagePriority = "low" | "medium" | "high" | "critical"

interface TriageResult {
  category: TriageCategory
  priority: TriagePriority
  confidence: number
  needsHumanReview: boolean
  signals?: JevTriageResult["signals"]
  model: string
  provider: "jev" | "openai" | "fallback"
}

// ─── Input validation ─────────────────────────────────────────────────────────

const triageInputSchema = z.object({
  ticketId: z.string().uuid("Invalid ticket ID format"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description too long"),
  awb: z
    .string()
    .regex(/^[A-Z0-9-]{5,40}$/i, "Invalid AWB format")
    .optional(),
})

// ─── OpenAI / OpenRouter path (runs when TYPESAFE_API_KEY is not set) ─────────

const openai = new OpenAI({
  timeout: 10000,
  maxRetries: 0,
  apiKey: process.env.OPENROUTER_API,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://tac-xpress.app",
    "X-Title": "TAC-XPRESS",
  },
})

const OPENAI_TRIAGE_PROMPT = `You are a logistics support triage agent. Categorize the customer ticket into exactly one of: delay, damage, billing, general, lost.

Also assess priority: low, medium, high, critical.
Critical = shipment lost, dangerous goods issue, or SLA breach >48h.
High = delay >24h, visible damage, or billing dispute >$1000.
Medium = standard delay, minor damage, or billing question.
Low = general inquiry, documentation request.

Return ONLY valid JSON: {"category": "...", "priority": "...", "reason": "..."}`

const openaiTriageResultSchema = z.object({
  category: z.enum(["delay", "damage", "billing", "general", "lost"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  reason: z.string().trim().min(1).max(500).optional(),
})

async function triageWithOpenAI(input: {
  ticketId: string
  subject: string
  description: string
  shipmentContext: string
}): Promise<TriageResult> {
  return Sentry.startSpan(
    { name: "openai_chat_completion", op: "ai.triage.openai" },
    async (span) => {
      const completion = await openai.chat.completions.create(
        {
          model: process.env.OPENAI_MODEL || "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: OPENAI_TRIAGE_PROMPT },
            {
              role: "user",
              content: `Subject: ${input.subject}\nDescription: ${input.description}\n${input.shipmentContext}`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          logprobs: true,
        },
        { signal: AbortSignal.timeout(10_000) }
      )

      const inputTokens = completion.usage?.prompt_tokens ?? 0
      const outputTokens = completion.usage?.completion_tokens ?? 0
      const cost = inputTokens * 0.00000015 + outputTokens * 0.0000006

      span.setAttribute("ai.tokens.input", inputTokens)
      span.setAttribute("ai.tokens.output", outputTokens)
      span.setAttribute("ai.cost.usd", cost)

      const parsed = openaiTriageResultSchema.parse(
        JSON.parse(completion.choices[0].message.content || "{}")
      )

      const confidence = completion.choices[0].logprobs ? 0.95 : 0.75

      return {
        category: parsed.category,
        priority: parsed.priority,
        confidence,
        needsHumanReview: confidence < 0.65,
        model: process.env.OPENAI_MODEL || "openai/gpt-4o-mini",
        provider: "openai",
      }
    }
  )
}

// ─── Main triage orchestrator ─────────────────────────────────────────────────

/**
 * Triage a support ticket using the best available AI provider:
 *
 *  1. **Jev** (TypeSafe System One) — used when TYPESAFE_API_KEY is set.
 *     Returns typed Category/Priority/Urgency/Frustration signals in one call.
 *
 *  2. **OpenAI via OpenRouter** — used when TYPESAFE_API_KEY is absent.
 *     Restores the original prompt-and-parse approach as a full-quality fallback.
 *
 *  3. **Hard fallback** — if both providers fail, marks the ticket for human
 *     review so it is never silently lost.
 */
export async function triageTicket(
  ticketId: string,
  subject: string,
  description: string,
  awb?: string
) {
  const input = safeParse(triageInputSchema, {
    ticketId,
    subject,
    description,
    awb,
  })

  const shipment = await getPublicShipmentContext(input.awb)
  const shipmentContext = shipment
    ? `Public shipment update: ${JSON.stringify(shipment)}`
    : "No public shipment updates are available."

  const hardFallback: TriageResult = {
    category: "general",
    priority: "medium",
    confidence: 0.0,
    needsHumanReview: true,
    model: "fallback",
    provider: "fallback",
  }

  let result: TriageResult = hardFallback

  if (isJevEnabled) {
    // ── Path 1: Jev ───────────────────────────────────────────────────────────
    try {
      const jevResult = await withRetry(
        () =>
          evaluateTicketWithJev(
            input.subject,
            input.description,
            shipmentContext
          ),
        "jev_triage",
        { ticketId: input.ticketId, subject: input.subject, awb: input.awb },
        1
      )
      if (jevResult) {
        result = { ...jevResult, provider: "jev" }
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "ai_triage", provider: "jev" },
        extra: { ticketId: input.ticketId },
      })
      // Falls through to hard fallback — OpenAI is not attempted as a second
      // chance here; Jev being available but erroring is a different problem.
    }
  } else {
    // ── Path 2: OpenAI via OpenRouter ─────────────────────────────────────────
    try {
      const openaiResult = await withRetry(
        () =>
          triageWithOpenAI({
            ticketId: input.ticketId,
            subject: input.subject,
            description: input.description,
            shipmentContext,
          }),
        "ai_triage",
        { ticketId: input.ticketId, subject: input.subject, awb: input.awb },
        1
      )
      if (openaiResult) result = openaiResult
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "ai_triage", provider: "openai" },
        extra: { ticketId: input.ticketId },
      })
    }
  }

  const routing = routeTicket({
    category: result.category,
    priority: result.priority,
    ai_confidence: result.confidence,
  })

  const { error: updateError } = await supabaseAdmin
    .from("tickets")
    .update({
      category: result.category,
      priority: result.priority,
      ai_confidence: result.confidence,
      ai_routing: routing,
      needs_human_review: result.needsHumanReview,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.ticketId)
  if (updateError) throw updateError

  const { applySLA } = await import("@/app/actions/sla")
  await applySLA(
    input.ticketId,
    result.priority,
    result.category,
    result.signals?.urgencyScore
  )

  await logAudit({
    action: "ai_triage",
    entity: "tickets",
    entityId: input.ticketId,
    userEmail: "ai-triage@system",
    metadata: {
      provider: result.provider,
      model: result.model,
      category: result.category,
      priority: result.priority,
      confidence: result.confidence,
      needs_human_review: result.needsHumanReview,
      ...(result.signals ? { signals: result.signals } : {}),
    },
    after: {
      category: result.category,
      priority: result.priority,
      ai_confidence: result.confidence,
      ai_routing: routing,
      needs_human_review: result.needsHumanReview,
    },
  })

  if (
    !result.needsHumanReview &&
    result.priority !== "critical" &&
    result.priority !== "high"
  ) {
    const { generateAutoReply } = await import("@/app/actions/ai-responder")
    await withRetry(
      () => generateAutoReply(input.ticketId, result.category, input.awb),
      "ai_auto_reply",
      { ticketId: input.ticketId, category: result.category, awb: input.awb }
    )
  }

  return result
}
