import { test, expect } from "@playwright/test"

test("staff sign-in validates required credentials", async ({ page }) => {
  await page.goto("/signin")
  await expect(
    page.getByRole("heading", { name: "Staff sign in" })
  ).toBeVisible()
  await page
    .getByRole("button", { name: "Sign in to workspace", exact: true })
    .click()
  await expect(page).toHaveURL(/\/signin$/)
  await expect(page.getByLabel("Email address")).toBeVisible()
})

test("health details require authorization", async ({ request }) => {
  const response = await request.get("/api/health")
  expect(response.status()).toBe(401)
  expect(await response.text()).not.toContain("services")
})

test("staff and customer data stay protected", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/signin/)
  await page.goto("/portal/invoices")
  await expect(page).toHaveURL(/\/signin/)
})

test("invalid sign-in callbacks provide recovery", async ({ page }) => {
  await page.goto("/auth/callback")
  await expect(page).toHaveURL(/\/signin\?reason=staff-only/)
  await expect(page.getByRole("alert")).toContainText("staff")
})

for (const route of [
  "/driver/delivery",
  "/driver/delivery/11111111-1111-4111-8111-111111111111",
  "/invoice/11111111-1111-4111-8111-111111111111",
  "/invoice/11111111-1111-4111-8111-111111111111/label",
]) {
  test(`private document or delivery route denies anonymous access: ${route}`, async ({
    page,
  }) => {
    await page.goto(route)
    await expect(page).toHaveURL(/\/signin/)
    await expect(
      page.getByRole("heading", { name: "Staff sign in" })
    ).toBeVisible()
  })
}
const id = "11111111-1111-4111-8111-111111111111"
// Separate cases keep each authorization boundary identifiable and avoid a
// shared timeout while the development server compiles unrelated API routes.
for (const [route, expectedStatus] of [
  [`/api/manifests/${id}/print`, 401],
  [`/api/documents/download?id=${id}`, 401],
  [`/api/public/invoice-pdf?id=${id}&sig=invalid`, 403],
  [`/api/cargo-documents/shipments/${id}`, 401],
  [`/api/staff-avatar/${id}?file=${id}.png`, 401],
  ["/api/customers?query=test", 401],
  ["/api/drivers?query=test", 401],
  ["/api/vehicles?query=test", 401],
  ["/api/hubs?query=test", 401],
] as const) {
  test(`API denies anonymous or unsigned access: ${route}`, async ({
    request,
  }) => {
    expect((await request.get(route)).status()).toBe(expectedStatus)
  })
}
