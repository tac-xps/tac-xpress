import "server-only"
import { choice, noul } from "@typesafe-ai/sdk"
import { jevClient, isJevEnabled } from "./client"
import { OpenAI } from "openai"
import * as Sentry from "@sentry/nextjs"

export const WHATSAPP_INTENT_CHOICE = choice(
  "What is the customer's primary intent in this WhatsApp message?",
  {
    tracking_request:
      "Checking whereabouts, tracking status, AWB, or delivery estimate of a shipment",
    complaint:
      "Complaining about delay, damage, lost parcel, bad service, or demanding escalation",
    billing_inquiry:
      "Inquiring about invoice, pricing, freight rates, payment, or charges",
    opt_out:
      "Requesting to stop, cancel, or unsubscribe from WhatsApp messages",
    opt_in:
      "Requesting to start, subscribe, or receive WhatsApp updates",
    general:
      "General inquiry, greeting, location, office hours, or miscellaneous question",
  }
)

export const WHATSAPP_IS_COMPLAINT = noul(
  "The customer is expressing dissatisfaction, reporting damaged goods, or complaining about late delivery"
)

export const WHATSAPP_IS_OPT_OUT = noul(
  "The customer wants to unsubscribe, cancel, or stop receiving messages"
)

export type WhatsAppIntent =
  | "tracking_request"
  | "complaint"
  | "billing_inquiry"
  | "opt_out"
  | "opt_in"
  | "general"

export interface WhatsAppClassificationResult {
  intent: WhatsAppIntent
  confidence: number
  isComplaint: boolean
  isOptOut: boolean
  provider: "jev" | "rule_based" | "openai"
}

/**
 * Fast rule-based intent deduction for deterministic commands and common logistics keywords.
 */
export function deriveWhatsAppIntentFromRules(text: string): {
  intent: WhatsAppIntent
  confidence: number
  isComplaint: boolean
  isOptOut: boolean
} | null {
  const clean = text.trim().toLowerCase()

  // Opt-out commands (standard regulatory keywords)
  if (["stop", "unsubscribe", "opt out", "cancel", "halt", "end"].includes(clean)) {
    return {
      intent: "opt_out",
      confidence: 1.0,
      isComplaint: false,
      isOptOut: true,
    }
  }

  // Opt-in commands
  if (["start", "subscribe", "opt in", "unstop"].includes(clean)) {
    return {
      intent: "opt_in",
      confidence: 1.0,
      isComplaint: false,
      isOptOut: false,
    }
  }

  // Explicit urgent complaints (evaluated before tracking so e.g. "TAC12345 damaged" escalates immediately)
  if (
    /\b(damaged|broken parcel|package crushed|cargo ruined|lost parcel|stolen cargo|terrible service|file a complaint|escalate this)\b/i.test(
      clean
    )
  ) {
    return {
      intent: "complaint",
      confidence: 0.9,
      isComplaint: true,
      isOptOut: /\b(stop|unsubscribe|opt out|cancel|halt)\b/i.test(clean),
    }
  }

  // Explicit tracking mentions or standard AWB patterns
  if (
    /^(track|where is|status of|eta of)/i.test(clean) ||
    /\b(tac|wb|awb|del|ghy)[0-9]{4,}\b/i.test(clean)
  ) {
    return {
      intent: "tracking_request",
      confidence: 0.9,
      isComplaint: false,
      isOptOut: /\b(stop|unsubscribe|opt out|cancel|halt)\b/i.test(clean),
    }
  }

  // Explicit billing keywords
  if (/\b(invoice|bill|charge|freight cost|payment receipt|gst bill)\b/i.test(clean)) {
    return {
      intent: "billing_inquiry",
      confidence: 0.85,
      isComplaint: false,
      isOptOut: /\b(stop|unsubscribe|opt out|cancel|halt)\b/i.test(clean),
    }
  }

  return null
}

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENROUTER_API) return null
  return new OpenAI({
    timeout: 8000,
    maxRetries: 0,
    apiKey: process.env.OPENROUTER_API,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://tac-xpress.app",
      "X-Title": "TAC-XPRESS",
    },
  })
}

/**
 * Classify inbound WhatsApp message intent.
 * Evaluates with TypeSafe Jev when enabled, falling back to OpenAI or rule heuristics.
 */
export async function classifyWhatsAppMessage(
  text: string
): Promise<WhatsAppClassificationResult> {
  // 1. Fast deterministic rule pass
  const ruleMatch = deriveWhatsAppIntentFromRules(text)
  if (ruleMatch && ruleMatch.confidence >= 0.9) {
    return {
      ...ruleMatch,
      provider: "rule_based",
    }
  }

  // 2. TypeSafe Jev path (System One calibrated evaluation)
  if (isJevEnabled && jevClient) {
    try {
      const response = await jevClient.systemOne({
        state: `Inbound WhatsApp message text from customer:\n"${text}"`,
        questions: {
          intent: WHATSAPP_INTENT_CHOICE,
          isComplaint: WHATSAPP_IS_COMPLAINT,
          isOptOut: WHATSAPP_IS_OPT_OUT,
        },
      })

      const choiceAnswer = response.answers.intent
      const isComplaintProb = response.answers.isComplaint?.noul ?? 0
      const isOptOutProb = response.answers.isOptOut?.noul ?? 0

      const intent = (choiceAnswer?.choice ?? "general") as WhatsAppIntent
      const confidence = choiceAnswer?.confidence ?? 0.7

      return {
        intent,
        confidence,
        isComplaint: isComplaintProb > 0.6,
        isOptOut: isOptOutProb > 0.7,
        provider: "jev",
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "jev_whatsapp_intent" },
      })
      console.warn("[WhatsApp Intent] Jev evaluation failed, falling back", error)
    }
  }

  // 3. Fallback: OpenAI structured classification
  const openai = getOpenAIClient()
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Classify inbound WhatsApp logistics message. Return JSON: {\"intent\": \"tracking_request\"|\"complaint\"|\"billing_inquiry\"|\"opt_out\"|\"opt_in\"|\"general\", \"confidence\": number, \"isComplaint\": boolean, \"isOptOut\": boolean}",
          },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 100,
      })

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}")
      return {
        intent: (parsed.intent || "general") as WhatsAppIntent,
        confidence: Number(parsed.confidence) || 0.75,
        isComplaint: Boolean(parsed.isComplaint),
        isOptOut: Boolean(parsed.isOptOut),
        provider: "openai",
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "openai_whatsapp_intent" },
      })
    }
  }

  // 4. Default to rule match or general
  return {
    intent: ruleMatch?.intent ?? "general",
    confidence: ruleMatch?.confidence ?? 0.5,
    isComplaint: ruleMatch?.isComplaint ?? false,
    isOptOut: ruleMatch?.isOptOut ?? false,
    provider: "rule_based",
  }
}
