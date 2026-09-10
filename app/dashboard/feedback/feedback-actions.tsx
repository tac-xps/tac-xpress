"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Trash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteFeedbackAction } from "./actions"
import { toast } from "sonner"
import { ConfirmRemoval } from "@/components/operations/confirm-removal"

export type FeedbackData = { 
  id: string; 
  name: string; 
  email: string; 
  message: string; 
  createdAt: string;
}

export function FeedbackActions({ feedback }: { feedback: FeedbackData }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleDelete() {
    const result = await deleteFeedbackAction({ id: feedback.id })
    if (!result?.data?.success) throw new Error("Unable to remove this record")
    toast.success("Feedback removed")
    router.refresh()
  }

  return (
    <>
      <ConfirmRemoval
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete feedback"
        description="Are you sure you want to delete this feedback?"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete feedback
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
