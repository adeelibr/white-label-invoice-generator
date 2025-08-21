/**
 * Client Storage Utilities
 * Handles localStorage operations for client data and CRM functionality
 */

export interface Client {
  id: string
  name: string
  company?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ClientInvoice {
  id: string
  clientId: string
  invoiceNumber: string
  date: string
  dueDate?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  total: number
  currency: string
  createdAt: string
  updatedAt: string
  // Full invoice data
  invoiceData: import("@/lib/storage").InvoiceData // Will match the existing InvoiceData type
}

const CLIENTS_STORAGE_KEY = "invoice-generator-clients"
const CLIENT_INVOICES_STORAGE_KEY = "invoice-generator-client-invoices"

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// CLIENT OPERATIONS

/**
 * Get all clients
 */
export function getAllClients(): Client[] {
  if (!isBrowser()) {
    return []
  }

  try {
    const stored = localStorage.getItem(CLIENTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to get clients:", error)
    return []
  }
}

/**
 * Get a client by ID
 */
export function getClient(id: string): Client | null {
  const clients = getAllClients()
  return clients.find(client => client.id === id) || null
}

/**
 * Save a new client
 */
export function saveClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
  if (!isBrowser()) {
    throw new Error("localStorage not available")
  }

  const now = new Date().toISOString()
  const newClient: Client = {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    ...clientData
  }

  try {
    const clients = getAllClients()
    clients.push(newClient)
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients))
    return newClient
  } catch (error) {
    console.error("Failed to save client:", error)
    throw error
  }
}

/**
 * Update an existing client
 */
export function updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>): Client | null {
  if (!isBrowser()) {
    return null
  }

  try {
    const clients = getAllClients()
    const clientIndex = clients.findIndex(client => client.id === id)
    
    if (clientIndex === -1) {
      return null
    }

    const updatedClient = {
      ...clients[clientIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    clients[clientIndex] = updatedClient
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients))
    return updatedClient
  } catch (error) {
    console.error("Failed to update client:", error)
    return null
  }
}

/**
 * Delete a client
 */
export function deleteClient(id: string): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    const clients = getAllClients()
    const filteredClients = clients.filter(client => client.id !== id)
    
    if (filteredClients.length === clients.length) {
      return false // Client not found
    }

    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(filteredClients))
    
    // Also delete all invoices for this client
    deleteAllClientInvoices(id)
    
    return true
  } catch (error) {
    console.error("Failed to delete client:", error)
    return false
  }
}

// CLIENT INVOICE OPERATIONS

/**
 * Get all invoices for a specific client
 */
export function getClientInvoices(clientId: string): ClientInvoice[] {
  if (!isBrowser()) {
    return []
  }

  try {
    const stored = localStorage.getItem(CLIENT_INVOICES_STORAGE_KEY)
    const allInvoices: ClientInvoice[] = stored ? JSON.parse(stored) : []
    return allInvoices.filter(invoice => invoice.clientId === clientId)
  } catch (error) {
    console.error("Failed to get client invoices:", error)
    return []
  }
}

/**
 * Get all invoices across all clients
 */
export function getAllInvoices(): ClientInvoice[] {
  if (!isBrowser()) {
    return []
  }

  try {
    const stored = localStorage.getItem(CLIENT_INVOICES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to get all invoices:", error)
    return []
  }
}

/**
 * Get a specific invoice by ID
 */
export function getClientInvoiceById(id: string): ClientInvoice | null {
  const invoices = getAllInvoices()
  return invoices.find(invoice => invoice.id === id) || null
}

/**
 * Save a new invoice for a client
 */
export function saveClientInvoice(invoiceData: Omit<ClientInvoice, 'id' | 'createdAt' | 'updatedAt'>): ClientInvoice {
  if (!isBrowser()) {
    throw new Error("localStorage not available")
  }

  const now = new Date().toISOString()
  const newInvoice: ClientInvoice = {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    ...invoiceData
  }

  try {
    const invoices = getAllInvoices()
    invoices.push(newInvoice)
    localStorage.setItem(CLIENT_INVOICES_STORAGE_KEY, JSON.stringify(invoices))
    return newInvoice
  } catch (error) {
    console.error("Failed to save client invoice:", error)
    throw error
  }
}

/**
 * Update an existing invoice
 */
export function updateClientInvoice(id: string, updates: Partial<Omit<ClientInvoice, 'id' | 'createdAt' | 'updatedAt'>>): ClientInvoice | null {
  if (!isBrowser()) {
    return null
  }

  try {
    const invoices = getAllInvoices()
    const invoiceIndex = invoices.findIndex(invoice => invoice.id === id)
    
    if (invoiceIndex === -1) {
      return null
    }

    const updatedInvoice = {
      ...invoices[invoiceIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    invoices[invoiceIndex] = updatedInvoice
    localStorage.setItem(CLIENT_INVOICES_STORAGE_KEY, JSON.stringify(invoices))
    return updatedInvoice
  } catch (error) {
    console.error("Failed to update client invoice:", error)
    return null
  }
}

/**
 * Delete an invoice
 */
export function deleteInvoice(id: string): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    const invoices = getAllInvoices()
    const filteredInvoices = invoices.filter(invoice => invoice.id !== id)
    
    if (filteredInvoices.length === invoices.length) {
      return false // Invoice not found
    }

    localStorage.setItem(CLIENT_INVOICES_STORAGE_KEY, JSON.stringify(filteredInvoices))
    return true
  } catch (error) {
    console.error("Failed to delete invoice:", error)
    return false
  }
}

/**
 * Delete all invoices for a specific client
 */
export function deleteAllClientInvoices(clientId: string): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    const invoices = getAllInvoices()
    const filteredInvoices = invoices.filter(invoice => invoice.clientId !== clientId)
    localStorage.setItem(CLIENT_INVOICES_STORAGE_KEY, JSON.stringify(filteredInvoices))
    return true
  } catch (error) {
    console.error("Failed to delete client invoices:", error)
    return false
  }
}

/**
 * Get invoice count for a client
 */
export function getClientInvoiceCount(clientId: string): number {
  return getClientInvoices(clientId).length
}

/**
 * Search clients by name or company
 */
export function searchClients(query: string): Client[] {
  if (!query.trim()) {
    return getAllClients()
  }

  const clients = getAllClients()
  const searchTerm = query.toLowerCase().trim()
  
  return clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm) ||
    (client.company && client.company.toLowerCase().includes(searchTerm))
  )
}