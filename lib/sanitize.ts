import DOMPurify from "dompurify"

let purifyInstance: ReturnType<typeof DOMPurify> | null = null

export function sanitizeHtml(dirty: string): string {
  if (!purifyInstance) {
    if (typeof window === "undefined") {
      // Server-side
      const { JSDOM } = require("jsdom")
      const jsdomWindow = new JSDOM("").window
      purifyInstance = DOMPurify(jsdomWindow as any)
    } else {
      // Client-side
      purifyInstance = DOMPurify(window as any)
    }
  }

  return purifyInstance.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  })
}
