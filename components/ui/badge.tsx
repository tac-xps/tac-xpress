import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "group/badge inline-flex min-h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Semantic status variants for shipment/operational statuses
        success:
          "border-status-delivered-wash bg-status-delivered-wash text-status-delivered dark:border-status-delivered-wash/40 dark:bg-status-delivered-wash/40",
        warning:
          "border-status-pending-wash bg-status-pending-wash text-status-pending dark:border-status-pending-wash/40 dark:bg-status-pending-wash/40",
        error:
          "border-status-failed-wash bg-status-failed-wash text-status-failed dark:border-status-failed-wash/40 dark:bg-status-failed-wash/40",
        neutral: "border-border/60 bg-muted text-muted-foreground",
        // Logistics status variants (calibrated OKLCH + APCA compliance)
        transit:
          "border-status-transit-wash bg-status-transit-wash text-status-transit dark:border-status-transit-wash/40 dark:bg-status-transit-wash/40",
        delivered:
          "border-status-delivered-wash bg-status-delivered-wash text-status-delivered dark:border-status-delivered-wash/40 dark:bg-status-delivered-wash/40",
        pending:
          "border-status-pending-wash bg-status-pending-wash text-status-pending dark:border-status-pending-wash/40 dark:bg-status-pending-wash/40",
        failed:
          "border-status-failed-wash bg-status-failed-wash text-status-failed dark:border-status-failed-wash/40 dark:bg-status-failed-wash/40",
        corridor:
          "border-corridor-border bg-corridor-subtle text-corridor",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
