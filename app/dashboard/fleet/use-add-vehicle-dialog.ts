import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { createVehicleAction } from "./actions"
import { addVehicleSchema, type AddVehicleValues } from "./validations"

export function useAddVehicleDialog() {
  const [open, setOpen] = useState(false)

  const form = useForm<AddVehicleValues>({
    resolver: zodResolver(addVehicleSchema as any),
    defaultValues: {
      registrationNumber: "",
      capacityKg: 1000,
      driverId: null,
      status: "active",
    },
  })

  const [isExecuting, startTransition] = useTransition()

  function onSubmit(values: AddVehicleValues) {
    startTransition(async () => {
      try {
        const result = await createVehicleAction(values)
        if (result?.success) {
          toast.success("Vehicle added successfully")
          form.reset()
          setOpen(false)
        } else {
          toast.error("Failed to add vehicle")
        }
      } catch (error) {
        toast.error("An unexpected error occurred.")
      }
    })
  }

  return {
    open,
    setOpen,
    form,
    isExecuting,
    onSubmit,
  }
}
