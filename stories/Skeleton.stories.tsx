import type { Meta, StoryObj } from "@storybook/react"
import { Skeleton } from "@/components/ui/skeleton"

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    chromatic: {
      // Disable animation for stable snapshot
      pauseAnimationAtEnd: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-80 space-y-3 border border-border p-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}

export const TableRowSkeleton: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
    </div>
  ),
}

export const AvatarWithText: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  ),
}
