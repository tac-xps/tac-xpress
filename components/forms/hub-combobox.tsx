"use client"
import { z } from "zod"
import { SearchSelect, type SearchSelectTriggerProps } from "./search-select"
import { useRecordLookup } from "./use-record-lookup"
const schema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
})
export function HubCombobox({
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
    "/api/hubs",
    schema,
    value,
    !disabled
  )
  return (
    <SearchSelect
      {...triggerProps}
      value={value}
      label="Find a hub"
      disabled={disabled}
      options={records.map((item) => ({
        value: item.id,
        label: item.name,
        detail: item.location,
      }))}
      onSelect={onSelect}
      onSearch={setQuery}
      loading={loading}
      error={error}
      onRetry={retry}
    />
  )
}
