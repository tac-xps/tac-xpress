import "server-only"
import sharp from "sharp"

export async function assertNonemptySignature(value: string) {
  try {
    const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(value)
    if (!match || value.length > 250000) throw new Error("Invalid signature")
    const image = sharp(Buffer.from(match[1], "base64"), {
      limitInputPixels: 1048576,
    })
    const metadata = await image.metadata()
    if (
      metadata.format !== "png" ||
      !metadata.width ||
      !metadata.height ||
      metadata.width > 2048 ||
      metadata.height > 1024
    )
      throw new Error("Invalid signature")
    const { data, info } = await image
      .flatten({ background: "#ffffff" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    if (!data.some((value, index) => value !== data[index % info.channels]))
      throw new Error("Empty signature")
  } catch {
    throw new Error("Draw a nonempty PNG signature before completing delivery")
  }
}
