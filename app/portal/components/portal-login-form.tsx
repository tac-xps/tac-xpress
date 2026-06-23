"use client"

import { useState } from "react"
import { authenticatePortalAccess } from "@/app/actions/portal-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const portalLoginSchema = z.object({
  awb_number: z.string().min(5, "Please enter a valid AWB number"),
  email: z.string().email("Please enter a valid email address"),
})

export default function PortalLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof portalLoginSchema>>({
    resolver: zodResolver(portalLoginSchema as any),
    defaultValues: {
      awb_number: "",
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof portalLoginSchema>) {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("awb_number", values.awb_number)
    formData.append("email", values.email)

    const result = await authenticatePortalAccess(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push("/portal/track")
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="awb_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AWB Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. AWB-100200300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registered Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
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
          Access Portal
        </Button>
      </form>
    </Form>
  )
}
