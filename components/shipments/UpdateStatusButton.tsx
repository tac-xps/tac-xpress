"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QuickStatusUpdate } from "@/components/logistics/quick-status-update"

import { Button } from "@/components/ui/button"

interface UpdateStatusButtonProps {
  shipmentId: string
  currentStatus: string
}

export function UpdateStatusButton({
  shipmentId,
  currentStatus,
}: UpdateStatusButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Update Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Update Status</DialogTitle>
        </DialogHeader>
        <QuickStatusUpdate
          shipmentId={shipmentId}
          currentStatus={currentStatus}
          onUpdate={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
