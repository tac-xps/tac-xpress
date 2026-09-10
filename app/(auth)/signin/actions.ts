"use server"

import { signIn } from "@/auth"
import { AuthError, CredentialsSignin } from "next-auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const parsed = loginSchema.safeParse({ email, password })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      if (error.code === "rate_limited") {
        return { error: "Too many sign-in attempts. Please try again later." }
      }
      if (error.code === "protection_unavailable") {
        return {
          error:
            "Sign-in is temporarily unavailable. Please try again shortly.",
        }
      }
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "An unexpected error occurred." }
      }
    }
    throw error // Important: Next.js redirects throw errors, we MUST rethrow them!
  }
}
