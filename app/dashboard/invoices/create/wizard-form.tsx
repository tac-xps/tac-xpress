"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  FileText,
  ReceiptText,
} from "lucide-react"

import { useWizardForm } from "./use-wizard-form"
import { InvoiceSuccessDialog } from "./invoice-success-dialog"
import { ReviewItem } from "./components/review-item"
import { QuickCreateCustomerDialog } from "./components/quick-create-customer-dialog"
import { WizardStepHeader } from "./components/wizard-step-header"

// Steps
import { Step1ShipmentType } from "./steps/step-1-shipment-type"
import { Step2Consignor } from "./steps/step-2-consignor"
import { Step3Consignee } from "./steps/step-3-consignee"
import { Step4Cargo } from "./steps/step-4-cargo"
import { Step5Charges } from "./steps/step-5-charges"
import { Step6Review } from "./steps/step-6-review"

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

  const [quickCreateRole, setQuickCreateRole] = useState<
    "consignor" | "consignee" | null
  >(null)

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100

  const onInvalid = (errors: any) => {
    console.error(errors)
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
            <Card className="overflow-hidden border border-border bg-card shadow-card">
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
                              "flex h-8 w-8 items-center justify-center rounded-none text-sm font-bold tabular-nums transition-all duration-300",
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

                <WizardStepHeader
                  name={STEPS[currentStep - 1].name}
                  description={STEPS[currentStep - 1].description}
                />

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
                            <Step1ShipmentType
                              form={form}
                              originPinQuery={originPinQuery}
                              setOriginPinQuery={setOriginPinQuery}
                              destinationPinQuery={destinationPinQuery}
                              setDestinationPinQuery={setDestinationPinQuery}
                              isOriginPinLoading={isOriginPinLoading}
                              isDestinationPinLoading={isDestinationPinLoading}
                              handleOriginPinLookup={handleOriginPinLookup}
                              handleDestinationPinLookup={
                                handleDestinationPinLookup
                              }
                            />
                          )}
                          {currentStep === 2 && (
                            <Step2Consignor
                              form={form}
                              onQuickAdd={() => setQuickCreateRole("consignor")}
                            />
                          )}
                          {currentStep === 3 && (
                            <Step3Consignee
                              form={form}
                              onQuickAdd={() => setQuickCreateRole("consignee")}
                            />
                          )}
                          {currentStep === 4 && (
                            <Step4Cargo
                              form={form}
                              calculations={calculations}
                            />
                          )}
                          {currentStep === 5 && <Step5Charges form={form} />}
                          {currentStep === 6 && <Step6Review form={form} />}
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
            <Card className="overflow-hidden border border-border bg-card shadow-card">
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
                  <h4 className="mb-2 text-micro font-bold tracking-widest text-muted-foreground uppercase">
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
                  <h4 className="mb-2 text-micro font-bold tracking-widest text-muted-foreground uppercase">
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
      <QuickCreateCustomerDialog
        role={quickCreateRole}
        onClose={() => setQuickCreateRole(null)}
        form={form}
      />
    </div>
  )
}
