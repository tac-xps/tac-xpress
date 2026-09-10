import { z } from "zod"
export const inboundMessageSchema = z.object({
  id: z.string().min(1).max(512),
  from: z.string().regex(/^\+?[0-9]{7,15}$/),
  timestamp: z.coerce.number().positive().max(8_640_000_000_000),
  type: z.string().max(50).optional(),
  text: z.object({ body: z.string().max(5000) }).optional(),
  body: z.string().max(5000).optional(),
})
const contactSchema = z.object({
  wa_id: z.string().max(32).optional(),
  profile: z.object({ name: z.string().max(200).optional() }).optional(),
})
const receiptSchema = z.object({
  id: z.string().min(1).max(512),
  status: z.enum(["sent", "delivered", "read", "failed"]),
  timestamp: z.coerce.number().positive().max(8_640_000_000_000),
})
export const webhookSchema = z
  .object({
    entry: z
      .array(
        z.object({
          changes: z
            .array(
              z.object({
                value: z.object({
                  messages: z.array(inboundMessageSchema).max(20).optional(),
                  contacts: z.array(contactSchema).max(20).optional(),
                  statuses: z.array(receiptSchema).max(20).optional(),
                }),
              })
            )
            .max(10),
        })
      )
      .max(10),
  })
  .refine(
    (data) =>
      data.entry.reduce(
        (count, entry) =>
          count +
          entry.changes.reduce(
            (n, change) =>
              n +
              (change.value.messages?.length ?? 0) +
              (change.value.statuses?.length ?? 0),
            0
          ),
        0
      ) <= 20
  )
