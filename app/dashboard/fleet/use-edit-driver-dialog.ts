import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { updateDriverAction } from "./actions"
import { updateDriverSchema, type UpdateDriverValues } from "./validations"

export function useEditDriverDialog(
  driver: any,
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const form = useForm<UpdateDriverValues>({
    resolver: zodResolver(updateDriverSchema as any),
    defaultValues: {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      status: driver.status as any,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        status: driver.status as any,
      })
    }
  }, [open, driver, form])

  const [isExecuting, startTransition] = useTransition()

  function onSubmit(values: UpdateDriverValues) {
    startTransition(async () => {
      try {
        const result = await updateDriverAction(values)
        if (result?.success) {
          toast.success("Driver updated successfully")
          setOpen(false)
        } else {
          toast.error("Failed to update driver")
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
