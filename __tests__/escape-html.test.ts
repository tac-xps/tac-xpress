import { expect, it } from "vitest"
import { escapeHtml } from "@/lib/server/escape-html"
it("escapes stored markup and attribute delimiters in printed manifests", () => {
  expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe(
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"
  )
  expect(escapeHtml("' & cargo")).toBe("&#39; &amp; cargo")
})
