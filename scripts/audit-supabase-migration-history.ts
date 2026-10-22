import { readdir } from "node:fs/promises"
import path from "node:path"

const migrationDirectory = path.join(process.cwd(), "supabase", "migrations")
const migrationFiles = (await readdir(migrationDirectory))
  .filter((file) => file.endsWith(".sql"))
  .sort((left, right) => left.localeCompare(right))

const versions = new Map<string, string[]>()
const invalidNames: string[] = []

for (const file of migrationFiles) {
  const match = file.match(/^(\d+)_([a-z0-9_]+)\.sql$/i)
  if (!match) {
    invalidNames.push(file)
    continue
  }

  const [, version] = match
  const filesForVersion = versions.get(version) ?? []
  filesForVersion.push(file)
  versions.set(version, filesForVersion)
}

const duplicateVersions = [...versions.entries()].filter(
  ([, files]) => files.length > 1
)

console.log(`Scanned ${migrationFiles.length} Supabase SQL migration files.`)

if (invalidNames.length > 0) {
  console.error("Invalid migration filenames:")
  for (const file of invalidNames) console.error(`  ${file}`)
}

if (duplicateVersions.length > 0) {
  console.error("Duplicate migration version prefixes:")
  for (const [version, files] of duplicateVersions) {
    console.error(`  ${version}: ${files.join(", ")}`)
  }
}

if (invalidNames.length > 0 || duplicateVersions.length > 0) {
  console.error(
    "Resolve the migration history in a reviewed release plan before using Supabase CLI migration commands."
  )
  process.exitCode = 1
} else {
  console.log("Migration filenames have unique numeric versions.")
}
