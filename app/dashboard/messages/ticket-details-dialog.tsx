"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  updateTicketStatus,
  replyToTicketFromDashboard,
} from "@/app/actions/tickets"
import type { TicketData } from "./columns"
import { Calendar, Mail, Phone, Tag, Box, Loader2, Send } from "lucide-react"
import { toast } from "sonner"

export function TicketDetailsDialog({
  ticket,
  open,
  onOpenChange,
}: {
  ticket: TicketData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [isSendingReply, setIsSendingReply] = useState(false)

  if (!ticket) return null

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await updateTicketStatus(ticket.id, newStatus)
      toast.success(`Ticket marked as ${newStatus.replace("_", " ")}`)
      onOpenChange(false)
    } catch (err) {
      toast.error("Failed to update ticket status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReply = async () => {
    if (!replyMessage.trim() || !ticket.customer_email) {
      toast.error("Message and customer email are required to reply.")
      return
    }
    setIsSendingReply(true)
    try {
      await replyToTicketFromDashboard(
        ticket.id,
        ticket.customer_email,
        ticket.subject,
        replyMessage
      )
      toast.success("Reply sent to customer via email!")
      setReplyMessage("")
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to send reply")
    } finally {
      setIsSendingReply(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[600px]">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl">{ticket.subject}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                Ticket #{ticket.id.slice(0, 8).toUpperCase()}
                <Badge
                  variant={
                    ticket.status === "open"
                      ? "destructive"
                      : ticket.status === "resolved"
                        ? "success"
                        : "secondary"
                  }
                  className="ml-2 capitalize"
                >
                  {ticket.status.replace("_", " ")}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" />
                <span className="font-medium text-foreground">
                  {ticket.customer_name || "Unknown"}
                </span>
                <span className="text-xs">
                  ({ticket.customer_email || "No email"})
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4" />
                <span>{ticket.customer_phone || "No phone provided"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="size-4" />
                <span className="capitalize">{ticket.category}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                <span>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(ticket.created_at))}
                </span>
              </div>
              {ticket.related_awb && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Box className="size-4" />
                  <span className="font-mono">{ticket.related_awb}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Message</h4>
            <div className="max-h-[250px] min-h-[100px] overflow-y-auto rounded-lg border border-border/50 bg-muted/10 p-4 text-sm whitespace-pre-wrap text-foreground/90">
              {ticket.message}
            </div>
          </div>

          {ticket.status !== "resolved" && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Reply via Email
              </h4>
              <Textarea
                placeholder="Type your reply here... (This will be emailed to the customer)"
                className="min-h-[120px] resize-none"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-3 border-t border-border/50 pt-4">
          {ticket.status !== "resolved" && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange("resolved")}
              disabled={isUpdating || isSendingReply}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Mark as Resolved
            </Button>
          )}
          {ticket.status === "open" && (
            <Button
              variant="secondary"
              onClick={() => handleStatusChange("in_progress")}
              disabled={isUpdating || isSendingReply}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Start Progress
            </Button>
          )}
          {ticket.status !== "resolved" && (
            <Button
              onClick={handleReply}
              disabled={
                isUpdating ||
                isSendingReply ||
                !replyMessage.trim() ||
                !ticket.customer_email
              }
            >
              {isSendingReply ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Send className="mr-2 size-4" />
              )}
              Send Reply
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
