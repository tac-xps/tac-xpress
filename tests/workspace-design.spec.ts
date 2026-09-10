import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
const previewUrl = process.env.WORKSPACE_PREVIEW_URL
test.describe("isolated operations design", () => {
  test.skip(
    !previewUrl,
    "Start Storybook and set WORKSPACE_PREVIEW_URL for isolated UI checks"
  )
  for (const width of [320, 768, 1440]) {
    test(`workspace is accessible at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      const errors: string[] = []
      page.on("pageerror", (error) => errors.push(error.message))
      await page.goto(previewUrl!)
      await expect(
        page.getByRole("heading", { name: "Operations overview" })
      ).toBeVisible()
      await expect(
        page.getByText("Design preview", { exact: false })
      ).toBeVisible()
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true)
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
      expect(axe.violations).toEqual([])
      expect(errors).toEqual([])
      await page.screenshot({
        path: `docs/audit-evidence/nordic-2026-09-07/workspace-${width}.png`,
        fullPage: true,
      })
      if (width === 320) {
        await page.getByRole("button", { name: "Toggle Sidebar" }).click()
        await expect(page.getByRole("dialog")).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(page.getByRole("dialog")).not.toBeVisible()
      }
    })
  }
  test("workspace theme and command search", async ({ page }) => {
    await page.goto(previewUrl!)
    await page.getByRole("button", { name: "Toggle color theme" }).click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze()
    expect(axe.violations).toEqual([])
    await page.screenshot({
      path: "docs/audit-evidence/nordic-2026-09-07/workspace-dark.png",
      fullPage: true,
    })
    await page.keyboard.press("Control+k")
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).not.toBeVisible()
  })
})
