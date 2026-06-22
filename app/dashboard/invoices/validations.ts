import { z } from "zod"

export const updateInvoiceSchema = z.object({
  id: z.string(),
  status: z.enum(["unpaid", "paid"]),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  advancePaid: z.coerce.number().min(0, "Advance must be non-negative"),
})

export type UpdateInvoiceValues = z.infer<typeof updateInvoiceSchema>
