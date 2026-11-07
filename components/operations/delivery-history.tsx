"use client"

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
import { MessagePayloadDialog, type MessagePayloadData } from "./message-payload-dialog"

interface DeliveryHistoryProps {
  failedOnly: boolean
  messages: MessagePayloadData[]
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
                <TableHead className="text-right">Payload</TableHead>
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
                    <span className="capitalize">
                      {message.templateName?.replaceAll("_", " ") || "Support message"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {message.status === "failed" ? (
                      <Badge variant="destructive">Failed</Badge>
                    ) : (
                      <span className="text-xs capitalize text-muted-foreground">
                        {message.status === "sent" ? "Provider accepted" : message.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {message.relatedInvoiceId ? (
                      <Link
                        href={`/invoice/${message.relatedInvoiceId}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        View invoice
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <MessagePayloadDialog message={message} />
                  </TableCell>
                </TableRow>
              ))}
              {!messages.length && (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
