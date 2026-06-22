"use client"

import React from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  PackagePlus,
  CheckCircle2,
  Plane,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
  ChoiceboxItemSubtitle,
} from "@/components/kibo-ui/choicebox"
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone"
import { DataLabel } from "@/components/typography/data-label"
import { useCreateShipmentForm } from "./use-create-shipment-form"
import { CityCombobox } from "@/components/forms/city-combobox"
import { CustomerCombobox } from "@/components/forms/customer-combobox"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export type CustomerMin = {
  id: string
  name: string | null
  email: string
  phone: string | null
}

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

export function CreateShipmentForm({ onSuccess }: { onSuccess?: () => void }) {
  const {
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
  } = useCreateShipmentForm(onSuccess)

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as any)}
        className="flex w-full flex-col font-sans"
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
        {/* Stepper Header */}
        <div className="mb-6 px-1">
          <div className="mb-3 flex justify-between px-1">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {STEPS[currentStep - 1].title}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2.5 bg-muted/50 [&>div]:bg-primary"
          />

          <div className="mt-4 flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div
                  key={step.id}
                  className="relative z-10 flex w-1/3 flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCurrent
                          ? "border-primary bg-background text-primary"
                          : "border-muted-foreground/30 bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden flex-col items-center text-center md:flex">
                    <span
                      className={cn(
                        "text-xs font-semibold tracking-wider uppercase",
                        isCurrent || isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative min-h-[350px] overflow-x-hidden border-y border-border/50 bg-muted/10 px-1 py-4">
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
              {/* STEP 1: ROUTING */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer (Billed To)</FormLabel>
                        <CustomerCombobox
                          value={field.value}
                          onSelect={(c) => field.onChange(c.id)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control as any}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origin City / Hub</FormLabel>
                          <FormControl>
                            <CityCombobox
                              value={field.value}
                              onSelect={(data) => {
                                field.onChange(data.city)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination City / Hub</FormLabel>
                          <FormControl>
                            <CityCombobox
                              value={field.value}
                              onSelect={(data) => {
                                field.onChange(data.city)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <FormField
                      control={form.control as any}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <FormControl>
                            <Choicebox
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                            >
                              <ChoiceboxItem value="express_air">
                                <ChoiceboxItemHeader>
                                  <ChoiceboxItemTitle>
                                    Express Air
                                  </ChoiceboxItemTitle>
                                  <ChoiceboxItemSubtitle>
                                    1-2 Days
                                  </ChoiceboxItemSubtitle>
                                </ChoiceboxItemHeader>
                              </ChoiceboxItem>
                              <ChoiceboxItem value="standard_ocean">
                                <ChoiceboxItemHeader>
                                  <ChoiceboxItemTitle>
                                    Standard Ocean
                                  </ChoiceboxItemTitle>
                                  <ChoiceboxItemSubtitle>
                                    14-30 Days
                                  </ChoiceboxItemSubtitle>
                                </ChoiceboxItemHeader>
                              </ChoiceboxItem>
                              <ChoiceboxItem value="road_freight">
                                <ChoiceboxItemHeader>
                                  <ChoiceboxItemTitle>
                                    Road Freight
                                  </ChoiceboxItemTitle>
                                  <ChoiceboxItemSubtitle>
                                    3-7 Days
                                  </ChoiceboxItemSubtitle>
                                </ChoiceboxItemHeader>
                              </ChoiceboxItem>
                            </Choicebox>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Live Rates */}
                  {(isFetchingRates || availableRates.length > 0) && (
                    <div className="mt-8 border-t border-border/50 pt-6">
                      <h3 className="mb-4 text-xs font-bold tracking-widest uppercase">
                        Available Flights
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {isFetchingRates ? (
                          <>
                            <Skeleton className="h-16 w-32" />
                            <Skeleton className="h-16 w-32" />
                            <Skeleton className="h-16 w-32" />
                          </>
                        ) : (
                          availableRates.map((rate) => (
                            <div
                              key={rate.id}
                              onClick={() => handleRateSelect(rate)}
                              className={`flex cursor-pointer flex-col justify-center border-2 p-3 transition-all ${
                                selectedRate?.id === rate.id
                                  ? "scale-[1.02] border-primary bg-primary/10"
                                  : "border-border/60 bg-background hover:border-primary/40"
                              }`}
                            >
                              <div className="text-sm font-bold text-foreground">
                                {rate.carrier}
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <Plane className="h-3 w-3" /> {rate.service}
                              </div>
                              <div className="mt-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                ETA: {rate.eta}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: PARTIES */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className="border-border bg-background shadow-none">
                    <CardContent className="space-y-4 p-4">
                      <h3 className="border-b border-border/50 pb-2 text-xs font-bold tracking-widest uppercase">
                        Consignor (Sender)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control as any}
                          name="consignorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
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
                                    if (customer.address)
                                      form.setValue(
                                        "consignorAddress",
                                        customer.address
                                      )
                                    form.trigger([
                                      "consignorPhone",
                                      "consignorAddress",
                                    ])
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as any}
                          name="consignorPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone Number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control as any}
                        name="consignorAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Full Address" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-background shadow-none">
                    <CardContent className="space-y-4 p-4">
                      <h3 className="border-b border-border/50 pb-2 text-xs font-bold tracking-widest uppercase">
                        Consignee (Receiver)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control as any}
                          name="consigneeName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
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
                                    if (customer.address)
                                      form.setValue(
                                        "consigneeAddress",
                                        customer.address
                                      )
                                    form.trigger([
                                      "consigneePhone",
                                      "consigneeAddress",
                                    ])
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as any}
                          name="consigneePhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone Number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control as any}
                        name="consigneeAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Full Address" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* STEP 3: CARGO */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control as any}
                      name="natureOfGoods"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nature of Goods</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? "others"}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="documents">
                                Documents
                              </SelectItem>
                              <SelectItem value="electronics">
                                Electronics
                              </SelectItem>
                              <SelectItem value="garments">Garments</SelectItem>
                              <SelectItem value="fragile">Fragile</SelectItem>
                              <SelectItem value="medicines">
                                Medicines
                              </SelectItem>
                              <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                          </Select>
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
                            value={field.value ?? "none"}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select packaging" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="corrugated_box">
                                Corrugated Box
                              </SelectItem>
                              <SelectItem value="bubble_wrap">
                                Bubble Wrap
                              </SelectItem>
                              <SelectItem value="wooden_crate">
                                Wooden Crate
                              </SelectItem>
                              <SelectItem value="pallet">Pallet</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 border border-border/50 bg-muted/30 p-4 md:grid-cols-4">
                    <FormField
                      control={form.control as any}
                      name="weightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Act. Wt (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="dimensionsL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>L (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="dimensionsW"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>W (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="dimensionsH"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>H (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border border-primary/20 bg-primary/5 p-4">
                    <FormField
                      control={form.control as any}
                      name="chargedWeightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-primary">
                            Charged Weight
                          </FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                disabled
                                {...field}
                                className="w-32 border-primary/20 bg-background text-lg font-bold"
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              (Volumetric divisor: 5000)
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 flex gap-6 border border-border/50 bg-background p-4">
                    <FormField
                      control={form.control as any}
                      name="isFragile"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-medium">
                            Fragile Item
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="insuranceOptIn"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-medium">
                            Include Insurance
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Document Uploads
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Upload any required customs documents, commercial
                      invoices, etc.
                    </p>
                    <Dropzone
                      accept={{
                        "application/pdf": [".pdf"],
                        "image/*": [".png", ".jpg", ".jpeg"],
                      }}
                      maxFiles={5}
                      onDrop={(files) => console.log(files)}
                    >
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="mt-auto flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isExecuting}
            className="px-6 font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={form.formState.isValidating}
              className="px-8 font-semibold shadow-md"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isExecuting || !canSubmit}
              className="bg-primary px-8 font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
            >
              {isExecuting ? "Creating..." : "Create Shipment"}
              {isExecuting ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <PackagePlus className="ml-2 h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
