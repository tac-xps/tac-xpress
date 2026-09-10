"use client"
import { SearchSelect } from "./search-select"
export type CityData = {
  city: string
  state: string
  pinCode: string
}

const PRIORITY_CITIES: CityData[] = [
  { city: "Imphal", state: "Manipur", pinCode: "795001" },
  { city: "New Delhi", state: "Delhi", pinCode: "110001" },
]

const STANDARD_CITIES: CityData[] = [
  { city: "Mumbai", state: "Maharashtra", pinCode: "400001" },
  { city: "Bangalore", state: "Karnataka", pinCode: "560001" },
  { city: "Chennai", state: "Tamil Nadu", pinCode: "600001" },
  { city: "Kolkata", state: "West Bengal", pinCode: "700001" },
  { city: "Hyderabad", state: "Telangana", pinCode: "500001" },
  { city: "Pune", state: "Maharashtra", pinCode: "411001" },
  { city: "Ahmedabad", state: "Gujarat", pinCode: "380001" },
  { city: "Jaipur", state: "Rajasthan", pinCode: "302001" },
  { city: "Surat", state: "Gujarat", pinCode: "395003" },
  { city: "Lucknow", state: "Uttar Pradesh", pinCode: "226001" },
  { city: "Kanpur", state: "Uttar Pradesh", pinCode: "208001" },
  { city: "Nagpur", state: "Maharashtra", pinCode: "440001" },
  { city: "Indore", state: "Madhya Pradesh", pinCode: "452001" },
  { city: "Thane", state: "Maharashtra", pinCode: "400601" },
  { city: "Bhopal", state: "Madhya Pradesh", pinCode: "462001" },
]

export function CityCombobox({
  value,
  onSelect,
  disabled,
}: {
  value?: string
  onSelect: (data: CityData) => void
  disabled?: boolean
}) {
  const cities = [...PRIORITY_CITIES, ...STANDARD_CITIES]
  if (value && !cities.some((item) => item.city === value))
    cities.push({ city: value, state: "", pinCode: "" })
  return (
    <SearchSelect
      value={value}
      label="Select a city"
      disabled={disabled}
      options={cities.map((item) => ({
        value: item.city,
        label: item.city,
        detail: item.state,
      }))}
      onSelect={(city) => {
        const item = cities.find((entry) => entry.city === city)
        if (item) onSelect({ ...item, pinCode: "" })
      }}
    />
  )
}
