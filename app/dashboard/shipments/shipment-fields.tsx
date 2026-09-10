"use client"
import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { ShipmentFormInput } from "./validations"
export function ShipmentInput({
  name,
  label,
  type = "text",
  readOnly = false,
}: {
  name: keyof ShipmentFormInput
  label: string
  type?: "text" | "number" | "tel"
  readOnly?: boolean
}) {
  const { control } = useFormContext<ShipmentFormInput>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              value={
                typeof field.value === "boolean" ? "" : (field.value ?? "")
              }
              onChange={(event) =>
                field.onChange(
                  type === "number"
                    ? event.target.value === ""
                      ? undefined
                      : event.target.valueAsNumber
                    : event.target.value
                )
              }
              readOnly={readOnly}
              min={type === "number" ? 0 : undefined}
              step={name === "weightKg" ? "0.001" : "1"}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export function ShipmentSelect({
  name,
  label,
  options,
}: {
  name: keyof ShipmentFormInput
  label: string
  options: { value: string; label: string }[]
}) {
  const { control } = useFormContext<ShipmentFormInput>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={String(field.value ?? "")}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export function ShipmentCheckbox({
  name,
  label,
}: {
  name: "isFragile" | "insuranceOptIn"
  label: string
}) {
  const { control } = useFormContext<ShipmentFormInput>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <Checkbox
              checked={field.value ?? false}
              onCheckedChange={(value) => field.onChange(value === true)}
            />
          </FormControl>
          <FormLabel>{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
