/**
 * useClient Hook
 * 
 * Centralizes client CRUD operations and form management that's repeated across components.
 * Handles client data loading, form state, validation, and CRUD operations with error handling.
 */

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { 
  getClient,
  getClientInvoices,
  getAllClients,
  type Client,
  type ClientInvoice 
} from "@/lib/storage"
import {
  getEmptyClientForm,
  populateClientForm,
  saveNewClient,
  updateExistingClient,
  deleteClientWithConfirmation,
  type ClientFormData
} from "@/lib/utils"

export interface UseClientReturn {
  // State
  client: Client | null
  clients: Client[]
  clientForm: ClientFormData
  invoices: ClientInvoice[]
  isLoading: boolean
  
  // Actions
  loadClient: (clientId: string) => Promise<void>
  loadAllClients: () => Promise<void>
  setClientForm: (form: ClientFormData) => void
  resetClientForm: () => void
  saveClient: () => Promise<{ success: boolean; client?: Client }>
  updateClient: (clientId: string) => Promise<{ success: boolean; client?: Client }>
  deleteClient: (clientId: string) => Promise<boolean>
  handleEditClient: (client: Client) => void
}

/**
 * Custom hook for managing client operations
 */
export function useClient(): UseClientReturn {
  const [client, setClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [clientForm, setClientForm] = useState<ClientFormData>(getEmptyClientForm())
  const [invoices, setInvoices] = useState<ClientInvoice[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load individual client data
  const loadClient = useCallback(async (clientId: string) => {
    setIsLoading(true)
    try {
      const clientData = getClient(clientId)
      const clientInvoices = getClientInvoices(clientId)
      
      setClient(clientData)
      setInvoices(clientInvoices)
      
      if (!clientData) {
        toast.error("Client not found")
      }
    } catch (error) {
      console.error("Failed to load client data:", error)
      toast.error("Failed to load client data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load all clients
  const loadAllClients = useCallback(async () => {
    setIsLoading(true)
    try {
      const allClients = getAllClients()
      setClients(allClients)
    } catch (error) {
      console.error("Failed to load clients:", error)
      toast.error("Failed to load clients")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Reset client form to empty state
  const resetClientForm = useCallback(() => {
    setClientForm(getEmptyClientForm())
  }, [])

  // Save new client
  const saveClient = useCallback(async () => {
    const result = await saveNewClient(clientForm)
    if (result.success) {
      resetClientForm()
      // Refresh clients list
      await loadAllClients()
    }
    return result
  }, [clientForm, resetClientForm, loadAllClients])

  // Update existing client
  const updateClient = useCallback(async (clientId: string) => {
    const result = await updateExistingClient(clientId, clientForm)
    if (result.success) {
      // Refresh client data
      await loadClient(clientId)
    }
    return result
  }, [clientForm, loadClient])

  // Delete client with confirmation
  const deleteClient = useCallback(async (clientId: string) => {
    const success = await deleteClientWithConfirmation(clientId)
    if (success) {
      // Refresh clients list
      await loadAllClients()
    }
    return success
  }, [loadAllClients])

  // Handle editing a client (populate form)
  const handleEditClient = useCallback((clientToEdit: Client) => {
    setClientForm(populateClientForm(clientToEdit))
  }, [])

  return {
    client,
    clients,
    clientForm,
    invoices,
    isLoading,
    loadClient,
    loadAllClients,
    setClientForm,
    resetClientForm,
    saveClient,
    updateClient,
    deleteClient,
    handleEditClient,
  }
}