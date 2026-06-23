import postgres from "postgres"
import { writeFileSync } from "fs"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function syncSchema() {
  const connectionString = process.env.DATABASE_URL!
  const sql = postgres(connectionString, { max: 1 })

  try {
    console.log("Fetching schema from information_schema...")
    const columns = await sql`
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `

    console.log("Fetching enum values...")
    const enums = await sql`
      SELECT t.typname as enum_name, array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
      FROM pg_type t 
      JOIN pg_enum e on t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname;
    `

    const types = generateTypes(Array.from(columns), Array.from(enums))
    writeFileSync("types/db-aligned.ts", types)

    console.log(
      "✅ Schema synced. Review types/db-aligned.ts before replacing."
    )
  } catch (error) {
    console.error("Schema pull failed:", error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

function generateTypes(columns: any[], enums: any[]): string {
  const tables = columns.reduce(
    (acc, col) => {
      acc[col.table_name] = acc[col.table_name] || []
      acc[col.table_name].push(col)
      return acc
    },
    {} as Record<string, any[]>
  )

  return `// AUTO-GENERATED. DO NOT EDIT MANUALLY.
// Generated at: ${new Date().toISOString()}
// Source: public schema information_schema.columns

${Object.entries(tables)
  .map(
    ([tableName, cols]) => `
export interface ${pascalCase(tableName)} {
${(cols as any[]).map((c: any) => `  ${c.column_name}${c.is_nullable === "YES" ? "?" : ""}: ${mapPgType(c.data_type, enums)}`).join("\n")}
}`
  )
  .join("\n\n")}

// KNOWN ENUMS
${enums.map((e: any) => `export type ${pascalCase(e.enum_name)} = ${e.values.map((v: string) => `'${v}'`).join(" | ")}`).join("\n")}
`
}

function mapPgType(pgType: string, enums: any[]): string {
  const mapping: Record<string, string> = {
    uuid: "string",
    text: "string",
    "character varying": "string",
    integer: "number",
    bigint: "number",
    boolean: "boolean",
    "timestamp with time zone": "string",
    "timestamp without time zone": "string",
    date: "string",
    json: "Record<string, any>",
    jsonb: "Record<string, any>",
    ARRAY: "string[]",
    "USER-DEFINED": "string",
  }

  // If it's USER-DEFINED, it might be an enum. We can map it strictly if we know the enum names.
  return mapping[pgType] || "any"
}

function pascalCase(str: string): string {
  return str.replace(/(^|_)(\w)/g, (_, __, letter) => letter.toUpperCase())
}

syncSchema()
