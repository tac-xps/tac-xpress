import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import ts from "typescript"

const internalServices = [
  "ai-triage",
  "ai-responder",
  "email-notifications",
  "whatsapp-inbound",
  "whatsapp-outbound",
  "whatsapp-proactive",
  "sla",
]

describe("privileged code cannot become public server actions", () => {
  it.each(internalServices)(
    "keeps %s behind a build-enforced server boundary",
    (name) => {
      const source = readFileSync(`app/actions/${name}.ts`, "utf8")
      const ast = ts.createSourceFile(
        name,
        source,
        ts.ScriptTarget.Latest,
        true
      )
      const directives = ast.statements
        .filter(ts.isExpressionStatement)
        .map((s) => (ts.isStringLiteral(s.expression) ? s.expression.text : ""))
      expect(directives).not.toContain("use server")
      expect(
        ast.statements.some(
          (s) =>
            ts.isImportDeclaration(s) &&
            ts.isStringLiteral(s.moduleSpecifier) &&
            s.moduleSpecifier.text === "server-only"
        )
      ).toBe(true)
    }
  )
  it("does not export a portal session signer as an action", () => {
    const source = readFileSync("app/actions/portal-auth.ts", "utf8")
    const ast = ts.createSourceFile(
      "portal-auth.ts",
      source,
      ts.ScriptTarget.Latest,
      true
    )
    const exports = ast.statements
      .filter(ts.isFunctionDeclaration)
      .filter((s) =>
        s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      )
      .map((s) => s.name?.text)
    expect(exports).not.toContain("createPortalSession")
  })
})
