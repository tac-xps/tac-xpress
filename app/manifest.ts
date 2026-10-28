import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TAC-XPRESS Cargo Logistics",
    short_name: "TAC-XPRESS",
    description:
      "Dedicated commercial air express and arterial surface linehaul exclusively connecting New Delhi and Imphal (DEL ⇄ IMF). Track consignments, manage gate dispatch, and generate invoices.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9FA",
    theme_color: "#1B2A32",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo/logo_collapsed.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo/logo_expanded.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Scanner Station",
        short_name: "Scanner",
        description: "Barcode and AWB scanning station for ramp and apron operations",
        url: "/dashboard/tracking",
        icons: [{ src: "/logo/logo_collapsed.png", sizes: "192x192" }],
      },
      {
        name: "Track Consignment",
        short_name: "Track",
        description: "Live bilateral DEL ⇄ IMF consignment status",
        url: "/track",
        icons: [{ src: "/logo/logo_collapsed.png", sizes: "192x192" }],
      },
      {
        name: "Gate Manifests",
        short_name: "Manifests",
        description: "Gate handover and departure manifests",
        url: "/dashboard/manifests",
        icons: [{ src: "/logo/logo_collapsed.png", sizes: "192x192" }],
      },
    ],
  }
}
