import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
const previewUrl = process.env.WORKSPACE_PREVIEW_URL ?? ""
const evidenceDir =
  process.env.AUDIT_EVIDENCE_DIR || "docs/audit-evidence/nordic-2026-09-07"
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
      await page.goto(previewUrl)
      await expect(
        page.getByRole("heading", { name: "Operations overview" })
      ).toBeVisible()
      await expect(
        page.getByText("Design preview", { exact: false })
      ).toBeVisible()
      await expect(
        page.getByRole("region", { name: "All-time operational totals" })
          .locator("dl > div").last()
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
      expect(errors).toEqual([])
      await page.screenshot({
        path: `${evidenceDir}/workspace-${width}.png`,
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
  test("dark workspace and command search", async ({ page }) => {
    const darkPreviewUrl = new URL(previewUrl)
    darkPreviewUrl.searchParams.set("globals", "theme:dark")
    await page.goto(darkPreviewUrl.toString())
    await expect(page.locator("html")).toHaveClass(/dark/)
    await expect(
      page.getByRole("region", { name: "All-time operational totals" })
        .locator("dl > div").last()
    ).toHaveCSS("opacity", "1")
    const foreground = await page.locator("body").evaluate(
      (element) => getComputedStyle(element).color
    )
    await expect(page.getByRole("link", { name: "Book & invoice" }))
      .toHaveCSS("color", foreground)
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze()
    expect(axe.violations).toEqual([])
    await page.screenshot({
      path: `${evidenceDir}/workspace-dark.png`,
      fullPage: true,
    })
    await page.keyboard.press("Control+k")
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).not.toBeVisible()
  })
})
