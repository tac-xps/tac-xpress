import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createHubAction } from "./actions"
import { createHubSchema } from "./validations"
import { z } from "zod"

export type CreateHubValues = z.infer<typeof createHubSchema>

export function useAddHubDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateHubValues>({
    resolver: zodResolver(createHubSchema as any),
    defaultValues: {
      name: "",
      location: "",
      contact: "",
      type: "branch",
    },
  })

  async function onSubmit(data: CreateHubValues) {
    setIsSubmitting(true)
    const result = await createHubAction(data as any)

    if (result?.data?.success) {
      toast.success("Hub added successfully")
      setOpen(false)
      form.reset()
    } else {
      toast.error(result?.data?.error || "Failed to create Transit Hub")
    }
    setIsSubmitting(false)
  }

  return {
    open,
    setOpen,
    form,
    isSubmitting,
    onSubmit,
  }
}
