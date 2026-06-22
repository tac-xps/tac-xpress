"use client"

import * as React from "react"
import { Check, Loader2, Contact, IdCard, PhoneIcon } from "lucide-react"
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

export type DriverMin = {
  id: string
  name: string
  phone: string
  licenseNumber: string
}

interface DriverComboboxProps {
  value?: string
  onSelect: (id: string) => void
  disabled?: boolean
}

export function DriverCombobox({
  value,
  onSelect,
  disabled,
}: DriverComboboxProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [drivers, setDrivers] = React.useState<DriverMin[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedDriver, setSelectedDriver] = React.useState<DriverMin | null>(
    null
  )

  React.useEffect(() => {
    const fetchDrivers = async (query: string) => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/drivers?query=${encodeURIComponent(query)}`
        )
        const data = await res.json()
        setDrivers(data)

        if (
          value &&
          !data.some((d: DriverMin) => d.id === value) &&
          selectedDriver &&
          selectedDriver.id === value
        ) {
          setDrivers([selectedDriver, ...data])
        }
      } catch (error) {
        console.error("Failed to fetch drivers", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchDrivers(searchQuery)
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery, value, selectedDriver])

  const mappedData = React.useMemo(() => {
    return drivers.map((d) => ({
      label: d.name,
      value: d.id,
    }))
  }, [drivers])

  return (
    <Combobox
      data={mappedData}
      type="driver"
      value={value}
      onValueChange={(val) => {
        const found = drivers.find((d) => d.id === val)
        if (found) {
          setSelectedDriver(found)
          onSelect(found.id)
        }
      }}
    >
      <ComboboxTrigger
        className="h-auto w-full justify-between bg-background px-3 py-2"
        disabled={disabled}
      >
        {(() => {
          const currentDriver =
            drivers.find((d) => d.id === value) || selectedDriver
          if (!currentDriver) {
            return (
              <span className="text-muted-foreground">Select a driver...</span>
            )
          }
          return (
            <div className="flex w-full flex-col items-start truncate text-left">
              <span className="block w-[90%] truncate font-medium text-foreground">
                {currentDriver.name}
              </span>
              <span className="mt-0.5 flex w-[90%] items-center gap-3 truncate text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <PhoneIcon className="size-3 shrink-0" />{" "}
                  {currentDriver.phone}
                </span>
                <span className="flex items-center gap-1">
                  <IdCard className="size-3 shrink-0" />{" "}
                  {currentDriver.licenseNumber}
                </span>
              </span>
            </div>
          )
        })()}
      </ComboboxTrigger>
      <ComboboxContent className="w-[--radix-popover-trigger-width] min-w-[280px]">
        <ComboboxInput
          placeholder="Search by name, phone or license..."
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
              <ComboboxEmpty>No driver found.</ComboboxEmpty>
              <ComboboxGroup heading="Drivers">
                {drivers.map((driver) => (
                  <ComboboxItem
                    key={driver.id}
                    value={driver.id}
                    keywords={[driver.name, driver.phone, driver.licenseNumber]}
                    className="flex cursor-pointer items-start gap-3 py-2.5"
                  >
                    <div className="mt-0.5 shrink-0">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === driver.id
                            ? "text-primary opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Contact className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium">
                        {driver.name}
                      </span>
                      <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="size-3" /> {driver.phone}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <IdCard className="size-3" /> {driver.licenseNumber}
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
