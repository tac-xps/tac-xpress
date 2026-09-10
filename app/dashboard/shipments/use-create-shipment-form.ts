import { useEffect, useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { useForm, useWatch, type FieldPath } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createShipmentAction } from "./actions"
import { chargedWeight } from "@/lib/shipment-weight"
import { createShipmentSchema, type CreateShipmentValues, type ShipmentFormInput } from "./validations"
const STEPS = [{ id: 1, title: "Route & service" }, { id: 2, title: "Sender & recipient" }, { id: 3, title: "Cargo details" }]
export function useCreateShipmentForm(onSuccess?: () => void) {
  const [currentStep, setCurrentStep] = useState(1)
  const form = useForm<ShipmentFormInput, unknown, CreateShipmentValues>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: { customerId: "", origin: "", destination: "", serviceType: "express_air", weightKg: 1, pieces: 1, dimensionsL: 0, dimensionsW: 0, dimensionsH: 0, chargedWeightKg: 1, natureOfGoods: "others", itemCondition: "new", packagingType: "none", isFragile: false, insuranceOptIn: false, consignorName: "", consignorPhone: "", consignorAddress: "", consigneeName: "", consigneePhone: "", consigneeAddress: "" },
  })
  const { executeAsync, isExecuting } = useAction(createShipmentAction, {
    onSuccess: ({ data }) => { if (data?.success) { toast.success(`Shipment created: ${data.shipment?.awbNumber || ""}`); form.reset(); setCurrentStep(1); onSuccess?.() } else toast.error(data?.error || "Unable to create shipment") },
    onError: ({ error }) => toast.error(error.serverError || "Unable to create shipment. Your entries have been kept."),
  })
  const [weight, length, width, height, service] = useWatch({ control: form.control, name: ["weightKg", "dimensionsL", "dimensionsW", "dimensionsH", "serviceType"] })
  useEffect(() => {
    form.setValue("chargedWeightKg", chargedWeight({ weightKg: Number(weight) || 0, serviceType: service, dimensionsL: length, dimensionsW: width, dimensionsH: height }), { shouldValidate: true })
  }, [weight, length, width, height, service, form])
  async function handleNext() {
    const fields: FieldPath<ShipmentFormInput>[] = currentStep === 1 ? ["customerId", "origin", "destination", "serviceType"] : ["consignorName", "consignorPhone", "consignorAddress", "consigneeName", "consigneePhone", "consigneeAddress"]
    if (await form.trigger(fields, { shouldFocus: true })) setCurrentStep((step) => Math.min(step + 1, 3))
  }
  async function onSubmit(values: CreateShipmentValues) { if (currentStep < 3) { await handleNext(); return }; await executeAsync(values) }
  return { form, currentStep, STEPS, isExecuting, onSubmit, handleNext, handleBack: () => setCurrentStep((step) => Math.max(1, step - 1)) }
}

