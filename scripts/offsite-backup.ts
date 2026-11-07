import { createHash, randomBytes } from "node:crypto"
import { execFileSync } from "node:child_process"
import { appendFileSync, createReadStream, constants } from "node:fs"
import * as fs from "node:fs/promises"
import { get } from "node:https"
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path"
import { pathToFileURL } from "node:url"
import { parse } from "dotenv"
import postgres from "postgres"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const SOURCE = "ujyellrhwhqjmfponhuz"
const MAX_CAPTURE_BYTES = 2 * 1024 ** 3
const digest = (value: Buffer) =>
  createHash("sha256").update(value).digest("hex")
const hex = z.string().regex(/^[a-f0-9]{64}$/)
const fileSchema = z.object({
  path: z
    .string()
    .regex(
      /^(?:database\.dump|database-metadata\.json|storage-metadata\.json|auth-settings\.json|application\.env|baseline\.sql|storage\/[a-f0-9]{64}\.bin)$/
    ),
  bytes: z.number().int().nonnegative(),
  sha256: hex,
})
const manifestSchema = z.object({
  sourceProject: z.literal(SOURCE),
  sourceSnapshotAt: z.string().datetime(),
  tables: z.number().int().positive(),
  storageObjects: z.number().int().nonnegative(),
  files: z.array(fileSchema).min(1).max(10_000),
})

export function vaultSettings(environment: Record<string, string | undefined>) {
  const settings = z
    .object({
      S3_ENDPOINT: z.string().url(),
      S3_ACCESS_KEY_ID: z.string().regex(/^[a-f0-9]{32}$/i),
      S3_SECRET_ACCESS_KEY: z.string().regex(/^[a-f0-9]{64}$/i),
      S3_BUCKET_NAME: z.literal("tac-xpress-vault"),
      S3_REGION: z.literal("auto"),
      BACKUP_ROOT: z.string().min(1),
      BACKUP_PASSWORD_FILE: z.string().min(1),
      BACKUP_REPOSITORY_ID: hex,
      RESTIC_BIN: z.string().min(1),
      RESTIC_SHA256: hex,
    })
    .parse(environment)
  const endpoint = new URL(settings.S3_ENDPOINT)
  if (
    endpoint.protocol !== "https:" ||
    !/^[a-f0-9]{32}\.r2\.cloudflarestorage\.com$/.test(endpoint.hostname) ||
    endpoint.pathname !== "/" ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash
  )
    throw new Error("The backup endpoint is invalid")
  if (
    ![
      settings.BACKUP_ROOT,
      settings.BACKUP_PASSWORD_FILE,
      settings.RESTIC_BIN,
    ].every(isAbsolute) ||
    basename(settings.BACKUP_ROOT) !== "tac-xpress-dr"
  )
    throw new Error("Dedicated absolute backup paths are required")
  const keyRelative = relative(
    settings.BACKUP_ROOT,
    settings.BACKUP_PASSWORD_FILE
  )
  if (!keyRelative.startsWith(`..${sep}`) && !isAbsolute(keyRelative))
    throw new Error("Keep the encryption password outside the backup directory")
  return settings
}

export function backupSettings(
  environment: Record<string, string | undefined>
) {
  const settings = {
    ...vaultSettings(environment),
    ...z
      .object({
        NEXT_PUBLIC_SUPABASE_URL: z.literal(`https://${SOURCE}.supabase.co`),
        SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
        BACKUP_DATABASE_URL: z.string().url(),
        PG_BIN: z.string().min(1),
        PG_DUMP_SHA256: hex,
      })
      .parse(environment),
  }
  const database = new URL(settings.BACKUP_DATABASE_URL)
  if (
    !["postgres:", "postgresql:"].includes(database.protocol) ||
    database.hostname !== "aws-1-ap-southeast-2.pooler.supabase.com" ||
    decodeURIComponent(database.username) !== `postgres.${SOURCE}` ||
    database.port !== "5432" ||
    !database.password ||
    database.pathname !== "/postgres" ||
    !isAbsolute(settings.PG_BIN)
  )
    throw new Error(
      "The backup connection must identify production session pooling"
    )
  return settings
}

function program(
  name: string,
  arguments_: string[],
  directory: string,
  environment = process.env
) {
  try {
    return execFileSync(name, arguments_, {
      env: environment,
      encoding: "utf8",
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 1_800_000,
      maxBuffer: 16 * 1024 ** 2,
    })
  } catch (error) {
    appendFileSync(join(directory, "command.private.log"), String(error), {
      mode: 0o600,
    })
    throw new Error(
      "A local backup command failed; inspect private diagnostics"
    )
  }
}

function resticEnvironment(settings: ReturnType<typeof vaultSettings>) {
  const system = Object.fromEntries(
    Object.entries(process.env).filter(([name]) =>
      /^(SYSTEMROOT|WINDIR|COMSPEC|PATH|PATHEXT|TEMP|TMP|LOCALAPPDATA|APPDATA|USERPROFILE)$/i.test(
        name
      )
    )
  )
  return {
    ...system,
    RESTIC_REPOSITORY: `s3:${new URL(settings.S3_ENDPOINT).origin}/tac-xpress-vault/tac-xpress-dr/${SOURCE}/restic-v1`,
    RESTIC_PASSWORD_FILE: settings.BACKUP_PASSWORD_FILE,
    RESTIC_CACHE_DIR: join(settings.BACKUP_ROOT, "cache"),
    AWS_ACCESS_KEY_ID: settings.S3_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: settings.S3_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: "auto",
    NODE_ENV: process.env.NODE_ENV || "production",
    GOMAXPROCS: "2",
    GOGC: "25",
    GOMEMLIMIT: "192MiB",
  }
}

async function repository(
  settings: ReturnType<typeof vaultSettings>,
  directory: string
) {
  if ((await hashFile(settings.RESTIC_BIN)) !== settings.RESTIC_SHA256)
    throw new Error("The Restic executable checksum differs")
  const run = (args: string[]) =>
    program(
      settings.RESTIC_BIN,
      ["--json", "--retry-lock", "2m", ...args],
      directory,
      resticEnvironment(settings)
    )
  const configuration = z
    .object({ id: hex })
    .parse(JSON.parse(run(["cat", "config"])))
  if (configuration.id !== settings.BACKUP_REPOSITORY_ID)
    throw new Error(
      "The encrypted repository does not match its configured identity"
    )
  return run
}

export async function verifyRecoveredFiles(root: string) {
  const manifest = manifestSchema.parse(
    JSON.parse(await fs.readFile(join(root, "manifest.json"), "utf8"))
  )
  const canonicalRoot = await fs.realpath(root)
  const paths = new Set<string>()
  for (const file of manifest.files) {
    if (paths.has(file.path))
      throw new Error("The recovery manifest contains duplicate files")
    paths.add(file.path)
    const target = join(root, file.path)
    const info = await fs.lstat(target)
    if (
      !info.isFile() ||
      info.isSymbolicLink() ||
      !(await fs.realpath(target)).startsWith(canonicalRoot + sep) ||
      info.size !== file.bytes ||
      (await hashFile(target)) !== file.sha256
    )
      throw new Error("A recovered file differs from the captured manifest")
  }
  if (!paths.has("database.dump") || !paths.has("database-metadata.json"))
    throw new Error("The recovery manifest omits the database")
  return manifest
}

async function restoredDataRoot(root: string) {
  const pending = [root]
  const manifests: string[] = []
  let entries = 0
  while (pending.length) {
    const current = pending.pop()
    if (!current) break
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      if (++entries > 20_000 || entry.isSymbolicLink())
        throw new Error("Unexpected restored directory structure")
      const path = join(current, entry.name)
      if (entry.isDirectory()) pending.push(path)
      else if (entry.name === "manifest.json") manifests.push(path)
    }
  }
  if (manifests.length !== 1)
    throw new Error("Exactly one recovery manifest is required")
  return dirname(z.string().parse(manifests[0]))
}

async function removeOwnedDirectory(run: string, path: string) {
  const canonical = await fs.realpath(path)
  if (!canonical.startsWith((await fs.realpath(run)) + sep))
    throw new Error("Cleanup path leaves the owned backup run")
  await fs.rm(canonical, { recursive: true })
}

async function runRecovery(snapshot: string) {
  hex.parse(snapshot)
  const operations = parse(await fs.readFile(resolve(".env.backup.local")))
  const credentials = [
    "S3_ENDPOINT",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "S3_BUCKET_NAME",
    "S3_REGION",
  ]
  const source = credentials.every((name) => operations[name])
    ? {}
    : parse(await fs.readFile(resolve(".env.local")))
  const settings = vaultSettings({ ...source, ...operations })
  await secureDirectory(settings.BACKUP_ROOT)
  const target = join(
    settings.BACKUP_ROOT,
    `recovery-${Date.now()}-${randomBytes(6).toString("hex")}`
  )
  await fs.mkdir(target, { mode: 0o700 })
  const restic = await repository(settings, target)
  restic(["restore", snapshot, "--target", target, "--verify"])
  const root = await restoredDataRoot(target)
  const manifest = await verifyRecoveredFiles(root)
  console.info(
    JSON.stringify({
      result: "PASS",
      recoveryDirectory: root,
      snapshotId: snapshot,
      sourceProject: manifest.sourceProject,
      sourceSnapshotAt: manifest.sourceSnapshotAt,
      filesVerified: manifest.files.length,
      databaseTables: manifest.tables,
      storageObjects: manifest.storageObjects,
      productionConnectionRequired: false,
      productionWrites: 0,
    })
  )
}

export async function hashFile(path: string) {
  const hash = createHash("sha256")
  for await (const part of createReadStream(path)) hash.update(part)
  return hash.digest("hex")
}

function authSettings(url: string, serviceKey: string): Promise<unknown> {
  return new Promise((resolveRequest, reject) => {
    const request = get(
      `${url}/auth/v1/settings`,
      { headers: { apikey: serviceKey }, timeout: 20_000 },
      (response) => {
        const pieces: Buffer[] = []
        let bytes = 0
        response.on("data", (piece: Buffer) => {
          bytes += piece.length
          if (bytes > 1_000_000)
            request.destroy(new Error("Auth settings response is too large"))
          else pieces.push(piece)
        })
        response.on("error", reject)
        response.on("end", () => {
          if (response.statusCode !== 200)
            return reject(new Error("Auth settings could not be read"))
          try {
            resolveRequest(JSON.parse(Buffer.concat(pieces).toString("utf8")))
          } catch {
            reject(new Error("Invalid Auth settings response"))
          }
        })
      }
    )
    request.on("timeout", () =>
      request.destroy(new Error("Auth settings request timed out"))
    )
    request.on("error", reject)
  })
}

async function secureDirectory(path: string) {
  await fs.mkdir(path, { recursive: true, mode: 0o700 })
  if ((await fs.lstat(path)).isSymbolicLink())
    throw new Error("Backup directories cannot be links")
  const insideRepo = relative(process.cwd(), await fs.realpath(path))
  if (!insideRepo.startsWith(`..${sep}`) && !isAbsolute(insideRepo))
    throw new Error("Keep backup contents outside the repository")
  if (process.platform === "win32") {
    const identity = execFileSync("whoami", ["/user", "/fo", "csv", "/nh"], {
      encoding: "utf8",
      windowsHide: true,
    })
    const sid = identity.match(/"(S-1-5-[0-9-]+)"/)?.[1]
    if (!sid) throw new Error("The backup owner could not be verified")
    execFileSync(
      "icacls",
      [
        path,
        "/inheritance:r",
        "/grant:r",
        `*${sid}:(OI)(CI)F`,
        "*S-1-5-18:(OI)(CI)F",
      ],
      { stdio: "ignore", windowsHide: true }
    )
  }
}

async function runBackup() {
  const sourceConfiguration = await fs.readFile(resolve(".env.local"))
  const profile = parse(sourceConfiguration)
  const settings = backupSettings({
    ...profile,
    ...parse(await fs.readFile(resolve(".env.backup.local"))),
  })
  await secureDirectory(settings.BACKUP_ROOT)
  const password = (
    await fs.readFile(settings.BACKUP_PASSWORD_FILE, "utf8")
  ).trim()
  if (
    password.length < 32 ||
    sourceConfiguration.includes(Buffer.from(password))
  )
    throw new Error(
      "Keep a strong backup password outside application configuration"
    )
  const started = new Date()
  const backupId = `${started.toISOString().replace(/[-:.]/g, "")}-${randomBytes(8).toString("hex")}`
  const run = join(settings.BACKUP_ROOT, backupId)
  const capture = join(run, "capture")
  await fs.mkdir(join(capture, "storage"), { recursive: true, mode: 0o700 })
  const local = (name: string, args: string[], environment = process.env) =>
    program(name, args, run, environment)
  const pgDump = join(
    settings.PG_BIN,
    process.platform === "win32" ? "pg_dump.exe" : "pg_dump"
  )
  if (
    (await hashFile(pgDump)) !== settings.PG_DUMP_SHA256 ||
    !/\b17\./.test(local(pgDump, ["--version"]))
  )
    throw new Error("Verified PostgreSQL 17 tools are required")
  const restic = await repository(settings, run)
  const sourceUrl = new URL(settings.BACKUP_DATABASE_URL)
  const source = postgres(settings.BACKUP_DATABASE_URL, {
    ssl: "require",
    max: 1,
    prepare: false,
    connect_timeout: 10,
    connection: { statement_timeout: 30_000 },
  })
  const storage = createClient(
    settings.NEXT_PUBLIC_SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  ).storage
  const writeJson = (name: string, data: unknown) =>
    fs.writeFile(join(capture, name), JSON.stringify(data, null, 2), {
      mode: 0o600,
      flag: "wx",
    })
  let phase = "capture"
  try {
    let snapshotAt = ""
    let tableCount = 0
    await source.begin(
      "isolation level repeatable read read only",
      async (tx) => {
        await tx`set local time zone 'UTC'`
        const [snapshot] =
          await tx`select pg_export_snapshot() as id, now() as captured_at`
        snapshotAt = z.date().parse(snapshot.captured_at).toISOString()
        const tables =
          await tx`select schemaname,tablename from pg_tables where schemaname in ('public','auth') order by schemaname,tablename`
        const fingerprints = []
        for (const table of tables) {
          const schema = z.enum(["public", "auth"]).parse(table.schemaname)
          const name = z
            .string()
            .regex(/^[a-z_]+$/)
            .parse(table.tablename)
          const [fingerprint] = await tx.unsafe(
            `select count(*)::text as count, md5(coalesce(string_agg(md5(to_jsonb(t)::text),'' order by md5(to_jsonb(t)::text)),'')) as checksum from ${schema}.${name} t`
          )
          fingerprints.push({ schema, table: name, ...fingerprint })
        }
        tableCount = tables.length
        const roles =
          await tx`select rolname,rolbypassrls,rolinherit,rolcanlogin from pg_roles where rolname not like 'pg_%' order by rolname`
        const triggers =
          await tx`select e.evtname,e.evtevent,e.evttags,e.evtenabled,n.nspname as function_schema,p.proname as function_name from pg_event_trigger e join pg_proc p on p.oid=e.evtfoid join pg_namespace n on n.oid=p.pronamespace`
        const ledger =
          await tx`select version,name,statements from supabase_migrations.schema_migrations order by version`
        local(
          pgDump,
          [
            "--format=custom",
            "--schema=public",
            "--schema=auth",
            "--no-owner",
            `--snapshot=${z
              .string()
              .regex(/^[a-f0-9-]+$/i)
              .parse(snapshot.id)}`,
            "--file",
            join(capture, "database.dump"),
          ],
          {
            ...process.env,
            PGHOST: sourceUrl.hostname,
            PGPORT: "5432",
            PGUSER: decodeURIComponent(sourceUrl.username),
            PGPASSWORD: decodeURIComponent(sourceUrl.password),
            PGDATABASE: "postgres",
            PGSSLMODE: "require",
            PGCONNECT_TIMEOUT: "10",
          }
        )
        await writeJson("database-metadata.json", {
          snapshotAt,
          fingerprints,
          roles,
          triggers,
          ledger,
        })
      }
    )
    const objects =
      await source`select id,bucket_id,name,metadata,updated_at from storage.objects order by bucket_id,name`
    const buckets = await storage.listBuckets()
    if (buckets.error)
      throw new Error("Storage bucket metadata could not be read")
    const policies =
      await source`select * from pg_policies where schemaname='storage'`
    const recovered = []
    let totalBytes = (await fs.stat(join(capture, "database.dump"))).size
    for (const object of objects) {
      if (totalBytes + Number(object.metadata?.size || 0) > MAX_CAPTURE_BYTES)
        throw new Error("The backup exceeds the transfer budget")
      const response = await storage
        .from(object.bucket_id)
        .download(object.name)
      if (response.error || !response.data)
        throw new Error("A Storage object could not be read")
      const bytes = Buffer.from(await response.data.arrayBuffer())
      totalBytes += bytes.length
      if (totalBytes > MAX_CAPTURE_BYTES)
        throw new Error("The backup exceeds the transfer budget")
      const file = `storage/${digest(Buffer.from(object.bucket_id + "\0" + object.name))}.bin`
      await fs.writeFile(join(capture, file), bytes, {
        flag: "wx",
        mode: 0o600,
      })
      recovered.push({ ...object, file, sha256: digest(bytes) })
    }
    const after =
      await source`select id,bucket_id,name,metadata,updated_at from storage.objects order by bucket_id,name`
    if (JSON.stringify(objects) !== JSON.stringify(after))
      throw new Error(
        "Storage changed during capture; retry with a fresh snapshot"
      )
    await writeJson("storage-metadata.json", {
      buckets: buckets.data,
      policies,
      objects: recovered,
      atomicWithDatabase: false,
    })
    await writeJson(
      "auth-settings.json",
      await authSettings(
        settings.NEXT_PUBLIC_SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
      )
    )
    await fs.writeFile(join(capture, "application.env"), sourceConfiguration, {
      flag: "wx",
      mode: 0o600,
    })
    await fs.copyFile(
      resolve("supabase/baselines/20261103_current_public.sql"),
      join(capture, "baseline.sql"),
      constants.COPYFILE_EXCL
    )
    const files = []
    for (const path of [
      "database.dump",
      "database-metadata.json",
      "storage-metadata.json",
      "auth-settings.json",
      "application.env",
      "baseline.sql",
      ...recovered.map((object) => object.file),
    ]) {
      files.push({
        path,
        bytes: (await fs.stat(join(capture, path))).size,
        sha256: await hashFile(join(capture, path)),
      })
    }
    const manifest = manifestSchema.parse({
      sourceProject: SOURCE,
      sourceSnapshotAt: snapshotAt,
      tables: tableCount,
      storageObjects: objects.length,
      files,
    })
    await writeJson("manifest.json", manifest)
    phase = "upload"
    const output = restic([
      "backup",
      capture,
      "--host",
      "tac-xpress-production",
      "--tag",
      SOURCE,
      "--tag",
      "production-dr",
    ])
    const summaries = output
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) =>
        z
          .object({ message_type: z.string(), snapshot_id: hex.optional() })
          .passthrough()
          .parse(JSON.parse(line))
      )
      .filter((line) => line.message_type === "summary")
    const snapshotId = hex.parse(summaries.at(-1)?.snapshot_id)
    phase = "verify"
    restic(["check", "--read-data"])
    const restored = join(run, "restored")
    restic(["restore", snapshotId, "--target", restored, "--verify"])
    const recoveredRoot = await restoredDataRoot(restored)
    const recoveredManifest = await verifyRecoveredFiles(recoveredRoot)
    if (JSON.stringify(recoveredManifest) !== JSON.stringify(manifest))
      throw new Error("The offsite manifest differs from its source")
    phase = "retention"
    restic([
      "forget",
      "--host",
      "tac-xpress-production",
      "--tag",
      `${SOURCE},production-dr`,
      "--group-by",
      "host,tags",
      "--keep-daily",
      "7",
      "--keep-weekly",
      "4",
      "--prune",
    ])
    restic(["check"])
    await removeOwnedDirectory(run, capture)
    await removeOwnedDirectory(run, restored)
    const receipt = {
      checkedAt: new Date().toISOString(),
      result: "PASS",
      sourceProject: SOURCE,
      sourceSnapshotAt: snapshotAt,
      vault: settings.S3_BUCKET_NAME,
      repositoryId: settings.BACKUP_REPOSITORY_ID,
      snapshotId,
      encryptedRepository: true,
      passwordIncludedInBackup: false,
      fullRemoteDataCheck: true,
      offsiteRestoreVerified: true,
      recoveredFileChecksumsMatch: true,
      filesVerified: files.length,
      databaseTables: tableCount,
      storageObjects: objects.length,
      applicationConfigurationCaptured: true,
      publicAuthSettingsCaptured: true,
      managedAuthSecretExported: false,
      crossServiceAtomicityClaimed: false,
      dailyPeriodsRetained: 7,
      weeklyPeriodsRetained: 4,
      retentionAppliedAfterVerification: true,
      plaintextCaptureRemoved: true,
      productionWrites: 0,
      providerMessagesSent: false,
      elapsedSeconds: Math.round((Date.now() - started.getTime()) / 10) / 100,
    }
    await fs.writeFile(
      join(run, "receipt.json"),
      JSON.stringify(receipt, null, 2),
      { mode: 0o600 }
    )
    await fs.writeFile(
      join(settings.BACKUP_ROOT, "latest-receipt.json"),
      JSON.stringify(receipt, null, 2),
      { mode: 0o600 }
    )
    console.info(JSON.stringify(receipt))
  } catch (error) {
    await fs.writeFile(join(run, "failure.private.log"), String(error), {
      mode: 0o600,
    })
    if (profile.SENTRY_DSN) {
      try {
        const sentry = await import("@sentry/nextjs")
        sentry.init({ dsn: profile.SENTRY_DSN, sendDefaultPii: false })
        sentry.captureException(new Error("Offsite backup failed"), {
          tags: { area: "offsite_backup", phase },
        })
        await sentry.flush(2000)
      } catch {
        /* Private diagnostics remain available when telemetry cannot start. */
      }
    }
    throw new Error(
      `Offsite backup failed during ${phase}; inspect the dedicated private directory`
    )
  } finally {
    await source.end({ timeout: 2 })
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const action = process.argv[2]
  const operation =
    action === "recover"
      ? runRecovery(process.argv[3] || "")
      : action === undefined
        ? runBackup()
        : Promise.reject(new Error("Unknown backup action"))
  operation.catch(() => {
    console.error(
      "Offsite operation failed. Inspect private backup diagnostics; no configuration values were printed."
    )
    process.exitCode = 1
  })
}
