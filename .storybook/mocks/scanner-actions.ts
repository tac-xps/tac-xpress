/**
 * Storybook stand-in for the "use server" scanner actions module.
 * Returns null so stories do not trigger server database queries.
 */
export async function getScannedShipmentDetails(_code: string) {
  return null
}

export async function updateScannedShipmentStatus(_input: unknown) {
  return { success: true }
}
