import * as React from "react"
import ReactPhoneInput, { type Value } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { cn } from "@/lib/utils"

export type PhoneInputProps = Omit<
  React.ComponentProps<typeof ReactPhoneInput>,
  "onChange"
> & {
  value?: Value
  onChange: (value?: Value) => void
}

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof ReactPhoneInput>,
  PhoneInputProps
>(({ className, onChange, ...props }, ref) => {
  return (
    <ReactPhoneInput
      ref={ref}
      onChange={onChange}
      className={cn(
        "flex h-9 w-full rounded-none border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-ring focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "[&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:focus-visible:outline-none",
        className
      )}
      {...(props as Omit<PhoneInputProps, "onChange">)}
    />
  )
})
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
