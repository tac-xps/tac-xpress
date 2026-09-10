import type { Meta, StoryObj } from "@storybook/nextjs"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const meta = {
  title: "TAC-XPRESS/Nordic Lagom foundation",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ComponentStates: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-6 bg-background p-6 text-foreground">
      <section className="flex flex-wrap items-center gap-3">
        <Button>Save shipment</Button>
        <Button variant="outline">View details</Button>
        <Button variant="ghost">Cancel</Button>
        <Button disabled>Saving</Button>
        <Badge variant="success">Delivered</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="error">Exception</Badge>
      </section>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Dispatch summary</CardTitle>
          <CardDescription>
            Restrained surface, direct copy, and operational hierarchy.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Search AWB number" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>AWB</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono tabular-nums">
              TX-260729-01
            </TableCell>
            <TableCell><Badge variant="success">Delivered</Badge></TableCell>
            <TableCell>12 min ago</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Empty className="min-h-48">
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>No dispatches need attention</EmptyTitle>
            <EmptyDescription>
              Exceptions and incomplete records appear here.
            </EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    </div>
  ),
}
