"use server"

import { db } from "@/lib/db"
import { feedback } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"

export async function submitFeedback(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return { error: "All fields are required" }
  }

  try {
    await db.insert(feedback).values({
      name,
      email,
      message,
    })

    revalidatePath("/feedback")
    return { success: true }
  } catch (error) {
    console.error("Failed to submit feedback:", error)
    return { error: "Failed to submit feedback. Please try again." }
  }
}
