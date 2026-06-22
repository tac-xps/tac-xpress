import { verifyPortalSession } from "@/app/actions/portal-auth"
import { redirect } from "next/navigation"
import { trackAwb } from "@/app/actions/tracking"
import { AwbTracker } from "@/app/(landing)/components/awb-tracker"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export const metadata = {
  title: "Track Shipment | TAC-XPRESS Portal",
}

export default async function PortalTrackPage() {
  const session = await verifyPortalSession()

  if (!session) {
    redirect("/portal")
  }

  // We know the session is valid, fetch the exact tracking data for their session AWB
  const formData = new FormData()
  formData.append("awb_number", session.awb_number)

  const result = await trackAwb(formData)

  if (result.error || !result.success || !result.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">
            Error Loading Shipment
          </CardTitle>
          <CardDescription>
            {result.error ||
              "There was a problem loading your shipment details."}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tracking Details</h1>
        <p className="text-muted-foreground">
          View real-time updates for your shipment {session.awb_number}
        </p>
      </div>

      <AwbTracker initialData={result.data} />
    </div>
  )
}
