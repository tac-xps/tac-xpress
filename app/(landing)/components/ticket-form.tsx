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
import { Textarea } from "@/components/ui/textarea"
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

export function TicketForm() {
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
        toast.success("Ticket submitted successfully!")
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
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center space-y-6 p-12 text-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
          <CheckCircleCustomIcon className="text-trend-positive h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            Request Received
          </h3>
          <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-muted-foreground">
            Your ticket{" "}
            {result.ticketId ? (
              <span className="font-mono font-medium text-foreground">
                #{result.ticketId.slice(0, 8).toUpperCase()}
              </span>
            ) : (
              ""
            )}{" "}
            has been submitted. Our team will get back to you within 2 hours.
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4 rounded-none border-border/50 hover:bg-muted"
          onClick={() => {
            setResult(null)
            form.reset()
          }}
        >
          Submit Another Ticket
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h3 className="mb-1 text-lg font-bold">Contact Support</h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Submit a ticket and our team will respond within 2 hours
      </p>

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

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full resize-none rounded-none border border-border/60 bg-muted/40 px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-primary"
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
                  <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="w-full resize-none rounded-none border border-border/60 bg-muted/40 px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-primary"
                      placeholder="you@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="customer_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Phone (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full resize-none rounded-none border border-border/60 bg-muted/40 px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-primary"
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
                <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Category *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full resize-none rounded-none border border-border/60 bg-muted/40 px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-primary">
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

          <FormField
            control={form.control}
            name="related_awb"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  AWB Number (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full rounded-none border border-border/60 bg-muted/40 px-3 py-2 font-mono text-sm shadow-sm transition-colors outline-none focus:border-primary"
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
                <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Subject *
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full resize-none rounded-none border border-border/60 bg-muted/40 px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-primary"
                    placeholder="What's this about?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Message *
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    className="w-full resize-none rounded-none border border-border/60 bg-muted/40 px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-primary"
                    placeholder="Describe your issue in detail..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={pending}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-none border-l-2 px-4 py-2.5 text-sm font-medium transition-colors",
              pending
                ? "cursor-not-allowed border-l-muted bg-muted text-muted-foreground"
                : "border-l-primary-foreground bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {pending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Ticket"
            )}
          </Button>

          {result?.error && (
            <div className="space-y-1 border-l-2 border-l-destructive bg-destructive/10 p-3 text-xs text-destructive">
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
