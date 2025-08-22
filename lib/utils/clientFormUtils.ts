/**
 * Client form utilities for consistent client form handling across components
 */

import { toast } from "sonner"
import { updateClient, saveClient, type Client } from "@/lib/storage"

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
 * Save a new client with error handling
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
 * Update an existing client with error handling
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