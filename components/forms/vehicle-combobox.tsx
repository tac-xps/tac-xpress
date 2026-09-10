"use client"
import { z } from "zod"
import { SearchSelect } from "./search-select"
import { useRecordLookup } from "./use-record-lookup"
const vehicleSchema = z.object({
  id: z.string(),
  registrationNumber: z.string(),
  capacityKg: z.number(),
})
export type VehicleMin = z.infer<typeof vehicleSchema>
export function VehicleCombobox({
  value,
  onSelect,
  disabled,
}: {
  value?: string
  onSelect: (id: string) => void
  disabled?: boolean
}) {
  const { records, loading, error, setQuery } = useRecordLookup(
    "/api/vehicles",
    vehicleSchema,
    value
  )
  return (
    <SearchSelect
      value={value}
      options={records.map((item) => ({
        value: item.id,
        label: item.registrationNumber,
        detail: `${item.capacityKg.toLocaleString("en-IN")} kg capacity`,
      }))}
      onSelect={onSelect}
      label="Find a vehicle"
      disabled={disabled}
      onSearch={setQuery}
      loading={loading}
      error={error}
    />
  )
}
