import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"
import { useTransition } from "react"
import { createPricingRuleAction } from "./actions"

export const addPricingRuleSchema = z.object({
  serviceType: z.enum(["express_air", "standard_ocean", "road_freight"]),
  origin: z.string().min(2, "Origin must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  basePrice: z.coerce.number().min(0, "Base price cannot be negative"),
  pricePerKg: z.coerce.number().min(0, "Price per Kg cannot be negative"),
})

export type AddPricingRuleValues = z.infer<typeof addPricingRuleSchema>

export function useAddPricingRuleForm(onSuccess: () => void) {
  const form = useForm<AddPricingRuleValues>({
    resolver: zodResolver(addPricingRuleSchema as any),
    defaultValues: {
      serviceType: "express_air",
      origin: "",
      destination: "",
      basePrice: 0,
      pricePerKg: 0,
    },
  })

  const [isExecuting, startTransition] = useTransition()

  function onSubmit(values: AddPricingRuleValues) {
    startTransition(async () => {
      try {
        const result = await createPricingRuleAction(values)
        if (result?.success) {
          toast.success("Pricing rule added successfully")
          form.reset()
          onSuccess()
        } else {
          toast.error(result?.error || "Failed to add pricing rule")
        }
      } catch (error) {
        Sentry.captureException(error)
        toast.error("An unexpected error occurred")
      }
    })
  }

  return {
    form,
    isExecuting,
    onSubmit,
  }
}
