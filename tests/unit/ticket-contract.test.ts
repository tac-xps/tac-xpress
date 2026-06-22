import { describe, expect, it } from "vitest"

import {
  isActiveWhatsAppTicketStatus,
  mapLandingCategoryToTriage,
} from "@/lib/support/tickets"

describe("ticket contract helpers", () => {
  it("maps landing intake categories to canonical triage categories", () => {
    expect(mapLandingCategoryToTriage("general")).toBe("general")
    expect(mapLandingCategoryToTriage("shipment")).toBe("general")
    expect(mapLandingCategoryToTriage("billing")).toBe("billing")
    expect(mapLandingCategoryToTriage("complaint")).toBe("general")
    expect(mapLandingCategoryToTriage("partnership")).toBe("general")
  })

  it("treats only unresolved workflow statuses as active WhatsApp tickets", () => {
    expect(isActiveWhatsAppTicketStatus("open")).toBe(true)
    expect(isActiveWhatsAppTicketStatus("in_progress")).toBe(true)
    expect(isActiveWhatsAppTicketStatus("awaiting_customer")).toBe(true)
    expect(isActiveWhatsAppTicketStatus("resolved")).toBe(false)
    expect(isActiveWhatsAppTicketStatus(null)).toBe(false)
  })
})
