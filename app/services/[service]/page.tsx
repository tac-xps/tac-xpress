import { redirect } from "next/navigation"

export function generateStaticParams() {
  return [{ service: "air-cargo" }, { service: "surface-cargo" }]
}

export default function ServiceDetailPage() {
  redirect("/#services")
}
