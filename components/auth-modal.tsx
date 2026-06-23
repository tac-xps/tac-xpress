"use client"

import { useState } from "react"
import { X, Loader2, Mail, UserPlus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Mode = "login" | "register"

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().optional(),
})

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: "success" | "error"
  } | null>(null)

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  })

  if (!isOpen) return null

  async function onSubmit(values: z.infer<typeof authSchema>) {
    if (
      mode === "register" &&
      (!values.fullName || values.fullName.trim() === "")
    ) {
      form.setError("fullName", { message: "Full name is required" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      if (mode === "register") {
        const { registerWithEmail } = await import("@/app/actions/auth")
        const result = await registerWithEmail(values.email, values.fullName!)
        if (result.error) {
          setMessage({ text: result.error, type: "error" })
        } else {
          setMessage({ text: result.message!, type: "success" })
          form.reset()
        }
      } else {
        const { sendMagicLink } = await import("@/app/actions/auth")
        const result = await sendMagicLink(values.email)
        if (result.error) {
          setMessage({ text: result.error, type: "error" })
        } else {
          setMessage({ text: result.message!, type: "success" })
          form.reset()
        }
      }
    } catch (err) {
      setMessage({
        text: "Something went wrong. Please try again.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "register" ? "Create Account" : "Sign In"}
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-border bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            {mode === "register" ? (
              <UserPlus className="h-4 w-4 text-primary" />
            ) : (
              <Sparkles className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-semibold tracking-wide uppercase">
              {mode === "register"
                ? "Create Account"
                : "Sign In with Magic Link"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-5 text-sm text-muted-foreground">
            {mode === "register"
              ? "Create an account to track all your shipments and tickets in one place."
              : "We'll email you a secure sign-in link. No password needed."}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === "register" && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm transition-colors outline-none focus:border-primary"
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Email *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm transition-colors outline-none focus:border-primary"
                        placeholder="you@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-none border-l-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  loading
                    ? "cursor-not-allowed border-l-muted bg-muted text-muted-foreground"
                    : "border-l-primary-foreground bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                    Processing...
                  </>
                ) : mode === "register" ? (
                  <>
                    <UserPlus className="h-3.5 w-3.5" /> Create Account
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5" /> Send Magic Link
                  </>
                )}
              </Button>
            </form>
          </Form>

          {message && (
            <div
              className={cn(
                "mt-4 border-l-2 p-3 text-xs",
                message.type === "success"
                  ? "text-trend-positive border-l-primary bg-primary/10"
                  : "border-l-destructive bg-destructive/10 text-destructive"
              )}
            >
              {message.text}
            </div>
          )}

          <div className="mt-5 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            {mode === "register" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login")
                    setMessage(null)
                    form.reset()
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  onClick={() => {
                    setMode("register")
                    setMessage(null)
                    form.reset()
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  Create an account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
