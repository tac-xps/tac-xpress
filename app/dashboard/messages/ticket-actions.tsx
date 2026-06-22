"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Trash, Eye, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteTicketAction } from "./actions"
import { toast } from "sonner"
import type { TicketData } from "./columns"

interface TicketActionsProps {
  ticket: TicketData
  onViewTicket: (ticket: TicketData) => void
}

export function TicketActions({ ticket, onViewTicket }: TicketActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone."
      )
    )
      return

    setIsDeleting(true)
    const result = await deleteTicketAction({ id: ticket.id })
    if (result?.data?.success) {
      toast.success("Ticket deleted successfully")
      router.refresh()
    } else {
      toast.error(result?.data?.error || "Failed to delete ticket")
    }
    setIsDeleting(false)
  }

  return (
    <div className="flex justify-end pr-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(ticket.id)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy ticket ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewTicket(ticket)}>
            <Eye className="mr-2 h-4 w-4" />
            View ticket details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete ticket"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
