export function toCsv(rows: readonly (readonly unknown[])[]) {
  return "\uFEFF" + rows.map((row) => row.map((value) => {
    const text = String(value ?? "")
    const safe = /^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text) ? "'" + text : text
    return '"' + safe.replaceAll('"', '""') + '"'
  }).join(",")).join("\r\n")
}

