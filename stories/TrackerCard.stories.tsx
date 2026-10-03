import type { Meta, StoryObj } from "@storybook/react"
import { MapPin } from "lucide-react"
import { PackageTrackerCard } from "@/components/ui/tracker-card"
import { AnimatedParcel } from "@/components/tracking/animated-parcel"

const meta = {
  title: "UI/TrackerCard",
  component: PackageTrackerCard,
  parameters: {
    layout: "centered",
    chromatic: { delay: 500 },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PackageTrackerCard>

export default meta
type Story = StoryObj<typeof meta>

export const InTransit: Story = {
  args: {
    status: "in transit",
    packageNumber: "TAC-DEL-98421",
    destination: "Imphal Hub (IMF)",
    destinationFlag: <MapPin className="h-4 w-4 text-muted-foreground" />,
    date: "New Delhi (DEL) · 04 Oct 2026",
    description: "Consignment arrived at Guwahati Sorting Center. Dispatched via connected line haul.",
    qrCodeValue: "https://tac-xpress.com/track/TAC-DEL-98421",
    packageImage: <AnimatedParcel status="in-transit" />,
  },
}

export const Delivered: Story = {
  args: {
    status: "delivered",
    packageNumber: "TAC-DEL-55102",
    destination: "Guwahati Hub (GAU)",
    destinationFlag: <MapPin className="h-4 w-4 text-muted-foreground" />,
    date: "Kolkata (CCU) · 03 Oct 2026",
    description: "Handed over to consignee with signature verification on record.",
    qrCodeValue: "https://tac-xpress.com/track/TAC-DEL-55102",
    packageImage: <AnimatedParcel status="delivered" />,
  },
}

export const Pending: Story = {
  args: {
    status: "pending pickup",
    packageNumber: "TAC-BOM-10294",
    destination: "Dimapur (DMU)",
    destinationFlag: <MapPin className="h-4 w-4 text-muted-foreground" />,
    date: "Mumbai (BOM) · 04 Oct 2026",
    description: "AWB manifest generated. Awaiting pickup dispatch team confirmation.",
    qrCodeValue: "https://tac-xpress.com/track/TAC-BOM-10294",
    packageImage: <AnimatedParcel status="pending" />,
  },
}

export const WithTrackingAction: Story = {
  args: {
    status: "in transit",
    packageNumber: "TAC-DEL-99881",
    destination: "Aizawl Hub (AJL)",
    destinationFlag: <MapPin className="h-4 w-4 text-muted-foreground" />,
    date: "New Delhi (DEL) · 04 Oct 2026",
    qrCodeValue: "https://tac-xpress.com/track/TAC-DEL-99881",
    packageImage: <AnimatedParcel status="in-transit" />,
    onTrackClick: () => alert("Track clicked"),
  },
}
