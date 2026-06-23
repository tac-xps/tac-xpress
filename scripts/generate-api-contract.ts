import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// @ts-expect-error TypeScript doesn't like .ts extensions in imports
import * as cargoData from "../mocks/cargo-data.ts"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const contractsDir = path.join(__dirname, "../contracts")

if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir, { recursive: true })
}

// Simple runtime inference engine
function inferZodType(val: any): string {
  if (typeof val === "string") return "z.string()"
  if (typeof val === "number") return "z.number()"
  if (typeof val === "boolean") return "z.boolean()"
  if (val instanceof Date) return "z.date()"
  if (Array.isArray(val)) {
    if (val.length > 0) return `z.array(${inferZodType(val[0])})`
    return "z.array(z.any())"
  }
  if (typeof val === "object" && val !== null) {
    const props = Object.entries(val)
      .map(([k, v]) => `  ${k}: ${inferZodType(v)}`)
      .join(",\n")
    return `z.object({\n${props}\n})`
  }
  return "z.any()"
}

function inferOpenApiType(val: any): any {
  if (typeof val === "string") return { type: "string", example: val }
  if (typeof val === "number") return { type: "number", example: val }
  if (typeof val === "boolean") return { type: "boolean", example: val }
  if (val instanceof Date)
    return { type: "string", format: "date-time", example: val.toISOString() }
  if (Array.isArray(val)) {
    return {
      type: "array",
      items: val.length > 0 ? inferOpenApiType(val[0]) : {},
    }
  }
  if (typeof val === "object" && val !== null) {
    const properties: any = {}
    for (const [k, v] of Object.entries(val)) {
      properties[k] = inferOpenApiType(v)
    }
    return { type: "object", properties }
  }
  return {}
}

let zodExports = `import { z } from 'zod';\n\n`
let typeExports = `import { z } from 'zod';\nimport {\n`
let openApiSchemas: any = {}

const targets = [
  { key: "mockOrganization", name: "Organization" },
  { key: "mockUser", name: "User" },
  { key: "mockShipment", name: "Shipment" },
  { key: "mockTrackingEvent", name: "TrackingEvent" },
  { key: "mockWarehouse", name: "Warehouse" },
  { key: "mockInventory", name: "Inventory" },
  { key: "mockInvoice", name: "Invoice" },
  { key: "mockManifest", name: "Manifest" },
]

targets.forEach((target) => {
  const data = (cargoData as any)[target.key]
  const zodSchema = inferZodType(data)
  const openApiSchema = inferOpenApiType(data)

  zodExports += `export const ${target.name}Schema = ${zodSchema};\n\n`
  typeExports += `  ${target.name}Schema,\n`
  openApiSchemas[target.name] = openApiSchema
})

typeExports += `} from './cargo-zod';\n\n`
targets.forEach((target) => {
  typeExports += `export type Cargo${target.name} = z.infer<typeof ${target.name}Schema>;\n`
})

const zodFile = zodExports
const typesFile = typeExports

const routerFile = `import { z } from 'zod';\nimport { ShipmentSchema } from './cargo-zod';\n\n// This is a stubbed tRPC router\nexport const cargoRouter = {\n  getShipments: {\n    input: z.object({ limit: z.number().optional() }),\n    output: z.array(ShipmentSchema),\n    resolve: async () => {\n      // Implementation goes here\n      return [];\n    }\n  }\n};\n`

const openApiFile = {
  openapi: "3.0.0",
  info: {
    title: "Cargo API",
    version: "1.0.0",
    description: "Generated from mocks/cargo-data.ts",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "https://api.tac-xpress.com/v1",
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/shipments": {
      get: {
        summary: "Get active shipments",
        operationId: "getShipments",
        responses: {
          "200": {
            description: "A list of shipments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Shipment",
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: openApiSchemas,
  },
}

fs.writeFileSync(path.join(contractsDir, "cargo-zod.ts"), zodFile)
fs.writeFileSync(path.join(contractsDir, "cargo-types.ts"), typesFile)
fs.writeFileSync(path.join(contractsDir, "cargo-router.ts"), routerFile)
fs.writeFileSync(
  path.join(contractsDir, "cargo-api.json"),
  JSON.stringify(openApiFile, null, 2)
)

console.log("Contracts generated successfully in /contracts")
