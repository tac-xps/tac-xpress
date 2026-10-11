"use client"

import { TicketForm } from "@/components/public/ticket-form"

/**
 * Legacy wrapper: Customer feedback has been unified with the Contact Operations form.
 * Directly renders TicketForm in feedback mode.
 */
export function FeedbackForm() {
  return <TicketForm defaultMode="feedback" />
}
