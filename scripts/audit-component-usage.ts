// @ts-ignore
import madge from "madge"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runAudit() {
  const componentsDir = path.join(__dirname, "..", "components")

  // Create madge dependency graph
  const res = await madge(componentsDir, {
    fileExtensions: ["ts", "tsx"],
    excludeRegExp: [/\.stories\.tsx$/, /\.test\.tsx$/],
  })

  const graph = res.obj()

  // graph maps a file to an array of files it depends on
  // We need the inverse graph: file to array of files that depend on IT
  const inverseGraph: Record<string, string[]> = {}
  for (const [file, deps] of Object.entries(graph)) {
    for (const dep of deps as string[]) {
      if (!inverseGraph[dep]) {
        inverseGraph[dep] = []
      }
      inverseGraph[dep].push(file)
    }
  }

  // Calculate transitive dependents (blast radius)
  const blastRadius = (component: string) => {
    const direct = inverseGraph[component] || []
    const transitive = new Set<string>()
    const queue = [...direct]

    while (queue.length) {
      const current = queue.pop()
      if (current && !transitive.has(current)) {
        transitive.add(current)
        const dependents = inverseGraph[current] || []
        queue.push(...dependents)
      }
    }
    return transitive.size
  }

  const results: { component: string; radius: number }[] = []

  // Only score files that are in components/
  for (const component of Object.keys(graph)) {
    results.push({
      component,
      radius: blastRadius(component),
    })
  }

  results.sort((a, b) => b.radius - a.radius)

  let output = "# P0-BACKLOG (Blast Radius Priority)\n\n"
  output += "| Component | Transitive Dependents |\n"
  output += "|-----------|-----------------------|\n"

  for (const item of results) {
    if (item.radius > 0) {
      output += `| \`${item.component}\` | ${item.radius} |\n`
    }
  }

  const outPath = path.join(__dirname, "..", "P0-BACKLOG.md")
  fs.writeFileSync(outPath, output)
  console.log(`✅ Audit complete. Generated P0-BACKLOG.md`)
}

runAudit().catch((err) => {
  console.error(err)
  process.exit(1)
})
