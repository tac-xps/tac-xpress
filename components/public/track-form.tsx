import React from "react"
import { Search, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "./magnetic-button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export type TrackFormVariant = "inline" | "desk" | "console"

interface TrackFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "action" | "method"> {
  variant?: TrackFormVariant
}

export function TrackForm({ variant = "inline", className, ...props }: TrackFormProps) {
  const placeholder = "Enter AWB number (e.g. TAC-948210)..."
  const pattern = "^[A-Z0-9-a-z]{5,40}$" // Let browser handle mixed case, server handles upper casing. Wait, actually the plan says ^[A-Z0-9-]{5,40}$ everywhere.
  
  if (variant === "inline") {
    return (
      <form
        action="/track"
        method="get"
        aria-label="Track a consignment by AWB number"
        className={cn("flex max-w-md items-center border border-border bg-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-xs rounded-sm overflow-hidden", className)}
        {...props}
      >
        <div className="pl-3.5 text-muted-foreground" aria-hidden="true">
          <Search className="size-4 text-primary" />
        </div>
        <input
          name="awb"
          type="text"
          required
          aria-label="Air Waybill (AWB) number"
          maxLength={40}
          pattern="^[A-Za-z0-9\-]{5,40}$"
          placeholder={placeholder}
          className="h-11 flex-1 bg-transparent px-3 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none uppercase"
        />
        <button
          type="submit"
          className="h-11 px-4 sm:px-5 bg-primary text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shrink-0 flex items-center gap-1.5 active:scale-[0.97]"
        >
          <span>Track</span>
          <ArrowUpRight className="size-3.5 text-primary-foreground" aria-hidden="true" />
        </button>
      </form>
    )
  }

  if (variant === "desk") {
    return (
      <form
        noValidate
        action="/track"
        method="get"
        aria-label="Track your shipment"
        className={cn("bg-card p-6 sm:p-8", className)}
        {...props}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="home-awb" className="text-base font-medium">
              AWB / shipment reference
            </FieldLabel>
            <div className="flex flex-col gap-3 sm:flex-row items-stretch sm:items-center">
              <Input
                id="home-awb"
                name="awb"
                required
                maxLength={40}
                pattern="^[A-Za-z0-9\-]{5,40}$"
                autoComplete="off"
                placeholder={placeholder}
                aria-describedby="home-awb-help"
                className="cargo-desk-input h-10 min-w-0 flex-1 text-base uppercase"
              />
              <MagneticButton strength={0.18} className="shrink-0">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto h-10 px-5 rounded-none bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-95 active:scale-[0.98]"
                >
                  <span>Track shipment</span>
                  <ArrowUpRight data-icon="inline-end" className="size-3.5 ml-1.5" />
                </Button>
              </MagneticButton>
            </div>
            <FieldDescription id="home-awb-help" className="text-muted-foreground text-sm">
              Tracking shows recorded events, rather than a live vehicle
              location.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    )
  }

  if (variant === "console") {
    return (
      <form action="/track" method="get" className={cn("flex min-h-[148px] flex-col justify-between", className)} {...props}>
        <div>
          <label htmlFor="hero-awb-input" className="sr-only">
            AWB Consignment Number
          </label>
          <input
            id="hero-awb-input"
            name="awb"
            required
            maxLength={40}
            pattern="^[A-Za-z0-9\-]{5,40}$"
            autoComplete="off"
            placeholder={placeholder}
            className="w-full px-4 py-3 font-mono text-sm border focus:outline-none focus-visible:ring-1 transition-colors bg-surface text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus-visible:ring-primary uppercase rounded-sm"
          />
          <p className="mt-2 text-xs font-mono text-muted-foreground">
            Direct lookup for New Delhi ↔ Northeast India consignments.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-end border-t border-border">
          <Button
            type="submit"
            size="lg"
            className="rounded-md h-10 px-5 font-sans text-sm font-medium tracking-wide focus-visible:ring-1 active:scale-[0.98] transition-transform bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-primary"
          >
            Track Cargo <ArrowUpRight data-icon="inline-end" className="size-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </form>
    )
  }

  return null
}
