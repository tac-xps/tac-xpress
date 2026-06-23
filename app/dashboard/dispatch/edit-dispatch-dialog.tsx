"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateDispatchRunAction } from "./actions"
import { DriverCombobox } from "@/components/forms/driver-combobox"
import { VehicleCombobox } from "@/components/forms/vehicle-combobox"

interface EditDispatchDialogProps {
  dispatchRun: {
    id: string
    referenceId: string
    driverId?: string | null
    vehicleId?: string | null
    status: "draft" | "finalized"
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDispatchDialog({
  dispatchRun,
  open,
  onOpenChange,
}: EditDispatchDialogProps) {
  const [driverId, setDriverId] = useState(dispatchRun.driverId || "")
  const [vehicleId, setVehicleId] = useState(dispatchRun.vehicleId || "")
  const [status, setStatus] = useState<"draft" | "finalized">(
    dispatchRun.status
  )

  const { executeAsync, isExecuting } = useAction(updateDispatchRunAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Dispatch run updated successfully")
        onOpenChange(false)
      } else {
        toast.error(data?.error || "Failed to update dispatch run")
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "An unexpected error occurred")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await executeAsync({
      id: dispatchRun.id,
      driverId: driverId || undefined,
      vehicleId: vehicleId || undefined,
      status,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90vw] max-w-4xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Dispatch Run</DialogTitle>
            <DialogDescription>
              Update driver, vehicle, and status for {dispatchRun.referenceId}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="driverId">Driver</Label>
              <DriverCombobox
                value={driverId}
                onSelect={(id) => setDriverId(id)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle</Label>
              <VehicleCombobox
                value={vehicleId}
                onSelect={(id) => setVehicleId(id)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "draft" | "finalized") =>
                  setStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="finalized">Finalized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isExecuting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isExecuting}>
              {isExecuting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
