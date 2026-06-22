import { useState, useEffect } from "react"
import { useAction } from "next-safe-action/hooks"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createShipmentAction } from "./actions"
import { createShipmentSchema, type CreateShipmentValues } from "./validations"
import { getRates, type CarrierRate } from "./actions/get-rates"

export function useCreateShipmentForm(onSuccess?: () => void) {
  const form = useForm<CreateShipmentValues>({
    resolver: zodResolver(createShipmentSchema as any),
    defaultValues: {
      customerId: "",
      origin: "",
      destination: "",
      serviceType: "express_air",
      weightKg: 1,
      pieces: 1,
      dimensionsL: 0,
      dimensionsW: 0,
      dimensionsH: 0,
      chargedWeightKg: 1,
      natureOfGoods: "others",
      itemCondition: "new",
      packagingType: "none",
      isFragile: false,
      insuranceOptIn: false,
      consignorName: "",
      consignorPhone: "",
      consignorAddress: "",
      consigneeName: "",
      consigneePhone: "",
      consigneeAddress: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createShipmentAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(`Shipment created: ${data.shipment?.awbNumber || ""}`)
        form.reset()
        onSuccess?.()
      } else {
        toast.error("Failed to create shipment")
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "An unexpected error occurred.")
    },
  })

  function onSubmit(values: CreateShipmentValues) {
    if (currentStep < STEPS.length) {
      handleNext()
      return
    }
    executeAsync(values)
  }

  // Watch dimensions and weight to calculate volumetric / charged weight
  const weightKg = useWatch({ control: form.control, name: "weightKg" })
  const l = useWatch({ control: form.control, name: "dimensionsL" })
  const w = useWatch({ control: form.control, name: "dimensionsW" })
  const h = useWatch({ control: form.control, name: "dimensionsH" })
  const serviceType = useWatch({ control: form.control, name: "serviceType" })

  // Basic volumetric calculation for Air Express (L x W x H in cm / 5000)
  useEffect(() => {
    let charged = weightKg || 1
    if (serviceType === "express_air" && l && w && h) {
      const volWeight = Math.ceil((l * w * h) / 5000)
      if (volWeight > charged) {
        charged = volWeight
      }
    }
    form.setValue("chargedWeightKg", charged, { shouldValidate: true })
  }, [weightKg, l, w, h, serviceType, form])

  // Live Rates fetching logic
  const [availableRates, setAvailableRates] = useState<CarrierRate[]>([])
  const [isFetchingRates, setIsFetchingRates] = useState(false)
  const [selectedRate, setSelectedRate] = useState<CarrierRate | null>(null)

  const origin = useWatch({ control: form.control, name: "origin" })
  const destination = useWatch({ control: form.control, name: "destination" })

  useEffect(() => {
    if (
      origin &&
      origin.length > 2 &&
      destination &&
      destination.length > 2 &&
      weightKg > 0
    ) {
      setSelectedRate(null)
      form.setValue("selectedRateId", undefined)
      const timer = setTimeout(async () => {
        setIsFetchingRates(true)
        try {
          const rates = await getRates(origin, destination, weightKg)
          setAvailableRates(rates)
        } catch (e) {
          toast.error("Failed to fetch live rates.")
        } finally {
          setIsFetchingRates(false)
        }
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setAvailableRates([])
      setSelectedRate(null)
      form.setValue("selectedRateId", undefined)
    }
  }, [origin, destination, weightKg, form])

  function handleRateSelect(rate: CarrierRate) {
    setSelectedRate(rate)
    form.setValue("selectedRateId", rate.id)
    // Optional: automatically set service type depending on carrier rate if needed
    // But we'll just store the ID for the form payload.
  }

  // onSubmit is moved above to access startTransition

  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [canSubmit, setCanSubmit] = useState(false)

  const STEPS = [
    { id: 1, title: "Routing", description: "Locations & service" },
    { id: 2, title: "Parties", description: "Consignor & Consignee" },
    { id: 3, title: "Cargo", description: "Package details" },
  ]

  useEffect(() => {
    if (currentStep === STEPS.length) {
      const timer = setTimeout(() => setCanSubmit(true), 400)
      return () => clearTimeout(timer)
    } else {
      setCanSubmit(false)
    }
  }, [currentStep, STEPS.length])

  const handleNext = async () => {
    let fieldsToValidate: any[] = []
    if (currentStep === 1)
      fieldsToValidate = ["customerId", "origin", "destination", "serviceType"]
    if (currentStep === 2)
      fieldsToValidate = [
        "consignorName",
        "consignorPhone",
        "consignorAddress",
        "consigneeName",
        "consigneePhone",
        "consigneeAddress",
      ]

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setDirection(1)
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const handleBack = () => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  return {
    form,
    isFetchingRates,
    availableRates,
    selectedRate,
    handleRateSelect,
    isExecuting,
    canSubmit,
    onSubmit,
    currentStep,
    direction,
    handleNext,
    handleBack,
    STEPS,
  }
}
