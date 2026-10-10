import DOMPurify from "dompurify"

let purifyInstance: ReturnType<typeof DOMPurify> | null = null

function getPurifyInstance(): ReturnType<typeof DOMPurify> | null {
  if (purifyInstance) return purifyInstance

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

  if (purifyInstance) {
    purifyInstance.addHook("uponSanitizeAttribute", (_node, data) => {
      if (data.attrName === "class" && typeof data.attrValue === "string") {
        data.attrValue = data.attrValue
          .split(/\s+/)
          .filter(
            (cls) =>
              cls.length > 0 &&
              !/^(fixed|absolute|relative|sticky|z-|inset-|top-|bottom-|left-|right-|w-screen|h-screen|overflow-|pointer-events-|opacity-0|-m|-top|-bottom|-left|-right)/i.test(
                cls
              )
          )
          .join(" ")
      }
    })
  }

  return purifyInstance
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ""

  const instance = getPurifyInstance()
  if (!instance) {
    throw new Error("HTML sanitizer unavailable")
  }

  return instance.sanitize(dirty, {
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

const HTML_STRUCTURE_REGEX =
  /<\/?(?:p|h[1-6]|ul|ol|li|blockquote|table|thead|tbody|tr|th|td|pre|code|div|span|strong|em|b|i|u|s|hr|br|a)\b[^>]*>/i

/**
 * Extracts visible text content from a message string.
 * - For HTML content (e.g. from rich text editors), strips ALL HTML tags and decodes common entities,
 *   preventing non-rendering markup (such as `<p><img src=x></p>`) from artificially inflating character counts.
 * - For plain text (e.g. from textareas or feedback), preserves literal angle bracket tokens
 *   (such as `<AWB123>` or `2 < 5`) without stripping them.
 */
export function getVisibleText(content?: string | null): string {
  if (!content) return ""

  // If content has no recognized HTML structural tags, treat as plain text
  if (!HTML_STRUCTURE_REGEX.test(content)) {
    return content.trim()
  }

  // Content is HTML: strip all tags and decode basic entities to measure true visible text
  return content
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim()
}

/**
 * Strips HTML formatting from legacy rich-text content while converting paragraph
 * and break boundaries into newlines. If content does not match recognized HTML
 * structural tags, it is treated as plain text and preserved verbatim (including
 * mathematical comparisons like "< 500" or custom tokens like "<AWB123>").
 */
export function stripHtmlToPlainText(content?: string | null): string {
  if (!content) return ""

  // If content has no recognized HTML structural tags, preserve plain text as-is
  if (!HTML_STRUCTURE_REGEX.test(content)) {
    return content
  }

  return content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim()
}
