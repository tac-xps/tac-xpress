import { verifyPortalSession } from "@/app/actions/portal-auth"
import { redirect } from "next/navigation"
import { getPortalTickets } from "@/app/actions/tickets"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import PortalTicketForm from "../components/portal-ticket-form"

export const metadata = {
  title: "Support Tickets | TAC-XPRESS Portal",
}

export default async function PortalTicketsPage() {
  const session = await verifyPortalSession()

  if (!session) {
    redirect("/portal")
  }

  const tickets = await getPortalTickets(session.email)

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-muted-foreground">
          View and manage your support inquiries associated with {session.email}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <h2 className="text-xl font-semibold">Your Tickets</h2>
          {tickets.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                You have no support tickets yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket: any) => (
                <Card
                  key={ticket.id}
                  className="transition-shadow hover:shadow-sm"
                >
                  <CardHeader className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {ticket.subject}
                        </CardTitle>
                        <CardDescription>
                          Ticket ID: {ticket.id.slice(0, 8)} • Updated{" "}
                          {formatDistanceToNow(new Date(ticket.updated_at), {
                            addSuffix: true,
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Badge
                          variant={
                            ticket.status === "open"
                              ? "default"
                              : ticket.status === "in_progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {ticket.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Open a New Ticket</CardTitle>
              <CardDescription>
                Need help? Submit a new request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PortalTicketForm
                defaultEmail={session.email}
                defaultAwb={session.awb_number}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
