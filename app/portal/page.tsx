import { verifyPortalSession } from "@/app/actions/portal-auth"
import { redirect } from "next/navigation"
import PortalLoginForm from "./components/portal-login-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Customer Portal | TAC-XPRESS",
  description: "Access your shipments and support tickets",
}

export default async function PortalPage() {
  const session = await verifyPortalSession()

  if (session) {
    redirect("/portal/track")
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Access Portal</CardTitle>
          <CardDescription>
            Enter your tracking number and email to access your shipment details
            and support tickets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortalLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
