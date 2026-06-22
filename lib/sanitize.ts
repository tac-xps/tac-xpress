import DOMPurify from "dompurify"
import { JSDOM } from "jsdom"

// Initialize window/DOM for server-side usage if needed
const window = new JSDOM("").window
const purify = DOMPurify(window as any)

export function sanitizeHtml(dirty: string): string {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  })
}
