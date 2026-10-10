"use client"

import * as React from "react"
import { useEditor, EditorContent, type AnyExtension } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
import { CharacterCount } from "@tiptap/extension-character-count"
import { TaskList } from "@tiptap/extension-task-list"
import { TaskItem } from "@tiptap/extension-task-item"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableCell } from "@tiptap/extension-table-cell"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListCheck,
  Quote,
  Code,
  Table as TableIcon,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Underline } from "@tiptap/extension-underline"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  disabled?: boolean
  variant?: "full" | "compact"
  maxLength?: number
  showCharacterCount?: boolean
  minHeight?: string
  className?: string
  error?: boolean
  id?: string
  name?: string
  "aria-describedby"?: string
  "aria-invalid"?: boolean | "true" | "false"
  "aria-label"?: string
  "aria-labelledby"?: string
  onBlur?: () => void
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  tooltip: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, isActive, disabled, tooltip, children }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          data-active={isActive ? "true" : undefined}
          aria-pressed={isActive !== undefined ? isActive : undefined}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-none text-xs font-medium transition-colors",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-40",
            isActive && "bg-accent text-accent-foreground font-semibold"
          )}
          aria-label={tooltip}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[11px] py-1 px-2">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

interface LinkToolbarButtonProps {
  editor: ReturnType<typeof useEditor> | null
  disabled?: boolean
}

function LinkToolbarButton({ editor, disabled }: LinkToolbarButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState("")

  const isActive = Boolean(editor?.isActive("link"))

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && editor) {
      setUrl(editor.getAttributes("link").href || "")
    }
    setOpen(nextOpen)
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!editor) return
    const trimmed = url.trim()
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      let validUrl = trimmed
      if (!/^https?:\/\//i.test(validUrl) && !/^mailto:/i.test(validUrl)) {
        validUrl = `https://${validUrl}`
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: validUrl }).run()
    }
    setOpen(false)
  }

  const handleRemove = () => {
    if (!editor) return
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled || !editor}
              data-active={isActive ? "true" : undefined}
              aria-pressed={isActive}
              aria-label={isActive ? "Edit link" : "Add link"}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-none text-xs font-medium transition-colors",
                "text-muted-foreground hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-40",
                isActive && "bg-accent text-accent-foreground font-semibold"
              )}
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[11px] py-1 px-2">
          {isActive ? "Edit link" : "Add link"}
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-72 p-3 space-y-2 rounded-none">
        <div className="text-xs font-semibold text-foreground">
          {isActive ? "Edit hyperlink" : "Insert hyperlink"}
        </div>
        <form onSubmit={handleApply} className="space-y-2.5">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            aria-label="Link URL"
            className="h-8 text-xs font-mono rounded-none"
            autoFocus
          />
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {isActive ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-7 px-2 text-xs text-destructive hover:text-destructive rounded-none"
              >
                Remove
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-7 px-2.5 text-xs rounded-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-7 px-2.5 text-xs rounded-none"
              >
                Apply
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  function RichTextEditor(
    {
      value = "",
      onChange,
      placeholder = "Write details here...",
      disabled = false,
      variant = "compact",
      maxLength,
      showCharacterCount = false,
      minHeight = "120px",
      className,
      error = false,
      id,
      name,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-label": ariaLabelProp,
      "aria-labelledby": ariaLabelledByProp,
      onBlur,
    }: RichTextEditorProps,
    ref
  ) {
    const isInvalid = Boolean(
      error || ariaInvalid === true || ariaInvalid === "true"
    )
    const accessibleLabel =
      ariaLabelProp ||
      (ariaLabelledByProp
        ? undefined
        : placeholder || "Rich text editor")
    const containerRef = React.useRef<HTMLDivElement>(null)

    const extensions = React.useMemo<AnyExtension[]>(() => {
      const base: AnyExtension[] = [
        StarterKit.configure({
          heading: { levels: [2, 3] },
          bulletList: { keepMarks: true, keepAttributes: false },
          orderedList: { keepMarks: true, keepAttributes: false },
          link: {
            openOnClick: false,
            HTMLAttributes: {
              class: "text-primary underline underline-offset-4 hover:opacity-80 transition-opacity",
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
        }),
        Underline,
        Placeholder.configure({
          placeholder,
        }),
      ]

      if (maxLength) {
        base.push(CharacterCount.configure({ limit: maxLength }))
      } else {
        base.push(CharacterCount.configure({}))
      }

      if (variant === "full") {
        base.push(
          TaskList,
          TaskItem.configure({ nested: true }),
          Table.configure({ resizable: false }),
          TableRow,
          TableHeader,
          TableCell
        )
      }

      return base
    }, [variant, placeholder, maxLength])

    const editor = useEditor({
      immediatelyRender: false,
      extensions,
      content: value || "",
      editable: !disabled,
      editorProps: {
        attributes: {
          role: "textbox",
          "aria-multiline": "true",
          ...(accessibleLabel ? { "aria-label": accessibleLabel } : {}),
          ...(ariaLabelledByProp ? { "aria-labelledby": ariaLabelledByProp } : {}),
          ...(isInvalid ? { "aria-invalid": "true" } : {}),
          ...(id ? { id } : {}),
          ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
          class: cn(
            "max-w-none focus:outline-none p-3 text-sm text-foreground",
            "[&_p]:leading-relaxed [&_p]:my-1",
            "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-2 [&_h2]:mb-1",
            "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mt-1.5 [&_h3]:mb-1",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ul]:space-y-0.5",
            "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_ol]:space-y-0.5",
            "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-1.5",
            "[&_code]:bg-muted [&_code]:text-foreground [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded-none [&_code]:text-xs [&_code]:font-mono",
            "[&_pre]:bg-muted/70 [&_pre]:p-2.5 [&_pre]:rounded-none [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-2",
            "[&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-border [&_table]:my-2 [&_table]:text-xs",
            "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:p-1.5 [&_th]:text-left [&_th]:font-semibold",
            "[&_td]:border [&_td]:border-border [&_td]:p-1.5 [&_td]:text-left",
            "[&_.is-editor-empty:first-child::before]:text-muted-foreground [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:h-0"
          ),
        },
        handleDOMEvents: {
          blur: () => {
            onBlur?.()
            return false
          },
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        const html = currentEditor.getHTML()
        if (currentEditor.isEmpty) {
          onChange?.("")
        } else {
          onChange?.(html)
        }
      },
    })

    React.useImperativeHandle(
      ref,
      () => {
        const container = containerRef.current
        if (!container) return {} as HTMLDivElement
        return Object.assign(container, {
          focus: () => {
            editor?.commands.focus()
          },
        })
      },
      [editor]
    )

    // Synchronize incoming external value
    React.useEffect(() => {
      if (!editor) return
      const currentHtml = editor.getHTML()
      const incoming = value || ""
      if (incoming !== currentHtml && (incoming !== "" || !editor.isEmpty)) {
        editor.commands.setContent(incoming, { emitUpdate: false })
      }
    }, [value, editor])

    // Synchronize editable state
    React.useEffect(() => {
      if (!editor) return
      editor.setEditable(!disabled)
    }, [disabled, editor])

    const charCount = editor?.storage.characterCount?.characters() || 0
    const wordCount = editor?.storage.characterCount?.words() || 0

    return (
      <TooltipProvider delayDuration={200}>
        <div
          ref={containerRef}
          data-slot="rich-text-editor"
          data-invalid={isInvalid ? "true" : undefined}
          className={cn(
            "group relative flex flex-col rounded-none border border-input bg-background text-foreground transition-all duration-150",
            "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
            isInvalid && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
            disabled && "cursor-not-allowed opacity-60 bg-muted/20",
            className
          )}
        >
        {/* Hidden field for traditional form submission */}
        {name && <input type="hidden" name={name} value={value} />}

        {/* Header Toolbar */}
        <div
          data-slot="rich-text-toolbar"
          role="toolbar"
          aria-label="Text formatting"
          className="flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-muted/30 px-2 py-1 select-none"
        >
          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            isActive={editor?.isActive("bold")}
            disabled={disabled || !editor}
            tooltip="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            isActive={editor?.isActive("italic")}
            disabled={disabled || !editor}
            tooltip="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            isActive={editor?.isActive("underline")}
            disabled={disabled || !editor}
            tooltip="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            isActive={editor?.isActive("strike")}
            disabled={disabled || !editor}
            tooltip="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarButton>

          {/* Full Variant Headers */}
          {variant === "full" && (
            <>
              <Separator orientation="vertical" className="mx-1 h-4 bg-border/60" />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor?.isActive("heading", { level: 2 })}
                disabled={disabled || !editor}
                tooltip="Heading 2"
              >
                <Heading2 className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor?.isActive("heading", { level: 3 })}
                disabled={disabled || !editor}
                tooltip="Heading 3"
              >
                <Heading3 className="h-3.5 w-3.5" />
              </ToolbarButton>
            </>
          )}

          <Separator orientation="vertical" className="mx-1 h-4 bg-border/60" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            isActive={editor?.isActive("bulletList")}
            disabled={disabled || !editor}
            tooltip="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            isActive={editor?.isActive("orderedList")}
            disabled={disabled || !editor}
            tooltip="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarButton>

          {/* Full Variant Extras */}
          {variant === "full" && (
            <>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                isActive={editor?.isActive("taskList")}
                disabled={disabled || !editor}
                tooltip="Task Checklist"
              >
                <ListCheck className="h-3.5 w-3.5" />
              </ToolbarButton>

              <Separator orientation="vertical" className="mx-1 h-4 bg-border/60" />

              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                isActive={editor?.isActive("blockquote")}
                disabled={disabled || !editor}
                tooltip="Blockquote"
              >
                <Quote className="h-3.5 w-3.5" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                isActive={editor?.isActive("codeBlock")}
                disabled={disabled || !editor}
                tooltip="Code Block"
              >
                <Code className="h-3.5 w-3.5" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
                isActive={editor?.isActive("table")}
                disabled={disabled || !editor}
                tooltip="Insert Table (3x3)"
              >
                <TableIcon className="h-3.5 w-3.5" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                disabled={disabled || !editor}
                tooltip="Divider Line"
              >
                <Minus className="h-3.5 w-3.5" />
              </ToolbarButton>
            </>
          )}

          <Separator orientation="vertical" className="mx-1 h-4 bg-border/60" />

          {/* Links */}
          <LinkToolbarButton editor={editor} disabled={disabled} />

          <Separator orientation="vertical" className="mx-1 h-4 bg-border/60" />

          {/* History */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={disabled || !editor?.can().undo()}
            tooltip="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={disabled || !editor?.can().redo()}
            tooltip="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>

        {/* Content Area */}
        <div
          data-slot="rich-text-content"
          style={{ minHeight }}
          className="cursor-text overflow-y-auto"
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>

        {/* Status Bar */}
        {(showCharacterCount || maxLength) && (
          <div
            data-slot="rich-text-status"
            className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-3 py-1 text-[11px] text-muted-foreground select-none"
          >
            <span>{wordCount} words</span>
            <span>
              {charCount}
              {maxLength ? ` / ${maxLength}` : ""} characters
            </span>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
})
RichTextEditor.displayName = "RichTextEditor"
