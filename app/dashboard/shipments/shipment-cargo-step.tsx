"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShipmentCheckbox,
  ShipmentInput,
  ShipmentSelect,
} from "./shipment-fields"
const options = (values: string[]) =>
  values.map((value) => ({ value, label: value.replaceAll("_", " ") }))
export function ShipmentCargoStep() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <ShipmentSelect
          name="natureOfGoods"
          label="Nature of goods"
          options={options([
            "documents",
            "electronics",
            "garments",
            "fragile",
            "medicines",
            "others",
          ])}
        />
        <ShipmentSelect
          name="packagingType"
          label="Packaging"
          options={options([
            "none",
            "corrugated_box",
            "bubble_wrap",
            "wooden_crate",
            "pallet",
          ])}
        />
        <ShipmentSelect
          name="itemCondition"
          label="Item condition"
          options={options(["new", "used", "refurbished"])}
        />
        <ShipmentInput name="pieces" label="Number of packages" type="number" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <ShipmentInput
          name="weightKg"
          label="Actual weight (kg)"
          type="number"
        />
        <ShipmentInput
          name="chargedWeightKg"
          label="Calculated chargeable weight (kg)"
          type="number"
          readOnly
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <ShipmentInput name="dimensionsL" label="Length (cm)" type="number" />
        <ShipmentInput name="dimensionsW" label="Width (cm)" type="number" />
        <ShipmentInput name="dimensionsH" label="Height (cm)" type="number" />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Air volumetric weight uses length × width × height ÷ 5000, rounded up.
        Confirm measurements and applicable pricing before billing.
      </p>
      <div className="flex flex-wrap gap-6 border-y py-5">
        <ShipmentCheckbox name="isFragile" label="Fragile goods" />
        <ShipmentCheckbox name="insuranceOptIn" label="Insurance requested" />
      </div>
      <Alert>
        <AlertDescription>
          After saving, open the shipment record to upload private documents.
          Selecting insurance records a request; confirm coverage separately.
        </AlertDescription>
      </Alert>
    </div>
  )
}
