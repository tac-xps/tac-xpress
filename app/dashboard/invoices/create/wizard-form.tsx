"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Stack } from "@/components/layout/stack"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileCheck,
  CheckCircle2,
  FileText,
  ReceiptText,
  ChevronDown,
} from "lucide-react"
// DEV-NOTE: If you see a "useWizardForm is not defined" error during development,
// it's likely a transient issue with Next.js's Fast Refresh. A full page reload will fix it.
import { useWizardForm } from "./use-wizard-form"
import { InvoiceSuccessDialog } from "./invoice-success-dialog"
import { CityCombobox } from "@/components/forms/city-combobox"
import { CustomerCombobox } from "@/components/forms/customer-combobox"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { createCustomerAction } from "@/app/dashboard/customers/actions"
import { lookupPincodeAction } from "../actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const contentVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 50 : -50,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -50 : 50,
    transition: { duration: 0.2 },
  }),
}

function ReviewItem({
  label,
  value,
  className,
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-dashed border-border/40 py-2 last:border-0",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground tabular-nums">
        {value || "—"}
      </span>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function WizardForm() {
  const {
    form,
    currentStep,
    direction,
    STEPS,
    canSubmit,
    isSubmitting,
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
    calculations,
    handleNext,
    handleBack,
    onSubmit,
    closeSuccessDialog,
  } = useWizardForm()

  const [chargesOpen, setChargesOpen] = useState(false)
  const [quickCreateRole, setQuickCreateRole] = useState<
    "consignor" | "consignee" | null
  >(null)

  // Quick Create Customer states
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [newPinCode, setNewPinCode] = useState("")
  const [newCity, setNewCity] = useState("")
  const [newState, setNewState] = useState("")
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)
  const [createError, setCreateError] = useState("")

  const handleQuickCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newPhone.trim()) {
      setCreateError("Name and Phone number are required.")
      return
    }

    setIsCreatingCustomer(true)
    setCreateError("")

    try {
      const res = await createCustomerAction({
        name: newName,
        phone: newPhone,
        email: newEmail || undefined,
        address: newAddress || undefined,
        city: newCity || undefined,
        state: newState || undefined,
        pinCode: newPinCode || undefined,
      })

      if (res && "customer" in res && res.customer) {
        const customer = res.customer
        toast.success(`Customer "${newName}" created successfully!`)

        if (quickCreateRole === "consignor") {
          form.setValue("consignorName", customer.name || "")
          form.setValue("consignorPhone", customer.phone || "")
          if (customer.email) form.setValue("consignorEmail", customer.email)
          if (customer.address)
            form.setValue("consignorAddress", customer.address)
          if (customer.pinCode)
            form.setValue("consignorPinCode", customer.pinCode)
          if (customer.city) form.setValue("origin", customer.city)
          form.trigger([
            "consignorPhone",
            "consignorEmail",
            "consignorAddress",
            "consignorPinCode",
          ])
        } else if (quickCreateRole === "consignee") {
          form.setValue("consigneeName", customer.name || "")
          form.setValue("consigneePhone", customer.phone || "")
          if (customer.email) form.setValue("consigneeEmail", customer.email)
          if (customer.address)
            form.setValue("consigneeAddress", customer.address)
          if (customer.pinCode)
            form.setValue("consigneePinCode", customer.pinCode)
          if (customer.city) form.setValue("destination", customer.city)
          form.trigger([
            "consigneePhone",
            "consigneeEmail",
            "consigneeAddress",
            "consigneePinCode",
          ])
        }

        // Reset dialog fields and close
        setNewName("")
        setNewPhone("")
        setNewEmail("")
        setNewAddress("")
        setNewPinCode("")
        setNewCity("")
        setNewState("")
        setQuickCreateRole(null)
      } else {
        const errMsg =
          res && "error" in res && typeof res.error === "string"
            ? res.error
            : "Failed to create customer."
        setCreateError(errMsg)
      }
    } catch (err: any) {
      setCreateError(err.message || "An unexpected error occurred.")
    } finally {
      setIsCreatingCustomer(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const lookupQuickPin = async () => {
      if (newPinCode.length === 6 && /^\d{6}$/.test(newPinCode)) {
        try {
          const res = await lookupPincodeAction({ pincode: newPinCode })
          if (!cancelled && res?.data?.success && res.data.city) {
            setNewCity(res.data.city)
            setNewState(res.data.state || "")
            toast.success(
              `Resolved Quick Add Location: ${res.data.city}, ${res.data.state}`
            )
          }
        } catch {
          // Ignore
        }
      }
    }
    lookupQuickPin()
    return () => {
      cancelled = true
    }
  }, [newPinCode])
  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100

  const onInvalid = (errors: any) => {
    console.error(errors)
    toast.error(
      "Please fix the validation errors before generating the invoice."
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-muted/20 p-4 font-sans md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Create Invoice
              </h1>
              <p className="text-sm text-muted-foreground">
                Fill out the details to generate a new shipment and invoice.
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="w-fit border-border bg-background px-4 py-2 text-xs font-semibold tracking-wider uppercase shadow-sm"
          >
            Draft Mode
          </Badge>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column: Form Content */}
          <div className="flex flex-col gap-6">
            <Card className="overflow-hidden border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                {/* Stepper Progress Indicator */}
                <div className="mb-10">
                  <div className="mb-4 flex justify-between px-2">
                    <span className="text-sm font-medium text-foreground">
                      Step {currentStep} of {STEPS.length}
                    </span>
                    <span className="text-sm font-medium text-primary tabular-nums">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-2 bg-muted/50"
                  />

                  {/* Step Markers */}
                  <div className="relative mt-6 flex justify-between">
                    {STEPS.map((s, i) => {
                      const isCompleted = i + 1 < currentStep
                      const isCurrent = i + 1 === currentStep

                      return (
                        <div
                          key={s.id}
                          className="relative z-10 flex w-16 flex-col items-center gap-2"
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold tabular-nums transition-all duration-300",
                              isCompleted
                                ? "bg-primary text-primary-foreground shadow-md"
                                : isCurrent
                                  ? "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20"
                                  : "border border-border/50 bg-muted text-muted-foreground"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              i + 1
                            )}
                          </div>
                          <span
                            className={cn(
                              "hidden text-center text-xs font-semibold transition-colors duration-300 sm:block",
                              isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {s.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    {STEPS[currentStep - 1].name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {STEPS[currentStep - 1].description}
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit as any)}
                    className="relative flex w-full flex-col font-sans"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        e.target instanceof HTMLElement &&
                        e.target.tagName !== "TEXTAREA"
                      ) {
                        e.preventDefault()
                      }
                    }}
                  >
                    <div className="w-full">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="w-full"
                        >
                          {currentStep === 1 && (
                            <div className="grid gap-6 sm:grid-cols-2">
                              <FormField
                                control={form.control as any}
                                name="serviceType"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-2">
                                    <FormLabel>
                                      Service Type{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12 bg-background">
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="express_air">
                                          Express Air
                                        </SelectItem>
                                        <SelectItem value="standard_ocean">
                                          Standard Ocean
                                        </SelectItem>
                                        <SelectItem value="road_freight">
                                          Road Freight
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="space-y-4">
                                <FormItem>
                                  <Label>Origin PIN Code Search</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="PIN Code (e.g. 110003)"
                                      value={originPinQuery}
                                      onChange={(e) =>
                                        setOriginPinQuery(e.target.value)
                                      }
                                      className="h-12 flex-1 bg-background"
                                      maxLength={6}
                                    />
                                    <Button
                                      type="button"
                                      onClick={handleOriginPinLookup}
                                      disabled={
                                        isOriginPinLoading ||
                                        originPinQuery.length !== 6
                                      }
                                      variant="secondary"
                                      className="h-12 shrink-0 border border-border/50"
                                    >
                                      {isOriginPinLoading
                                        ? "Searching..."
                                        : "Search"}
                                    </Button>
                                  </div>
                                </FormItem>
                                <FormField
                                  control={form.control as any}
                                  name="origin"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Origin City{" "}
                                        <span className="text-destructive">
                                          *
                                        </span>
                                      </FormLabel>
                                      <FormControl>
                                        <CityCombobox
                                          value={field.value}
                                          onSelect={(data) => {
                                            field.onChange(data.city)
                                            form.setValue(
                                              "originState",
                                              data.state || ""
                                            )
                                            form.setValue(
                                              "consignorPinCode",
                                              data.pinCode || ""
                                            )
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="space-y-4">
                                <FormItem>
                                  <Label>Destination PIN Code Search</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="PIN Code (e.g. 795001)"
                                      value={destinationPinQuery}
                                      onChange={(e) =>
                                        setDestinationPinQuery(e.target.value)
                                      }
                                      className="h-12 flex-1 bg-background"
                                      maxLength={6}
                                    />
                                    <Button
                                      type="button"
                                      onClick={handleDestinationPinLookup}
                                      disabled={
                                        isDestinationPinLoading ||
                                        destinationPinQuery.length !== 6
                                      }
                                      variant="secondary"
                                      className="h-12 shrink-0 border border-border/50"
                                    >
                                      {isDestinationPinLoading
                                        ? "Searching..."
                                        : "Search"}
                                    </Button>
                                  </div>
                                </FormItem>
                                <FormField
                                  control={form.control as any}
                                  name="destination"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Destination City{" "}
                                        <span className="text-destructive">
                                          *
                                        </span>
                                      </FormLabel>
                                      <FormControl>
                                        <CityCombobox
                                          value={field.value}
                                          onSelect={(data) => {
                                            field.onChange(data.city)
                                            form.setValue(
                                              "destinationState",
                                              data.state || ""
                                            )
                                            form.setValue(
                                              "consigneePinCode",
                                              data.pinCode || ""
                                            )
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}

                          {currentStep === 2 && (
                            <div className="grid gap-6 sm:grid-cols-2">
                              <FormField
                                control={form.control as any}
                                name="consignorName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Consignor{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </FormLabel>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1">
                                        <FormControl>
                                          <CustomerCombobox
                                            value={field.value}
                                            onSelect={(customer) => {
                                              field.onChange(
                                                customer.name ||
                                                  customer.email ||
                                                  customer.id
                                              )
                                              if (customer.phone)
                                                form.setValue(
                                                  "consignorPhone",
                                                  customer.phone
                                                )
                                              if (customer.email)
                                                form.setValue(
                                                  "consignorEmail",
                                                  customer.email
                                                )
                                              if (customer.address)
                                                form.setValue(
                                                  "consignorAddress",
                                                  customer.address
                                                )
                                              if (customer.pinCode)
                                                form.setValue(
                                                  "consignorPinCode",
                                                  customer.pinCode
                                                )
                                              // Trigger validation for auto-filled fields
                                              form.trigger([
                                                "consignorPhone",
                                                "consignorEmail",
                                                "consignorAddress",
                                                "consignorPinCode",
                                              ])
                                            }}
                                          />
                                        </FormControl>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="h-10 shrink-0 border-dashed border-primary/40 text-xs font-semibold text-primary hover:bg-primary/5"
                                        onClick={() =>
                                          setQuickCreateRole("consignor")
                                        }
                                      >
                                        + Quick Add
                                      </Button>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consignorCompany"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        placeholder="Optional"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consignorPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Phone{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        placeholder="10-digit number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consignorAltPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Alt Phone</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        placeholder="Optional"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consignorEmail"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        type="email"
                                        placeholder="Optional"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consignorAddress"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-2">
                                    <FormLabel>Address (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        className="h-24 resize-none bg-background"
                                        {...field}
                                        placeholder="Full Address"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consignorPinCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>PIN Code (Optional)</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        placeholder="6 digits"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consignorIdType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>ID Proof Type</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-background">
                                          <SelectValue placeholder="Select ID type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="none">
                                          None
                                        </SelectItem>
                                        <SelectItem value="aadhaar">
                                          Aadhaar
                                        </SelectItem>
                                        <SelectItem value="pan">PAN</SelectItem>
                                        <SelectItem value="passport">
                                          Passport
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {form.watch("consignorIdType") !== "none" && (
                                <FormField
                                  control={form.control as any}
                                  name="consignorIdNumber"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>ID Number</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-background uppercase"
                                          {...field}
                                          placeholder="Enter ID number"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          )}

                          {currentStep === 3 && (
                            <div className="grid gap-6 sm:grid-cols-2">
                              <FormField
                                control={form.control as any}
                                name="consigneeName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Consignee{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </FormLabel>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1">
                                        <FormControl>
                                          <CustomerCombobox
                                            value={field.value}
                                            onSelect={(customer) => {
                                              field.onChange(
                                                customer.name ||
                                                  customer.email ||
                                                  customer.id
                                              )
                                              if (customer.phone)
                                                form.setValue(
                                                  "consigneePhone",
                                                  customer.phone
                                                )
                                              if (customer.email)
                                                form.setValue(
                                                  "consigneeEmail",
                                                  customer.email
                                                )
                                              if (customer.address)
                                                form.setValue(
                                                  "consigneeAddress",
                                                  customer.address
                                                )
                                              if (customer.pinCode)
                                                form.setValue(
                                                  "consigneePinCode",
                                                  customer.pinCode
                                                )
                                              // Trigger validation for auto-filled fields
                                              form.trigger([
                                                "consigneePhone",
                                                "consigneeEmail",
                                                "consigneeAddress",
                                                "consigneePinCode",
                                              ])
                                            }}
                                          />
                                        </FormControl>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="h-10 shrink-0 border-dashed border-primary/40 text-xs font-semibold text-primary hover:bg-primary/5"
                                        onClick={() =>
                                          setQuickCreateRole("consignee")
                                        }
                                      >
                                        + Quick Add
                                      </Button>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consigneePhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Phone{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        placeholder="10-digit number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consigneeAltPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Alt Phone</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        placeholder="Optional"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consigneeAddress"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-2">
                                    <FormLabel>
                                      Address{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        className="h-24 resize-none bg-background"
                                        {...field}
                                        placeholder="Full Address"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consigneePinCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      PIN Code{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        placeholder="6 digits"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="consigneeEmail"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        type="email"
                                        placeholder="Optional"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          {currentStep === 4 && (
                            <div className="grid gap-6 sm:grid-cols-2">
                              <FormField
                                control={form.control as any}
                                name="contentDescription"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-2">
                                    <FormLabel>
                                      Content Description{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-background"
                                        {...field}
                                        placeholder="e.g. Used Mobile Phone"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="natureOfGoods"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nature of Goods</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-background">
                                          <SelectValue placeholder="Select nature" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="documents">
                                          Documents
                                        </SelectItem>
                                        <SelectItem value="electronics">
                                          Electronics
                                        </SelectItem>
                                        <SelectItem value="garments">
                                          Garments
                                        </SelectItem>
                                        <SelectItem value="fragile">
                                          Fragile
                                        </SelectItem>
                                        <SelectItem value="medicines">
                                          Medicines
                                        </SelectItem>
                                        <SelectItem value="others">
                                          Others
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="itemCondition"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Item Condition</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-background">
                                          <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="used">
                                          Used
                                        </SelectItem>
                                        <SelectItem value="refurbished">
                                          Refurbished
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control as any}
                                name="packagingType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Packaging Type</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-background">
                                          <SelectValue placeholder="Select packaging" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="none">
                                          None
                                        </SelectItem>
                                        <SelectItem value="corrugated_box">
                                          Corrugated Box
                                        </SelectItem>
                                        <SelectItem value="bubble_wrap">
                                          Bubble Wrap
                                        </SelectItem>
                                        <SelectItem value="wooden_crate">
                                          Wooden Crate
                                        </SelectItem>
                                        <SelectItem value="pallet">
                                          Pallet
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-3 gap-4 sm:col-span-2">
                                <FormField
                                  control={form.control as any}
                                  name="pieces"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Pieces</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-background text-right tabular-nums"
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control as any}
                                  name="weightKg"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Weight (Kg)</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-background text-right tabular-nums"
                                          type="number"
                                          step="0.1"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control as any}
                                  name="declaredValue"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Declared Value (₹)</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-background text-right tabular-nums"
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-4 sm:col-span-2">
                                <FormField
                                  control={form.control as any}
                                  name="dimensionsL"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Length (cm)</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-background text-right tabular-nums"
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control as any}
                                  name="dimensionsW"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Width (cm)</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-background text-right tabular-nums"
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control as any}
                                  name="dimensionsH"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Height (cm)</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-background text-right tabular-nums"
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
                                <FormField
                                  control={form.control as any}
                                  name="isFragile"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-1 flex-row items-center space-y-0 space-x-3 rounded-md border border-border/50 bg-background/50 p-4">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel>Fragile Items</FormLabel>
                                        <p className="text-[10px] text-muted-foreground">
                                          Handle with extra care
                                        </p>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control as any}
                                  name="insuranceOptIn"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-1 flex-row items-center space-y-0 space-x-3 rounded-md border border-border/50 bg-background/50 p-4">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel>Insurance Opt-in</FormLabel>
                                        <p className="text-[10px] text-muted-foreground">
                                          Protect declared value
                                        </p>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid gap-4 sm:col-span-2">
                                {/* Live Cargo Metrics Card */}
                                <Card className="border border-border/60 bg-gradient-to-br from-background to-muted/40 shadow-sm">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold tracking-wider text-primary uppercase">
                                      Live Cargo Metrics
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="grid gap-2 text-sm">
                                    <div className="flex justify-between border-b border-dashed border-border/40 py-1.5">
                                      <span className="text-muted-foreground">
                                        Actual Gross Weight
                                      </span>
                                      <span className="font-semibold">
                                        {form.watch("weightKg") || 0} Kg
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-border/40 py-1.5">
                                      <span className="text-muted-foreground">
                                        Volumetric Weight
                                      </span>
                                      <span className="font-semibold">
                                        {calculations.volumetricWeight
                                          ? calculations.volumetricWeight.toFixed(
                                              2
                                            )
                                          : "0.00"}{" "}
                                        Kg
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-border/40 py-1.5">
                                      <span className="text-muted-foreground">
                                        Total Volume
                                      </span>
                                      <span className="font-semibold">
                                        {calculations.volumeCbm
                                          ? calculations.volumeCbm.toFixed(4)
                                          : "0.0000"}{" "}
                                        CBM
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-1.5 font-bold text-primary">
                                      <span>Chargeable Weight</span>
                                      <span className="flex items-center gap-2">
                                        {calculations.chargeableWeight >
                                          (Number(form.watch("weightKg")) ||
                                            0) && (
                                          <Badge
                                            variant="outline"
                                            className="h-5 border-primary/30 px-1.5 text-[10px] text-primary"
                                          >
                                            Volumetric
                                          </Badge>
                                        )}
                                        {calculations.chargeableWeight
                                          ? calculations.chargeableWeight.toFixed(
                                              2
                                            )
                                          : "0.00"}{" "}
                                        Kg
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          )}

                          {currentStep === 5 && (
                            <div className="grid gap-6">
                              <Card className="border border-border/60 bg-muted/30 shadow-none">
                                <CardHeader className="pt-6 pb-4">
                                  <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                    Charges Breakdown
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="mb-4 grid gap-4 sm:grid-cols-3">
                                    <FormField
                                      control={form.control as any}
                                      name="freightRatePerKg"
                                      render={({ field }) => (
                                        <FormItem className="flex flex-col gap-1.5">
                                          <FormLabel>
                                            Freight Rate (per kg)
                                          </FormLabel>
                                          <div className="relative flex flex-col gap-2">
                                            <FormControl>
                                              <Input
                                                className="bg-background text-right tabular-nums"
                                                type="number"
                                                {...field}
                                              />
                                            </FormControl>
                                            <p className="text-[10px] text-muted-foreground">
                                              Auto-calculates Freight Charge
                                            </p>
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control as any}
                                      name="freightCharge"
                                      render={({ field }) => (
                                        <FormItem className="flex flex-col gap-1.5">
                                          <FormLabel>Freight Charge</FormLabel>
                                          <div className="relative flex flex-col gap-2">
                                            <FormControl>
                                              <Input
                                                className="bg-background text-right tabular-nums"
                                                type="number"
                                                {...field}
                                              />
                                            </FormControl>
                                            <p className="invisible text-[10px] text-muted-foreground">
                                              Spacer
                                            </p>
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control as any}
                                      name="pickupCharge"
                                      render={({ field }) => (
                                        <FormItem className="flex flex-col gap-1.5">
                                          <FormLabel>Pickup Charge</FormLabel>
                                          <div className="relative flex flex-col gap-2">
                                            <FormControl>
                                              <Input
                                                className="bg-background text-right tabular-nums"
                                                type="number"
                                                {...field}
                                              />
                                            </FormControl>
                                            <p className="invisible text-[10px] text-muted-foreground">
                                              Spacer
                                            </p>
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <Collapsible
                                    open={chargesOpen}
                                    onOpenChange={setChargesOpen}
                                    className="mt-4 overflow-hidden border border-border/60 bg-background"
                                  >
                                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-semibold transition-colors hover:bg-muted/50">
                                      <span className="text-sm">
                                        Additional Charges
                                      </span>
                                      <ChevronDown
                                        className={cn(
                                          "h-4 w-4 transition-transform duration-200",
                                          chargesOpen && "rotate-180"
                                        )}
                                      />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="grid gap-4 border-t border-border/40 bg-muted/10 p-4 pt-0 sm:grid-cols-2">
                                      <FormField
                                        control={form.control as any}
                                        name="packingCharge"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Packing Charge
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                className="bg-background text-right tabular-nums"
                                                type="number"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control as any}
                                        name="docketCharge"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Docket Charge</FormLabel>
                                            <FormControl>
                                              <Input
                                                className="bg-background text-right tabular-nums"
                                                type="number"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control as any}
                                        name="insuranceCharge"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Insurance Charge
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                className="bg-background text-right tabular-nums"
                                                type="number"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control as any}
                                        name="otherCharges"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Other Charges</FormLabel>
                                            <FormControl>
                                              <Input
                                                className="bg-background text-right tabular-nums"
                                                type="number"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </CollapsibleContent>
                                  </Collapsible>
                                </CardContent>
                              </Card>

                              <div className="grid gap-6 sm:grid-cols-3">
                                <FormField
                                  control={form.control as any}
                                  name="gstRate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>GST Rate (%)</FormLabel>
                                      <Select
                                        onValueChange={(val) =>
                                          field.onChange(Number(val))
                                        }
                                        value={String(field.value)}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-background tabular-nums">
                                            <SelectValue placeholder="Select GST" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="0">0%</SelectItem>
                                          <SelectItem value="5">5%</SelectItem>
                                          <SelectItem value="12">
                                            12%
                                          </SelectItem>
                                          <SelectItem value="18">
                                            18%
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control as any}
                                  name="paymentMode"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Payment Mode</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Select payment" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="cash">
                                            Cash
                                          </SelectItem>
                                          <SelectItem value="upi">
                                            UPI
                                          </SelectItem>
                                          <SelectItem value="card">
                                            Card
                                          </SelectItem>
                                          <SelectItem value="credit">
                                            Credit (B2B)
                                          </SelectItem>
                                          <SelectItem value="to_pay">
                                            To Pay (COD)
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control as any}
                                  name="advancePaid"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Advance Paid (₹)</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-background text-right tabular-nums"
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}

                          {currentStep === 6 && (
                            <div className="flex flex-col items-center justify-center py-10">
                              <div className="mb-8 space-y-4 text-center">
                                <div className="mb-2 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                                  <ReceiptText className="h-10 w-10" />
                                </div>
                                <h3 className="text-3xl font-bold">
                                  Ready to Generate
                                </h3>
                                <p className="mx-auto max-w-sm text-muted-foreground">
                                  Review the summary on the right to ensure all
                                  details are correct before finalizing.
                                </p>
                              </div>

                              <div className="w-full max-w-md border border-border/60 bg-muted/40 p-6">
                                <Stack space="md">
                                  <FormField
                                    control={form.control as any}
                                    name="termsAccepted"
                                    render={({ field }) => (
                                      <FormItem className="w-full">
                                        <div className="flex flex-row items-start space-x-4 p-4 transition-colors hover:bg-background/50">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                              className="mt-1"
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="cursor-pointer font-semibold">
                                              Accept Terms &amp; Conditions
                                            </FormLabel>
                                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                              I agree to the standard shipping
                                              terms and conditions of service.
                                            </p>
                                          </div>
                                        </div>
                                        <FormMessage className="mt-2 ml-4" />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control as any}
                                    name="prohibitedAccepted"
                                    render={({ field }) => (
                                      <FormItem className="w-full">
                                        <div className="flex flex-row items-start space-x-4 p-4 transition-colors hover:bg-background/50">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                              className="mt-1"
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="cursor-pointer font-semibold">
                                              Prohibited Items Declaration
                                            </FormLabel>
                                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                              I declare that this shipment
                                              contains no prohibited or
                                              hazardous items.
                                            </p>
                                          </div>
                                        </div>
                                        <FormMessage className="mt-2 ml-4" />
                                      </FormItem>
                                    )}
                                  />
                                </Stack>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </form>
                </Form>
              </CardContent>

              {/* Footer Navigation */}
              <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-6 py-6">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSubmitting}
                  className={cn(
                    "border-border shadow-sm",
                    currentStep === 1 && "invisible"
                  )}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleNext}
                    disabled={form.formState.isValidating}
                    className="px-8 font-semibold shadow-md"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    onClick={form.handleSubmit(onSubmit as any, onInvalid)}
                    disabled={isSubmitting || !canSubmit}
                    className="bg-primary px-8 font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    {isSubmitting ? "Generating..." : "Generate Invoice"}{" "}
                    <FileCheck className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Live Summary Sidebar */}
          <div className="sticky top-0 h-svh overflow-y-auto py-8">
            <Card className="overflow-hidden border border-border/60 bg-background shadow-lg">
              <div className="relative overflow-hidden bg-primary px-6 py-4 text-primary-foreground">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ReceiptText className="h-24 w-24 translate-x-4 -translate-y-4 rotate-12 transform" />
                </div>
                <CardTitle className="relative z-10 flex items-center gap-2 text-lg font-bold">
                  Invoice Summary
                </CardTitle>
                <p className="relative z-10 mt-1 text-xs text-primary-foreground/80">
                  Live calculation
                </p>
              </div>

              <CardContent className="p-6">
                {/* Route Summary */}
                <div className="mb-6 border border-border/40 bg-muted/40 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 truncate text-center">
                      <span className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Origin
                      </span>
                      <span
                        className="text-sm font-bold text-foreground"
                        title={form.watch("origin") || "Select Origin"}
                      >
                        {form.watch("origin") || "—"}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 truncate text-center">
                      <span className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Destination
                      </span>
                      <span
                        className="text-sm font-bold text-foreground"
                        title={
                          form.watch("destination") || "Select Destination"
                        }
                      >
                        {form.watch("destination") || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parties Summary */}
                <div className="mb-6 space-y-1">
                  <h4 className="mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Parties
                  </h4>
                  <ReviewItem
                    label="Consignor"
                    value={form.watch("consignorName")}
                  />
                  <ReviewItem
                    label="Consignee"
                    value={form.watch("consigneeName")}
                  />
                </div>

                {/* Financial Summary */}
                <div className="space-y-1 pt-2">
                  <h4 className="mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Financials
                  </h4>
                  {Number(form.watch("freightCharge")) > 0 && (
                    <ReviewItem
                      label="Freight Charge"
                      value={`₹${Number(form.watch("freightCharge") || 0).toFixed(2)}`}
                    />
                  )}
                  {Number(form.watch("pickupCharge")) > 0 && (
                    <ReviewItem
                      label="Pickup Charge"
                      value={`₹${Number(form.watch("pickupCharge") || 0).toFixed(2)}`}
                    />
                  )}
                  {Number(form.watch("packingCharge")) > 0 && (
                    <ReviewItem
                      label="Packing Charge"
                      value={`₹${Number(form.watch("packingCharge") || 0).toFixed(2)}`}
                    />
                  )}
                  {Number(form.watch("insuranceCharge")) > 0 && (
                    <ReviewItem
                      label="Insurance Charge"
                      value={`₹${Number(form.watch("insuranceCharge") || 0).toFixed(2)}`}
                    />
                  )}
                  {Number(form.watch("otherCharges")) > 0 && (
                    <ReviewItem
                      label="Other Charges"
                      value={`₹${Number(form.watch("otherCharges") || 0).toFixed(2)}`}
                    />
                  )}
                  {Number(form.watch("docketCharge")) > 0 && (
                    <ReviewItem
                      label="Docket Charge"
                      value={`₹${Number(form.watch("docketCharge") || 0).toFixed(2)}`}
                    />
                  )}
                  <div className="mt-2 border-t border-dashed border-border pt-2">
                    <ReviewItem
                      label="Subtotal"
                      value={`₹${calculations.subtotal.toFixed(2)}`}
                    />
                    {calculations.calcCgst > 0 && (
                      <ReviewItem
                        label={`CGST (${(Number(form.watch("gstRate")) || 0) / 2}%)`}
                        value={`₹${calculations.calcCgst.toFixed(2)}`}
                      />
                    )}
                    {calculations.calcSgst > 0 && (
                      <ReviewItem
                        label={`SGST (${(Number(form.watch("gstRate")) || 0) / 2}%)`}
                        value={`₹${calculations.calcSgst.toFixed(2)}`}
                      />
                    )}
                    {calculations.calcIgst > 0 && (
                      <ReviewItem
                        label={`IGST (${form.watch("gstRate") || 0}%)`}
                        value={`₹${calculations.calcIgst.toFixed(2)}`}
                      />
                    )}
                    {calculations.gstAmount > 0 &&
                      calculations.calcCgst === 0 &&
                      calculations.calcIgst === 0 && (
                        <ReviewItem
                          label={`GST (${form.watch("gstRate") || 0}%)`}
                          value={`₹${calculations.gstAmount.toFixed(2)}`}
                        />
                      )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-border py-4">
                    <span className="font-bold text-foreground">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-foreground tabular-nums">
                      ₹{calculations.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {Number(form.watch("advancePaid")) > 0 && (
                    <div className="flex items-center justify-between py-2 text-primary">
                      <span className="text-sm font-semibold">
                        Advance Paid
                      </span>
                      <span className="text-sm font-bold tabular-nums">
                        - ₹{(Number(form.watch("advancePaid")) || 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border border-primary/20 bg-primary/5 px-6 py-4 shadow-sm">
                    <span className="font-bold tracking-tight text-primary">
                      Balance Due
                    </span>
                    <span className="text-2xl font-bold text-primary tabular-nums">
                      ₹{calculations.balanceDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      {createdResult && (
        <InvoiceSuccessDialog
          open={!!createdResult}
          onOpenChange={(open) => {
            if (!open) closeSuccessDialog()
          }}
          shipmentId={createdResult.shipmentId}
          invoiceId={createdResult.invoiceId}
          consignorPhone={consignorPhone}
        />
      )}

      {/* Quick Add Customer Dialog */}
      <Dialog
        open={quickCreateRole !== null}
        onOpenChange={(open) => {
          if (!open) setQuickCreateRole(null)
        }}
      >
        <DialogContent className="max-w-md rounded-none border border-border/85 bg-popover p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Quick Add{" "}
              {quickCreateRole === "consignor" ? "Consignor" : "Consignee"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new customer to the database. This will sync with the
              Customers page and auto-populate the wizard details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickCreateCustomer} className="space-y-4 py-2">
            {createError && (
              <div className="rounded-none bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {createError}
              </div>
            )}
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="quick-name"
                  className="text-xs font-semibold text-foreground"
                >
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quick-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="h-10 bg-background text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="quick-phone"
                  className="text-xs font-semibold text-foreground"
                >
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quick-phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="h-10 bg-background text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="quick-email"
                  className="text-xs font-semibold text-foreground"
                >
                  Email (Optional)
                </Label>
                <Input
                  id="quick-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-10 bg-background text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="quick-address"
                  className="text-xs font-semibold text-foreground"
                >
                  Address (Optional)
                </Label>
                <Textarea
                  id="quick-address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Complete Address"
                  className="h-16 resize-none bg-background text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label
                    htmlFor="quick-pin"
                    className="text-xs font-semibold text-foreground"
                  >
                    PIN Code
                  </Label>
                  <Input
                    id="quick-pin"
                    value={newPinCode}
                    onChange={(e) => setNewPinCode(e.target.value)}
                    placeholder="6 digits"
                    className="h-10 bg-background text-xs"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="quick-city"
                    className="text-xs font-semibold text-foreground"
                  >
                    City
                  </Label>
                  <Input
                    id="quick-city"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="City"
                    className="h-10 bg-background text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="quick-state"
                    className="text-xs font-semibold text-foreground"
                  >
                    State
                  </Label>
                  <Input
                    id="quick-state"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="State"
                    className="h-10 bg-background text-xs"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuickCreateRole(null)}
                className="h-10 text-xs"
                disabled={isCreatingCustomer}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 bg-primary text-xs font-semibold text-primary-foreground"
                disabled={isCreatingCustomer}
              >
                {isCreatingCustomer ? "Saving..." : "Save Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
