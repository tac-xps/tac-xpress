"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTrackingEventForm } from "./use-tracking-event-form"
import {
  EditorProvider,
  EditorBubbleMenu,
  EditorFormatBold,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeBulletList,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeCode,
} from "@/components/kibo-ui/editor"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Navigation2 } from "lucide-react"

interface AddTrackingEventFormProps {
  shipmentId: string
  onSuccess: () => void
}

export function AddTrackingEventForm({
  shipmentId,
  onSuccess,
}: AddTrackingEventFormProps) {
  const { form, status, onSubmit } = useTrackingEventForm(shipmentId, onSuccess)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <Card className="border-border bg-muted/20 shadow-none">
          <CardContent className="space-y-6 p-6">
            <div className="mb-4 space-y-1 border-b border-border/50 pb-4">
              <h3 className="text-xs font-bold tracking-widest uppercase">
                Event Details
              </h3>
            </div>

            <FormField
              control={form.control as any}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Delhi Sort Facility"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="overflow-hidden border border-border/50 bg-background">
                      <EditorProvider
                        content={field.value ?? ""}
                        onUpdate={({ editor }) =>
                          field.onChange(editor.getHTML())
                        }
                        className="prose prose-sm dark:prose-invert min-h-[150px] max-w-none p-4 text-sm focus:outline-none"
                      >
                        <EditorBubbleMenu>
                          <EditorFormatBold />
                          <EditorFormatItalic />
                          <EditorFormatStrike />
                          <EditorNodeHeading1 />
                          <EditorNodeHeading2 />
                          <EditorNodeBulletList />
                          <EditorNodeOrderedList />
                        </EditorBubbleMenu>
                      </EditorProvider>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button
          type="submit"
          className="w-full font-semibold shadow-md"
          size="lg"
          disabled={status === "executing"}
        >
          {status === "executing" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Navigation2 className="mr-2 h-4 w-4" />
          )}
          {status === "executing" ? "Logging..." : "Log Event"}
        </Button>
      </form>
    </Form>
  )
}
