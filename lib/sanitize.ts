import DOMPurify from "dompurify"

let purifyInstance: ReturnType<typeof DOMPurify> | null = null

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ""

  if (!purifyInstance) {
    if (typeof window === "undefined") {
      try {
        // Server-side JSDOM instance
        const { JSDOM } = require("jsdom")
        const jsdomWindow = new JSDOM("").window
        purifyInstance = DOMPurify(jsdomWindow as unknown as Window & typeof globalThis)
      } catch {
        purifyInstance = null
      }
    } else {
      purifyInstance = DOMPurify(window as unknown as Window & typeof globalThis)
    }
  }

  if (!purifyInstance) {
    return dirty
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/on\w+='[^']*'/gi, "")
  }

  return purifyInstance.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "u",
      "s",
      "a",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "hr",
      "span",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "class",
      "data-type",
      "checked",
      "disabled",
    ],
    FORBID_TAGS: ["style", "script", "iframe"],
  })
}

