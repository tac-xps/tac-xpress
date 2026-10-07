"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPinIcon } from "lucide-react"
import { AddTrackingEventForm } from "./add-tracking-event-form"

interface AddTrackingEventDialogProps {
  shipmentId: string
  awbNumber: string
  onSuccess?: () => void
  triggerVariant?: "ghost" | "outline" | "default" | "secondary"
  triggerClassName?: string
}

export function AddTrackingEventDialog({
  shipmentId,
  awbNumber,
  onSuccess,
  triggerVariant = "ghost",
  triggerClassName,
}: AddTrackingEventDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size="sm"
          className={triggerClassName || "h-8 w-full justify-start"}
        >
          <MapPinIcon className="mr-2 h-4 w-4" />
          Log Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Tracking Event</DialogTitle>
          <DialogDescription>
            Update the status and location for shipment AWB: {awbNumber}.
          </DialogDescription>
        </DialogHeader>
        <AddTrackingEventForm
          shipmentId={shipmentId}
          onSuccess={() => {
            setOpen(false)
            onSuccess?.()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
