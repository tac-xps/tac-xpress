import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// db/index.ts
// Connection limit workaround for serverless environments
// SUPABASE_POOLER_URL uses PgBouncer to prevent connection exhaustion at scale
const poolerUrl = process.env.SUPABASE_POOLER_URL
const dbUrl = process.env.DATABASE_URL

const isValid = (url?: string) => url && !url.includes("fill-in")

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
  // eslint-disable-next-line no-var
  var _postgresClient: postgres.Sql | undefined
}

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
    postgres(connectionString, {
      prepare: false,
      ssl: isLocalhost ? false : "require",
    })

  if (process.env.NODE_ENV !== "production") {
    globalThis._postgresClient = client
  }

  return drizzle(client, { schema })
}

export const db = createDb()
