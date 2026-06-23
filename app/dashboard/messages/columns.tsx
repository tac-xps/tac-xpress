"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { TicketActions } from "./ticket-actions"

export type TicketData = {
  id: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  subject: string
  message: string
  category: string
  status: string
  priority: string
  related_awb: string | null
  created_at: string
}

export const getColumns = (
  onViewTicket: (ticket: TicketData) => void
): ColumnDef<TicketData>[] => [
  {
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ row }) => (
      <span className="font-medium whitespace-nowrap text-muted-foreground tabular-nums">
        #{String(row.getValue("id")).slice(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const item = row.original
      const name = item.customer_name || "Unknown"
      return (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Avatar className="h-8 w-8 ring-1 ring-border/50">
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="text-xs text-muted-foreground">
              {item.customer_email}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("subject")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-muted-foreground capitalize">
        {row.getValue("category")}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return (
        <span className="text-muted-foreground tabular-nums">
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }).format(date)}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "open"
              ? "destructive"
              : status === "resolved"
                ? "success"
                : "secondary"
          }
          className="capitalize"
        >
          {status.replace("_", " ")}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original
      return <TicketActions ticket={ticket} onViewTicket={onViewTicket} />
    },
  },
]
