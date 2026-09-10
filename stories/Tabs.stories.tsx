import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="manifest">Manifests</TabsTrigger>
        <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4 pt-6">
        <h4 className="text-sm font-medium mb-2">Hub Overview</h4>
        <p className="text-sm text-muted-foreground">
          View high-level metrics for the selected operations hub.
        </p>
      </TabsContent>
      <TabsContent value="manifest" className="p-4 pt-6">
        <h4 className="text-sm font-medium mb-2">Active Manifests</h4>
        <p className="text-sm text-muted-foreground">
          Manage inbound and outbound manifests for this location.
        </p>
      </TabsContent>
    </Tabs>
  ),
}
