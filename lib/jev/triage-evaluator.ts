/**
 * Jev-powered ticket triage evaluator.
 *
 * Returns `null` when `TYPESAFE_API_KEY` is not configured, allowing the
 * caller to fall back to another triage provider (e.g. OpenAI via OpenRouter).
 *
 * When enabled, sends all five questions in one API call (Speculative Fan-Out),
 * applies Confidence-Gated Routing for human escalation, and derives priority
 * via Composite Scoring — all in plain TypeScript code.
 *
 * See lib/jev/triage-questions.ts for question definitions and thresholds.
 */
import "server-only"
import * as Sentry from "@sentry/nextjs"
import { jevClient, isJevEnabled } from "./client"
import {
  CATEGORY_QUESTION,
  URGENCY_SCORE,
  IS_BILLING_DISPUTE,
  IS_FRUSTRATED,
  HAS_SHIPMENT_REFERENCE,
  CATEGORY_CONFIDENCE_THRESHOLD,
  PRIORITY_CONFIDENCE_THRESHOLD,
  derivePriority,
  type TriageCategory,
  type TriagePriority,
} from "./triage-questions"

export interface JevTriageResult {
  category: TriageCategory
  priority: TriagePriority
  /** Raw Jev confidence on category classification (0–1). */
  confidence: number
  /** True when Jev's confidence is below threshold — flag for human review. */
  needsHumanReview: boolean
  /** Structured signals extracted for audit and dashboards. */
  signals: {
    urgencyScore: number
    isBillingDispute: number
    isFrustrated: number
    hasShipmentReference: number
  }
  /** Jev model version that produced the answer. */
  model: string
}

/**
 * Evaluate a support ticket with Jev and return a fully typed triage result.
 * Returns `null` when `TYPESAFE_API_KEY` is not set (caller should use fallback).
 *
 * @param subject   Ticket subject line.
 * @param body      Full ticket body / description.
 * @param shipmentContext  Optional: public shipment state appended to state.
 */
export async function evaluateTicketWithJev(
  subject: string,
  body: string,
  shipmentContext?: string
): Promise<JevTriageResult | null> {
  // Gracefully skip when no API key is configured
  if (!isJevEnabled || !jevClient) return null

  const stateText = [
    `Subject: ${subject}`,
    `Message: ${body}`,
    shipmentContext ? `Shipment context: ${shipmentContext}` : null,
  ]
    .filter(Boolean)
    .join("\n\n")

  return Sentry.startSpan(
    { name: "jev_system_one", op: "ai.triage.jev" },
    async (span) => {
      const response = await jevClient!.systemOne({
        state: stateText,
        questions: {
          category: CATEGORY_QUESTION,
          urgency: URGENCY_SCORE,
          isBillingDispute: IS_BILLING_DISPUTE,
          isFrustrated: IS_FRUSTRATED,
          hasShipmentReference: HAS_SHIPMENT_REFERENCE,
        },
      })

      span.setAttribute("ai.tokens.input", response.usage?.input_tokens ?? 0)
      span.setAttribute("ai.tokens.output", response.usage?.output_tokens ?? 0)

      const { answers, model } = response
      const categoryAnswer = answers.category
      const urgencyAnswer = answers.urgency
      const billingAnswer = answers.isBillingDispute
      const frustratedAnswer = answers.isFrustrated

      const category = categoryAnswer.choice as TriageCategory
      const categoryConfidence = categoryAnswer.confidence ?? 0
      const urgencyScore = urgencyAnswer.score
      const isBillingDispute = billingAnswer.noul
      const isFrustrated = frustratedAnswer.noul

      const priority = derivePriority({
        category,
        urgencyScore: Math.round(urgencyScore),
        isBillingDispute,
        isFrustrated,
      })

      // Flag for human review when either dimension falls below threshold
      const urgencyConfidence = urgencyAnswer.confidence ?? 0
      const needsHumanReview =
        categoryConfidence < CATEGORY_CONFIDENCE_THRESHOLD ||
        urgencyConfidence < PRIORITY_CONFIDENCE_THRESHOLD

      span.setAttribute("jev.category", category)
      span.setAttribute("jev.priority", priority)
      span.setAttribute("jev.confidence.category", categoryConfidence)
      span.setAttribute("jev.needs_human_review", needsHumanReview)

      return {
        category,
        priority,
        confidence: categoryConfidence,
        needsHumanReview,
        signals: {
          urgencyScore,
          isBillingDispute,
          isFrustrated,
          hasShipmentReference: answers.hasShipmentReference.noul,
        },
        model,
      }
    }
  )
}
