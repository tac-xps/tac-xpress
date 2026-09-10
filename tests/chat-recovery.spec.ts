import { test, expect } from "@playwright/test"

test("assistant retries a provider error without duplicating the user question", async ({ page }) => {
  let attempts = 0
  const bodies: unknown[] = []
  await page.route("**/api/chat", async route => {
    bodies.push(route.request().postDataJSON()); attempts++
    if (attempts === 1) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Temporarily unavailable" }) })
    const chunks = [
      { type: "start", messageId: "qa-assistant" },
      { type: "text-start", id: "text-1" },
      { type: "text-delta", id: "text-1", delta: "Use strong packaging and protect fragile items. This is a simulated reply." },
      { type: "text-end", id: "text-1" },
      { type: "finish" },
    ]
    return route.fulfill({ status: 200, headers: { "content-type": "text/event-stream", "x-vercel-ai-ui-message-stream": "v1", "cache-control": "no-cache" }, body: chunks.map(chunk => "data: " + JSON.stringify(chunk) + "\n\n").join("") + "data: [DONE]\n\n" })
  })
  await page.goto("/")
  await page.getByRole("button", { name: "Open AI assistant" }).click()
  await page.getByLabel("Your question").fill("How should I pack fragile cargo?")
  await page.getByRole("button", { name: "Send question" }).click()
  await expect(page.getByRole("alert")).toContainText("couldn’t reply")
  await page.getByRole("button", { name: "Retry reply" }).click()
  await expect(page.getByRole("log")).toContainText("This is a simulated reply")
  await expect(page.getByRole("log").getByText("How should I pack fragile cargo?", { exact: true })).toHaveCount(1)
  expect(attempts).toBe(2)
  expect(bodies[1]).toMatchObject({ messages: [{ role: "user", parts: [{ type: "text", text: "How should I pack fragile cargo?" }] }] })
})
