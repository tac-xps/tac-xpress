import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyDataIntegrity() {
  console.log("--- TAC-XPRESS DATA INTEGRITY VERIFICATION ---")
  let hasLeaks = false

  // 1. Tickets without SLA deadlines (excluding resolved ones)
  const { data: noSla, error: err1 } = await supabase
    .from("tickets")
    .select("id")
    .is("sla_deadline_first_response", null)
    .neq("status", "resolved")

  if (err1) throw err1
  console.log(`Tickets without SLA deadlines (should be 0): ${noSla.length}`)
  if (noSla.length > 0) hasLeaks = true

  // 2. WhatsApp tickets missing phone numbers
  const { data: noPhone, error: err2 } = await supabase
    .from("tickets")
    .select("id")
    .eq("source", "whatsapp")
    .is("customer_phone", null)

  if (err2) throw err2
  console.log(
    `WhatsApp tickets without customer_phone (should be 0): ${noPhone.length}`
  )
  if (noPhone.length > 0) hasLeaks = true

  // 3. AI Replies not reaching outbound (simple check via joining locally)
  const { data: waTickets } = await supabase
    .from("tickets")
    .select("id, customer_phone")
    .eq("source", "whatsapp")
    .not("customer_phone", "is", null)

  let orphanedReplies = 0
  if (waTickets && waTickets.length > 0) {
    for (const ticket of waTickets) {
      const { data: replies } = await supabase
        .from("ticket_replies")
        .select("message")
        .eq("ticket_id", ticket.id)
        .eq("sender_type", "ai")

      if (!replies || replies.length === 0) continue

      const phoneNormalized = ticket.customer_phone!.replace(/^\+/, "")
      const { data: outbound } = await supabase
        .from("message_outbound")
        .select("id")
        .eq("phone", phoneNormalized)

      // If AI sent replies but we have 0 outbound for this phone
      if (replies.length > 0 && (!outbound || outbound.length === 0)) {
        orphanedReplies++
      }
    }
  }
  console.log(
    `AI replies potentially orphaned from WhatsApp (should be 0): ${orphanedReplies}`
  )
  if (orphanedReplies > 0) hasLeaks = true

  // 4. Dead Letter Queue count
  const { data: dlq } = await supabase
    .from("dead_letter_queue")
    .select("id, action, error")
    .is("resolved_at", null)

  console.log(`Unresolved Dead Letters (should be 0): ${dlq?.length || 0}`)
  if (dlq && dlq.length > 0) {
    console.warn("Current DLQ Items:", dlq)
    hasLeaks = true
  }

  console.log("----------------------------------------------")
  if (hasLeaks) {
    console.error("❌ Data integrity issues detected. Investigate seam leaks.")
  } else {
    console.log("✅ Data integrity verified. Zero seam leaks.")
  }
}

verifyDataIntegrity().catch(console.error)
