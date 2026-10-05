import type { Meta, StoryObj } from "@storybook/react"
import { StatusBadge } from "@/components/logistics/status-badge"

/**
 * StatusBadge Component
 *
 * Implements Evil Martians Storybook CSF3 workbench pattern:
 * - 5 essential states: Default, Loading/Pulsing, Success, Error, and Themed
 * - Calibrated OKLCH colors guaranteeing APCA |Lc| ≥ 60 badge contrast
 */
const meta = {
  title: "Logistics/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: [
        "pending",
        "in-transit",
        "out-for-delivery",
        "delivered",
        "failed",
        "delayed",
        "at-risk",
        "corridor",
      ],
    },
    showDot: {
      control: "boolean",
    },
    pulse: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

/** State 1: Default pending shipment booked at origin station */
export const DefaultPending: Story = {
  args: {
    status: "pending",
    label: "Pending Booking",
    showDot: true,
  },
}

/** State 2: Active in-transit shipment with animated ping telemetry */
export const PulsingTransit: Story = {
  args: {
    status: "in-transit",
    label: "In Transit — GAU Linehaul",
    showDot: true,
    pulse: true,
  },
}

/** State 3: Delivered terminal state satisfying APCA contrast criteria */
export const DeliveredSuccess: Story = {
  args: {
    status: "delivered",
    label: "Delivered to Consignee",
    showDot: true,
    pulse: false,
  },
}

/** State 4: Delayed / SLA breach failure state with high-urgency contrast */
export const DelayedFailure: Story = {
  args: {
    status: "failed",
    label: "SLA Breached / Exception",
    showDot: true,
    pulse: false,
  },
}

/** State 5: Corridor-aware route badge utilizing dynamic OKLCH hue */
export const CorridorRoute: Story = {
  args: {
    status: "corridor",
    label: "DEL → IMF Priority Corridor",
    showDot: true,
    pulse: false,
  },
}

/** Compact variant without the status dot */
export const WithoutDot: Story = {
  args: {
    status: "delivered",
    label: "Delivered",
    showDot: false,
  },
}
