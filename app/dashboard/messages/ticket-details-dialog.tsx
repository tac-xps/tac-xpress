"use client"

import { useState, useRef, useEffect } from "react"
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
import { Calendar, Mail, Phone, Tag, Box, Loader2, Send, Sparkles, AlertTriangle, Clock } from "lucide-react"
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
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && ticket) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 150)
    }
  }, [open, ticket?.id])

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
      <DialogContent className="max-h-[90svh] overflow-y-auto bg-background sm:max-w-xl">
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
          {ticket.needs_human_review && (
            <div className="flex items-start gap-3 rounded-none border border-status-pending/40 bg-status-pending/10 p-3.5 text-sm text-foreground">
              <AlertTriangle className="size-5 shrink-0 text-status-pending mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Human Review Required
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Autonomous outbound responses are paused. AI triage flagged this conversation due to high-urgency keywords, customer grievance, or strict safety guardrail triggers. Please inspect and reply manually.
                </p>
              </div>
            </div>
          )}

          {(ticket.ai_routing || ticket.sla_breached || ticket.sla_at_risk) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-none border border-border/50 bg-muted/20 px-4 py-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles className="size-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">AI Triage:</span>
                {ticket.ai_routing && (
                  <Badge variant="outline" className="text-[11px] font-mono capitalize">
                    {ticket.ai_routing}
                  </Badge>
                )}
                {ticket.ai_confidence !== null && ticket.ai_confidence !== undefined && (
                  <span className="text-muted-foreground">
                    Confidence: <span className="font-semibold text-foreground">{Math.round(ticket.ai_confidence * 100)}%</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {ticket.sla_breached && (
                  <Badge variant="destructive" className="text-[11px]">
                    SLA Breached
                  </Badge>
                )}
                {ticket.sla_at_risk && !ticket.sla_breached && (
                  <Badge variant="warning" className="text-[11px]">
                    SLA At Risk
                  </Badge>
                )}
                <Badge
                  variant={
                    ticket.priority === "urgent"
                      ? "destructive"
                      : ticket.priority === "high"
                        ? "warning"
                        : "secondary"
                  }
                  className="text-[11px] capitalize font-medium"
                >
                  Priority: {ticket.priority}
                </Badge>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-none border border-border/50 bg-muted/30 p-4 text-sm">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 break-words text-muted-foreground">
                <Mail className="size-4" />
                <span className="font-medium text-foreground">
                  {ticket.customer_name || "Unknown"}
                </span>
                <span className="text-xs">
                  ({ticket.customer_email || "No email"})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 break-words text-muted-foreground">
                <Phone className="size-4" />
                <span>{ticket.customer_phone || "No phone provided"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 break-words text-muted-foreground">
                <Tag className="size-4" />
                <span className="capitalize">{ticket.category}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 break-words text-muted-foreground">
                <Calendar className="size-4" />
                <span>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(ticket.created_at))}
                </span>
              </div>
              {ticket.related_awb && (
                <div className="flex flex-wrap items-center gap-2 break-words text-muted-foreground">
                  <Box className="size-4" />
                  <span className="font-mono">{ticket.related_awb}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Message</h4>
            <div className="max-h-64 min-h-24 overflow-y-auto rounded-none border border-border/50 bg-muted/10 p-4 text-sm whitespace-pre-wrap text-foreground/90">
              {ticket.message}
              <div ref={messageEndRef} />
            </div>
          </div>

          {ticket.status !== "resolved" && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Reply via Email
              </h4>
              <Textarea
                placeholder="Type your reply here... (This will be emailed to the customer)"
                className="min-h-32 resize-none"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-3 border-t border-border/50 pb-2 pt-4">
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

