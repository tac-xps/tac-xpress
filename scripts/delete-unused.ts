import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'

function main() {
  const backlogPath = path.join(process.cwd(), 'P0-BACKLOG.md')
  if (!fs.existsSync(backlogPath)) {
    console.error('P0-BACKLOG.md not found')
    process.exit(1)
  }

  const content = fs.readFileSync(backlogPath, 'utf8')
  
  // Only parse bullets under the "## Unused Components" heading
  const unusedSectionMatch = content.match(/## Unused Components\s+([\s\S]*?)(?=\n## |\Z)/)
  if (!unusedSectionMatch) {
    console.error('## Unused Components section not found in P0-BACKLOG.md')
    process.exit(1)
  }

  const unusedSection = unusedSectionMatch[1]
  const bulletRegex = /^-\s+`([^`]+)`/gm

  let match
  const filesToCheck: string[] = []
  while ((match = bulletRegex.exec(unusedSection)) !== null) {
    filesToCheck.push(match[1])
  }

  let deletedCount = 0
  const failedDeletions: { path: string; error: unknown }[] = []

  for (const relativePath of filesToCheck) {
    const fullPath = path.join(process.cwd(), relativePath)
    if (!fs.existsSync(fullPath)) continue

    // Get the base name without extension for searching imports (e.g. "dropdown-menu" from "components/ui/dropdown-menu.tsx")
    const ext = path.extname(relativePath)
    const baseName = path.basename(relativePath, ext)

    try {
      // Find all occurrences of the baseName. If it's 0 (other than in the file itself), delete it.
      const output = execFileSync('git', ['grep', '-l', '--', baseName], { encoding: 'utf8' }).trim()
      const matches = output.split('\n').filter(Boolean)
      
      const isUsed = matches.some(matchFile => {
        // Exclude itself, P0-BACKLOG.md, and scripts
        if (matchFile === relativePath) return false
        if (matchFile === 'P0-BACKLOG.md') return false
        if (matchFile.startsWith('scripts/')) return false
        return true
      })

      if (!isUsed) {
        console.log(`Deleting TRULY UNUSED file: ${relativePath}`)
        try {
          fs.unlinkSync(fullPath)
          deletedCount++
        } catch (unlinkError) {
          console.error(`Failed to delete ${relativePath}:`, unlinkError)
          failedDeletions.push({ path: relativePath, error: unlinkError })
        }
      } else {
        console.log(`Skipping used file: ${relativePath} (found in ${matches.length} files)`)
      }
    } catch (e: unknown) {
      // git grep returns exit code 1 when no matches are found
      if (e && typeof e === 'object' && 'status' in e && (e as { status: number }).status === 1) {
        console.log(`Deleting TRULY UNUSED file (no matches): ${relativePath}`)
        try {
          fs.unlinkSync(fullPath)
          deletedCount++
        } catch (unlinkError) {
          console.error(`Failed to delete ${relativePath}:`, unlinkError)
          failedDeletions.push({ path: relativePath, error: unlinkError })
        }
      } else {
        console.error(`git grep failed for ${relativePath}:`, e)
        failedDeletions.push({ path: relativePath, error: e })
      }
    }
  }

  console.log(`Deleted ${deletedCount} unused components safely.`)

  if (failedDeletions.length > 0) {
    console.error(`Encountered ${failedDeletions.length} errors during deletion:`)
    for (const f of failedDeletions) {
      console.error(` - ${f.path}:`, f.error)
    }
    process.exit(1)
  }
}

main()
