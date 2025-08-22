/**
 * Client operations utilities for consistent client CRUD operations with error handling
 */

import { toast } from "sonner"
import { deleteClient, deleteInvoice } from "@/lib/storage"

/**
 * Delete a client with confirmation and error handling
 */
export async function deleteClientWithConfirmation(clientId: string): Promise<boolean> {
  if (!confirm("Are you sure you want to delete this client? This will also delete all their invoices.")) {
    return false
  }

  try {
    const success = deleteClient(clientId)
    if (success) {
      toast.success("Client deleted successfully")
      return true
    } else {
      toast.error("Failed to delete client")
      return false
    }
  } catch (error) {
    console.error("Failed to delete client:", error)
    toast.error("Failed to delete client")
    return false
  }
}

/**
 * Delete an invoice with confirmation and error handling
 */
export async function deleteInvoiceWithConfirmation(invoiceId: string): Promise<boolean> {
  if (!confirm("Are you sure you want to delete this invoice?")) {
    return false
  }

  try {
    const success = deleteInvoice(invoiceId)
    if (success) {
      toast.success("Invoice deleted successfully")
      return true
    } else {
      toast.error("Failed to delete invoice")
      return false
    }
  } catch (error) {
    console.error("Failed to delete invoice:", error)
    toast.error("Failed to delete invoice")
    return false
  }
}

/**
 * Get status badge configuration for invoices
 */
export function getInvoiceStatusBadge(status: string) {
  const colors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800"
  } as const

  return colors[status as keyof typeof colors] || colors.draft
}