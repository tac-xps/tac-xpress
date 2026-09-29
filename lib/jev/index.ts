/**
 * lib/jev — TypeSafe Jev integration for Tac-Xpress.
 *
 * Public surface for importing Jev utilities in server code:
 *
 *   import { jevClient, isJevEnabled } from "@/lib/jev"
 *   import { evaluateTicketWithJev } from "@/lib/jev"
 *   import { evaluateReplyGuardrail } from "@/lib/jev"
 *   import { classifyWhatsAppMessage } from "@/lib/jev"
 */
export { jevClient, isJevEnabled } from "./client"
export { evaluateTicketWithJev } from "./triage-evaluator"
export type { JevTriageResult } from "./triage-evaluator"
export {
  CATEGORY_QUESTION,
  URGENCY_SCORE,
  IS_BILLING_DISPUTE,
  IS_FRUSTRATED,
  HAS_SHIPMENT_REFERENCE,
  CATEGORY_CONFIDENCE_THRESHOLD,
  PRIORITY_CONFIDENCE_THRESHOLD,
  derivePriority,
} from "./triage-questions"
export type { TriageCategory, TriagePriority } from "./triage-questions"

export {
  GUARDRAIL_FALSE_CLAIM_QUESTION,
  GUARDRAIL_UNAUTHORIZED_PROMISE_QUESTION,
  GUARDRAIL_THRESHOLD,
  evaluateReplyGuardrail,
  parseGuardrailVerdict,
  checkHeuristicGuardrails,
} from "./reply-guardrail"
export type { GuardrailCheckResult } from "./reply-guardrail"

export {
  WHATSAPP_INTENT_CHOICE,
  WHATSAPP_IS_COMPLAINT,
  WHATSAPP_IS_OPT_OUT,
  classifyWhatsAppMessage,
  deriveWhatsAppIntentFromRules,
} from "./whatsapp-questions"
export type {
  WhatsAppIntent,
  WhatsAppClassificationResult,
} from "./whatsapp-questions"
