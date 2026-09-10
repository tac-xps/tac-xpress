"use server"
import { createTicket } from "@/app/actions/tickets"

// Feedback belongs in the staffed support queue and shares its validation/rate limit.
export async function submitFeedback(formData: FormData) {
  const ticket = new FormData()
  for (const [input, output] of [["name", "customer_name"], ["email", "customer_email"], ["phone", "customer_phone"], ["message", "message"]]) {
    const value = formData.get(input)
    if (value !== null) ticket.set(output, value)
  }
  ticket.set("category", "general")
  ticket.set("subject", "Website feedback")
  const result = await createTicket(ticket)
  if (result.error) return { error: "We couldn’t submit your message. Check your details and try again shortly." }
  return { success: true }
}
