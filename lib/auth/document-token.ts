import { createHmac, timingSafeEqual } from "node:crypto"
type DocumentPurpose = "pdf" | "render"
const maxAge = 300

export function signDocumentToken(
  id: string,
  purpose: DocumentPurpose,
  now = Date.now()
) {
  const secret = process.env.INVOICE_PDF_SIGNING_SECRET
  if (!secret || secret.length < 32)
    throw new Error("A strong invoice signing secret is required.")
  const expires = Math.floor(now / 1000) + maxAge
  const signature = createHmac("sha256", secret)
    .update(`${purpose}:${id}:${expires}`)
    .digest("hex")
  return `${expires}.${signature}`
}
export function verifyDocumentToken(
  token: string | null,
  id: string,
  purpose: DocumentPurpose,
  now = Date.now()
) {
  const secret = process.env.INVOICE_PDF_SIGNING_SECRET
  if (
    !secret ||
    secret.length < 32 ||
    !token ||
    !/^\d{10}\.[a-f0-9]{64}$/.test(token)
  )
    return false
  const [expiry, signature] = token.split(".")
  const seconds = Math.floor(now / 1000)
  if (Number(expiry) <= seconds || Number(expiry) > seconds + maxAge)
    return false
  const expected = createHmac("sha256", secret)
    .update(`${purpose}:${id}:${expiry}`)
    .digest()
  return timingSafeEqual(expected, Buffer.from(signature, "hex"))
}
