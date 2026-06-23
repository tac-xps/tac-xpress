import { format } from "date-fns"
import { MessageSquareText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <CardHeader className="border-b border-border/50 bg-muted/20 p-4">
        <CardTitle className="text-base font-semibold tracking-tight">
          Outbound Communications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
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
          <div className="space-y-4">
            {[...conversations.entries()].map(([phone, thread]) => (
              <section key={phone} className="border border-border/60">
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-3">
                  <p className="font-mono text-sm font-semibold">
                    {maskPhone(phone)}
                  </p>
                  <Badge variant="outline">{thread.length} messages</Badge>
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
                      <Badge
                        variant={
                          message.status === "failed"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {message.status}
                      </Badge>
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
