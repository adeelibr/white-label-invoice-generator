/**
 * Client Storage Utilities
 * Handles localStorage operations for client management
 */

export interface Client {
  id: string
  name: string
  email: string
  address: string
  phone?: string
  website?: string
  createdAt: string
  updatedAt: string
  invoiceCount: number
}

const CLIENTS_KEY = "invoiceGenerator_clients"

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

/**
 * Generate unique client ID
 */
function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get all clients from localStorage
 */
export function getAllClients(): Client[] {
  if (!isBrowser()) {
    console.warn("getAllClients: localStorage not available")
    return []
  }

  try {
    const clientsData = localStorage.getItem(CLIENTS_KEY)
    if (clientsData) {
      return JSON.parse(clientsData) as Client[]
    }
  } catch (error) {
    console.error("Failed to load clients:", error)
  }

  return []
}

/**
 * Save all clients to localStorage
 */
function saveAllClients(clients: Client[]): void {
  if (!isBrowser()) {
    console.warn("saveAllClients: localStorage not available")
    return
  }

  try {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
  } catch (error) {
    console.error("Failed to save clients:", error)
  }
}

/**
 * Add a new client
 */
export function addClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'invoiceCount'>): Client {
  const clients = getAllClients()
  const now = new Date().toISOString()
  
  const newClient: Client = {
    ...clientData,
    id: generateClientId(),
    createdAt: now,
    updatedAt: now,
    invoiceCount: 0
  }
  
  clients.push(newClient)
  saveAllClients(clients)
  
  return newClient
}

/**
 * Update an existing client
 */
export function updateClient(clientId: string, updates: Partial<Omit<Client, 'id' | 'createdAt' | 'invoiceCount'>>): Client | null {
  const clients = getAllClients()
  const clientIndex = clients.findIndex(c => c.id === clientId)
  
  if (clientIndex === -1) {
    console.error("Client not found:", clientId)
    return null
  }
  
  const updatedClient: Client = {
    ...clients[clientIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  clients[clientIndex] = updatedClient
  saveAllClients(clients)
  
  return updatedClient
}

/**
 * Delete a client
 */
export function deleteClient(clientId: string): boolean {
  const clients = getAllClients()
  const filteredClients = clients.filter(c => c.id !== clientId)
  
  if (filteredClients.length === clients.length) {
    console.error("Client not found:", clientId)
    return false
  }
  
  saveAllClients(filteredClients)
  return true
}

/**
 * Get client by ID
 */
export function getClientById(clientId: string): Client | null {
  const clients = getAllClients()
  return clients.find(c => c.id === clientId) || null
}

/**
 * Search clients by name or email
 */
export function searchClients(query: string): Client[] {
  const clients = getAllClients()
  const lowercaseQuery = query.toLowerCase()
  
  return clients.filter(client => 
    client.name.toLowerCase().includes(lowercaseQuery) ||
    client.email.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Increment invoice count for a client
 */
export function incrementClientInvoiceCount(clientId: string): void {
  const clients = getAllClients()
  const clientIndex = clients.findIndex(c => c.id === clientId)
  
  if (clientIndex !== -1) {
    clients[clientIndex].invoiceCount += 1
    clients[clientIndex].updatedAt = new Date().toISOString()
    saveAllClients(clients)
  }
}

/**
 * Get client statistics
 */
export function getClientStats(): {
  totalClients: number
  totalInvoices: number
  averageInvoicesPerClient: number
} {
  const clients = getAllClients()
  const totalClients = clients.length
  const totalInvoices = clients.reduce((sum, client) => sum + client.invoiceCount, 0)
  const averageInvoicesPerClient = totalClients > 0 ? totalInvoices / totalClients : 0

  return {
    totalClients,
    totalInvoices,
    averageInvoicesPerClient: Math.round(averageInvoicesPerClient * 100) / 100
  }
}