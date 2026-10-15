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

const ALLOWED_TAGS_SET = new Set([
  "b", "i", "em", "strong", "u", "s", "a", "p", "br", "ul", "ol", "li",
  "h2", "h3", "h4", "blockquote", "code", "pre", "table", "thead", "tbody",
  "tr", "th", "td", "hr", "span",
])

const ALLOWED_ATTR_LIST = [
  "href", "target", "rel", "class", "data-type", "checked", "disabled",
]

/**
 * Strips all HTML tags except the allow-listed set. Used as a resilient
 * fallback when DOMPurify cannot initialise (e.g. Vercel serverless cold
 * start where jsdom is unavailable).
 */
function regexSanitizeFallback(dirty: string): string {
  // Remove script/style/iframe blocks entirely (content included)
  let safe = dirty.replace(/<(script|style|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, "")

  // Strip event-handler attributes (onclick, onerror, etc.)
  safe = safe.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "")

  // Remove tags not in the allow-list
  safe = safe.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*\/?>/gi, (match, tag: string) => {
    return ALLOWED_TAGS_SET.has(tag.toLowerCase()) ? match : ""
  })

  // Strip any remaining attributes except those in the allow-list
  safe = safe.replace(/<([a-z][a-z0-9]*)\s+([^>]*)>/gi, (_match, tag: string, attrs: string) => {
    const cleanAttrs = (attrs as string)
      .match(/[a-z][\w-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?/gi)
      ?.filter((attr) => {
        const name = attr.split(/[=\s]/)[0].toLowerCase()
        return ALLOWED_ATTR_LIST.includes(name)
      })
      .join(" ") || ""
    return cleanAttrs ? `<${tag} ${cleanAttrs}>` : `<${tag}>`
  })

  return safe
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ""

  const instance = getPurifyInstance()

  // Graceful fallback: regex-based sanitisation when DOMPurify is unavailable
  // (e.g. Vercel serverless where jsdom cannot load). Fixes Sentry #1T.
  if (!instance) {
    return regexSanitizeFallback(dirty)
  }

  return instance.sanitize(dirty, {
    ALLOWED_TAGS: [...ALLOWED_TAGS_SET],
    ALLOWED_ATTR: ALLOWED_ATTR_LIST,
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
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
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
    .replace(/<\/(?:p|div|li|h[1-6]|blockquote|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .trim()
}
