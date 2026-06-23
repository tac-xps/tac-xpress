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
}

export function AddTrackingEventDialog({
  shipmentId,
  awbNumber,
}: AddTrackingEventDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-full justify-start">
          <MapPinIcon className="mr-2 h-4 w-4" />
          Log Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Tracking Event</DialogTitle>
          <DialogDescription>
            Update the status and location for shipment AWB: {awbNumber}.
          </DialogDescription>
        </DialogHeader>
        <AddTrackingEventForm
          shipmentId={shipmentId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
