import * as React from "react"
import { sanitizeHtml } from "@/lib/sanitize"
import { cn } from "@/lib/utils"

export interface RichTextRendererProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content?: string | null
  fallbackText?: string
}

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

  const isHtml = /<[a-z][\s\S]*>/i.test(content)

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
        "rich-text-content text-sm leading-relaxed text-foreground break-words space-y-2",
        "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-3 [&_h2]:mb-1",
        "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mt-2 [&_h3]:mb-1",
        "[&_p]:leading-relaxed [&_p]:my-1",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ul]:space-y-0.5",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_ol]:space-y-0.5",
        "[&_li]:leading-relaxed",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-2",
        "[&_code]:bg-muted [&_code]:text-foreground [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:text-xs [&_code]:font-mono",
        "[&_pre]:bg-muted/70 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:my-2",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-border [&_table]:my-2 [&_table]:text-xs",
        "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:text-left",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
        "[&_hr]:border-border [&_hr]:my-3",
        "[&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:pl-0 [&_ul[data-type='taskList']]:space-y-1.5",
        "[&_li[data-type='taskItem']]:flex [&_li[data-type='taskItem']]:items-start [&_li[data-type='taskItem']]:gap-2",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...props}
    />
  )
}
