export type TicketStatus =
  | "open"
  | "in-progress"
  | "waiting-customer"
  | "resolved"
  | "closed"
export type TicketPriority = "low" | "medium" | "high" | "urgent"
export type TicketCategory =
  | "general"
  | "shipment"
  | "billing"
  | "complaint"
  | "partnership"

export interface Ticket {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  subject: string
  message: string
  category: TicketCategory
  status: TicketStatus
  priority: TicketPriority
  assigned_to?: string
  related_awb?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  source: string
}

export interface TicketReply {
  id: string
  ticket_id: string
  message: string
  is_internal: boolean
  sender_type: "customer" | "staff" | "system"
  sender_id?: string
  sender_name: string
  sender_email?: string
  created_at: string
}

export interface TicketWithReplies extends Ticket {
  replies: TicketReply[]
}
