import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import arcjet, { tokenBucket } from "@arcjet/next"

const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  rules: [
    tokenBucket({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
      refillRate: 10,
      interval: "1m",
      capacity: 10,
    }),
  ],
})

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API || "",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Tac-Xpress",
  },
})

const SYSTEM_PROMPT = `You are the official Tac-Xpress AI Assistant. 
Tac-Xpress is a dedicated logistics partner operating for over 15 years, connecting New Delhi to the Northeast community in Imphal.
We offer Air Cargo, Surface Cargo, Pick and Drop, and Packaging services.

Keep your responses extremely short, polite, and conversational. Avoid generic AI disclaimers, bullet points, and excessive styling (like asterisks or bold text) unless absolutely necessary. Talk like a friendly human support agent.`

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant", "tool"]),
        content: z.string().max(4000).optional(),
        parts: z
          .array(
            z.object({
              type: z.string(),
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

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API) {
    return NextResponse.json(
      { error: "AI assistant is not configured." },
      { status: 503 }
    )
  }

  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => null)
  const parsedBody = chatRequestSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid chat payload." },
      { status: 400 }
    )
  }

  const { messages } = parsedBody.data

  const normalizedMessages = messages.map((m: any) => {
    if (m.parts) {
      const content =
        m.content ||
        m.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("")
      const { parts, ...rest } = m
      return { ...rest, content }
    }
    return m
  })

  const result = streamText({
    model: openrouter.chat("openrouter/free"), // Automatically routes to the best available free model
    system: SYSTEM_PROMPT,
    messages: normalizedMessages,
  })

  return result.toUIMessageStreamResponse()
}
