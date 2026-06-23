export const TRIAGE_TICKET_CATEGORIES = [
  "delay",
  "damage",
  "billing",
  "general",
  "lost",
] as const

export const LANDING_TICKET_CATEGORIES = [
  "general",
  "shipment",
  "billing",
  "complaint",
  "partnership",
] as const

export type TriageTicketCategory = (typeof TRIAGE_TICKET_CATEGORIES)[number]
export type LandingTicketCategory = (typeof LANDING_TICKET_CATEGORIES)[number]

const landingToTriageCategory: Record<
  LandingTicketCategory,
  TriageTicketCategory
> = {
  general: "general",
  shipment: "general",
  billing: "billing",
  complaint: "general",
  partnership: "general",
}

export function mapLandingCategoryToTriage(
  category: LandingTicketCategory
): TriageTicketCategory {
  return landingToTriageCategory[category]
}

export function isActiveWhatsAppTicketStatus(
  status: string | null | undefined
) {
  return (
    status === "open" ||
    status === "in_progress" ||
    status === "awaiting_customer"
  )
}
