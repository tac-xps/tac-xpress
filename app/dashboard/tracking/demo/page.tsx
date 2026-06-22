"use client"

import React from "react"
import Image from "next/image"
import {
  PackageTrackerCard,
  PackageTrackerCardProps,
} from "@/components/ui/tracker-card"

const PolandFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 5 3"
    className="h-4 w-6 rounded-sm"
  >
    <rect width="5" height="3" fill="#fff" />
    <rect width="5" height="1.5" y="1.5" fill="#dc143c" />
  </svg>
)

export default function PackageTrackerCardDemo() {
  const trackingUrl = "https://21st.dev/track/49029880150810129411"

  const cardProps: PackageTrackerCardProps = {
    status: "Out for Delivery",
    packageNumber: "49029880150810129411",
    destination: "Poland",
    destinationFlag: <PolandFlag />,
    date: "Poland - 01/06/25",
    description: "Shipment is out for delivery.",
    packageImage: (
      <Image
        src={`https://${process.env.NEXT_PUBLIC_VERCEL_BLOB_HOSTNAME ?? "your-project.public.blob.vercel-storage.com"}/image-cfG5HFRLtZ568wRFDk8NRn7hzW00fY.png`}
        width={200}
        height={200}
        alt="Package visualization"
        className="drop-shadow-lg"
      />
    ),
    onTrackClick: () => alert("Tracking details button clicked!"),
  }

  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center bg-background p-4">
      <PackageTrackerCard {...cardProps} />
    </div>
  )
}
