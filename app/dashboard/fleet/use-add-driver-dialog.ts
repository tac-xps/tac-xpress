import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { createDriverAction } from "./actions"
import { addDriverSchema, type AddDriverValues } from "./validations"

export function useAddDriverDialog() {
  const [open, setOpen] = useState(false)

  const form = useForm<AddDriverValues>({
    resolver: zodResolver(addDriverSchema as any),
    defaultValues: {
      name: "",
      phone: "",
      licenseNumber: "",
      status: "active",
    },
  })

  const [isExecuting, startTransition] = useTransition()

  function onSubmit(values: AddDriverValues) {
    startTransition(async () => {
      try {
        const result = await createDriverAction(values)
        if (result?.success) {
          toast.success("Driver added successfully")
          form.reset()
          setOpen(false)
        } else {
          toast.error("Failed to add driver")
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
