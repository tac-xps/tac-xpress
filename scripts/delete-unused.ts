import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

function main() {
  const backlogPath = path.join(process.cwd(), 'P0-BACKLOG.md')
  if (!fs.existsSync(backlogPath)) {
    console.error('P0-BACKLOG.md not found')
    process.exit(1)
  }

  const content = fs.readFileSync(backlogPath, 'utf8')
  // Regex to match markdown table rows: | `components/ui/dropdown-menu.tsx` | 188 |
  const rowRegex = /\| \`([^\`]+)\` \|/g

  let match
  const filesToCheck: string[] = []
  while ((match = rowRegex.exec(content)) !== null) {
    filesToCheck.push(match[1])
  }

  let deletedCount = 0

  for (const relativePath of filesToCheck) {
    const fullPath = path.join(process.cwd(), relativePath)
    if (!fs.existsSync(fullPath)) continue

    // Get the base name without extension for searching imports (e.g. "dropdown-menu" from "components/ui/dropdown-menu.tsx")
    const ext = path.extname(relativePath)
    const baseName = path.basename(relativePath, ext)
    const folderPath = path.dirname(relativePath)
    
    // We will search for the literal string that would import it, e.g. "ui/dropdown-menu" or "components/ui/dropdown-menu"
    const searchPattern = folderPath.replace('components/', '') + '/' + baseName
    
    // Or even simpler: just search for the baseName in all .ts/.tsx files, excluding the file itself
    try {
      // Find all occurrences of the baseName. If it's 0 (other than in the file itself), delete it.
      // We can use ripgrep or git grep. Let's use git grep.
      // git grep -l "baseName"
      const output = execSync(`git grep -l "${baseName}"`, { encoding: 'utf8' }).trim()
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
        fs.unlinkSync(fullPath)
        deletedCount++
      } else {
        console.log(`Skipping used file: ${relativePath} (found in ${matches.length} files)`)
      }
    } catch (e) {
      // git grep throws if no matches found!
      console.log(`Deleting TRULY UNUSED file (no matches): ${relativePath}`)
      fs.unlinkSync(fullPath)
      deletedCount++
    }
  }

  console.log(`Deleted ${deletedCount} unused components safely.`)
}

main()
