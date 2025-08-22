/**
 * Client operations with UI feedback for CRM functionality
 * Extends basic storage operations with validation, error handling, and user feedback
 */

import { toast } from "sonner"
import { 
  saveClient, 
  updateClient, 
  deleteClient, 
  deleteInvoice, 
  type Client 
} from "./clientStorage"

export interface ClientFormData {
  name: string
  company: string
  email: string
  phone: string
  address: string
  notes: string
}

/**
 * Initial empty client form data
 */
export const getEmptyClientForm = (): ClientFormData => ({
  name: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  notes: ""
})

/**
 * Populate client form data from an existing client
 */
export function populateClientForm(client: Client): ClientFormData {
  return {
    name: client.name,
    company: client.company || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "",
    notes: client.notes || ""
  }
}

/**
 * Validate client form data
 */
export function validateClientForm(formData: ClientFormData): { isValid: boolean; error?: string } {
  if (!formData.name.trim()) {
    return { isValid: false, error: "Client name is required" }
  }
  return { isValid: true }
}

/**
 * Save a new client with error handling and user feedback
 */
export async function saveNewClient(formData: ClientFormData): Promise<{ success: boolean; client?: Client }> {
  const validation = validateClientForm(formData)
  if (!validation.isValid) {
    toast.error(validation.error!)
    return { success: false }
  }

  try {
    const newClient = saveClient(formData)
    toast.success("Client added successfully")
    return { success: true, client: newClient }
  } catch (error) {
    console.error("Failed to save client:", error)
    toast.error("Failed to save client")
    return { success: false }
  }
}

/**
 * Update an existing client with error handling and user feedback
 */
export async function updateExistingClient(
  clientId: string, 
  formData: ClientFormData
): Promise<{ success: boolean; client?: Client }> {
  const validation = validateClientForm(formData)
  if (!validation.isValid) {
    toast.error(validation.error!)
    return { success: false }
  }

  try {
    const updated = updateClient(clientId, formData)
    if (updated) {
      toast.success("Client updated successfully")
      return { success: true, client: updated }
    } else {
      toast.error("Failed to update client")
      return { success: false }
    }
  } catch (error) {
    console.error("Failed to update client:", error)
    toast.error("Failed to update client")
    return { success: false }
  }
}

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