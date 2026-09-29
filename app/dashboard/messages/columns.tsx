"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, ArrowUpDown, MoreHorizontal, Sparkles, AlertCircle, ShieldAlert } from "lucide-react"
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
  assigned_to: string | null
  created_at: string
  ai_confidence?: number | null
  ai_routing?: string | null
  needs_human_review?: boolean | null
  sla_at_risk?: boolean | null
  sla_breached?: boolean | null
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
    cell: ({ row }) => {
      const ticket = row.original
      const isUrgent = ticket.priority === "urgent" || ticket.priority === "high"
      return (
        <div className="flex flex-col gap-1.5 py-1 min-w-[200px] max-w-[340px]">
          <span className="font-medium leading-snug line-clamp-2">{ticket.subject}</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {ticket.priority && (
              <Badge
                variant={
                  isUrgent
                    ? "destructive"
                    : ticket.priority === "medium"
                      ? "warning"
                      : "neutral"
                }
                className="text-[10px] px-1.5 py-0 h-4 capitalize"
              >
                {ticket.priority}
              </Badge>
            )}
            {ticket.needs_human_review && (
              <Badge variant="warning" className="text-[10px] px-1.5 py-0 h-4 gap-1">
                <AlertCircle className="size-2.5" />
                Needs Review
              </Badge>
            )}
            {ticket.ai_routing && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 gap-1 border-primary/30 text-primary">
                <Sparkles className="size-2.5" />
                {ticket.ai_routing}
                {ticket.ai_confidence ? ` (${Math.round(ticket.ai_confidence * 100)}%)` : ""}
              </Badge>
            )}
            {ticket.sla_breached && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                SLA Breached
              </Badge>
            )}
          </div>
        </div>
      )
    },
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
