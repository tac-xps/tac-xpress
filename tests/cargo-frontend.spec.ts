import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const evidenceDir =
  process.env.AUDIT_EVIDENCE_DIR || "docs/audit-evidence/cargo-2026-09-07"

for (const width of [320, 768, 1440]) {
  test(`cargo imagery loads and stays within the layout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    const images = page.locator('main img[src*="images"]')
    expect(await images.count()).toBeGreaterThanOrEqual(4)
    for (const image of await images.all()) {
      await image.evaluate((node) => {
        node.scrollIntoView({ block: "center", behavior: "instant" })
      })
      await expect(image).toBeVisible()
      await expect
        .poll(() =>
          image.evaluate(
            (node) =>
              node instanceof HTMLImageElement &&
              node.complete &&
              node.naturalWidth > 0
          )
        )
        .toBe(true)
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true)
    const desk = page.locator("#contact")
    await desk.evaluate((node) => {
      node.scrollIntoView({ block: "center", behavior: "instant" })
    })
    const box = await desk.boundingBox()
    expect(box).not.toBeNull()
    if (box) {
      await page.screenshot({
        path: `${evidenceDir}/operations-desk-${width}.png`,
        clip: {
          x: Math.max(0, box.x),
          y: Math.max(0, box.y),
          width: Math.min(box.width, width),
          height: Math.min(box.height, 900),
        },
      })
    }
  })
}

test("tracking AWB entry reaches real validation without signing in", async ({
  page,
}) => {
  await page.goto("/track")
  await page.getByLabel("AWB number").fill("!")
  await page
    .getByRole("button", { name: "Track shipment", exact: true })
    .click()
  await expect(page).toHaveURL(/\/track\?awb=%21/)
  await expect(
    page.getByRole("heading", { name: "Where is your cargo?" })
  ).toBeVisible()
  await expect(
    page.getByText("We could not retrieve this shipment", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("alert").filter({ hasText: "Check the number" })
  ).toBeVisible()
  await expect(page.getByLabel("AWB number", { exact: true })).toHaveValue("!")
})

test("essential content, navigation and tracking work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 1440, height: 900 },
  })
  try {
    const page = await context.newPage()
    await page.goto("/")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Connecting Delhi to Imphal/,
      })
    ).toBeVisible()
    await page.goto("/track")
    await page.getByLabel("AWB number").fill("!")
    await page.getByLabel("AWB number").press("Enter")
    await expect(
      page.getByText("We could not retrieve this shipment", { exact: true })
    ).toBeVisible()
    await page.goto("/services")
    await expect(
      page.getByRole("heading", { name: "Your cargo. The right journey." })
    ).toBeVisible()
  } finally {
    await context.close()
  }
})

test("reduced motion keeps service content visible and suppresses image zoom", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/services")
  const link = page.getByRole("link", {
    name: /air cargo/i,
  }).first()
  await link.focus()
  await expect(link).toBeFocused()
  await expect(
    page.getByRole("heading", { name: "Air cargo", exact: true })
  ).toBeVisible()
  const media = page.locator("main img").first()
  await expect(media).toHaveCSS("transform", "none")
  // The global reduced-motion reset keeps a 1ms lifecycle duration. The image
  // must disable transition properties entirely, regardless of that fallback.
  await expect(media).toHaveCSS("transition-property", "none")
})

for (const route of [
  "/services",
  "/services/air-cargo",
  "/shipping-guide",
  "/about",
  "/contact",
  "/track",
  "/signin",
  "/feedback",
]) {
  test(`dark mode supports readable content and controls on ${route}`, async ({
    page,
  }) => {
    await page.goto(route)
    await page.getByRole("button", { name: "Toggle color theme" }).click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze()
    expect(result.violations).toEqual([])
  })
}
