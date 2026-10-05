import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TAC-XPRESS Cargo Logistics",
    short_name: "TAC-XPRESS",
    description:
      "Air and surface cargo between Northeast India and New Delhi. Track consignments, manage dispatch, and generate invoices.",
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
  }
}
