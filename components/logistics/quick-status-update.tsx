"use client"

import { useState } from "react"
import { createTrackingEventAction } from "@/app/dashboard/shipments/actions"
import { toast } from "sonner"
import { StatusBadge } from "./status-badge"
import { MapPin, Clock, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/native-select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface QuickStatusUpdateProps {
  shipmentId: string
  currentStatus: string
  onUpdate: () => void
}

const eventTypes = [
  { value: "pending", label: "Pending" },
  { value: "in-transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
]

export function QuickStatusUpdate({
  shipmentId,
  currentStatus,
  onUpdate,
}: QuickStatusUpdateProps) {
  const [eventType, setEventType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit() {
    if (!eventType || !location || !description) return

    setPending(true)
    try {
      const result = await createTrackingEventAction({
        shipmentId,
        status: eventType as any,
        location,
        description,
      })

      if (result?.data?.success) {
        toast.success("Tracking event added successfully")
        setEventType("")
        setLocation("")
        setDescription("")
        onUpdate()
      } else {
        const errorMsg =
          result?.data && "error" in result.data
            ? (result.data as any).error
            : result?.serverError
              ? result.serverError
              : "Failed to update tracking event"
        toast.error(errorMsg)
        console.error(errorMsg)
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="border border-border bg-card p-4">
      <h4 className="mb-3 text-sm font-semibold">Update Status</h4>

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Current Status
          </label>
          <StatusBadge status={currentStatus as any} />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            New Event *
          </label>
          <NativeSelect
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full text-xs"
          >
            <option value="">Select event type...</option>
            {eventTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Location *
          </label>
          <div className="relative">
            <MapPin className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Delhi Hub, Mumbai Airport"
              className="pl-9 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Description *
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened?"
            rows={2}
            className="w-full resize-none text-xs"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={pending || !eventType || !location || !description}
          className="w-full"
        >
          <Send className="mr-1.5 h-3 w-3" />
          {pending ? "Updating..." : "Log Event"}
        </Button>
      </div>
    </div>
  )
}
