/**
 * Triage questions for Jev — the single source of truth for all TypeSafe
 * question definitions and confidence thresholds used in the support pipeline.
 *
 * Design principle: keep every question narrow and factual so Jev can evaluate
 * it as a gut-check judgment. Combine results with plain logic here in code.
 *
 * Patterns used:
 *  - Speculative fan-out  (all questions sent in one call, evaluated in parallel)
 *  - Confidence-gated routing  (needsHumanReview driven by confidence thresholds)
 *  - Composite scoring  (priority derived by weighing urgency + category severity)
 */
import { choice, noul, score } from "@typesafe-ai/sdk"

// ─── Question definitions ────────────────────────────────────────────────────

/**
 * Classify the primary issue type of a support ticket.
 * Maps directly to TriageTicketCategory in lib/support/tickets.ts.
 */
export const CATEGORY_QUESTION = choice(
  "What is the primary issue described in this support ticket?",
  {
    delay: "The shipment is late or behind schedule",
    damage: "Cargo was damaged, broken, or physically harmed in transit",
    billing: "There is a dispute, question, or error about charges or invoices",
    lost: "The shipment cannot be located, is missing, or was never delivered",
    general: "General inquiry, documentation, or anything that does not fit the above categories",
  }
)

/**
 * Score urgency on a 3-level rubric.
 * The score index (0-2) maps to urgency bands used in priority derivation below.
 */
export const URGENCY_SCORE = score(
  "How urgent is this support request?",
  [
    "Routine — no time pressure or deadline mentioned",
    "Elevated — customer mentions a deadline, frustration, or impact to business",
    "Critical — SLA breach, safety risk, dangerous goods, or explicit escalation demand",
  ]
)

/** True if the ticket involves a financial dispute or billing error. */
export const IS_BILLING_DISPUTE = noul(
  "The message describes a billing error, disputed charge, or invoice discrepancy"
)

/** True if the customer sounds frustrated or angry rather than informational. */
export const IS_FRUSTRATED = noul(
  "The customer sounds frustrated, upset, or emotionally distressed"
)

/** True if a specific shipment tracking reference (AWB, waybill) is mentioned. */
export const HAS_SHIPMENT_REFERENCE = noul(
  "The message references a specific shipment, airway bill, or tracking number"
)

// ─── Confidence thresholds ───────────────────────────────────────────────────

/**
 * Minimum Jev confidence to trust a category answer automatically.
 * Below this → flag for human review.
 */
export const CATEGORY_CONFIDENCE_THRESHOLD = 0.65

/**
 * Minimum Jev confidence to trust a priority derivation without human review.
 */
export const PRIORITY_CONFIDENCE_THRESHOLD = 0.60

// ─── Priority derivation ─────────────────────────────────────────────────────

export type TriageCategory = "delay" | "damage" | "billing" | "general" | "lost"
export type TriagePriority = "low" | "medium" | "high" | "critical"

/**
 * Derive a priority from Jev's structured answers using plain code logic.
 * This keeps routing rules auditable and changeable without touching prompts.
 */
export function derivePriority(opts: {
  category: TriageCategory
  urgencyScore: number  // 0 | 1 | 2 from URGENCY_SCORE
  isBillingDispute: number  // 0–1 from IS_BILLING_DISPUTE noul
  isFrustrated: number  // 0–1 from IS_FRUSTRATED noul
}): TriagePriority {
  const { category, urgencyScore, isBillingDispute, isFrustrated } = opts

  // Critical: lost cargo, critical urgency, or dangerous escalation
  if (category === "lost" || urgencyScore === 2) return "critical"

  // High: delayed + frustrated, damaged, billing dispute with high frustration
  if (urgencyScore === 1 && (isFrustrated > 0.7 || category === "damage")) return "high"
  if (isBillingDispute > 0.8 && isFrustrated > 0.6) return "high"

  // Medium: standard delay, billing question, or elevated urgency alone
  if (category === "delay" || urgencyScore === 1 || isBillingDispute > 0.5) return "medium"

  return "low"
}
