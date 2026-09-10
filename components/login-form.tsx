"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { loginAction } from "@/app/(auth)/signin/actions"
import { z } from "zod"
import { Logo } from "@/components/logo"
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
import { TypographyMuted } from "@/components/ui/typography"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("email", values.email)
      formData.append("password", values.password)

      const result = await loginAction({ error: null }, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <div className="w-full text-foreground">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-medium tracking-tight">Staff sign in</h1>
          <p className="text-sm text-muted-foreground">
            Use your work email and password to open the operations workspace.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="username"
                        aria-label="Email address"
                        placeholder="Your work email"
                        className="h-9 border-input bg-muted/40 shadow-sm transition-colors focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          aria-label="Password"
                          className="h-9 border-input bg-muted/40 pr-10 shadow-sm transition-colors focus:border-primary"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-9 w-9 text-muted-foreground hover:bg-transparent hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Contact your administrator if you need access or a password reset.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="mt-2 h-9 w-full"
                disabled={isPending}
              >
                {isPending ? "Signing in…" : "Sign in to workspace"}
              </Button>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  &larr; Back to Home
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
