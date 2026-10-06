"use client"

import { useState } from "react"
import * as Sentry from "@sentry/nextjs"
import { createTicket } from "@/app/actions/tickets"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { CheckCircleCustomIcon } from "@/components/icons/landing-icons"
import { toast } from "sonner"
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
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LANDING_TICKET_CATEGORIES } from "@/lib/support/tickets"

const ticketSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().optional(),
  category: z.enum(LANDING_TICKET_CATEGORIES),
  related_awb: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().max(0, "Bots only").optional(), // Honeypot
})

interface TicketFormProps {
  className?: string
}

export function TicketForm({ className }: TicketFormProps = {}) {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    ticketId?: string
    error?: any
  } | null>(null)

  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema as any),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      category: "general",
      related_awb: "",
      subject: "",
      message: "",
      website: "",
    },
  })

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    setPending(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("customer_name", values.customer_name)
      formData.append("customer_email", values.customer_email)
      if (values.customer_phone)
        formData.append("customer_phone", values.customer_phone)
      formData.append("category", values.category)
      if (values.related_awb) formData.append("related_awb", values.related_awb)
      formData.append("subject", values.subject)
      formData.append("message", values.message)
      if (values.website) formData.append("website", values.website)

      const res = await createTicket(formData)
      setResult(res)

      if (res.success) {
        toast.success("Request received.")
        form.reset()
      } else if (res.error) {
        const formErrors =
          typeof res.error === "object" &&
          res.error !== null &&
          "_form" in res.error
            ? (res.error._form as string[] | undefined)
            : undefined
        toast.error(
          formErrors?.[0] || "Failed to submit ticket. Please check the fields."
        )
      }
    } catch (error) {
      Sentry.captureException(error)
      toast.error("Failed to submit ticket. Please try again.")
      setResult({ success: false, error: "Unexpected error" })
    } finally {
      setPending(false)
    }
  }

  if (result?.success) {
    return (
      <div className={cn("flex h-full min-h-[360px] flex-col items-center justify-center space-y-6 border border-border bg-card p-8 text-center shadow-sm", className)}>
        <div className="flex h-14 w-14 items-center justify-center bg-primary/10 ring-4 ring-primary/5">
          <CheckCircleCustomIcon className="text-primary h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Request Received
          </h3>
          <p className="mx-auto max-w-[320px] text-xs leading-relaxed text-muted-foreground">
            Your ticket{" "}
            {result.ticketId ? (
              <span className="font-mono font-medium text-foreground">
                #{result.ticketId.slice(0, 8).toUpperCase()}
              </span>
            ) : (
              ""
            )}{" "}
            has been submitted. Our operations team will review it and reply by email.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-border hover:bg-muted font-mono text-xs uppercase tracking-wider"
          onClick={() => {
            setResult(null)
            form.reset()
          }}
        >
          Send another request
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("border border-border bg-card p-6 sm:p-8 shadow-sm", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-bold tracking-tight text-foreground">Contact our team</h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Tell us about your shipment, request or question. Include the route and cargo details when asking about a booking.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <input
                    type="text"
                    className="pointer-events-none absolute top-0 left-0 h-0 w-0 opacity-0"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border border-border bg-background px-3 py-2 text-sm transition-colors outline-none focus:border-primary"
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="w-full border border-border bg-background px-3 py-2 text-sm transition-colors outline-none focus:border-primary"
                      placeholder="you@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row 2: Phone and Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="customer_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    Phone (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border border-border bg-background px-3 py-2 text-sm transition-colors outline-none focus:border-primary"
                      placeholder="+91 99999 99999"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    Category *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border border-border bg-background px-3 py-2 text-sm transition-colors outline-none focus:border-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="shipment">Shipment Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row 3: Related AWB and Subject */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="related_awb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    AWB Number (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border border-border bg-background px-3 py-2 font-mono text-sm transition-colors outline-none focus:border-primary"
                      placeholder="AWB-XXXXXXXXXX"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    Subject *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border border-border bg-background px-3 py-2 text-sm transition-colors outline-none focus:border-primary"
                      placeholder="What's this about?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row 4: Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-muted-foreground">
                  Message *
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    variant="compact"
                    minHeight="120px"
                    placeholder="Describe your issue or cargo requirements in detail..."
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Row 5: Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={pending}
              className={cn(
                "flex w-full sm:w-auto min-w-[160px] h-10 items-center justify-center gap-2 px-6 font-mono text-xs font-bold uppercase tracking-wider",
                pending
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {pending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Send request"
              )}
            </Button>
          </div>

          {result?.error && (
            <div className="space-y-1 border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {Array.isArray(result.error) ? (
                result.error.map((e: string, i: number) => <p key={i}>{e}</p>)
              ) : typeof result.error === "string" ? (
                <p>{result.error}</p>
              ) : (
                Object.entries(result.error).map(([field, msgs]) => (
                  <p key={field}>{(msgs as string[]).join(", ")}</p>
                ))
              )}
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
