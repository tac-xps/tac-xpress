import { format } from "date-fns"
import { MessageSquareText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export interface OutboundMessageRow {
  id: string
  phone: string
  status: string
  templateName: string | null
  relatedAwb: string | null
  createdAt: Date | null
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length <= 4) return "••••"
  return `${"•".repeat(Math.min(8, digits.length - 4))}${digits.slice(-4)}`
}

export function OutboundMessageLog({
  messages,
}: {
  messages: OutboundMessageRow[]
}) {
  const conversations = Map.groupBy(messages, (message) => message.phone)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {messages.length === 0 ? (
          <Empty className="min-h-48 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquareText />
              </EmptyMedia>
              <EmptyTitle>No outbound messages yet</EmptyTitle>
              <EmptyDescription>
                WhatsApp delivery attempts will appear here after they are sent.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="divide-y divide-border/60">
            {[...conversations.entries()].map(([phone, thread]) => (
              <section key={phone}>
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-3">
                  <p className="font-mono text-sm font-semibold">
                    {maskPhone(phone)}
                  </p>
                  <span className="text-xs text-muted-foreground tabular-nums">{thread.length} messages</span>
                </div>
                <div className="divide-y divide-border/60">
                  {thread.map((message) => (
                    <div
                      key={message.id}
                      className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {message.templateName || "Direct message"}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {message.relatedAwb || "No related AWB"}
                        </p>
                      </div>
                      {message.status === "failed" ? (
                        <Badge variant="destructive">Failed</Badge>
                      ) : (
                        <span className="text-xs capitalize text-muted-foreground">
                          {message.status}
                        </span>
                      )}
                      <time className="text-xs text-muted-foreground tabular-nums">
                        {message.createdAt
                          ? format(message.createdAt, "PP p")
                          : "Unknown time"}
                      </time>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
