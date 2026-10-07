// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { sanitizeHtml } from "@/lib/sanitize"
import { RichTextRenderer } from "@/components/ui/rich-text-renderer"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe("sanitizeHtml", () => {
  it("removes script tags and inline event handlers", () => {
    const dirty = '<p>Safe text</p><script>alert("xss")</script><img src="x" onerror="alert(1)" />'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain("<script>")
    expect(clean).not.toContain("alert")
    expect(clean).toContain("<p>Safe text</p>")
  })

  it("preserves rich text formatting tags", () => {
    const dirty = "<h2>Heading</h2><p><strong>Bold</strong> and <em>Italic</em></p><ul><li>Item 1</li></ul>"
    const clean = sanitizeHtml(dirty)
    expect(clean).toContain("<h2>Heading</h2>")
    expect(clean).toContain("<strong>Bold</strong>")
    expect(clean).toContain("<em>Italic</em>")
    expect(clean).toContain("<li>Item 1</li>")
  })

  it("handles empty and null inputs safely", () => {
    expect(sanitizeHtml("")).toBe("")
    expect(sanitizeHtml(null as unknown as string)).toBe("")
  })
})

describe("RichTextRenderer", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it("renders fallback text when content is empty", () => {
    act(() => {
      root.render(<RichTextRenderer content="" fallbackText="Custom fallback" />)
    })
    expect(container.textContent).toContain("Custom fallback")
  })

  it("renders plain text with preserved whitespace", () => {
    act(() => {
      root.render(<RichTextRenderer content={"Plain line 1\nPlain line 2"} />)
    })
    expect(container.textContent).toContain("Plain line 1")
    expect(container.textContent).toContain("Plain line 2")
    const el = container.querySelector('[data-slot="rich-text-renderer-plain"]')
    expect(el).not.toBeNull()
  })

  it("renders sanitized HTML safely", () => {
    act(() => {
      root.render(
        <RichTextRenderer content="<h3>Cargo Notes</h3><p>Fragile items</p><script>evil()</script>" />
      )
    })
    expect(container.textContent).toContain("Cargo Notes")
    expect(container.textContent).toContain("Fragile items")
    expect(container.innerHTML).not.toContain("<script>")
  })
})

describe("RichTextEditor Component", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it("renders editor toolbar and content container", () => {
    act(() => {
      root.render(<RichTextEditor value="<p>Initial content</p>" placeholder="Type something..." />)
    })
    const toolbar = container.querySelector('[data-slot="rich-text-toolbar"]')
    const content = container.querySelector('[data-slot="rich-text-content"]')
    expect(toolbar).not.toBeNull()
    expect(content).not.toBeNull()
  })

  it("forwards aria-invalid and displays error styling", () => {
    act(() => {
      root.render(<RichTextEditor aria-invalid="true" placeholder="Error test" />)
    })
    const editorContainer = container.querySelector('[data-slot="rich-text-editor"]')
    expect(editorContainer?.getAttribute("data-invalid")).toBe("true")
    expect(editorContainer?.className).toContain("border-destructive")
  })
})

describe("Sanitizer & Renderer security improvements", () => {
  it("strips positioning, layering, and escape classes while retaining safe formatting", () => {
    const input =
      '<p class="fixed top-0 z-50 text-primary font-bold overflow-hidden pointer-events-none">Text</p>'
    const output = sanitizeHtml(input)
    expect(output).not.toContain("fixed")
    expect(output).not.toContain("top-0")
    expect(output).not.toContain("z-50")
    expect(output).not.toContain("overflow-hidden")
    expect(output).not.toContain("pointer-events-none")
    expect(output).toContain("text-primary")
    expect(output).toContain("font-bold")
  })

  it("does not treat bracketed email addresses or arbitrary angle bracket text as HTML", () => {
    let testContainer = document.createElement("div")
    document.body.appendChild(testContainer)
    let testRoot = createRoot(testContainer)

    act(() => {
      testRoot.render(<RichTextRenderer content="Contact us at <support@example.com> or <item>" />)
    })

    const plainEl = testContainer.querySelector('[data-slot="rich-text-renderer-plain"]')
    expect(plainEl).not.toBeNull()
    expect(testContainer.textContent).toContain("<support@example.com>")
    expect(testContainer.textContent).toContain("<item>")

    act(() => testRoot.unmount())
    testContainer.remove()
  })

  it("preserves angle bracket references in feedback and message validation", () => {
    const HTML_TAG_REGEX =
      /<\/?(?:p|h[1-6]|ul|ol|li|blockquote|table|thead|tbody|tr|th|td|pre|code|div|span|strong|em|b|i|u|s|hr|br|a)\b[^>]*>/gi
    const input = "Please check <AWB123>"
    const stripped = input.replace(HTML_TAG_REGEX, "").trim()
    expect(stripped).toBe("Please check <AWB123>")
    expect(stripped.length).toBeGreaterThanOrEqual(10)

    const mathInput = "Weight range: 2 < 5 and 5 > 2"
    expect(mathInput.replace(HTML_TAG_REGEX, "").trim()).toBe("Weight range: 2 < 5 and 5 > 2")
  })
})

