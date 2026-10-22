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
  deliveryShipments,
  defaultRunType,
  buttonLabel = "Create Dispatch Run",
  buttonSize = "default",
  buttonVariant = "default",
}: {
  pendingShipments: ShipmentMin[]
  deliveryShipments: ShipmentMin[]
  defaultRunType?: "pickup" | "delivery"
  buttonLabel?: string
  buttonSize?: "default" | "sm" | "lg" | "icon"
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link"
}) {
  const initialShipmentIds =
    defaultRunType === "delivery" && deliveryShipments.length === 1
      ? [deliveryShipments[0].id]
      : defaultRunType === "pickup" && pendingShipments.length === 1
        ? [pendingShipments[0].id]
        : []

  const { open, setOpen, form, isExecuting, onSubmit } =
    useCreateDispatchDialog({ defaultRunType, initialShipmentIds })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={buttonSize} variant={buttonVariant}>
          <Plus className="mr-2 h-4 w-4" /> {buttonLabel}
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
          deliveryShipments={deliveryShipments}
        />
      </DialogContent>
    </Dialog>
  )
}
