/**
 * Storybook stand-in for the "use server" invoice actions module.
 * Returns no data so stories keep their `initialData` fixtures.
 */
export async function getInvoiceDetails(_input: unknown) {
  return { data: undefined }
}
