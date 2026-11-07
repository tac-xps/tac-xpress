import { redirect } from "next/navigation"

interface TrackingPageProps {
  searchParams: Promise<{ awb?: string | string[] }>
}

export default async function TrackingPage({
  searchParams,
}: TrackingPageProps) {
  const params = await searchParams
  const awb = typeof params.awb === "string" ? params.awb.trim().toUpperCase() : ""
  if (awb) {
    redirect(`/?tracking=open&awb=${encodeURIComponent(awb)}`)
  }
  redirect("/?tracking=open")
}
