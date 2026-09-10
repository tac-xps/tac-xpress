"use client"
import { z } from "zod"
import { SearchSelect } from "./search-select"
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
}: {
  value?: string
  onSelect: (id: string) => void
  disabled?: boolean
}) {
  const { records, loading, error, setQuery } = useRecordLookup(
    "/api/hubs",
    schema,
    value
  )
  return (
    <SearchSelect
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
    />
  )
}
