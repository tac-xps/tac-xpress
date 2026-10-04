/**
 * Tac-Xpress Design Token Audit Script
 *
 * Scans application TSX/TS files to prevent token drift and enforce the
 * "Nordic Mineral — Quiet Infrastructure" semantic color contract.
 *
 * Prohibits:
 * - Raw `bg-white` and `text-black` (use `bg-card`, `bg-background`, `text-foreground`, etc.)
 * - Hardcoded Tailwind spectrum classes (e.g. `bg-emerald-500`, `text-blue-600`)
 * - Arbitrary hex utilities (e.g. `bg-[#0f172a]`)
 *
 * Exemptions:
 * - A4 Print and GST Invoice documents (`components/invoice/`, `components/documents/`, `print/route.ts`)
 * - HTML Email templates (`app/actions/email-notifications.ts`)
 * - Sentry SDK demo page (`app/sentry-example-page/`)
 * - Test and story files (`*.test.ts`, `*.test.tsx`, `*.stories.tsx`)
 */

import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const TARGET_DIRS = ["app", "components", "hooks", "lib"]

const EXEMPT_PATTERNS = [
  /components[\\/]invoice[\\/]/,
  /components[\\/]documents[\\/]/,
  /app[\\/]actions[\\/]email-notifications\.ts/,
  /app[\\/]api[\\/]manifests[\\/].*[\\/]print[\\/]route\.ts/,
  /app[\\/]sentry-example-page[\\/]/,
  /\.test\.(ts|tsx)$/,
  /\.stories\.(ts|tsx)$/,
]

const FORBIDDEN_PATTERNS: { name: string; regex: RegExp }[] = [
  {
    name: "Raw white / black class",
    // Allows print:bg-white and print:text-black for physical paper media
    regex: /(?<!print:)\b(bg-white|text-black)\b/g,
  },
  {
    name: "Tailwind spectrum color class",
    regex: /\b(bg|text|border|ring|fill|stroke)-(red|blue|green|amber|emerald|slate|gray|zinc|neutral|stone|orange|yellow|lime|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
  },
  {
    name: "Arbitrary hex color utility",
    regex: /\b(bg|text|border|ring|fill|stroke)-\[#(?:[0-9a-fA-F]{3,8})\]/g,
  },
]

interface Violation {
  file: string
  line: number
  rule: string
  match: string
}

function scanDir(dir: string, fileList: string[] = []): string[] {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      scanDir(fullPath, fileList)
    } else if (/\.(tsx|ts)$/.test(entry)) {
      fileList.push(fullPath)
    }
  }
  return fileList
}

function runAudit(): void {
  console.log("🔍 Scanning Tac-Xpress codebase for design token drift...")

  const filesToScan: string[] = []
  for (const dir of TARGET_DIRS) {
    try {
      scanDir(dir, filesToScan)
    } catch {
      // directory might not exist
    }
  }

  const violations: Violation[] = []

  for (const filePath of filesToScan) {
    const relPath = relative(process.cwd(), filePath)
    const isExempt = EXEMPT_PATTERNS.some((p) => p.test(relPath))
    if (isExempt) continue

    const content = readFileSync(filePath, "utf-8")
    const lines = content.split("\n")

    lines.forEach((line, idx) => {
      // Skip pure comments
      const trimmed = line.trim()
      if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
        return
      }

      for (const { name, regex } of FORBIDDEN_PATTERNS) {
        // Reset regex state
        regex.lastIndex = 0
        let match: RegExpExecArray | null
        while ((match = regex.exec(line)) !== null) {
          violations.push({
            file: relPath,
            line: idx + 1,
            rule: name,
            match: match[0],
          })
        }
      }
    })
  }

  if (violations.length > 0) {
    console.error(`\n❌ Found ${violations.length} design token violation(s):\n`)
    for (const v of violations) {
      console.error(`  ${v.file}:${v.line} - [${v.rule}] "${v.match}"`)
    }
    console.error("\n💡 Replace spectrum/raw classes with semantic Nordic Mineral tokens:")
    console.error("   e.g. `bg-card`, `bg-background`, `text-primary-foreground`, `text-status-transit`, `text-success`\n")
    process.exit(1)
  }

  console.log("✅ 0 design token violations found. Nordic Mineral Quiet Infrastructure compliance verified.\n")
}

runAudit()
