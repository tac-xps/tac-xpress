// Auth failures are routine and their message is safe to show as is, so they
// are passed to the client and kept out of error tracking.
const AUTH_ERROR_MARKERS = ["permission", "signed in", "Unauthorized", "Forbidden"]

export function isAuthErrorMessage(message: string | undefined): boolean {
  return !!message && AUTH_ERROR_MARKERS.some((marker) => message.includes(marker))
}
