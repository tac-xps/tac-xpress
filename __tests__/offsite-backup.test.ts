import { createHash } from "node:crypto"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve, sep } from "node:path"
import { afterEach, expect, it } from "vitest"
import {
  backupSettings,
  vaultSettings,
  verifyRecoveredFiles,
} from "../scripts/offsite-backup"

const temporary: string[] = []
afterEach(async () => {
  for (const root of temporary.splice(0)) {
    if (
      !resolve(root).startsWith(resolve(tmpdir()) + sep) ||
      !root.includes("tac-backup-test-")
    )
      throw new Error("Unexpected temporary cleanup path")
    await rm(root, { recursive: true, force: true })
  }
})

const settings = () => ({
  NEXT_PUBLIC_SUPABASE_URL: "https://ujyellrhwhqjmfponhuz.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "fixture-service-role-key",
  BACKUP_DATABASE_URL:
    "postgresql://postgres.ujyellrhwhqjmfponhuz:fixture@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
  S3_ENDPOINT: `https://${"a".repeat(32)}.r2.cloudflarestorage.com`,
  S3_ACCESS_KEY_ID: "b".repeat(32),
  S3_SECRET_ACCESS_KEY: "c".repeat(64),
  S3_BUCKET_NAME: "tac-xpress-vault",
  S3_REGION: "auto",
  BACKUP_ROOT: resolve(tmpdir(), "tac-xpress-dr"),
  BACKUP_PASSWORD_FILE: resolve(tmpdir(), "separate-key", "backup.password"),
  BACKUP_REPOSITORY_ID: "d".repeat(64),
  RESTIC_BIN: resolve(tmpdir(), "restic"),
  RESTIC_SHA256: "e".repeat(64),
  PG_BIN: resolve(tmpdir(), "postgres-bin"),
  PG_DUMP_SHA256: "f".repeat(64),
})

it("pins backup source, vault, session port and a separate password location", () => {
  expect(backupSettings(settings()).S3_BUCKET_NAME).toBe("tac-xpress-vault")
  for (const change of [
    { NEXT_PUBLIC_SUPABASE_URL: "https://unrelated.supabase.co" },
    { S3_ENDPOINT: "http://untrusted.invalid" },
    { S3_ENDPOINT: `${settings().S3_ENDPOINT}/?credential=fixture` },
    { S3_BUCKET_NAME: "unrelated-bucket" },
    {
      BACKUP_DATABASE_URL: settings().BACKUP_DATABASE_URL.replace(
        ":5432/",
        ":6543/"
      ),
    },
    { BACKUP_PASSWORD_FILE: join(settings().BACKUP_ROOT, "backup.password") },
    { RESTIC_SHA256: "invalid" },
  ])
    expect(() => backupSettings({ ...settings(), ...change })).toThrow()
})

it("permits offsite recovery without production credentials or a database connection", () => {
  const recoveryOnly = Object.fromEntries(
    Object.entries(settings()).filter(
      ([name]) => !/SUPABASE|DATABASE|PG_/.test(name)
    )
  )
  expect(vaultSettings(recoveryOnly).BACKUP_REPOSITORY_ID).toBe("d".repeat(64))
  expect(() => backupSettings(recoveryOnly)).toThrow()
})

async function recoveryFixture() {
  const root = await mkdtemp(join(tmpdir(), "tac-backup-test-"))
  temporary.push(root)
  const files = []
  for (const name of ["database.dump", "database-metadata.json"]) {
    const bytes = Buffer.from(`fixture ${name}`)
    await writeFile(join(root, name), bytes)
    files.push({
      path: name,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    })
  }
  const manifest = {
    sourceProject: "ujyellrhwhqjmfponhuz",
    sourceSnapshotAt: "2026-11-04T00:00:00.000Z",
    tables: 55,
    storageObjects: 0,
    files,
  }
  await writeFile(join(root, "manifest.json"), JSON.stringify(manifest))
  return { root, manifest }
}

it("verifies every recovered database byte against the captured manifest", async () => {
  const { root, manifest } = await recoveryFixture()
  expect(await verifyRecoveredFiles(root)).toEqual(manifest)
  await writeFile(join(root, "database.dump"), "altered data")
  await expect(verifyRecoveredFiles(root)).rejects.toThrow("differs")
})

it.each(["traversal", "duplicate", "wrong-project", "missing-database"])(
  "rejects an unsafe %s recovery manifest",
  async (scenario) => {
    const { root, manifest } = await recoveryFixture()
    if (scenario === "traversal") manifest.files[0].path = "../escape"
    if (scenario === "duplicate") manifest.files.push(manifest.files[0])
    if (scenario === "wrong-project")
      manifest.sourceProject = "unrelated-project"
    if (scenario === "missing-database")
      manifest.files = manifest.files.slice(1)
    await writeFile(join(root, "manifest.json"), JSON.stringify(manifest))
    await expect(verifyRecoveredFiles(root)).rejects.toThrow()
    expect(await readFile(join(root, "database.dump"), "utf8")).toContain(
      "fixture"
    )
  }
)
