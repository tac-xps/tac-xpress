"use client"

import { useState } from "react"
import * as Sentry from "@sentry/nextjs"
import { createTicket } from "@/app/actions/tickets"
import { cn } from "@/lib/utils"
import { Loader2, Plus, ArrowUpRight } from "lucide-react"
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
import { getVisibleText } from "@/lib/sanitize"

const ticketSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().optional(),
  category: z.enum(LANDING_TICKET_CATEGORIES),
  related_awb: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .refine(
      (val) => getVisibleText(val).length >= 10,
      { message: "Message must be at least 10 characters" }
    )
    .refine(
      (val) => getVisibleText(val).length <= 5000,
      { message: "Message cannot exceed 5000 characters" }
    ),
  website: z.string().max(0, "Bots only").optional(), // Honeypot
})

interface TicketFormProps {
  className?: string
  compact?: boolean
  hideHeader?: boolean
}

export function TicketForm({
  className,
  compact = false,
  hideHeader = false,
}: TicketFormProps = {}) {
  const [pending, setPending] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
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

  const category = form.watch("category")
  const hasOptionalValues = Boolean(form.watch("related_awb") || form.watch("customer_phone"))
  const isExpanded = showOptional || category === "shipment" || hasOptionalValues

  if (result?.success) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center space-y-4 border border-border bg-card p-6 sm:p-8 text-center shadow-sm min-h-[300px]",
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center bg-primary/10 ring-4 ring-primary/5">
          <CheckCircleCustomIcon className="text-primary h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
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
          className="h-8 rounded-none border-border hover:bg-muted font-mono text-xs uppercase tracking-wider px-4"
          onClick={() => {
            setResult(null)
            setShowOptional(false)
            form.reset()
          }}
        >
          Send another request
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("border border-border bg-card p-5 sm:p-6 shadow-sm", className)}>
      {hideHeader ? (
        <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-status-delivered opacity-75" />
              <span className="relative inline-flex size-2 rounded-none bg-status-delivered" />
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
              Live Operations Desk
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Avg response &lt; 1 hr
          </span>
        </div>
      ) : (
        <div className="mb-4 flex flex-col gap-1 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-foreground">Contact our team</h3>
            <p className="text-xs text-muted-foreground">
              Cargo inquiries, quotes, and consignment assistance.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start pt-1 font-mono text-[10px] text-muted-foreground sm:self-auto sm:pt-0">
            <span className="size-1.5 rounded-none bg-status-delivered" />
            <span>Avg response &lt; 1 hr</span>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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

          {/* Tier 1: Identity (Name & Email) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                    Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 rounded-none border-border bg-background px-3 text-sm focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="h-9 rounded-none border-border bg-background px-3 text-sm focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                      placeholder="you@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Tier 2: Category & Subject */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                    Category *
                  </FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val)
                      if (val === "shipment") setShowOptional(true)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 w-full rounded-none border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder="Select category" />
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
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                    Subject *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 rounded-none border-border bg-background px-3 text-sm focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                      placeholder="What is this regarding?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Tier 3: Progressive Context (Phone & AWB) */}
          {isExpanded ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-0.5">
              <FormField
                control={form.control}
                name="related_awb"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                      AWB Number (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-9 rounded-none border-border bg-background px-3 font-mono text-sm uppercase focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                        placeholder="AWB-XXXXXXXXXX"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_phone"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                      Phone (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-9 rounded-none border-border bg-background px-3 text-sm focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                        placeholder="+91 99999 99999"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowOptional(true)}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="size-3 text-primary" />
                <span>Add AWB number or phone (optional)</span>
              </button>
            </div>
          )}

          {/* Tier 4: Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                  Message *
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Describe your cargo requirements, route, or inquiry in detail..."
                    aria-label="Message"
                    className="min-h-[72px] resize-y rounded-none border-border bg-background p-3 text-sm focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Tier 5: Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <Button
              type="submit"
              disabled={pending}
              className={cn(
                "h-9 px-5 rounded-none font-mono text-xs font-semibold uppercase tracking-wider transition-all",
                pending
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {pending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Submitting...
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  Send request
                  <ArrowUpRight className="size-3.5" />
                </span>
              )}
            </Button>
            <span className="font-mono text-[11px] text-muted-foreground">
              No account required · Email reply
            </span>
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
