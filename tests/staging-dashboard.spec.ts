import { test, expect, type Page } from "@playwright/test"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"
import dotenv from "dotenv"
import postgres from "postgres"
import AxeBuilder from "@axe-core/playwright"
import { PDFDocument } from "pdf-lib"

const enabled = process.env.RUN_STAGING_ACCEPTANCE === "true"
const baseURL = process.env.PLAYWRIGHT_BASE_URL
const previewOrigin = process.env.STAGING_PREVIEW_ORIGIN
const previewAllowed = Boolean(
  previewOrigin &&
  baseURL === previewOrigin &&
  /^https:\/\/tac-xpress-[a-z0-9]+-tac-xps\.vercel\.app$/.test(previewOrigin)
)
test.skip(!enabled, "Enable explicitly for the isolated staging application")

const profile = enabled
  ? dotenv.parse(readFileSync(resolve(".env.staging.local"), "utf8"))
  : {}
const credentials = enabled
  ? dotenv.parse(readFileSync(resolve(".env.staging.auth.local"), "utf8"))
  : {}

// These write checks must never reach the production application or database.
if (enabled) {
  let connection: URL
  try {
    connection = new URL(profile.SUPABASE_POOLER_URL || profile.DATABASE_URL)
  } catch {
    throw new Error("The staging database URL is invalid")
  }
  if (
    (baseURL !== "http://localhost:3001" && !previewAllowed) ||
    profile.STAGING_SUPABASE_REF !== "zuevgwqmphbvgnwhvvnq" ||
    profile.NEXT_PUBLIC_SUPABASE_URL !==
      "https://zuevgwqmphbvgnwhvvnq.supabase.co" ||
    connection.hostname !== "aws-0-ap-southeast-2.pooler.supabase.com" ||
    decodeURIComponent(connection.username) !==
      "postgres.zuevgwqmphbvgnwhvvnq" ||
    profile.WHATSAPP_ENABLED !== "false" ||
    (profile.CRON_SECRET?.length ?? 0) < 32 ||
    profile.RESEND_API_KEY ||
    profile.WPBOX_API_TOKEN
  )
    throw new Error("Staging acceptance target or outbound isolation is unsafe")
}

test.describe.configure({ mode: "serial" })
test.setTimeout(120_000)
test.use({
  trace: "off",
  video: "off",
  actionTimeout: 15_000,
  storageState: previewAllowed
    ? process.env.STAGING_PREVIEW_STORAGE_STATE
    : undefined,
})

test.afterEach(async () => {
  if (previewAllowed)
    await new Promise((resolve) => setTimeout(resolve, 15_000))
})

test.beforeAll(async ({ request }) => {
  if (!enabled || !previewAllowed) return
  const response = await request
    .get("/api/health", {
      headers: { Authorization: `Bearer ${profile.CRON_SECRET}` },
    })
    .catch(() => {
      throw new Error("The isolated deployment health probe failed")
    })
  expect([200, 503]).toContain(response.status())
  const health = await response.json()
  expect(health.services.database).toMatchObject({ status: "up" })
  expect(health.services.whatsapp).toMatchObject({
    enabled: false,
    status: "unconfigured",
  })
  expect(health.services.resend).toMatchObject({ status: "unconfigured" })
  expect(health.services.openrouter).toMatchObject({ status: "unconfigured" })
})

async function login(page: Page, role: string) {
  if (!["admin", "staff", "customer"].includes(role)) {
    throw new Error("Unexpected staging test role")
  }
  const email = credentials[`STAGING_${role.toUpperCase()}_EMAIL`]
  const password = credentials[`STAGING_${role.toUpperCase()}_PASSWORD`]
  if (email !== `qa-${role}@tac-xpress.invalid` || !password) {
    throw new Error("Synthetic staging credentials are missing")
  }
  await page.goto("/signin")
  await page.getByLabel("Email address", { exact: true }).fill(email)
  try {
    await page.getByLabel("Password", { exact: true }).fill(password)
  } catch {
    throw new Error("Could not enter the synthetic staging password")
  }
  await page
    .getByRole("button", { name: "Sign in to workspace", exact: true })
    .click()
}

test("admin loads every requested operations route", async ({ page }) => {
  test.setTimeout(600_000)
  const errors: string[] = []
  let protectedRequests = 0
  page.on("request", (request) => {
    const url = new URL(request.url())
    if (
      /^\/(?:dashboard|driver|api)\//.test(url.pathname) &&
      !url.pathname.startsWith("/api/auth/")
    )
      protectedRequests++
  })
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (/ClientSessionError|ClientFetchError/.test(message.text()))
      errors.push(message.text())
  })
  await login(page, "admin")
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
  const session = await page.request.get("/api/auth/session")
  expect(session.status()).toBe(200)
  expect(await session.json()).toMatchObject({
    user: { role: "admin", email: credentials.STAGING_ADMIN_EMAIL },
  })
  for (const route of [
    "/dashboard",
    "/dashboard/shipments",
    "/dashboard/dispatch",
    "/dashboard/manifests",
    "/dashboard/warehouse",
    "/driver/delivery",
    "/dashboard/tracking",
    "/dashboard/fleet",
    "/dashboard/hubs",
    "/dashboard/operations/air-cargo",
    "/dashboard/operations/surface-cargo",
    "/dashboard/invoices",
    "/dashboard/customers",
    "/dashboard/staff",
    "/dashboard/pricing",
    "/dashboard/messages",
    "/dashboard/feedback",
    "/dashboard/communications",
    "/dashboard/analytics",
    "/dashboard/metrics",
    "/dashboard/warehouse/audit",
    "/dashboard/integrations",
    "/dashboard/jobs",
    "/dashboard/settings/security",
  ]) {
    const response = await page.goto(route, {
      timeout: 60_000,
      waitUntil: "domcontentloaded",
    })
    expect(response?.status(), route).toBeLessThan(400)
    await expect(page).toHaveURL(
      new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$")
    )
    await expect(page.locator("main"), route).toHaveCount(1, {
      timeout: 30_000,
    })
    await expect(page.locator("main"), route).toBeVisible()
    await expect(page.locator("main")).not.toContainText("Something went wrong")
    expect(errors, route).toEqual([])
    await test.info().attach("route-workload", {
      body: JSON.stringify({ route, protectedRequests }),
      contentType: "application/json",
    })
    // Pace the sweep below the live request budget without weakening protection.
    await page.waitForTimeout(10_000)
  }
  await page.screenshot({
    path: `${process.env.AUDIT_EVIDENCE_DIR || "test-results/staging"}/staging-admin-security.png`,
    fullPage: true,
  })
})

test("customer credentials cannot obtain a workspace session", async ({
  page,
}) => {
  await login(page, "customer")
  await expect(
    page.getByText("Staff workspace access not provisioned for this account.", {
      exact: true,
    })
  ).toBeVisible({ timeout: 30_000 })
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/signin/)
  expect(
    (await page.request.get("/api/customers?query=Staging")).status()
  ).toBe(401)
})

test("staff can work but cannot open administration", async ({ page }) => {
  await login(page, "staff")
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
  expect(
    (await page.request.get("/api/customers?query=Staging")).status()
  ).toBe(200)
  await page.goto("/dashboard/staff")
  await expect(page).toHaveURL(/\/signin\?reason=staff-only$/, {
    timeout: 20_000,
  })
})

test("revoked staff lose API and page access with an existing cookie", async ({
  page,
}) => {
  const sql = postgres(profile.SUPABASE_POOLER_URL || profile.DATABASE_URL, {
    ssl: "require",
    max: 1,
    prepare: false,
    connect_timeout: 10,
  })
  const email = credentials.STAGING_STAFF_EMAIL
  await login(page, "staff")
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
  try {
    const revoked = await sql`
      update public.users set deleted_at=now()
      where email=${email} and role='staff' and deleted_at is null returning id
    `
    expect(revoked).toHaveLength(1)
    expect(
      (await page.request.get("/api/customers?query=Staging")).status()
    ).toBe(403)
    for (const route of ["/dashboard", "/driver/delivery"]) {
      await page.goto(route, { timeout: 20_000 })
      await expect(page).toHaveURL(/\/signin/)
      await expect(
        page.getByRole("heading", { name: "Staff sign in" })
      ).toBeVisible()
    }
  } finally {
    await sql`update public.users set deleted_at=null where email=${email} and role='staff'`
    await sql.end({ timeout: 2 })
  }
})

test("invoice wizard commits exact totals and a private document", async ({
  page,
  browser,
}) => {
  test.setTimeout(180_000)
  const marker = `TAC-STG-BILL-${Date.now()}`
  const sql = postgres(profile.SUPABASE_POOLER_URL || profile.DATABASE_URL, {
    ssl: "require",
    max: 1,
    prepare: false,
    connect_timeout: 10,
  })
  try {
    await login(page, "admin")
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
    await page.goto("/dashboard/invoices/create", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    })
    for (const [label, city] of [
      ["Origin City", "New Delhi"],
      ["Destination City", "Imphal"],
    ]) {
      await page.getByRole("combobox", { name: new RegExp(label) }).click()
      await page
        .locator('[data-slot="popover-content"][data-state="open"]')
        .getByRole("option", { name: new RegExp(city) })
        .click()
    }
    await page.getByRole("button", { name: "Next", exact: true }).click()
    await page.getByRole("combobox", { name: /^Consignor/ }).click()
    await page
      .getByPlaceholder("Find a customer", { exact: true })
      .fill(credentials.STAGING_CUSTOMER_EMAIL)
    await expect(
      page.getByRole("option", { name: /Staging QA customer/ })
    ).toHaveCount(1, { timeout: 15_000 })
    await page.getByRole("option", { name: /Staging QA customer/ }).click()
    await page.getByLabel("Phone", { exact: false }).first().fill("9990000001")
    await page.getByRole("button", { name: "Next", exact: true }).click()
    await page.getByRole("combobox", { name: /^Consignee/ }).click()
    await page
      .getByPlaceholder("Find a customer", { exact: true })
      .fill(credentials.STAGING_CUSTOMER_EMAIL)
    await expect(
      page.getByRole("option", { name: /Staging QA customer/ })
    ).toHaveCount(1, { timeout: 15_000 })
    await page.getByRole("option", { name: /Staging QA customer/ }).click()
    await page.getByLabel("Phone", { exact: false }).first().fill("9990000002")
    await page
      .getByLabel(/^Address/)
      .fill("Synthetic acceptance fixture, Imphal")
    await page.getByLabel(/^PIN Code/).fill("795001")
    await page.getByRole("button", { name: "Next", exact: true }).click()
    await expect(page.getByRole("group", { name: "Carton Presets" })).toBeVisible()
    await page.getByLabel(/Content Description/).fill(marker)
    await page.getByLabel("Weight (Kg)", { exact: true }).fill("2")
    await page.getByRole("button", { name: "Next", exact: true }).click()
    await page.getByLabel("Freight Rate (per kg)", { exact: true }).fill("100")
    await expect(
      page.getByLabel("Freight Charge", { exact: true })
    ).toHaveValue("200")
    await page
      .getByRole("combobox", { name: "GST Rate (%)", exact: true })
      .click()
    await page.getByRole("option", { name: "18%", exact: true }).click()
    await page.getByLabel("Advance Paid (₹)", { exact: true }).fill("50")
    await page.getByRole("button", { name: "Next", exact: true }).click()
    await page
      .getByRole("checkbox", { name: "Accept Terms & Conditions", exact: true })
      .check()
    await page
      .getByRole("checkbox", {
        name: "Prohibited Items Declaration",
        exact: true,
      })
      .check()
    await page
      .getByRole("button", { name: "Generate Invoice", exact: true })
      .click()
    await expect(
      page.getByRole("heading", {
        name: "Invoice Created Successfully",
        exact: true,
      })
    ).toBeVisible({ timeout: 45_000 })
    const rows = await sql`
      select i.id, i.shipment_id, i.amount, i.subtotal, i.igst, i.cgst, i.sgst,
        i.advance_paid, i.balance_due, s.origin, s.destination,
        i.document_snapshot #>> '{commercial,financials,totalInvoiceValue,paise}' as snapshot_total,
        (select count(*)::int from public.audit_log a where a.entity_id=i.id::text and a.action='invoice.wizard_created') as audits
      from public.invoices i join public.shipments s on s.id=i.shipment_id
      where s.content_description=${marker}
    `
    expect(rows).toHaveLength(1)
    const invoice = rows[0]
    expect(invoice).toMatchObject({
      amount: 23600,
      subtotal: 20000,
      igst: 3600,
      cgst: 0,
      sgst: 0,
      advance_paid: 5000,
      balance_due: 18600,
      origin: "New Delhi",
      destination: "Imphal",
      snapshot_total: "23600",
      audits: 1,
    })
    const document = await page.request.get(`/invoice/${invoice.id}`)
    expect(document.status()).toBe(200)
    expect(await document.text()).toContain(marker)
    const anonymous = await browser.newContext({
      baseURL,
      storageState: previewAllowed
        ? process.env.STAGING_PREVIEW_STORAGE_STATE
        : undefined,
    })
    try {
      const denied = await anonymous.request.get(`/invoice/${invoice.id}`, {
        maxRedirects: 0,
      })
      expect(denied.status()).toBe(307)
      expect(denied.headers().location).toContain("/signin")
    } finally {
      await anonymous.close()
    }
  } finally {
    await sql.end({ timeout: 2 })
  }
})

test("staff workspace supports mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await login(page, "staff")
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
  await expect(
    page.getByRole("heading", { name: "Operations overview" })
  ).toBeVisible()
  await expect(
    page
      .getByRole("region", { name: "All-time operational totals" })
      .locator("dl > div")
      .last()
  ).toHaveCSS("opacity", "1")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze()
  expect(axe.violations).toEqual([])
  await page.getByRole("button", { name: "Toggle Sidebar" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).not.toBeVisible()
  await page.screenshot({
    path: `${process.env.AUDIT_EVIDENCE_DIR || "test-results/staging"}/staging-workspace-320.png`,
    fullPage: true,
  })
})

test("warehouse scan records a private observation and preserves custody", async ({
  page,
}) => {
  const awb = "TAC-STG-DEL-IMF-01"
  const sql = postgres(profile.SUPABASE_POOLER_URL || profile.DATABASE_URL, {
    ssl: "require",
    max: 1,
    prepare: false,
    connect_timeout: 10,
  })
  try {
    const before = await sql`
      select s.id, s.status,
        (select count(*)::int from public.tracking_events e where e.shipment_id=s.id and e.event_type='warehouse_scan') as scans,
        (select count(*)::int from public.audit_log a where a.entity_id=s.id::text and a.action='scanner_warehouse_transition') as audits
      from public.shipments s where s.awb_number=${awb}
    `
    expect(before).toHaveLength(1)
    await login(page, "staff")
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
    await page.goto("/dashboard/warehouse", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    })
    await page
      .getByRole("button", { name: "Scan barcode", exact: true })
      .click()
    const dialog = page.getByRole("dialog")
    await dialog.getByPlaceholder("Awaiting scan input...").fill(awb)
    await dialog
      .getByRole("button", { name: "Process Scan", exact: true })
      .click()
    await expect(
      dialog.getByText(`Processed. Status: ${before[0].status}`, {
        exact: true,
      })
    ).toBeVisible({ timeout: 20_000 })
    const after = await sql`
      select s.status,
        (select count(*)::int from public.tracking_events e where e.shipment_id=s.id and e.event_type='warehouse_scan' and e.is_public=false) as scans,
        (select count(*)::int from public.audit_log a where a.entity_id=s.id::text and a.action='scanner_warehouse_transition') as audits
      from public.shipments s where s.id=${before[0].id}
    `
    expect(after[0]).toMatchObject({
      status: before[0].status,
      scans: before[0].scans + 1,
      audits: before[0].audits + 1,
    })
  } finally {
    await sql.end({ timeout: 2 })
  }
})

test("invoice download returns a private, valid PDF", async ({
  page,
  browser,
}) => {
  const sql = postgres(profile.SUPABASE_POOLER_URL || profile.DATABASE_URL, {
    ssl: "require",
    max: 1,
    prepare: false,
    connect_timeout: 10,
  })
  try {
    const rows = await sql`
      select i.id from public.invoices i join public.shipments s on s.id=i.shipment_id
      where s.content_description like 'TAC-STG-BILL-%' order by i.created_at desc limit 1
    `
    expect(rows).toHaveLength(1)
    await login(page, "admin")
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
    await page.goto(`/invoice/${rows[0].id}`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    })
    const total = page.locator("tr.bg-print-ink")
    await expect(total.locator("td").first()).toHaveCSS(
      "color",
      await total.evaluate((element) => getComputedStyle(element).color)
    )
    await expect(page.locator("footer")).not.toContainText("ISO 9001")
    const url = `/api/documents/download?id=${rows[0].id}`
    const response = await page.request.get(url, { timeout: 60_000 })
    expect(response.status()).toBe(200)
    expect(response.headers()["content-type"]).toBe("application/pdf")
    expect(response.headers()["cache-control"]).toBe("private, no-store")
    const bytes = await response.body()
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-")
    const document = await PDFDocument.load(bytes)
    expect(document.getPageCount()).toBeGreaterThan(0)
    const directory = process.env.AUDIT_EVIDENCE_DIR || "test-results/staging"
    mkdirSync(directory, { recursive: true })
    writeFileSync(resolve(directory, "staging-invoice.pdf"), bytes)
    const anonymous = await browser.newContext({
      baseURL,
      storageState: previewAllowed
        ? process.env.STAGING_PREVIEW_STORAGE_STATE
        : undefined,
    })
    try {
      expect((await anonymous.request.get(url)).status()).toBe(401)
    } finally {
      await anonymous.close()
    }
  } finally {
    await sql.end({ timeout: 2 })
  }
})

test("line-haul departure, exception and receipt preserve custody", async ({
  page,
}) => {
  test.setTimeout(180_000)
  const sql = postgres(profile.SUPABASE_POOLER_URL || profile.DATABASE_URL, {
    ssl: "require",
    max: 1,
    prepare: false,
    connect_timeout: 10,
  })
  try {
    const candidates = await sql`
      select s.id, s.awb_number from public.shipments s
      where s.content_description like 'TAC-STG-BILL-%' and s.status='pending'
        and not exists(select 1 from public.manifest_items mi where mi.shipment_id=s.id and mi.is_active)
      order by s.created_at desc limit 1
    `
    expect(candidates).toHaveLength(1)
    const shipment = candidates[0]
    await login(page, "admin")
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
    await page.goto("/dashboard/manifests", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    })
    await page
      .getByRole("button", { name: "Create Manifest", exact: true })
      .click()
    const create = page.getByRole("dialog")
    for (const [placeholder, option] of [
      ["Select origin hub", /Delhi/i],
      ["Select destination hub", /Imphal/i],
    ]) {
      await create
        .getByRole("combobox")
        .filter({ hasText: placeholder })
        .click()
      await page.getByRole("option", { name: option }).click()
    }
    await create
      .getByRole("combobox")
      .filter({ hasText: "Select active driver" })
      .click()
    await page
      .getByRole("option", { name: /^Staging driver \(/ })
      .click()
    await create
      .getByRole("combobox")
      .filter({ hasText: "Select active vehicle" })
      .click()
    await page.getByRole("option", { name: /STAGING-ONLY-001/ }).click()
    const notify = create.getByRole("checkbox", {
      name: /Auto-dispatch WhatsApp/,
    })
    if (await notify.count()) await notify.uncheck()
    await create
      .getByPlaceholder("Scan or enter AWB...")
      .fill(shipment.awb_number)
    await create.getByPlaceholder("Scan or enter AWB...").press("Enter")
    await create
      .getByRole("button", { name: "Create Digital Manifest (1)", exact: true })
      .click()
    await expect(create).not.toBeVisible({ timeout: 25_000 })
    const created = await sql`
      select m.id, m.reference_id, m.status, m.leg_type from public.manifests m
      join public.manifest_items mi on mi.manifest_id=m.id where mi.shipment_id=${shipment.id}
    `
    expect(created).toHaveLength(1)
    expect(created[0]).toMatchObject({ status: "draft", leg_type: "line_haul" })
    await page.reload({ waitUntil: "domcontentloaded" })
    const row = page
      .getByRole("row")
      .filter({ hasText: created[0].reference_id })
    await row.getByRole("button", { name: "Start run", exact: true }).click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Confirm departure", exact: true })
      .click()
    await expect(page.getByRole("alertdialog")).not.toBeVisible({
      timeout: 25_000,
    })
    await row
      .getByRole("button", { name: "Record handover", exact: true })
      .click()
    const handover = page.getByRole("dialog")
    for (const outcome of ["exception", "received"]) {
      await handover
        .getByRole("combobox", { name: "Shipment to receive", exact: true })
        .click()
      await page
        .getByRole("option", { name: shipment.awb_number, exact: true })
        .click()
      await handover
        .getByLabel("Receiving location", { exact: true })
        .fill("Synthetic Imphal terminal")
      await handover
        .getByLabel("Receiver name or team", { exact: true })
        .fill("Staging gate team")
      await handover
        .getByLabel("Notes (optional)", { exact: true })
        .fill("Synthetic custody acceptance")
      await handover
        .getByRole("button", {
          name:
            outcome === "exception" ? "Record exception" : "Confirm receipt",
          exact: true,
        })
        .click()
      if (outcome === "exception") {
        await expect(
          handover.getByRole("combobox", {
            name: "Shipment to receive",
            exact: true,
          })
        ).toContainText("Select an active shipment", { timeout: 25_000 })
      } else await expect(handover).not.toBeVisible({ timeout: 25_000 })
    }
    const result = await sql`
      select s.status, mi.is_active,
        count(*) filter(where h.outcome='received')::int as receipts,
        count(*) filter(where h.outcome='exception')::int as exceptions
      from public.shipments s join public.manifest_items mi on mi.shipment_id=s.id
      join public.manifest_item_handoffs h on h.manifest_item_id=mi.id
      where s.id=${shipment.id} group by s.status, mi.is_active
    `
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      status: "in-transit",
      is_active: false,
      receipts: 1,
      exceptions: 1,
    })
  } finally {
    await sql.end({ timeout: 2 })
  }
})

test("pickup receipt and signed final delivery preserve custody", async ({
  page,
}) => {
  test.setTimeout(240_000)
  const sql = postgres(profile.SUPABASE_POOLER_URL || profile.DATABASE_URL, {
    ssl: "require",
    max: 1,
    prepare: false,
    connect_timeout: 10,
  })
  const token = Date.now().toString()
  const awb = `TAC-STG-POD-${token}`
  const driverName = `Staging POD ${token}`
  const vehicleName = `STG-POD-${token}`
  try {
    const [customer] =
      await sql`select id from public.users where email='qa-customer@tac-xpress.invalid'`
    expect(customer).toBeDefined()
    await sql`insert into public.drivers(name,phone,license_number) values(${driverName},'0000000000',${vehicleName})`
    await sql`insert into public.vehicles(registration_number,capacity_kg) values(${vehicleName},1000)`
    const [shipment] = await sql`
      insert into public.shipments(awb_number,customer_id,origin,destination,weight_kg,consignee_name,content_description)
      values(${awb},${customer.id},'New Delhi','Imphal',5,'Synthetic consignee',${awb}) returning id
    `
    await sql`insert into public.invoices(shipment_id,customer_id,amount,document_snapshot)
      values(${shipment.id},${customer.id},5900,'{"fixture":"synthetic-pod-only","totalPaise":5900}')`
    await login(page, "admin")
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
    for (const leg of ["pickup", "delivery"]) {
      await page.goto(`/dashboard/dispatch?q=${awb}`, {
        waitUntil: "domcontentloaded",
      })
      await page
        .getByRole("button", { name: "Create Dispatch Run", exact: true })
        .click()
      const create = page.getByRole("dialog", {
        name: "Create Daily Run Sheet",
      })
      await create
        .getByRole("combobox", { name: "Run Type", exact: true })
        .click()
      await page
        .getByRole("option", {
          name: leg === "pickup" ? "Pickup" : "Delivery",
          exact: true,
        })
        .click()
      await create
        .getByRole("combobox", { name: "Find a driver", exact: true })
        .click()
      await page.getByPlaceholder("Find a driver").fill(driverName)
      await page.getByRole("option", { name: new RegExp(driverName) }).click()
      await create
        .getByRole("combobox", { name: "Find a vehicle", exact: true })
        .click()
      await page.getByPlaceholder("Find a vehicle").fill(vehicleName)
      await page
        .getByRole("option", { name: new RegExp(`^${vehicleName} `) })
        .click()
      const shipmentChoice = create.getByRole("checkbox", {
        name: new RegExp(awb),
      })
      await shipmentChoice.check()
      await create
        .getByRole("button", { name: "Assign Run Sheet", exact: true })
        .click()
      await expect(create).not.toBeVisible({ timeout: 30_000 })
      const [run] = await sql`
        select m.id,m.reference_id from public.manifests m join public.manifest_items mi on mi.manifest_id=m.id
        where mi.shipment_id=${shipment.id} and m.leg_type=${leg}
      `
      expect(run).toBeDefined()
      await page.reload({ waitUntil: "domcontentloaded" })
      await page
        .getByRole("tab", { name: "Dispatch runs", exact: true })
        .click()
      const row = page.getByRole("row").filter({ hasText: run.reference_id })
      await row.getByRole("button", { name: "Start run", exact: true }).click()
      await page
        .getByRole("alertdialog")
        .getByRole("button", { name: "Confirm departure", exact: true })
        .click()
      await expect(page.getByRole("alertdialog")).not.toBeVisible({
        timeout: 30_000,
      })
      if (leg === "pickup") {
        await row
          .getByRole("button", { name: "Record handover", exact: true })
          .click()
        const handover = page.getByRole("dialog")
        await handover
          .getByRole("combobox", { name: "Shipment to receive", exact: true })
          .click()
        await page.getByRole("option", { name: awb, exact: true }).click()
        await handover
          .getByLabel("Receiving location", { exact: true })
          .fill("Synthetic New Delhi terminal")
        await handover
          .getByLabel("Receiver name or team", { exact: true })
          .fill("Staging intake team")
        await handover
          .getByRole("button", { name: "Confirm receipt", exact: true })
          .click()
        await expect(handover).not.toBeVisible({ timeout: 30_000 })
      } else {
        await page.goto(`/driver/delivery/${shipment.id}`, {
          waitUntil: "domcontentloaded",
        })
        const complete = page.getByRole("button", {
          name: "Complete Delivery",
          exact: true,
        })
        await expect(complete).toBeDisabled()
        const signatureCanvas = page.getByLabel("Consignee signature")
        await expect(signatureCanvas).toBeVisible()
        await signatureCanvas.scrollIntoViewIfNeeded()
        const signature = await signatureCanvas.boundingBox()
        if (!signature) throw new Error("The signature canvas is unavailable")
        await page.mouse.move(signature.x + 20, signature.y + 40)
        await page.mouse.down()
        await page.mouse.move(signature.x + 120, signature.y + 90, {
          steps: 15,
        })
        await page.mouse.move(signature.x + 200, signature.y + 35, {
          steps: 15,
        })
        await page.mouse.up()
        await expect(complete).toBeEnabled()
        await complete.click()
        await expect
          .poll(
            async () => {
              const [result] =
                await sql`select status from public.shipments where id=${shipment.id}`
              return result.status
            },
            { timeout: 30_000 }
          )
          .toBe("delivered")
      }
    }
    const [result] = await sql`
      select s.status,length(i.signature_url)>100 as signed,i.amount,
        (select count(*)::int from public.manifest_items mi where mi.shipment_id=s.id and mi.is_active) as active_assignments,
        (select count(*)::int from public.manifest_item_handoffs h join public.manifest_items mi on mi.id=h.manifest_item_id
          where mi.shipment_id=s.id and h.outcome='received') as receipts
      from public.shipments s join public.invoices i on i.shipment_id=s.id where s.id=${shipment.id}
    `
    expect(result).toMatchObject({
      status: "delivered",
      signed: true,
      amount: 5900,
      active_assignments: 0,
      receipts: 2,
    })
  } finally {
    await sql.end({ timeout: 2 })
  }
})

test("concurrent staff lookups fit the bounded serverless pool", async ({
  page,
}) => {
  await login(page, "admin")
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 })
  const timings = await Promise.all(
    Array.from({ length: 8 }, async () => {
      const started = Date.now()
      const response = await page.request.get("/api/customers?query=Staging", {
        timeout: 15_000,
      })
      expect(response.status()).toBe(200)
      return Date.now() - started
    })
  )
  await test.info().attach("bounded-concurrency", {
    body: JSON.stringify({
      concurrentReads: timings.length,
      maximumMilliseconds: Math.max(...timings),
    }),
    contentType: "application/json",
  })
})
