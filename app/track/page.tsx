"use client"

import { useState, Suspense, useEffect } from "react"
import {
  Search,
  MapPin,
  Package,
  Clock,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Circle,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchPublicTrackingInfo } from "./actions"
import { format } from "date-fns"
import Image from "next/image"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { PackageTrackerCard } from "@/components/ui/tracker-card"
import { useSearchParams } from "next/navigation"

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

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return {
        label: "Delivered",
        colorClass:
          "bg-primary/10 text-status-delivered ring-1 ring-primary/20",
        icon: CheckCircle2,
      }
    case "in-transit":
      return {
        label: "In Transit",
        colorClass: "bg-primary/10 text-status-transit ring-1 ring-primary/20",
        icon: Truck,
      }
    case "pending":
      return {
        label: "Pending",
        colorClass:
          "bg-status-pending/10 text-status-pending ring-1 ring-status-pending/20",
        icon: Circle,
      }
    case "failed":
      return {
        label: "Failed",
        colorClass:
          "bg-destructive/10 text-status-failed ring-1 ring-destructive/20",
        icon: Circle, // Consider importing AlertCircle if desired
      }
    case "out-for-delivery":
      return {
        label: "Out For Delivery",
        colorClass:
          "bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20 dark:text-indigo-400",
        icon: Truck,
      }
    default:
      return {
        label: status
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : "Unknown",
        colorClass:
          "bg-gray-500/10 text-gray-600 ring-1 ring-gray-500/20 dark:text-gray-400",
        icon: Circle,
      }
  }
}

const parseLocation = (loc: string) => {
  if (!loc) return { city: "N/A", code: "N/A" }
  const match = loc.match(/(.+?)\s*\((.+?)\)/)
  if (match) {
    return { city: match[1].trim(), code: match[2].trim() }
  }
  return { city: loc, code: loc.slice(0, 3).toUpperCase() }
}

const trackingSchema = z.object({
  awb: z
    .string()
    .min(5, "AWB must be at least 5 characters")
    .max(20, "AWB is too long"),
})

function TrackingContent() {
  const searchParams = useSearchParams()
  const initialAwb = searchParams.get("awb") || ""

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [showDetailedTimeline, setShowDetailedTimeline] = useState(false)

  // Derive dynamic timeline from shipment data
  let rawEvents = result?.events || []
  let hasPending = rawEvents.some((e: any) => e.status === "pending")

  let timelineEvents = rawEvents.map((e: any) => ({
    status:
      e.status === "pending"
        ? "Booked"
        : e.status === "in-transit"
          ? "In Transit"
          : "Delivered",
    time: new Date(e.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    desc: e.description?.replace(/<\/?[^>]+(>|$)/g, ""),
    location: e.location,
    done: true,
  }))

  // Backward compatibility: If no tracking events exist at all, or if they exist but lack the initial origin event
  if (result?.shipment && !hasPending) {
    if (timelineEvents.length === 0) {
      if (result.shipment.status === "delivered") {
        timelineEvents.push({
          status: "Delivered",
          time: new Date(result.shipment.updatedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          desc: "Package delivered to final destination.",
          location: parseLocation(result.shipment.destination).city,
          done: true,
        })
      }
      timelineEvents.push({
        status: "Booked",
        time: new Date(result.shipment.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        desc: "Shipment details entered and tracking started.",
        location: parseLocation(result.shipment.origin).city,
        done: true,
      })
    } else {
      timelineEvents.push({
        status: "Booked",
        time: new Date(result.shipment.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        desc: "Shipment details entered and tracking started.",
        location: parseLocation(result.shipment.origin).city,
        done: true,
      })
    }
  }

  const originInfo = result?.shipment
    ? parseLocation(result.shipment.origin)
    : { city: "N/A", code: "N/A" }
  const destInfo = result?.shipment
    ? parseLocation(result.shipment.destination)
    : { city: "N/A", code: "N/A" }

  const latestDbEvent = rawEvents[0]
  const currentLocInfo = latestDbEvent
    ? parseLocation(latestDbEvent.location)
    : originInfo
  const currentDateStr = result?.shipment
    ? new Date(
        latestDbEvent?.createdAt || result.shipment.updatedAt
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      })
    : "N/A"

  const statusStyles = result?.shipment
    ? getStatusStyles(result.shipment.status)
    : null

  const form = useForm<z.infer<typeof trackingSchema>>({
    resolver: zodResolver(trackingSchema as any),
    defaultValues: {
      awb: initialAwb,
    },
  })

  useEffect(() => {
    if (initialAwb) {
      executeSearch(initialAwb)
    }
  }, [initialAwb])

  const executeSearch = async (trackingNumber: string) => {
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetchPublicTrackingInfo(trackingNumber.trim())
      if (res.success) {
        setResult(res)
      } else {
        setError(res.error || "Failed to fetch tracking info")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof trackingSchema>) => {
    executeSearch(values.awb)
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex h-16 items-center border-b bg-background px-6 shadow-sm">
        <Link href="/">
          <Logo className="h-8" />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center p-6 md:p-12">
        <div className="w-full max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Track Your Shipment
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your AWB number below to get real-time tracking updates.
            </p>
          </div>

          <Card className="rounded-none border-muted shadow-lg">
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-start gap-4"
                >
                  <FormField
                    control={form.control}
                    name="awb"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">AWB number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="Enter AWB Number (e.g. AWB-1234567890)"
                              aria-label="AWB number"
                              className="rounded-none pl-10 text-lg"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="rounded-none"
                  >
                    {loading ? "Searching..." : "Track"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-none bg-destructive/10 p-4 text-center font-medium text-destructive">
              {error}
            </div>
          )}

          {result && result.shipment && (
            <div className="flex w-full animate-in flex-col items-center gap-6 duration-500 fade-in slide-in-from-bottom-4">
              <PackageTrackerCard
                status={statusStyles?.label || "Pending"}
                packageNumber={result.shipment.awbNumber}
                destination={currentLocInfo.city}
                destinationFlag={
                  <div className="shrink-0">
                    {result.shipment.destination
                      ?.toLowerCase()
                      .includes("poland") ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 5 3"
                        className="h-4 w-6 rounded-sm border border-muted/20 shadow-sm"
                      >
                        <rect width="5" height="3" fill="#fff" />
                        <rect width="5" height="1.5" y="1.5" fill="#dc143c" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 900 600"
                        className="h-4 w-6 rounded-sm border border-muted/20 shadow-sm"
                      >
                        <rect width="900" height="200" fill="#FF9933" />
                        <rect width="900" height="200" y="200" fill="#FFFFFF" />
                        <rect width="900" height="200" y="400" fill="#138808" />
                        <circle cx="450" cy="300" r="50" fill="#000080" />
                      </svg>
                    )}
                  </div>
                }
                date={`${currentLocInfo.city} - ${currentDateStr}`}
                description={latestDbEvent?.description?.replace(
                  /<\/?[^>]+(>|$)/g,
                  ""
                )}
                packageImage={
                  <Image
                    src={`https://${process.env.NEXT_PUBLIC_VERCEL_BLOB_HOSTNAME ?? "your-project.public.blob.vercel-storage.com"}/image-cfG5HFRLtZ568wRFDk8NRn7hzW00fY.png`}
                    alt="Shipment Parcel"
                    width={180}
                    height={180}
                    className="drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                  />
                }
                onTrackClick={() => setShowDetailedTimeline((prev) => !prev)}
                className="w-full max-w-md border-border/50 bg-card shadow-2xl"
              />

              {showDetailedTimeline && (
                <Card className="w-full max-w-md animate-in overflow-hidden border-border/50 bg-card shadow-lg duration-500 fade-in slide-in-from-top-4">
                  {/* Route Summary */}
                  <div className="border-b border-border/50 bg-background p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-5 text-muted-foreground" />
                        <span className="text-lg font-semibold">
                          {originInfo.city}
                        </span>
                        <span className="rounded bg-muted px-1.5 font-mono text-sm text-muted-foreground">
                          {originInfo.code}
                        </span>
                      </div>
                      <div className="flex flex-1 items-center px-4">
                        <div className="relative h-[2px] w-full bg-border">
                          <div
                            className={`absolute inset-0 h-full bg-primary ${
                              result.shipment.status === "delivered"
                                ? "w-full"
                                : result.shipment.status === "in-transit"
                                  ? "w-1/2"
                                  : "w-0"
                            }`}
                          />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                            <Truck className="size-5 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row-reverse items-center gap-2">
                        <MapPin className="size-5 text-primary" />
                        <span className="text-lg font-semibold">
                          {destInfo.city}
                        </span>
                        <span className="rounded bg-muted px-1.5 font-mono text-sm text-muted-foreground">
                          {destInfo.code}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between px-1 text-sm text-muted-foreground">
                      <span className="capitalize">
                        {result.shipment.serviceType?.replace("_", " ")}
                      </span>
                      <span>
                        {result.shipment.weightKg} KG (
                        {result.shipment.pieces || 1}{" "}
                        {result.shipment.pieces === 1 ? "Piece" : "Pieces"})
                      </span>
                      <span>
                        {new Date(
                          result.shipment.bookingDate ||
                            result.shipment.createdAt
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Vertical Timeline */}
                  <CardContent className="bg-background p-8">
                    <div className="relative">
                      {timelineEvents.map((event: any, i: number) => {
                        const isLast = i === timelineEvents.length - 1
                        return (
                          <div
                            key={i}
                            className="relative flex gap-6 pb-8 last:pb-0"
                          >
                            {/* Connecting Line */}
                            {!isLast && (
                              <div
                                className={`${
                                  event.done
                                    ? "bg-primary/50"
                                    : "border-s-2 border-border"
                                } absolute top-8 bottom-[-8px] left-[11px] w-[2px] border-dotted`}
                              />
                            )}

                            {/* Node Icon */}
                            <div className="relative z-10 mt-1 shrink-0 bg-background">
                              {event.done ? (
                                <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
                                  <CheckCircle2 className="size-4 text-primary" />
                                </div>
                              ) : (
                                <div className="flex size-6 items-center justify-center rounded-full bg-muted ring-4 ring-background">
                                  <Circle className="size-3 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div
                              className={`${!event.done && "opacity-50"} flex-1`}
                            >
                              <p
                                className={`${
                                  i === 0 ? "text-primary" : "text-foreground"
                                } text-lg font-semibold tracking-tight`}
                              >
                                {event.status}
                              </p>
                              <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                {event.desc}
                              </p>
                              <p className="mt-1 font-mono text-xs text-muted-foreground/70">
                                {event.time}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function PublicTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
          Loading...
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  )
}
