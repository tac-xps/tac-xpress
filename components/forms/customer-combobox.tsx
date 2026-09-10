"use client"
import { z } from "zod"
import { SearchSelect } from "./search-select"
import { useRecordLookup } from "./use-record-lookup"
const customerSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable().optional(),
  pinCode: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
})
export type CustomerMin = z.infer<typeof customerSchema>
export function CustomerCombobox({
  value,
  onSelect,
  disabled,
}: {
  value?: string
  onSelect: (customer: CustomerMin) => void
  disabled?: boolean
}) {
  const isValidId = !!value && z.string().uuid().safeParse(value).success

  const { records, loading, error, setQuery } = useRecordLookup(
    "/api/customers",
    customerSchema,
    isValidId ? value : undefined
  )
  return (
    <SearchSelect
      value={isValidId ? value : undefined}
      displayValue={!isValidId && value ? value : undefined}
      options={records.map((item) => ({
        value: item.id,
        label: item.name || item.email || "Unnamed customer",
        detail: [item.phone, item.city].filter(Boolean).join(" · "),
      }))}
      onSelect={(id) => {
        const item = records.find((record) => record.id === id)
        if (item) onSelect(item)
      }}
      label="Find a customer"
      disabled={disabled}
      onSearch={setQuery}
      loading={loading}
      error={error}
    />
  )
}
