"use server"

import { db } from "@/lib/db"
import { feedback } from "@/lib/db/schema"
import { createTicket } from "@/app/actions/tickets"
import { revalidatePath } from "next/cache"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"

const feedbackSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
})

/**
 * Handles public feedback submissions from the landing page and /feedback route.
 * Persists directly to the `feedback` database table for display in /dashboard/feedback,
 * and creates a support desk ticket for cross-channel follow-up.
 */
export async function submitFeedback(formData: FormData) {
  try {
    const rawData = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || undefined,
      message: (formData.get("message") as string) || "",
    }

    const validation = feedbackSubmissionSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? "Invalid feedback input"
      return { error: firstError }
    }

    const { name, email, message, phone } = validation.data

    // 1. Persist directly to Postgres feedback table for /dashboard/feedback
    await db.insert(feedback).values({
      name,
      email,
      message,
    })

    // 2. Forward to support tickets queue for staff triage (non-blocking)
    try {
      const ticket = new FormData()
      ticket.set("customer_name", name)
      ticket.set("customer_email", email)
      if (phone) ticket.set("customer_phone", phone)
      ticket.set("message", message)
      ticket.set("category", "general")
      ticket.set("subject", "Customer feedback submission")
      await createTicket(ticket)
    } catch (ticketError) {
      console.warn("Support ticket creation skipped for feedback:", ticketError)
    }

    // 3. Revalidate dashboard and public pages so feedback appears in real time
    revalidatePath("/dashboard/feedback")
    revalidatePath("/feedback")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    Sentry.captureException(error)
    return { error: "We couldn’t submit your message. Check your details and try again shortly." }
  }
}

