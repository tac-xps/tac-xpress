"use client"
import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CustomerCombobox } from "@/components/forms/customer-combobox"
import { CityCombobox } from "@/components/forms/city-combobox"
import type { ShipmentFormInput } from "./validations"
export function ShipmentRouteStep() {
  const { control } = useFormContext<ShipmentFormInput>()
  return (
    <div className="grid gap-6">
      <FormField
        control={control}
        name="customerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Billing customer</FormLabel>
            <CustomerCombobox
              value={field.value}
              onSelect={(customer) => field.onChange(customer.id)}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {(["origin", "destination"] as const).map((name) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {name === "origin" ? "Origin city" : "Destination city"}
                </FormLabel>
                <CityCombobox
                  value={field.value}
                  onSelect={(city) => field.onChange(city.city)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      <FormField
        control={control}
        name="serviceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cargo service</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-3 sm:grid-cols-2"
              >
                {[
                  {
                    value: "express_air",
                    label: "Air cargo",
                    detail: "Confirm acceptance and the flight plan",
                  },
                  {
                    value: "road_freight",
                    label: "Surface cargo",
                    detail: "Confirm route and loading requirements",
                  },
                ].map((item) => (
                  <Label
                    key={item.value}
                    htmlFor={item.value}
                    className="flex items-start gap-3 rounded-none border p-4 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent"
                  >
                    <RadioGroupItem
                      id={item.value}
                      value={item.value}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium">{item.label}</span>
                      <span className="mt-2 block text-xs leading-relaxed font-normal text-muted-foreground">
                        {item.detail}
                      </span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <p className="text-sm leading-relaxed text-muted-foreground">
        Confirm pricing and the delivery window with the operations team. Saving
        a shipment does not reserve carrier capacity.
      </p>
    </div>
  )
}
