"use client"

import * as Sentry from "@sentry/nextjs"
import { useState } from "react"
import { MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deletePricingRuleAction } from "./actions"
import { toast } from "sonner"
import { EditPricingRuleDialog } from "./edit-pricing-rule-dialog"
import { useRouter } from "next/navigation"

export function PricingActions({
  rule,
}: {
  rule: {
    id: string
    serviceType: string
    origin: string
    destination: string
    basePrice: number
    pricePerKg: number
  }
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pricing rule?")) return
    setIsDeleting(true)
    try {
      const result = await deletePricingRuleAction({ id: rule.id })
      if (result && "success" in result && result.success) {
        toast.success("Pricing rule deleted successfully")
        router.refresh()
      } else {
        const errorMsg =
          result && "error" in result && result.error
            ? result.error
            : "Failed to delete pricing rule"
        toast.error(errorMsg)
        setIsDeleting(false)
      }
    } catch (err: any) {
      Sentry.captureException(err)
      console.error("Delete action error:", err)
      toast.error(err.message || "An unexpected error occurred while deleting")
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEdit(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete Rule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showEdit && (
        <EditPricingRuleDialog
          rule={rule}
          open={showEdit}
          onOpenChange={setShowEdit}
        />
      )}
    </>
  )
}
