"use client"

import { useState } from "react"
import { trackAwb } from "@/app/actions/tracking"
import { StatusBadge } from "@/components/logistics/status-badge"
import {
  SearchCustomIcon,
  TrackingBoxIcon,
  MapMarkerIcon,
} from "@/components/icons/landing-icons"
import { cn } from "@/lib/utils"

import { TrackingResult } from "@/types/tracking"
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

const trackingSchema = z.object({
  awb_number: z
    .string()
    .min(5, "AWB number must be at least 5 characters")
    .max(20, "AWB number is too long"),
})

export function AwbTracker({ initialData }: { initialData?: TrackingResult }) {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<TrackingResult | null>(
    initialData || null
  )
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof trackingSchema>>({
    resolver: zodResolver(trackingSchema as any),
    defaultValues: {
      awb_number: initialData?.awb_number || "",
    },
  })

  async function onSubmit(values: z.infer<typeof trackingSchema>) {
    setPending(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append("awb_number", values.awb_number)
    const res = await trackAwb(formData)

    if (res.error || !res.data) {
      setError(res.error || "No data found")
    } else {
      setResult(res.data as TrackingResult)
    }

    setPending(false)
  }

  return (
    <div className="relative max-w-2xl border border-border/60 bg-card p-6 shadow-xl shadow-black/8 backdrop-blur-sm before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-card-accent/50 before:to-transparent">
      <h3 className="mb-1 text-lg font-bold">Track Your Shipment</h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Enter your AWB number to see real-time status
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-6 flex items-start gap-2"
        >
          <FormField
            control={form.control}
            name="awb_number"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sr-only">AWB number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <SearchCustomIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      aria-label="AWB number"
                      className="w-full rounded-none border border-border/60 bg-muted/40 py-2.5 pr-3 pl-10 font-mono text-sm uppercase shadow-sm transition-colors outline-none focus:border-primary"
                      placeholder="AWB-XXXXXXXXXX"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={pending}
            className={cn(
              "flex items-center gap-2 rounded-none border-l-2 px-4 py-2.5 text-sm font-medium transition-colors",
              pending
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : "border-l-primary-foreground bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {pending ? "Tracking..." : "Track"}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="mb-4 border-l-2 border-l-destructive bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Shipment Header */}
          <div className="border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrackingBoxIcon className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm font-medium">
                  {result.awb_number}
                </span>
              </div>
              <StatusBadge status={result.status as any} />
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Route</span>
                <p className="mt-0.5 font-medium">
                  {result.origin} → {result.destination}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Service</span>
                <p className="mt-0.5 font-medium">{result.service}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Weight</span>
                <p className="mt-0.5 font-medium">{result.weight}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-0">
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Tracking History
            </h4>
            {result.events.map((event: any, i: number) => (
              <div key={event.id} className="relative flex gap-3 pb-4">
                {/* Timeline line */}
                {i < result.events.length - 1 && (
                  <div className="absolute top-3 bottom-0 left-[5px] w-px bg-border" />
                )}

                {/* Dot */}
                <div
                  className={cn(
                    "mt-1 h-2.5 w-2.5 shrink-0",
                    i === 0 ? "bg-primary" : "bg-muted-foreground/50"
                  )}
                />

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {event.description}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(event.event_time).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1">
                    <MapMarkerIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
