"use client"
// Official shadcn Combobox recipe: Popover + Command, using the installed Radix base.
import { useState, useRef, type ComponentProps } from "react"
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
export type SearchSelectTriggerProps = Omit<
  ComponentProps<"button">,
  "value" | "onSelect" | "onChange" | "children"
>
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
  onRetry,
  ...triggerProps
}: SearchSelectTriggerProps & {
  value?: string
  displayValue?: string
  options: SelectOption[]
  onSelect: (value: string) => void
  label: string
  disabled?: boolean
  onSearch?: (query: string) => void
  loading?: boolean
  error?: string
  onRetry?: () => void
}) {
  const [open, setOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const selected = options.find((option) => option.value === value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...triggerProps}
          type="button"
          role="combobox"
          aria-label={
            triggerProps["aria-label"] ??
            (triggerProps.id || triggerProps["aria-labelledby"] ? undefined : label)
          }
          aria-expanded={open}
          variant="outline"
          size="lg"
          disabled={disabled}
          className="w-full justify-between gap-3 bg-background font-normal"
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
            ref={searchRef}
            placeholder={label}
            onValueChange={onSearch}
            className="h-9 text-sm"
          />
          {error && (
            <div className="grid gap-2 p-3">
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
              {onRetry && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => {
                    onRetry()
                    searchRef.current?.focus()
                  }}
                >
                  Retry
                </Button>
              )}
            </div>
          )}
          <CommandList>
            {loading && (
              <p role="status" className="p-3 text-sm text-muted-foreground">
                Searching…
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
