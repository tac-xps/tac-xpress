import { z } from "zod"

export const createTicketSchema = z.object({
  customerId: z.string().uuid().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerEmail: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional().nullable(),
  priority: z.string().optional().nullable(),
})

export type CreateTicketInput = z.infer<typeof createTicketSchema>

export const updateTicketSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "in_progress", "awaiting_customer", "resolved"]),
  priority: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
})

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>

export const deleteTicketSchema = z.object({
  id: z.string().uuid(),
})

export type DeleteTicketInput = z.infer<typeof deleteTicketSchema>
