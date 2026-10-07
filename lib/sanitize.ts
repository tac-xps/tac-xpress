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

