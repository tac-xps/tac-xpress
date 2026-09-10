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
import { ConfirmRemoval } from "@/components/operations/confirm-removal"
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
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deletePricingRuleAction({ id: rule.id })
      if (!result?.data?.success) throw new Error("Unable to remove this record")
      toast.success("Record removed")
      router.refresh()
    } finally { setIsDeleting(false) }
  }

  return (
    <>
      <ConfirmRemoval open={deleteOpen} onOpenChange={setDeleteOpen} title="Remove this pricing rule?" description="This removes the record. Confirm that it was created in error or is no longer needed." onConfirm={handleDelete} />
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
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
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

