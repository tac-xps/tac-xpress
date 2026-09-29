import "server-only"
import { noul } from "@typesafe-ai/sdk"
import { jevClient, isJevEnabled } from "./client"
import { OpenAI } from "openai"
import * as Sentry from "@sentry/nextjs"

export const GUARDRAIL_FALSE_CLAIM_QUESTION = noul(
  "Does this drafted response contain any claim about shipment status, location, delivery date, or carrier actions that contradicts or is unsupported by the verified shipment data?"
)

export const GUARDRAIL_UNAUTHORIZED_PROMISE_QUESTION = noul(
  "Does this drafted response promise financial compensation, refund, admission of liability, or policy exception?"
)

export const GUARDRAIL_THRESHOLD = 0.3

export interface GuardrailCheckResult {
  passed: boolean
  provider: "jev" | "openai" | "heuristic"
  falseClaimProbability?: number
  unauthorizedPromiseProbability?: number
  reason?: string
}

/**
 * Pure evaluation rule: blocks if false claim or promise probability exceeds threshold.
 */
export function parseGuardrailVerdict(
  falseClaimProb: number,
  promiseProb: number,
  threshold: number = GUARDRAIL_THRESHOLD
): { passed: boolean; reason?: string } {
  if (falseClaimProb > threshold) {
    return {
      passed: false,
      reason: `Potential false claim or hallucinated shipment fact detected (p=${falseClaimProb.toFixed(2)} > ${threshold})`,
    }
  }
  if (promiseProb > threshold) {
    return {
      passed: false,
      reason: `Unauthorized compensation or liability promise detected (p=${promiseProb.toFixed(2)} > ${threshold})`,
    }
  }
  return { passed: true }
}

/**
 * Fast pattern-matching heuristic checks for unauthorized promises.
 */
export function checkHeuristicGuardrails(reply: string): {
  passed: boolean
  reason?: string
} {
  const lower = reply.toLowerCase()
  const forbiddenPhrases = [
    "full refund",
    "will refund",
    "refund your",
    "compensate you",
    "we accept full liability",
    "we will credit your account",
    "promise delivery within",
    "guarantee delivery by tomorrow",
  ]

  for (const phrase of forbiddenPhrases) {
    if (lower.includes(phrase)) {
      return {
        passed: false,
        reason: `Draft contains prohibited phrase: "${phrase}"`,
      }
    }
  }
  return { passed: true }
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
 * Evaluate an AI-generated reply against safety guardrails before outbound dispatch.
 * Uses TypeSafe Jev if enabled, or falls back to OpenAI/heuristic check if key is absent.
 */
export async function evaluateReplyGuardrail(params: {
  reply: string
  category: string
  shipmentContext: string
}): Promise<GuardrailCheckResult> {
  const { reply, category, shipmentContext } = params

  // 1. First run fast heuristic check
  const heuristic = checkHeuristicGuardrails(reply)
  if (!heuristic.passed) {
    return {
      passed: false,
      provider: "heuristic",
      reason: heuristic.reason,
    }
  }

  // 2. TypeSafe Jev path (calibrated, typed System One judgment)
  if (isJevEnabled && jevClient) {
    try {
      const stateText = [
        `Verified Shipment Tracking Context:\n${shipmentContext}`,
        `Ticket Category: ${category}`,
        `Drafted AI Reply to Customer:\n${reply}`,
      ].join("\n\n")

      const response = await jevClient.systemOne({
        state: stateText,
        questions: {
          falseClaim: GUARDRAIL_FALSE_CLAIM_QUESTION,
          unauthorizedPromise: GUARDRAIL_UNAUTHORIZED_PROMISE_QUESTION,
        },
      })

      const falseClaimProb = response.answers.falseClaim?.noul ?? 0
      const promiseProb = response.answers.unauthorizedPromise?.noul ?? 0
      const verdict = parseGuardrailVerdict(falseClaimProb, promiseProb)

      return {
        passed: verdict.passed,
        provider: "jev",
        falseClaimProbability: falseClaimProb,
        unauthorizedPromiseProbability: promiseProb,
        reason: verdict.reason,
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "jev_reply_guardrail" },
      })
      console.warn("[Guardrail] Jev evaluation failed, falling back to OpenAI/heuristic", error)
    }
  }

  // 3. Fallback path: OpenAI structured audit via OpenRouter
  const openai = getOpenAIClient()
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI safety auditor for TAC-XPRESS logistics. Check if the drafted reply contains ungrounded claims about shipment status or makes unauthorized financial promises. Return JSON: {\"passed\": boolean, \"reason\": string, \"falseClaimScore\": number, \"promiseScore\": number}",
          },
          {
            role: "user",
            content: `Shipment Data: ${shipmentContext}\nCategory: ${category}\nDraft: ${reply}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 150,
      })

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}")
      const passed =
        parsed.passed !== false &&
        (parsed.falseClaimScore ?? 0) <= GUARDRAIL_THRESHOLD &&
        (parsed.promiseScore ?? 0) <= GUARDRAIL_THRESHOLD

      return {
        passed,
        provider: "openai",
        falseClaimProbability: parsed.falseClaimScore,
        unauthorizedPromiseProbability: parsed.promiseScore,
        reason: passed ? undefined : (parsed.reason || "Flagged by OpenAI safety auditor"),
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "openai_reply_guardrail" },
      })
      console.warn("[Guardrail] OpenAI audit failed, using heuristic result", error)
    }
  }

  // 4. Final fallback: Heuristic check passed
  return {
    passed: true,
    provider: "heuristic",
  }
}
