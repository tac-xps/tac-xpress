import * as React from "react"
import { sanitizeHtml } from "@/lib/sanitize"
import { cn } from "@/lib/utils"

export interface RichTextRendererProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content?: string | null
  fallbackText?: string
}

/**
 * Sanitized rich text viewer providing typography styling and safe HTML injection.
 */
export function RichTextRenderer({
  content,
  fallbackText = "No details provided.",
  className,
  ...props
}: RichTextRendererProps) {
  if (!content || !content.trim()) {
    return (
      <div
        data-slot="rich-text-renderer-empty"
        className={cn("text-sm text-muted-foreground italic", className)}
        {...props}
      >
        {fallbackText}
      </div>
    )
  }

  const isHtml =
    /<\/?(?:p|h[1-6]|ul|ol|li|blockquote|table|thead|tbody|tr|th|td|pre|code|div|span|strong|em|b|i|u|s|hr|br|a)\b[^>]*>/i.test(
      content
    )

  if (!isHtml) {
    return (
      <div
        data-slot="rich-text-renderer-plain"
        className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground",
          className
        )}
        {...props}
      >
        {content}
      </div>
    )
  }

  const sanitized = sanitizeHtml(content)

  return (
    <div
      data-slot="rich-text-renderer"
      className={cn(
        "typeset typeset-docs rich-text-content text-foreground break-words",
        "[&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:pl-0 [&_ul[data-type='taskList']]:space-y-1.5",
        "[&_li[data-type='taskItem']]:flex [&_li[data-type='taskItem']]:items-start [&_li[data-type='taskItem']]:gap-2",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...props}
    />
  )
}
