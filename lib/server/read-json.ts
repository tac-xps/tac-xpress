/** Bound unauthenticated JSON input before buffering it in memory. */
export async function readBoundedJson(
  request: Request,
  maxBytes = 64_000
): Promise<unknown> {
  if (!request.body || Number(request.headers.get("content-length")) > maxBytes)
    return null
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
    const buffer = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
      buffer.set(chunk, offset)
      offset += chunk.byteLength
    }
    return JSON.parse(new TextDecoder().decode(buffer))
  } catch {
    return null
  } finally {
    reader.releaseLock()
  }
}
