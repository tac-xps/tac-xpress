export function routeTicket(triage: {
  category: string
  priority: string
  ai_confidence: number
}) {
  if (triage.priority === "critical") return "senior_agent"
  if (triage.category === "billing" && triage.priority === "high")
    return "finance_team"
  if (triage.category === "damage") return "claims_department"
  if (triage.ai_confidence < 0.7) return "general_queue" // Low confidence = human review
  return "standard_queue"
}
