import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"
import { useTransition } from "react"
import { createPricingRuleAction } from "./actions"
import { createPricingRuleSchema } from "./validations"

export const addPricingRuleSchema = createPricingRuleSchema

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
        if (result?.data?.success) {
          toast.success("Pricing rule added successfully")
          form.reset()
          onSuccess()
        } else {
          toast.error(
            (result?.data?.error ?? result?.serverError) ||
              "Failed to add pricing rule"
          )
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
