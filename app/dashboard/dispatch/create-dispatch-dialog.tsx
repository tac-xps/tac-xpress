"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCreateDispatchDialog } from "./use-create-dispatch-dialog"
import { CreateDispatchForm } from "./create-dispatch-form"

export type DriverMin = { id: string; name: string }
export type VehicleMin = { id: string; registrationNumber: string }
export type ShipmentMin = {
  id: string
  awbNumber: string
  origin: string
  destination: string
  status: string
}

export function CreateDispatchDialog({
  pendingShipments,
}: {
  pendingShipments: ShipmentMin[]
}) {
  const { open, setOpen, form, isExecuting, onSubmit } =
    useCreateDispatchDialog()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Dispatch Run
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Daily Run Sheet</DialogTitle>
        </DialogHeader>
        <CreateDispatchForm
          form={form}
          onSubmit={onSubmit}
          isExecuting={isExecuting}
          pendingShipments={pendingShipments}
        />
      </DialogContent>
    </Dialog>
  )
}
