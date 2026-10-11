"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  MoreHorizontal,
  Trash,
  Eye,
  Mail,
  Copy,
  Check,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { deleteFeedbackAction } from "./actions"
import { toast } from "sonner"
import { ConfirmRemoval } from "@/components/operations/confirm-removal"

export type FeedbackData = {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  sentiment?: "positive" | "negative" | "general"
}

export function FeedbackActions({ feedback }: { feedback: FeedbackData }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleDelete() {
    const result = await deleteFeedbackAction({ id: feedback.id })
    if (!result?.data?.success) throw new Error("Unable to remove this record")
    toast.success("Feedback removed")
    router.refresh()
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(feedback.email)
      setCopied(true)
      toast.success("Email copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy email")
    }
  }

  const getSentimentBadge = (sentiment?: string) => {
    if (sentiment === "positive") {
      return (
        <Badge variant="success" className="text-micro font-medium inline-flex items-center gap-1">
          <ThumbsUp className="size-3" /> Positive
        </Badge>
      )
    }
    if (sentiment === "negative") {
      return (
        <Badge variant="destructive" className="text-micro font-medium inline-flex items-center gap-1">
          <AlertCircle className="size-3" /> Needs Attention
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="text-micro font-medium inline-flex items-center gap-1">
        <Star className="size-3" /> General
      </Badge>
    )
  }

  return (
    <>
      <ConfirmRemoval
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete feedback"
        description="Are you sure you want to delete this customer feedback record? This action cannot be undone."
      />

      {/* Full Feedback Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="size-5 text-primary" />
                Customer Feedback Details
              </DialogTitle>
              {getSentimentBadge(feedback.sentiment)}
            </div>
            <DialogDescription>
              Received from public feedback channel on{" "}
              {new Date(feedback.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Customer Details Box */}
            <div className="rounded-none border border-border/80 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground text-sm">
                    {feedback.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  {new Date(feedback.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <span className="font-mono text-xs text-muted-foreground">
                  {feedback.email}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={copyEmail}
                    className="h-7 px-2 text-xs"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500 mr-1" />
                    ) : (
                      <Copy className="size-3.5 mr-1" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-7 px-2 text-xs"
                  >
                    <a
                      href={`mailto:${feedback.email}?subject=Regarding%20your%20TAC-XPRESS%20Feedback`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="size-3.5 mr-1 text-primary" />
                      Reply
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                Message Content
              </span>
              <div className="rounded-none border border-border/80 bg-background p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
                {feedback.message}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setDetailOpen(false)
                setDeleteOpen(true)
              }}
              className="mr-auto"
            >
              <Trash className="size-3.5 mr-1.5" />
              Delete Record
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDetailOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open feedback actions menu">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => setDetailOpen(true)}>
            <Eye className="mr-2 h-4 w-4 text-primary" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyEmail}>
            <Copy className="mr-2 h-4 w-4" />
            Copy email
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`mailto:${feedback.email}?subject=Regarding%20your%20TAC-XPRESS%20Feedback`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center cursor-pointer"
            >
              <Mail className="mr-2 h-4 w-4 text-primary" />
              Reply via email
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete feedback
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
