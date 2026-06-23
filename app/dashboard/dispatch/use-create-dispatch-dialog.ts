import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { createDispatchRunAction } from "./actions"
import {
  createDispatchRunSchema,
  type CreateDispatchRunValues,
} from "./validations"

export function useCreateDispatchDialog() {
  const [open, setOpen] = useState(false)

  const form = useForm<CreateDispatchRunValues>({
    resolver: zodResolver(createDispatchRunSchema as any),
    defaultValues: {
      driverId: "",
      vehicleId: "",
      runType: "pickup",
      shipmentIds: [],
    },
  })

  const [isExecuting, startTransition] = useTransition()

  function onSubmit(values: CreateDispatchRunValues) {
    startTransition(async () => {
      try {
        const result = await createDispatchRunAction(values)
        if (result?.success) {
          toast.success("Dispatch run created successfully")
          form.reset()
          setOpen(false)
        } else {
          toast.error(result?.error || "Failed to create dispatch run")
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
