import { createRequire } from "node:module"
import { drizzle } from "drizzle-orm/pglite"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

const { auth } = vi.hoisted(() => ({ auth: vi.fn() }))
vi.mock("@/auth", () => ({ auth }))
vi.mock("@/lib/db", () => ({ get db() { return db } }))

const require = createRequire(import.meta.url)
const { PGlite } = createRequire(require.resolve("gbrain"))("@electric-sql/pglite")
const pg = new PGlite()
const db = drizzle(pg)
const { GET } = await import("@/app/api/customers/route")

const staffId = "11111111-1111-4111-8111-111111111111"
const customerId = "22222222-2222-4222-8222-222222222222"
const selectedId = "33333333-3333-4333-8333-333333333333"
const lookup = (query: string) => GET(new Request(`http://localhost/api/customers?${query}`))

beforeAll(async () => {
  await pg.exec(`
    create table users (
      id uuid primary key, role text, deleted_at timestamptz, name text,
      email text, phone text, address text, pin_code text, city text, state text
    );
    insert into users (id, role, name) values
      ('${staffId}', 'staff', 'Synthetic staff'),
      ('${customerId}', 'customer', 'Synthetic A'),
      ('${selectedId}', 'customer', 'Selected B'),
      ('44444444-4444-4444-8444-444444444444', 'customer', 'Synthetic deleted');
    update users set deleted_at = now() where name = 'Synthetic deleted';
  `)
}, 30_000)

afterAll(async () => {
  await pg.close()
})

describe("authorized customer lookup", () => {
  it("uses the live role and rejects revoked, non-staff and anonymous access", async () => {
    auth.mockResolvedValue(null)
    expect((await lookup("query=Synthetic")).status).toBe(401)
    auth.mockResolvedValue({ user: { id: customerId, role: "admin" } })
    expect((await lookup("id=invalid")).status).toBe(403)
    auth.mockResolvedValue({ user: { id: staffId, role: "customer" } })
    await pg.exec(`update users set deleted_at = now() where id = '${staffId}'`)
    try {
      expect((await lookup("query=Synthetic")).status).toBe(403)
    } finally {
      await pg.exec(`update users set deleted_at = null where id = '${staffId}'`)
    }
    expect((await lookup("query=Synthetic")).status).toBe(200)
  })

  it("keeps authorized empty, invalid and selected-customer results distinct", async () => {
    auth.mockResolvedValue({ user: { id: staffId } })
    const empty = await lookup("query=Absent")
    expect(empty.status).toBe(200)
    expect(await empty.json()).toEqual([])
    expect((await lookup("id=invalid")).status).toBe(400)

    const matches = await lookup(`query=Synthetic&id=${selectedId}`)
    expect(matches.headers.get("cache-control")).toBe("private, no-store")
    expect(await matches.json()).toEqual([
      expect.objectContaining({ id: selectedId, name: "Selected B" }),
      expect.objectContaining({ id: customerId, name: "Synthetic A" }),
    ])
  })
})
