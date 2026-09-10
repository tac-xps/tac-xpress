import { z } from "zod"
export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000).optional(),
        parts: z
          .array(
            z.object({
              type: z.string().max(40),
              text: z.string().max(4000).optional(),
            })
          )
          .max(8)
          .optional(),
      })
    )
    .min(1)
    .max(12),
})
export function normalizeChatMessages(
  input: z.infer<typeof chatRequestSchema>
) {
  return input.messages
    .map((message) => ({
      role: message.role,
      content: (
        message.content ||
        message.parts
          ?.filter((part) => part.type === "text")
          .map((part) => part.text || "")
          .join("") ||
        ""
      ).trim(),
    }))
    .filter((message) => message.content.length > 0)
}
export function extractTrackingReference(text: string) {
  return text.toUpperCase().match(/\b(?:AWB|SHP|TAC)-[A-Z0-9-]{5,35}\b/)?.[0]
}
