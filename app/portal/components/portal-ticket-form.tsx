"use client"

import { useState } from "react"
import { createTicket } from "@/app/actions/tickets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
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

const ticketSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  related_awb: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export default function PortalTicketForm({
  defaultEmail,
  defaultAwb,
}: {
  defaultEmail: string
  defaultAwb: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema as any),
    defaultValues: {
      customer_name: "",
      related_awb: defaultAwb,
      category: "general",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("customer_email", defaultEmail)
    formData.append("customer_name", values.customer_name)
    if (values.related_awb) formData.append("related_awb", values.related_awb)
    formData.append("category", values.category)
    formData.append("subject", values.subject)
    formData.append("message", values.message)

    const result = await createTicket(formData)

    if (result.error) {
      setError("Please check the form fields and try again.")
      setIsLoading(false)
    } else {
      form.reset({
        customer_name: "",
        subject: "",
        message: "",
        category: "general",
        related_awb: defaultAwb,
      })
      router.refresh()
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="related_awb"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related AWB</FormLabel>
              <FormControl>
                <Input readOnly className="bg-muted" {...field} />
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
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="shipment">Shipment Issue</SelectItem>
                  <SelectItem value="billing">Billing/Invoice</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm font-medium text-destructive">{error}</div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Ticket
        </Button>
      </form>
    </Form>
  )
}
