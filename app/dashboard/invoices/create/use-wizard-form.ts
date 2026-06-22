import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"
import { useAction } from "next-safe-action/hooks"

import {
  invoiceWizardSchema,
  type InvoiceWizardValues,
} from "@/lib/schemas/invoice-wizard"
import { createWizardInvoiceAction, lookupPincodeAction } from "../actions"

export const STEPS = [
  { id: 1, name: "Basics", description: "Consignment route" },
  { id: 2, name: "Consignor", description: "Shipper details" },
  { id: 3, name: "Consignee", description: "Receiver details" },
  { id: 4, name: "Shipment", description: "Package specs" },
  { id: 5, name: "Financials", description: "Charges & GST" },
  { id: 6, name: "Review", description: "Confirm & Print" },
]

export function useWizardForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [canSubmit, setCanSubmit] = useState(false)
  const router = useRouter()
  const [createdResult, setCreatedResult] = useState<{
    invoiceId: string
    shipmentId: string
  } | null>(null)

  const { executeAsync, isExecuting } = useAction(createWizardInvoiceAction, {
    onSuccess: ({ data }) => {
      if (data?.success && "invoiceId" in data && "shipmentId" in data) {
        toast.success("Consignment and Invoice created successfully!")
        setCreatedResult({
          invoiceId: data.invoiceId,
          shipmentId: data.shipmentId,
        })
      } else {
        const actionError = data && "error" in data ? data.error : undefined
        toast.error(actionError || "Failed to create invoice")
      }
    },
    onError: ({ error }) => {
      Sentry.captureException(error)
      toast.error(error.serverError || "An unexpected error occurred")
    },
  })

  const onSubmit = async (data: InvoiceWizardValues) => {
    if (currentStep < STEPS.length) {
      handleNext()
      return
    }
    await executeAsync(data as any)
  }

  const form = useForm<InvoiceWizardValues>({
    // @ts-ignore - version mismatch between zod and react-hook-form resolvers
    resolver: zodResolver(invoiceWizardSchema),
    defaultValues: {
      serviceType: "express_air",
      origin: "",
      destination: "",
      originState: "",
      destinationState: "",
      consignorName: "",
      consignorCompany: "",
      consignorPhone: "",
      consignorAltPhone: "",
      consignorEmail: "",
      consignorAddress: "",
      consignorPinCode: "",
      consignorIdType: "none",
      consignorIdNumber: "",
      consigneeName: "",
      consigneePhone: "",
      consigneeAltPhone: "",
      consigneeEmail: "",
      consigneeAddress: "",
      consigneePinCode: "",
      contentDescription: "",
      natureOfGoods: "others",
      itemCondition: "new",
      declaredValue: 0,
      pieces: 1,
      weightKg: 1,
      dimensionsL: 0,
      dimensionsW: 0,
      dimensionsH: 0,
      packagingType: "none",
      isFragile: false,
      insuranceOptIn: false,
      freightRatePerKg: 0,
      freightCharge: 0,
      pickupCharge: 0,
      packingCharge: 0,
      docketCharge: 0,
      insuranceCharge: 0,
      otherCharges: 0,
      gstRate: 0,
      paymentMode: "cash",
      advancePaid: 0,
      termsAccepted: false,
      prohibitedAccepted: false,
    },
    mode: "onTouched",
  })

  const { watch, trigger } = form

  const consignorPhone = watch("consignorPhone") || ""
  const serviceType = watch("serviceType") || "express_air"
  const weightKg = Number(watch("weightKg")) || 1
  const pieces = Number(watch("pieces")) || 1
  const dimL = Number(watch("dimensionsL")) || 0
  const dimW = Number(watch("dimensionsW")) || 0
  const dimH = Number(watch("dimensionsH")) || 0
  const origin = watch("origin") || ""
  const destination = watch("destination") || ""

  // Pincode search states
  const [originPinQuery, setOriginPinQuery] = useState("")
  const [destinationPinQuery, setDestinationPinQuery] = useState("")
  const [isOriginPinLoading, setIsOriginPinLoading] = useState(false)
  const [isDestinationPinLoading, setIsDestinationPinLoading] = useState(false)

  // Rate estimation states removed

  // Volumetric and Chargeable calculations
  let volumetricWeight = 0
  const isOcean = serviceType === "standard_ocean"
  const isRoad = serviceType === "road_freight"
  const isAir = serviceType === "express_air"

  const volumeCbm = ((dimL * dimW * dimH) / 1000000) * pieces

  if (isAir) {
    volumetricWeight = ((dimL * dimW * dimH) / 5000) * pieces
  } else if (isRoad) {
    volumetricWeight = ((dimL * dimW * dimH) / 4000) * pieces
  }

  let chargeableWeight = weightKg
  if (isAir || isRoad) {
    chargeableWeight = Math.max(weightKg, volumetricWeight)
  } else if (isOcean) {
    const tonnage = weightKg / 1000
    chargeableWeight = Math.max(tonnage, volumeCbm) * 1000
  }

  // Traffic & Demand Metrics removed
  // Pincode lookups
  const handleOriginPinLookup = async () => {
    if (originPinQuery.length !== 6) return
    setIsOriginPinLoading(true)
    try {
      const res = await lookupPincodeAction({ pincode: originPinQuery })
      if (res?.data?.success && res.data.city) {
        form.setValue("origin", res.data.city)
        form.setValue("originState", res.data.state || "")
        form.setValue("consignorPinCode", originPinQuery)
        toast.success(`Resolved Origin: ${res.data.city}, ${res.data.state}`)
      } else {
        toast.error(res?.data?.error || "Pincode details not found")
      }
    } catch (err) {
      Sentry.captureException(err)
      toast.error("Failed to lookup pincode")
    } finally {
      setIsOriginPinLoading(false)
    }
  }

  const handleDestinationPinLookup = async () => {
    if (destinationPinQuery.length !== 6) return
    setIsDestinationPinLoading(true)
    try {
      const res = await lookupPincodeAction({ pincode: destinationPinQuery })
      if (res?.data?.success && res.data.city) {
        form.setValue("destination", res.data.city)
        form.setValue("destinationState", res.data.state || "")
        form.setValue("consigneePinCode", destinationPinQuery)
        toast.success(
          `Resolved Destination: ${res.data.city}, ${res.data.state}`
        )
      } else {
        toast.error(res?.data?.error || "Pincode details not found")
      }
    } catch (err) {
      Sentry.captureException(err)
      toast.error("Failed to lookup pincode")
    } finally {
      setIsDestinationPinLoading(false)
    }
  }

  // Auto-calculation logic for freight charge based on rate per kg
  const freightRatePerKg = Number(watch("freightRatePerKg")) || 0

  useEffect(() => {
    if (freightRatePerKg > 0) {
      const calculatedFreight = freightRatePerKg * chargeableWeight
      form.setValue("freightCharge", Number(calculatedFreight.toFixed(2)))
    }
  }, [freightRatePerKg, chargeableWeight, form])

  // Auto-calculation logic for Step 5
  const freight = watch("freightCharge") || 0
  const pickup = watch("pickupCharge") || 0
  const packing = watch("packingCharge") || 0
  const docket = watch("docketCharge") || 0
  const insurance = watch("insuranceCharge") || 0
  const other = watch("otherCharges") || 0
  const gstRate = watch("gstRate") || 0
  const advance = watch("advancePaid") || 0

  const subtotal =
    Number(freight) +
    Number(pickup) +
    Number(packing) +
    Number(docket) +
    Number(insurance) +
    Number(other)

  const originState = watch("originState") || ""
  const destinationState = watch("destinationState") || ""

  let calcCgst = 0
  let calcSgst = 0
  let calcIgst = 0

  if (gstRate > 0) {
    if (
      originState &&
      destinationState &&
      originState.toLowerCase() !== destinationState.toLowerCase()
    ) {
      calcIgst = (subtotal * Number(gstRate)) / 100
    } else {
      calcCgst = (subtotal * (Number(gstRate) / 2)) / 100
      calcSgst = (subtotal * (Number(gstRate) / 2)) / 100
    }
  }

  const gstAmount = calcCgst + calcSgst + calcIgst
  const totalAmount = subtotal + gstAmount
  const balanceDue = totalAmount - Number(advance)

  const handleNext = async () => {
    let fieldsToValidate: (keyof InvoiceWizardValues)[] = []
    if (currentStep === 1)
      fieldsToValidate = ["serviceType", "origin", "destination"]
    if (currentStep === 2)
      fieldsToValidate = [
        "consignorName",
        "consignorCompany",
        "consignorPhone",
        "consignorAltPhone",
        "consignorEmail",
        "consignorAddress",
        "consignorPinCode",
        "consignorIdType",
        "consignorIdNumber",
      ]
    if (currentStep === 3)
      fieldsToValidate = [
        "consigneeName",
        "consigneePhone",
        "consigneeAltPhone",
        "consigneeEmail",
        "consigneeAddress",
        "consigneePinCode",
      ]
    if (currentStep === 4)
      fieldsToValidate = [
        "contentDescription",
        "natureOfGoods",
        "itemCondition",
        "declaredValue",
        "pieces",
        "weightKg",
        "dimensionsL",
        "dimensionsW",
        "dimensionsH",
        "packagingType",
      ]
    if (currentStep === 5) fieldsToValidate = ["freightCharge", "paymentMode"]

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid && currentStep < STEPS.length) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  useEffect(() => {
    if (currentStep === STEPS.length) {
      const timer = setTimeout(() => setCanSubmit(true), 400)
      return () => clearTimeout(timer)
    } else {
      setCanSubmit(false)
    }
  }, [currentStep])

  const closeSuccessDialog = () => {
    setCreatedResult(null)
    router.push("/dashboard/invoices")
  }

  return {
    form,
    currentStep,
    direction,
    STEPS,
    canSubmit,
    isSubmitting: isExecuting,
    createdResult,
    consignorPhone,
    originPinQuery,
    setOriginPinQuery,
    destinationPinQuery,
    setDestinationPinQuery,
    isOriginPinLoading,
    isDestinationPinLoading,
    handleOriginPinLookup,
    handleDestinationPinLookup,
    calculations: {
      subtotal,
      gstAmount,
      calcCgst,
      calcSgst,
      calcIgst,
      totalAmount,
      balanceDue,
      volumetricWeight,
      chargeableWeight,
      volumeCbm,
    },
    handleNext,
    handleBack,
    onSubmit,
    closeSuccessDialog,
  }
}
