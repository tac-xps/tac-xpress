"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/kibo-ui/combobox"

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

interface CityComboboxProps {
  value?: string
  onSelect: (data: CityData) => void
  disabled?: boolean
}

export function CityCombobox({ value, onSelect, disabled }: CityComboboxProps) {
  const mappedData = React.useMemo(() => {
    const defaultCities = [...PRIORITY_CITIES, ...STANDARD_CITIES]
    const exists = defaultCities.some(
      (c) => c.city.toLowerCase() === value?.toLowerCase()
    )
    const list = [...defaultCities]
    if (value && !exists) {
      list.push({ city: value, state: "", pinCode: "" })
    }
    return list.map((c) => ({ label: c.city, value: c.city }))
  }, [value])

  return (
    <Combobox
      data={mappedData}
      type="city"
      value={value}
      onValueChange={(val) => {
        const found =
          PRIORITY_CITIES.find((c) => c.city === val) ||
          STANDARD_CITIES.find((c) => c.city === val) ||
          (val ? { city: val, state: "", pinCode: "" } : null)
        if (found) onSelect(found)
      }}
    >
      <ComboboxTrigger className="w-full justify-between" disabled={disabled} />
      <ComboboxContent>
        <ComboboxInput placeholder="Search city..." />
        <ComboboxList>
          <ComboboxEmpty />
          {!PRIORITY_CITIES.some(
            (c) => c.city.toLowerCase() === value?.toLowerCase()
          ) &&
            !STANDARD_CITIES.some(
              (c) => c.city.toLowerCase() === value?.toLowerCase()
            ) &&
            value && (
              <ComboboxGroup heading="Resolved Location">
                <ComboboxItem value={value}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      "opacity-100" // Always visible since it only renders when selected
                    )}
                  />
                  {value}
                </ComboboxItem>
              </ComboboxGroup>
            )}
          <ComboboxGroup heading="Priority Hubs">
            {PRIORITY_CITIES.map((cityData) => (
              <ComboboxItem key={cityData.city} value={cityData.city}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === cityData.city ? "opacity-100" : "opacity-0"
                  )}
                />
                {cityData.city}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
          <ComboboxGroup heading="Standard Locations">
            {STANDARD_CITIES.map((cityData) => (
              <ComboboxItem key={cityData.city} value={cityData.city}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === cityData.city ? "opacity-100" : "opacity-0"
                  )}
                />
                {cityData.city}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
