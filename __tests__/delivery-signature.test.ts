import { describe, expect, it, vi } from "vitest"
import sharp from "sharp"
vi.mock("server-only", () => ({}))
import { assertNonemptySignature } from "@/lib/shipments/signature"
const drawn =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAUCAYAAAD/Rn+7AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAQ0lEQVRIie3QwQkAIAwEwe2/6bMABYU8XDED+eR1LJEjckSOyJEXBwLT3cLy2QPPdcGqLljVBf8saELkiByR4/aAnQGnjt68vTE5NwAAAABJRU5ErkJggg=="
describe("delivery signature validation", () => {
  it("accepts a decoded nonblank PNG", async () => {
    await expect(assertNonemptySignature(drawn)).resolves.toBeUndefined()
  })
  it.each(["white", "black", "transparent"])(
    "rejects a %s blank image",
    async (color) => {
      const image = await sharp({
        create: { width: 40, height: 20, channels: 4, background: color },
      })
        .png()
        .toBuffer()
      await expect(
        assertNonemptySignature(
          "data:image/png;base64," + image.toString("base64")
        )
      ).rejects.toThrow("Draw a nonempty PNG signature")
    }
  )
  it("rejects oversized dimensions and mislabeled formats", async () => {
    const large = await sharp({
      create: { width: 2049, height: 2, channels: 4, background: "white" },
    })
      .png()
      .toBuffer()
    await expect(
      assertNonemptySignature(
        "data:image/png;base64," + large.toString("base64")
      )
    ).rejects.toThrow()
    const jpeg = await sharp({
      create: { width: 20, height: 20, channels: 3, background: "white" },
    })
      .jpeg()
      .toBuffer()
    await expect(
      assertNonemptySignature(
        "data:image/png;base64," + jpeg.toString("base64")
      )
    ).rejects.toThrow()
  })
  it("rejects invalid and oversized payloads before decoding", async () => {
    await expect(
      assertNonemptySignature("data:image/png;base64,dGVzdA==")
    ).rejects.toThrow()
    await expect(
      assertNonemptySignature("data:image/png;base64," + "A".repeat(250001))
    ).rejects.toThrow()
  })
})
