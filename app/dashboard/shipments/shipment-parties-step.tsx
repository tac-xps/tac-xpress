"use client"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerCombobox } from "@/components/forms/customer-combobox"
import { Label } from "@/components/ui/label"
import { ShipmentInput } from "./shipment-fields"
import type { ShipmentFormInput } from "./validations"
export function ShipmentPartiesStep() {
  const form = useFormContext<ShipmentFormInput>()
  return (
    <div className="grid gap-5">
      {(["consignor", "consignee"] as const).map((party) => (
        <Card key={party} className="shadow-none">
          <CardHeader>
            <CardTitle>
              {party === "consignor"
                ? "Sender / consignor"
                : "Recipient / consignee"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label>Fill from a customer record (optional)</Label>
              <CustomerCombobox
                onSelect={(customer) => {
                  form.setValue(`${party}Name`, customer.name || "", {
                    shouldValidate: true,
                  })
                  form.setValue(`${party}Phone`, customer.phone || "", {
                    shouldValidate: true,
                  })
                  form.setValue(`${party}Address`, customer.address || "", {
                    shouldValidate: true,
                  })
                }}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <ShipmentInput name={`${party}Name`} label="Full name" />
              <ShipmentInput
                name={`${party}Phone`}
                label="Phone number"
                type="tel"
              />
            </div>
            <ShipmentInput name={`${party}Address`} label="Full address" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
