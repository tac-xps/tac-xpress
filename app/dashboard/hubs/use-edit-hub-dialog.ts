import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { updateHubAction } from "./actions"
import { updateHubSchema } from "./validations"
import { z } from "zod"

export type UpdateHubValues = z.infer<typeof updateHubSchema>

export function useEditHubDialog(
  hub: any,
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdateHubValues>({
    resolver: zodResolver(updateHubSchema as any),
    defaultValues: {
      id: hub.id,
      name: hub.name,
      location: hub.location,
      contact: hub.contact || "",
      type: hub.type as any,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        id: hub.id,
        name: hub.name,
        location: hub.location,
        contact: hub.contact || "",
        type: hub.type as any,
      })
    }
  }, [open, hub, form])

  async function onSubmit(data: UpdateHubValues) {
    setIsSubmitting(true)
    const result = await updateHubAction(data as any)

    if (result?.data?.success) {
      toast.success("Hub updated successfully")
      setOpen(false)
    } else {
      toast.error(result?.data?.error || "Failed to update Transit Hub")
    }
    setIsSubmitting(false)
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  }
}
