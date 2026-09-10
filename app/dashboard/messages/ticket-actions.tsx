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
import { ConfirmRemoval } from "@/components/operations/confirm-removal"
import type { TicketData } from "./columns"
import { EditTicketDialog } from "./edit-ticket-dialog"
import { Edit } from "lucide-react"

interface TicketActionsProps {
  ticket: TicketData
  onViewTicket: (ticket: TicketData) => void
}

export function TicketActions({ ticket, onViewTicket }: TicketActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteTicketAction({ id: ticket.id })
      if (!result?.data?.success) throw new Error("Unable to remove this record")
      toast.success("Record removed")
      router.refresh()
    } finally { setIsDeleting(false) }
  }

  return (
    <div className="flex justify-end pr-4">
      <ConfirmRemoval open={deleteOpen} onOpenChange={setDeleteOpen} title="Remove this support ticket?" description="This removes the record. Confirm that it was created in error or is no longer needed." onConfirm={handleDelete} />
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
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit ticket
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete ticket"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {editOpen && (
        <EditTicketDialog 
          ticket={ticket} 
          open={editOpen} 
          onOpenChange={setEditOpen} 
        />
      )}
    </div>
  )
}

