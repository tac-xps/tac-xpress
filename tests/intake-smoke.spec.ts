import { test, expect } from "@playwright/test"

test("public contact booking inquiry submits and displays registration confirmation", async ({ page }) => {
  await page.goto("/#contact")
  await page.waitForLoadState("networkidle")

  const contactSection = page.locator("#contact")
  await expect(contactSection).toBeVisible()

  // Fill in booking inquiry form
  await page.locator("#contact-name").fill("Delhi Electronics Ltd")
  await page.locator("#contact-email").fill("dispatch@delhi-elec.in")
  await page.locator("#contact-phone").fill("+91 98765 43210")
  await page.locator("#contact-message").fill("10 cartons urgent medical components for Imphal General Hospital.")

  // Submit
  await page.getByRole("button", { name: "Submit Booking Request" }).click()

  // Wait for submission confirmation
  await expect(page.getByText("Inquiry Registered")).toBeVisible({ timeout: 10000 })
  await expect(page.getByText("Reference docket:")).toBeVisible()
})
