"use client"
// Official shadcn Combobox recipe: Popover + Command, using the installed Radix base.
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
export type SelectOption = { value: string; label: string; detail?: string }
export function SearchSelect({
  value,
  displayValue,
  options,
  onSelect,
  label,
  disabled,
  onSearch,
  loading,
  error,
}: {
  value?: string
  displayValue?: string
  options: SelectOption[]
  onSelect: (value: string) => void
  label: string
  disabled?: boolean
  onSearch?: (query: string) => void
  loading?: boolean
  error?: string
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          variant="outline"
          disabled={disabled}
          className="h-9 w-full justify-between gap-3 bg-background font-normal"
        >
          <span className="min-w-0 truncate text-left">
            {selected?.label ??
              displayValue ??
              (value
                ? loading
                  ? "Loading selected record…"
                  : "Selected record unavailable"
                : label)}
          </span>
          <ChevronsUpDown className="shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) max-w-[calc(100vw-2rem)] min-w-56 p-0"
        align="start"
      >
        <Command shouldFilter={!onSearch}>
          <CommandInput
            placeholder={label}
            onValueChange={onSearch}
            className="h-9 text-sm"
          />
          <CommandList>
            {loading && (
              <p role="status" className="p-3 text-sm text-muted-foreground">
                Searching…
              </p>
            )}
            {error && (
              <p role="alert" className="p-3 text-sm text-destructive">
                {error}
              </p>
            )}
            {!loading && !error && (
              <CommandEmpty>
                No matching records. Try a different search.
              </CommandEmpty>
            )}
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                keywords={[option.label, option.detail ?? ""]}
                onSelect={() => {
                  onSelect(option.value)
                  setOpen(false)
                }}
                className="gap-3 py-3"
              >
                <Check
                  className={
                    value === option.value ? "opacity-100" : "opacity-0"
                  }
                />
                <span className="min-w-0">
                  <span className="block truncate">{option.label}</span>
                  {option.detail && (
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {option.detail}
                    </span>
                  )}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
