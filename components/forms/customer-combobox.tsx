"use client"

import * as React from "react"
import { Check, UserCircle2, PhoneIcon, MailIcon, Loader2 } from "lucide-react"
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

export type CustomerMin = {
  id: string
  name: string | null
  email: string
  phone: string | null
  address?: string | null
  pinCode?: string | null
  city?: string | null
  state?: string | null
}

interface CustomerComboboxProps {
  value?: string
  onSelect: (customer: CustomerMin) => void
  disabled?: boolean
}

export function CustomerCombobox({
  value,
  onSelect,
  disabled,
}: CustomerComboboxProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [customers, setCustomers] = React.useState<CustomerMin[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<CustomerMin | null>(null)

  React.useEffect(() => {
    const fetchCustomers = async (query: string) => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/customers?query=${encodeURIComponent(query)}`
        )
        const data = await res.json()
        setCustomers(data)

        // Ensure selected customer is still in the list to avoid trigger rendering issues
        if (
          value &&
          !data.some((c: CustomerMin) => c.id === value) &&
          selectedCustomer &&
          selectedCustomer.id === value
        ) {
          setCustomers([selectedCustomer, ...data])
        }
      } catch (error) {
        console.error("Failed to fetch customers", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchCustomers(searchQuery)
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery, value, selectedCustomer])

  // Initial fetch for selected customer if value provided but not in list
  React.useEffect(() => {
    if (value && !selectedCustomer) {
      // We could ideally fetch the specific customer by ID here if needed
      // But for now, we rely on the parent or previous state
    }
  }, [value, selectedCustomer])

  const mappedData = React.useMemo(() => {
    return customers.map((c) => ({
      label: c.name || c.email || "Unknown Customer",
      value: c.id,
    }))
  }, [customers])

  return (
    <Combobox
      data={mappedData}
      type="customer"
      value={value}
      onValueChange={(val) => {
        const found = customers.find((c) => c.id === val)
        if (found) {
          setSelectedCustomer(found)
          onSelect(found)
        }
      }}
    >
      <ComboboxTrigger
        className="h-auto w-full justify-between bg-background px-3 py-2"
        disabled={disabled}
      >
        {(() => {
          const currentCustomer =
            customers.find((c) => c.id === value) || selectedCustomer
          if (!currentCustomer) {
            return (
              <span className="text-muted-foreground">
                Select a customer...
              </span>
            )
          }
          return (
            <div className="flex w-full flex-col items-start truncate text-left">
              <span className="block w-[90%] truncate font-medium text-foreground">
                {currentCustomer.name || "Unknown Customer"}
              </span>
              {(currentCustomer.phone || currentCustomer.email) && (
                <span className="mt-0.5 block flex w-[90%] items-center gap-1.5 truncate text-xs text-muted-foreground">
                  {currentCustomer.phone ? (
                    <>
                      <PhoneIcon className="size-3 shrink-0" />{" "}
                      {currentCustomer.phone}
                    </>
                  ) : (
                    <>
                      <MailIcon className="size-3 shrink-0" />{" "}
                      {currentCustomer.email}
                    </>
                  )}
                </span>
              )}
            </div>
          )
        })()}
      </ComboboxTrigger>
      <ComboboxContent className="w-[--radix-popover-trigger-width] min-w-[280px]">
        <ComboboxInput
          placeholder="Search by name, phone or email..."
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
              <ComboboxEmpty>No customer found.</ComboboxEmpty>
              <ComboboxGroup heading="Customers">
                {customers.map((customer) => (
                  <ComboboxItem
                    key={customer.id}
                    value={customer.id}
                    keywords={[
                      customer.name || "",
                      customer.email || "",
                      customer.phone || "",
                    ]}
                    className="flex cursor-pointer items-start gap-3 py-2.5"
                  >
                    <div className="mt-0.5 shrink-0">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === customer.id
                            ? "text-primary opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <UserCircle2 className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium">
                        {customer.name || "Unknown Customer"}
                      </span>
                      <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                        {customer.phone && (
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="size-3" /> {customer.phone}
                          </span>
                        )}
                        {customer.email && (
                          <span className="flex items-center gap-1 truncate">
                            <MailIcon className="size-3" /> {customer.email}
                          </span>
                        )}
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
