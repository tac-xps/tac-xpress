"use client"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useCreateShipmentForm } from "./use-create-shipment-form"
import { ShipmentRouteStep } from "./shipment-route-step"
import { ShipmentPartiesStep } from "./shipment-parties-step"
import { ShipmentCargoStep } from "./shipment-cargo-step"
export type { CustomerMin } from "@/components/forms/customer-combobox"
export function CreateShipmentForm({ onSuccess }: { onSuccess?: () => void }) {
  const {
    form,
    currentStep,
    STEPS,
    isExecuting,
    onSubmit,
    handleNext,
    handleBack,
  } = useCreateShipmentForm(onSuccess)
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-w-0 flex-col gap-6"
      >
        {/* Step indicator with ARIA accessibility */}
        <div className="grid gap-3">
          <div className="flex justify-between gap-3 text-sm">
            <span aria-live="polite" aria-atomic="true">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="font-medium">
              {STEPS[currentStep - 1].title}
            </span>
          </div>
          <Progress
            value={(currentStep / STEPS.length) * 100}
            aria-label={`Shipment booking progress: step ${currentStep} of ${STEPS.length}`}
            className="h-1.5"
          />
        </div>
        {/* Scrollable step content — safe on 1366×768 viewports */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <fieldset disabled={isExecuting} className="min-w-0">
            <legend className="sr-only">{STEPS[currentStep - 1].title}</legend>
            {currentStep === 1 ? (
              <ShipmentRouteStep />
            ) : currentStep === 2 ? (
              <ShipmentPartiesStep />
            ) : (
              <ShipmentCargoStep />
            )}
          </fieldset>
        </div>
        <div className="flex justify-between gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            disabled={currentStep === 1 || isExecuting}
            onClick={handleBack}
          >
            Back
          </Button>
          {currentStep < 3 ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={isExecuting}>
              {isExecuting ? "Creating shipment…" : "Create shipment"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
