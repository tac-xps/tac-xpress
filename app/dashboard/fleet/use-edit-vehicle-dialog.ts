import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { updateVehicleAction } from "./actions"
import { updateVehicleSchema, type UpdateVehicleValues } from "./validations"

export function useEditVehicleDialog(
  vehicle: any,
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const form = useForm<UpdateVehicleValues>({
    resolver: zodResolver(updateVehicleSchema as any),
    defaultValues: {
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      capacityKg: vehicle.capacityKg,
      driverId: vehicle.driverId || null,
      status: vehicle.status as any,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        id: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        capacityKg: vehicle.capacityKg,
        driverId: vehicle.driverId || null,
        status: vehicle.status as any,
      })
    }
  }, [open, vehicle, form])

  const [isExecuting, startTransition] = useTransition()

  function onSubmit(values: UpdateVehicleValues) {
    startTransition(async () => {
      try {
        const result = await updateVehicleAction(values)
        if (result?.success) {
          toast.success("Vehicle updated successfully")
          setOpen(false)
        } else {
          toast.error("Failed to update vehicle")
        }
      } catch (error) {
        toast.error("An unexpected error occurred.")
      }
    })
  }

  return {
    form,
    isExecuting,
    onSubmit,
  }
}
