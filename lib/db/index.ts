import "server-only"
import { EventEmitter } from "events"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

if (EventEmitter.defaultMaxListeners < 50) {
  EventEmitter.defaultMaxListeners = 50
}

// db/index.ts
// Connection limit workaround for serverless environments
// SUPABASE_POOLER_URL uses PgBouncer to prevent connection exhaustion at scale
const poolerUrl = process.env.SUPABASE_POOLER_URL
const dbUrl = process.env.DATABASE_URL

const isValid = (url?: string) => url && !url.includes("fill-in")

export const isDatabaseConfigured = Boolean(isValid(poolerUrl) || isValid(dbUrl))

const connectionString =
  (isValid(poolerUrl) ? poolerUrl : undefined) ||
  (isValid(dbUrl) ? dbUrl : undefined) ||
  "postgres://dummy:dummy@localhost:5432/dummy"

const isMissingProductionDb =
  process.env.NODE_ENV === "production" &&
  !isValid(poolerUrl) &&
  !isValid(dbUrl)

// Disable prepare as it is not supported for some connection poolers
// SSL is required for Supabase connections but disabled for local/CI Postgres
const isLocalhost =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1")

type DbInstance = PostgresJsDatabase<typeof schema>

declare global {
  var _postgresClient: postgres.Sql | undefined
}

// Serverless runtimes (Vercel, AWS Lambda) connect via Supabase PgBouncer (transaction mode, port 6543).
// Allow up to 6 concurrent sockets per lambda instance so Promise.all can execute in parallel.
const isServerless = Boolean(
  process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.NODE_ENV === "production"
)

function normalizeConnectionString(raw: string): string {
  // If connection points to Supabase pooler on port 5432 (session mode limit: 15),
  // route to port 6543 (transaction mode) which supports high concurrency in serverless.
  if (raw.includes("pooler.supabase.com")) {
    return raw.replace(/(:5432)(\b|\/|\?)/, ":6543$2")
  }
  return raw
}

const resolvedConnectionString = normalizeConnectionString(connectionString)

// Defer the production guard to first actual use so that Storybook/Chromatic
// can import this module without crashing (they never execute queries).
function createDb(): DbInstance {
  if (isMissingProductionDb) {
    return new Proxy({} as DbInstance, {
      get(): never {
        throw new Error(
          "Missing SUPABASE_POOLER_URL or DATABASE_URL for production database access."
        )
      },
    })
  }

  const client =
    globalThis._postgresClient ||
    postgres(resolvedConnectionString, {
      prepare: false,
      ssl: isLocalhost ? false : "require",
      max: isServerless ? 6 : 10,
      // Bound every wait so a stalled database can never hang a request forever.
      // Without these, a connect or query that never returns leaves server
      // components awaiting indefinitely and the page never finishes rendering.
      connect_timeout: 10,
      idle_timeout: isServerless ? 5 : 20,
      // In development (Turbopack HMR), abandoned sockets are never closed by the
      // process. Set max_lifetime=30 so postgres.js recycles them before
      // Supabase PgBouncer's ~15-minute idle-connection timeout expires and
      // blocks every new connection request for minutes.
      max_lifetime: isServerless ? 60 : 30,
      connection: {
        statement_timeout: 30000,
      },
    })

  // Cleanly close the connection pool on process shutdown so that Turbopack
  // HMR restarts do not leave zombie sockets in Supabase PgBouncer.
  if (!isServerless && !globalThis._postgresClient) {
    const cleanup = () => {
      client.end({ timeout: 5 }).catch(() => {})
    }
    process.once("SIGTERM", cleanup)
    process.once("SIGINT", cleanup)
    process.once("beforeExit", cleanup)
  }

  globalThis._postgresClient = client

  return drizzle(client, { schema })
}

export const db = createDb()
