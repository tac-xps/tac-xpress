import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { messageOutbound } from "@/lib/db/schema"
interface DeliveryHistoryProps {
  failedOnly: boolean
  messages: Pick<
    typeof messageOutbound.$inferSelect,
    | "id"
    | "phone"
    | "status"
    | "templateName"
    | "relatedInvoiceId"
    | "relatedAwb"
  >[]
}
export function DeliveryHistory({
  messages,
  failedOnly,
}: DeliveryHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp history</CardTitle>
        <CardDescription>
          Latest 50 {failedOnly ? "failed " : ""}attempts. Full recipient
          numbers are available on the linked invoice.
        </CardDescription>
        <div className="flex gap-2">
          <Button
            asChild
            variant={failedOnly ? "outline" : "secondary"}
            size="sm"
          >
            <Link href="/dashboard/communications">All attempts</Link>
          </Button>
          <Button
            asChild
            variant={failedOnly ? "secondary" : "outline"}
            size="sm"
          >
            <Link href="/dashboard/communications?status=failed">
              Needs review
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div
          role="region"
          aria-label="WhatsApp delivery history"
          tabIndex={0}
          className="overflow-x-auto"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-mono text-xs">
                    {message.relatedAwb || message.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>•••• {message.phone.slice(-4)}</TableCell>
                  <TableCell>
                    {message.templateName || "Support message"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        message.status === "failed" ? "destructive" : "outline"
                      }
                    >
                      {message.status === "sent"
                        ? "Provider accepted"
                        : message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {message.relatedInvoiceId ? (
                      <Link
                        href={`/invoice/${message.relatedInvoiceId}`}
                        className="underline"
                      >
                        View invoice
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!messages.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No matching delivery attempts.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
