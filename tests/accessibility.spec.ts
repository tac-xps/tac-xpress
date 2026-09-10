import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
const evidenceDir =
  process.env.AUDIT_EVIDENCE_DIR || "docs/audit-evidence/nordic-2026-09-07"

for (const width of [320, 768, 1440]) {
  for (const route of [
    "/",
    "/signin",
    "/track",
    "/terms",
    "/feedback",
    "/services",
    "/services/air-cargo",
    "/services/surface-cargo",
    "/shipping-guide",
    "/about",
    "/contact",
  ]) {
    test(`${route} is accessible at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      const errors: string[] = []
      page.on("pageerror", (error) => errors.push(error.message))
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.locator("main")).toBeVisible()
      await expect(
        page.getByRole("link", { name: "Customer portal", exact: true })
      ).toHaveCount(0)
      await page.evaluate(() => document.fonts.ready)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true)
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
      expect(results.violations).toEqual([])
      expect(errors).toEqual([])
      if (route === "/" || width === 1440) {
        for (const image of await page.locator("main img").all()) {
          await image.scrollIntoViewIfNeeded()
          await image.evaluate((node) => (node as HTMLImageElement).decode())
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
        await page.screenshot({
          path: `${evidenceDir}/${route.slice(1).replaceAll("/", "-") || "home"}-${width}.png`,
          fullPage: true,
        })
      }
    })
  }
}

test("mobile navigation supports keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto("/")
  await page.getByRole("button", { name: "Open navigation" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).not.toBeVisible()
  await expect(
    page.getByRole("button", { name: "Open navigation" })
  ).toBeFocused()
})

test("dark theme maintains accessible contrast", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Toggle color theme" }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze()
  expect(results.violations).toEqual([])
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded()
    await image.evaluate((node) => (node as HTMLImageElement).decode())
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
  await page.screenshot({
    path: `${evidenceDir}/home-dark.png`,
    fullPage: true,
  })
})

test("assistant opens accessibly on a small screen without sending a message", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto("/")
  await page.getByRole("button", { name: "Open AI assistant" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByLabel("Your question")).toBeVisible()
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze()
  expect(results.violations).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await page.keyboard.press("Escape")
  await expect(
    page.getByRole("button", { name: "Open AI assistant" })
  ).toBeFocused()
})
