import { test, expect } from "@playwright/test"

test("public inquiry preserves details when persistence is unavailable", async ({
  page,
}) => {
  test.skip(
    Boolean(
      process.env.DATABASE_URL ||
      process.env.SUPABASE_POOLER_URL ||
      process.env.PLAYWRIGHT_BASE_URL
    ),
    "Requires the database-free local test server"
  )
  await page.goto("/#contact")

  const contactSection = page.locator("#contact")
  await expect(contactSection).toBeVisible()

  await page.locator("#contact-name").fill("Delhi Electronics Ltd")
  await page.locator("#contact-email").fill("dispatch@example.test")
  await page.locator("#contact-phone").fill("+91 98765 43210")
  await page
    .locator("#contact-message")
    .fill("10 cartons urgent medical components for Imphal General Hospital.")

  const submit = page.getByRole("button", { name: "Submit Booking Request" })
  await submit.click()
  await expect(
    page.getByText(
      "We could not save your request. Please try again or contact our team directly.",
      { exact: true }
    )
  ).toBeVisible()
  await expect(
    page.getByText("Inquiry Registered", { exact: true })
  ).toHaveCount(0)
  await expect(page.getByText("Reference docket:")).toHaveCount(0)
  await expect(page.locator("#contact-name")).toHaveValue(
    "Delhi Electronics Ltd"
  )
  await expect(page.locator("#contact-email")).toHaveValue(
    "dispatch@example.test"
  )
  await expect(page.locator("#contact-message")).toHaveValue(
    "10 cartons urgent medical components for Imphal General Hospital."
  )
  await expect(submit).toBeEnabled()
})
