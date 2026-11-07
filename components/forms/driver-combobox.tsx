"use client"
import { z } from "zod"
import { SearchSelect, type SearchSelectTriggerProps } from "./search-select"
import { useRecordLookup } from "./use-record-lookup"
const driverSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  licenseNumber: z.string(),
})
export type DriverMin = z.infer<typeof driverSchema>
export function DriverCombobox({
  value,
  onSelect,
  disabled,
  ...triggerProps
}: SearchSelectTriggerProps & {
  value?: string
  onSelect: (id: string) => void
  disabled?: boolean
}) {
  const { records, loading, error, setQuery, retry } = useRecordLookup(
    "/api/drivers",
    driverSchema,
    value,
    !disabled
  )
  return (
    <SearchSelect
      {...triggerProps}
      value={value}
      options={records.map((item) => ({
        value: item.id,
        label: item.name,
        detail: [item.phone, item.licenseNumber].join(" · "),
      }))}
      onSelect={onSelect}
      label="Find a driver"
      disabled={disabled}
      onSearch={setQuery}
      loading={loading}
      error={error}
      onRetry={retry}
    />
  )
}
