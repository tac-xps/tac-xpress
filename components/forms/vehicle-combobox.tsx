"use client"

import * as React from "react"
import { Check, Loader2, Truck, Weight } from "lucide-react"
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

export type VehicleMin = {
  id: string
  registrationNumber: string
  capacityKg: number
}

interface VehicleComboboxProps {
  value?: string
  onSelect: (id: string) => void
  disabled?: boolean
}

export function VehicleCombobox({
  value,
  onSelect,
  disabled,
}: VehicleComboboxProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [vehicles, setVehicles] = React.useState<VehicleMin[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedVehicle, setSelectedVehicle] =
    React.useState<VehicleMin | null>(null)

  React.useEffect(() => {
    const fetchVehicles = async (query: string) => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/vehicles?query=${encodeURIComponent(query)}`
        )
        const data = await res.json()
        setVehicles(data)

        if (
          value &&
          !data.some((v: VehicleMin) => v.id === value) &&
          selectedVehicle &&
          selectedVehicle.id === value
        ) {
          setVehicles([selectedVehicle, ...data])
        }
      } catch (error) {
        console.error("Failed to fetch vehicles", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchVehicles(searchQuery)
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery, value, selectedVehicle])

  const mappedData = React.useMemo(() => {
    return vehicles.map((v) => ({
      label: v.registrationNumber,
      value: v.id,
    }))
  }, [vehicles])

  return (
    <Combobox
      data={mappedData}
      type="vehicle"
      value={value}
      onValueChange={(val) => {
        const found = vehicles.find((v) => v.id === val)
        if (found) {
          setSelectedVehicle(found)
          onSelect(found.id)
        }
      }}
    >
      <ComboboxTrigger
        className="h-auto w-full justify-between bg-background px-3 py-2"
        disabled={disabled}
      >
        {(() => {
          const currentVehicle =
            vehicles.find((v) => v.id === value) || selectedVehicle
          if (!currentVehicle) {
            return (
              <span className="text-muted-foreground">Select a vehicle...</span>
            )
          }
          return (
            <div className="flex w-full flex-col items-start truncate text-left">
              <span className="block w-[90%] truncate font-mono font-medium tracking-widest text-foreground uppercase">
                {currentVehicle.registrationNumber}
              </span>
              <span className="mt-0.5 flex w-[90%] items-center gap-3 truncate text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Weight className="size-3 shrink-0" />{" "}
                  {currentVehicle.capacityKg.toLocaleString()} kg
                </span>
              </span>
            </div>
          )
        })()}
      </ComboboxTrigger>
      <ComboboxContent className="w-[--radix-popover-trigger-width] min-w-[280px]">
        <ComboboxInput
          placeholder="Search by registration number..."
          onValueChange={setSearchQuery}
        />
        <ComboboxList>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
              <Loader2 className="mb-2 size-4 animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : (
            <>
              <ComboboxEmpty>No vehicle found.</ComboboxEmpty>
              <ComboboxGroup heading="Vehicles">
                {vehicles.map((vehicle) => (
                  <ComboboxItem
                    key={vehicle.id}
                    value={vehicle.id}
                    keywords={[vehicle.registrationNumber]}
                    className="flex cursor-pointer items-start gap-3 py-2.5"
                  >
                    <div className="mt-0.5 shrink-0">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === vehicle.id
                            ? "text-primary opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Truck className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate font-mono text-sm font-medium tracking-widest uppercase">
                        {vehicle.registrationNumber}
                      </span>
                      <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                        <span className="flex items-center gap-1">
                          <Weight className="size-3" /> Capacity:{" "}
                          {vehicle.capacityKg.toLocaleString()} kg
                        </span>
                      </div>
                    </div>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
