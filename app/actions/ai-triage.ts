import "server-only"

import { OpenAI } from "openai"
import { supabaseAdmin } from "@/lib/supabase/clients"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { logAudit } from "@/lib/audit"
import { safeParse } from "@/lib/validation/guard"
import { getPublicShipmentContext } from "@/lib/support/public-shipment-context"

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

import { routeTicket } from "@/lib/routing"
import { withRetry } from "@/lib/queue"

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

const triageResultSchema = z.object({
  category: z.enum(["delay", "damage", "billing", "general", "lost"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  reason: z.string().trim().min(1).max(500).optional(),
})

type TriageResult = z.infer<typeof triageResultSchema>

const CATEGORY_PROMPT = `You are a logistics support triage agent. Categorize the customer ticket into exactly one of: delay, damage, billing, general, lost.

Also assess priority: low, medium, high, critical.
Critical = shipment lost, dangerous goods issue, or SLA breach >48h.
High = delay >24h, visible damage, or billing dispute >$1000.
Medium = standard delay, minor damage, or billing question.
Low = general inquiry, documentation request.

Return ONLY valid JSON: {"category": "...", "priority": "...", "reason": "..."}`

async function createTimedTriageCompletion(input: {
  ticketId: string
  subject: string
  description: string
  shipmentContext: string
}) {
  return Sentry.startSpan(
    { name: "openai_chat_completion", op: "ai.triage.llm" },
    async (span) => {
      const result = await openai.chat.completions.create(
        {
          model: process.env.OPENAI_MODEL || "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: CATEGORY_PROMPT },
            {
              role: "user",
              content: `Subject: ${input.subject}\nDescription: ${input.description}\n${input.shipmentContext}`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          logprobs: true,
        },
        {
          signal: AbortSignal.timeout(10_000),
        }
      )

      const inputTokens = result.usage?.prompt_tokens || 0
      const outputTokens = result.usage?.completion_tokens || 0
      const cost = inputTokens * 0.00000015 + outputTokens * 0.0000006

      span.setAttribute("ai.tokens.input", inputTokens)
      span.setAttribute("ai.tokens.output", outputTokens)
      span.setAttribute("ai.cost.usd", cost)

      return result
    }
  )
}

export async function triageTicket(
  ticketId: string,
  subject: string,
  description: string,
  awb?: string
) {
  // Validate all inputs before processing
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

  const fallbackResult: TriageResult = {
    category: "general",
    priority: "medium",
    reason: "fallback_needs_human_review",
  }
  let result = fallbackResult
  let confidence = 0.0
  let needsHumanReview = false

  const completion = await withRetry(
    () =>
      createTimedTriageCompletion({
        ticketId: input.ticketId,
        subject: input.subject,
        description: input.description,
        shipmentContext,
      }),
    "ai_triage",
    {
      ticketId: input.ticketId,
      subject: input.subject,
      description: input.description,
      awb: input.awb,
    },
    1
  )

  if (!completion) {
    needsHumanReview = true
  } else {
    try {
      const parsed = triageResultSchema.parse(
        JSON.parse(completion.choices[0].message.content || "{}")
      )
      result = {
        category: parsed.category,
        priority: parsed.priority,
        reason: parsed.reason || "llm_classification",
      }
      confidence = completion.choices[0].logprobs ? 0.95 : 0.75 // Approximate
    } catch (e) {
      needsHumanReview = true
      Sentry.captureException(e, {
        extra: {
          context: "ai_triage_parse",
          content: completion.choices[0].message.content,
        },
      })
      console.error("[AI Triage] Failed to parse OpenAI JSON response", e)
    }
  }

  const routing = routeTicket({
    category: result.category,
    priority: result.priority,
    ai_confidence: confidence,
  })

  // Update ticket with AI classification
  const { error: updateError } = await supabaseAdmin
    .from("tickets")
    .update({
      category: result.category,
      priority: result.priority,
      ai_confidence: confidence,
      ai_routing: routing,
      needs_human_review: needsHumanReview,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.ticketId)
  if (updateError) throw updateError

  const { applySLA } = await import("@/app/actions/sla")
  // The durable worker owns retries; a failed SLA write must not complete its job.
  await applySLA(input.ticketId, result.priority, result.category)

  await logAudit({
    action: "ai_triage",
    entity: "tickets",
    entityId: input.ticketId,
    userEmail: "ai-triage@system",
    metadata: {
      category: result.category,
      priority: result.priority,
      reason: result.reason,
      confidence,
      needs_human_review: needsHumanReview,
    },
    after: {
      category: result.category,
      priority: result.priority,
      ai_confidence: confidence,
      ai_routing: routing,
      needs_human_review: needsHumanReview,
    },
  })

  // Trigger Auto-Responder if not critical/escalation
  if (
    !needsHumanReview &&
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
