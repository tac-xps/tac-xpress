export async function getInvoiceDetails(input: any) {
  return {
    data: {
      id: "inv-123",
      amount: 150000,
      status: "unpaid",
      // ... basic fields
    }
  }
}
