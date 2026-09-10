import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

const root = process.cwd()
const normalize = (value) => path.relative(root, value).replaceAll("\\", "/")
const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile)
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, root).options
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
}
const entries = files(path.join(root, "app")).filter((file) => /^(?:page|layout|loading|error|not-found|global-error|route)\.(tsx?|jsx?)$/.test(path.basename(file)))
const seen = new Set()
const edges = []
const external = new Set()
function visit(file) {
  if (seen.has(file) || !fs.existsSync(file) || !/\.[cm]?[jt]sx?$/.test(file)) return
  seen.add(file)
  const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true)
  function inspect(node) {
    let specifier
    if (ts.isImportDeclaration(node) && !node.importClause?.isTypeOnly) specifier = node.moduleSpecifier
    if (ts.isExportDeclaration(node) && !node.isTypeOnly) specifier = node.moduleSpecifier
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) specifier = node.arguments[0]
    if (specifier && ts.isStringLiteral(specifier)) {
      const name = specifier.text
      const resolved = ts.resolveModuleName(name, file, options, ts.sys).resolvedModule
      if (resolved && !resolved.isExternalLibraryImport && !resolved.resolvedFileName.endsWith(".d.ts")) {
        const target = path.resolve(resolved.resolvedFileName)
        edges.push({ from: normalize(file), to: normalize(target) })
        visit(target)
      } else if (!name.startsWith(".") && !name.startsWith("@/")) external.add(name)
    }
    ts.forEachChild(node, inspect)
  }
  inspect(source)
}
entries.forEach(visit)
const exceptions = edges.filter(({ to }) => /components\/(kibo-ui|shadcn-space|animate-ui|magicui|aceternity)/.test(to))
const externalKits = [...external].filter((name) => /@aliimam|@kibo|shadcn-space/.test(name))
const result = { scope: "Current route entry points and their statically resolvable runtime imports; this is not an authenticated execution audit.", entryCount: entries.length, reachableModuleCount: seen.size, entries: entries.map(normalize).sort(), uiKitExceptions: exceptions, externalKitExceptions: externalKits, reachableComponents: [...seen].map(normalize).filter((file) => file.startsWith("components/")).sort() }
fs.mkdirSync(path.join(root, "artifacts"), { recursive: true })
fs.writeFileSync(path.join(root, "artifacts", "route-source-audit.json"), JSON.stringify(result, null, 2) + "\n")
process.stdout.write(JSON.stringify({ entryCount: result.entryCount, reachableModuleCount: result.reachableModuleCount, uiKitExceptions: exceptions, externalKitExceptions: externalKits }, null, 2) + "\n")
