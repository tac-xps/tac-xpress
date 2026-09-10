export const MAX_CARGO_FILE_BYTES = 5 * 1024 * 1024
export function cargoFileExtension(bytes: Uint8Array, type: string) {
  const ascii = (start: number, end: number) => new TextDecoder().decode(bytes.slice(start, end))
  if (type === "application/pdf" && ascii(0, 5) === "%PDF-") return "pdf"
  if (type === "image/jpeg" && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpg"
  if (type === "image/png" && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)) return "png"
  return null
}
export function safeCargoFilename(name: string, extension: string) {
  const stem = name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80) || "document"
  return `${stem}.${extension}`
}

