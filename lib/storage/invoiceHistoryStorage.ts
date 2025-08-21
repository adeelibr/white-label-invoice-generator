/**
 * Invoice History Storage Utilities
 * Handles localStorage operations for invoice history management
 */

import type { InvoiceData, LineItem } from './invoiceStorage'

export interface InvoiceHistoryItem extends InvoiceData {
  id: string
  clientId: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  createdAt: string
  updatedAt: string
  dueAmount?: number
  paidAmount?: number
  paidAt?: string
}

export interface InvoiceFilter {
  clientId?: string
  status?: InvoiceHistoryItem['status']
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
}

export interface InvoiceSortOptions {
  field: 'invoiceDate' | 'dueDate' | 'total' | 'createdAt' | 'updatedAt' | 'invoiceNumber'
  direction: 'asc' | 'desc'
}

const INVOICE_HISTORY_KEY = "invoiceGenerator_invoiceHistory"
const INVOICE_COUNTER_KEY = "invoiceGenerator_invoiceCounter"

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

/**
 * Generate unique invoice ID
 */
function generateInvoiceId(): string {
  return `invoice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get next invoice number
 */
export function getNextInvoiceNumber(clientId?: string): string {
  if (!isBrowser()) {
    return "INV-001"
  }

  try {
    const counterData = localStorage.getItem(INVOICE_COUNTER_KEY)
    let counter = 1
    
    if (counterData) {
      const counters = JSON.parse(counterData) as Record<string, number>
      if (clientId && counters[clientId]) {
        counter = counters[clientId] + 1
      } else {
        // Global counter for all invoices
        counter = (counters.global || 0) + 1
      }
    }
    
    return `INV-${counter.toString().padStart(4, '0')}`
  } catch (error) {
    console.error("Failed to get next invoice number:", error)
    return "INV-001"
  }
}

/**
 * Increment invoice counter
 */
function incrementInvoiceCounter(clientId?: string): void {
  if (!isBrowser()) {
    return
  }

  try {
    const counterData = localStorage.getItem(INVOICE_COUNTER_KEY)
    let counters: Record<string, number> = {}
    
    if (counterData) {
      counters = JSON.parse(counterData)
    }
    
    // Increment global counter
    counters.global = (counters.global || 0) + 1
    
    // Increment client-specific counter if clientId provided
    if (clientId) {
      counters[clientId] = (counters[clientId] || 0) + 1
    }
    
    localStorage.setItem(INVOICE_COUNTER_KEY, JSON.stringify(counters))
  } catch (error) {
    console.error("Failed to increment invoice counter:", error)
  }
}

/**
 * Get all invoices from localStorage
 */
export function getAllInvoices(): InvoiceHistoryItem[] {
  if (!isBrowser()) {
    console.warn("getAllInvoices: localStorage not available")
    return []
  }

  try {
    const invoicesData = localStorage.getItem(INVOICE_HISTORY_KEY)
    if (invoicesData) {
      return JSON.parse(invoicesData) as InvoiceHistoryItem[]
    }
  } catch (error) {
    console.error("Failed to load invoices:", error)
  }

  return []
}

/**
 * Save all invoices to localStorage
 */
function saveAllInvoices(invoices: InvoiceHistoryItem[]): void {
  if (!isBrowser()) {
    console.warn("saveAllInvoices: localStorage not available")
    return
  }

  try {
    localStorage.setItem(INVOICE_HISTORY_KEY, JSON.stringify(invoices))
  } catch (error) {
    console.error("Failed to save invoices:", error)
  }
}

/**
 * Add a new invoice to history
 */
export function addInvoiceToHistory(
  invoiceData: InvoiceData, 
  clientId: string, 
  status: InvoiceHistoryItem['status'] = 'draft'
): InvoiceHistoryItem {
  const invoices = getAllInvoices()
  const now = new Date().toISOString()
  
  // Auto-generate invoice number if not provided
  if (!invoiceData.invoiceNumber) {
    invoiceData.invoiceNumber = getNextInvoiceNumber(clientId)
  }
  
  const newInvoice: InvoiceHistoryItem = {
    ...invoiceData,
    id: generateInvoiceId(),
    clientId,
    status,
    createdAt: now,
    updatedAt: now,
    dueAmount: invoiceData.total,
    paidAmount: 0
  }
  
  invoices.push(newInvoice)
  saveAllInvoices(invoices)
  incrementInvoiceCounter(clientId)
  
  return newInvoice
}

/**
 * Update an existing invoice
 */
export function updateInvoice(
  invoiceId: string, 
  updates: Partial<Omit<InvoiceHistoryItem, 'id' | 'createdAt'>>
): InvoiceHistoryItem | null {
  const invoices = getAllInvoices()
  const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId)
  
  if (invoiceIndex === -1) {
    console.error("Invoice not found:", invoiceId)
    return null
  }
  
  const updatedInvoice: InvoiceHistoryItem = {
    ...invoices[invoiceIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  // Update due amount when total changes
  if (updates.total !== undefined && updates.dueAmount === undefined) {
    updatedInvoice.dueAmount = updatedInvoice.total - (updatedInvoice.paidAmount || 0)
  }
  
  invoices[invoiceIndex] = updatedInvoice
  saveAllInvoices(invoices)
  
  return updatedInvoice
}

/**
 * Delete an invoice
 */
export function deleteInvoice(invoiceId: string): boolean {
  const invoices = getAllInvoices()
  const filteredInvoices = invoices.filter(inv => inv.id !== invoiceId)
  
  if (filteredInvoices.length === invoices.length) {
    console.error("Invoice not found:", invoiceId)
    return false
  }
  
  saveAllInvoices(filteredInvoices)
  return true
}

/**
 * Get invoice by ID
 */
export function getInvoiceById(invoiceId: string): InvoiceHistoryItem | null {
  const invoices = getAllInvoices()
  return invoices.find(inv => inv.id === invoiceId) || null
}

/**
 * Get invoices for a specific client
 */
export function getInvoicesByClient(clientId: string): InvoiceHistoryItem[] {
  const invoices = getAllInvoices()
  return invoices.filter(inv => inv.clientId === clientId)
}

/**
 * Filter and sort invoices
 */
export function getFilteredInvoices(
  filter: InvoiceFilter = {},
  sort: InvoiceSortOptions = { field: 'createdAt', direction: 'desc' }
): InvoiceHistoryItem[] {
  let invoices = getAllInvoices()
  
  // Apply filters
  if (filter.clientId) {
    invoices = invoices.filter(inv => inv.clientId === filter.clientId)
  }
  
  if (filter.status) {
    invoices = invoices.filter(inv => inv.status === filter.status)
  }
  
  if (filter.dateFrom) {
    invoices = invoices.filter(inv => inv.invoiceDate >= filter.dateFrom!)
  }
  
  if (filter.dateTo) {
    invoices = invoices.filter(inv => inv.invoiceDate <= filter.dateTo!)
  }
  
  if (filter.amountMin !== undefined) {
    invoices = invoices.filter(inv => inv.total >= filter.amountMin!)
  }
  
  if (filter.amountMax !== undefined) {
    invoices = invoices.filter(inv => inv.total <= filter.amountMax!)
  }
  
  // Apply sorting
  invoices.sort((a, b) => {
    let aValue = a[sort.field]
    let bValue = b[sort.field]
    
    // Handle string/date comparisons
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1
    return 0
  })
  
  return invoices
}

/**
 * Duplicate an invoice
 */
export function duplicateInvoice(invoiceId: string, clientId?: string): InvoiceHistoryItem | null {
  const invoice = getInvoiceById(invoiceId)
  if (!invoice) {
    console.error("Invoice not found for duplication:", invoiceId)
    return null
  }
  
  // Create new invoice data without IDs and timestamps
  const duplicateData: InvoiceData = {
    invoiceNumber: "", // Will be auto-generated
    purchaseOrder: invoice.purchaseOrder,
    logo: invoice.logo,
    companyDetails: invoice.companyDetails,
    billTo: invoice.billTo,
    currency: invoice.currency,
    invoiceDate: new Date().toISOString().split('T')[0], // Today's date
    dueDate: invoice.dueDate,
    lineItems: invoice.lineItems.map(item => ({ ...item, id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}` })),
    notes: invoice.notes,
    bankDetails: invoice.bankDetails,
    subtotal: invoice.subtotal,
    taxRate: invoice.taxRate,
    discount: invoice.discount,
    shippingFee: invoice.shippingFee,
    total: invoice.total
  }
  
  return addInvoiceToHistory(duplicateData, clientId || invoice.clientId, 'draft')
}

/**
 * Get invoice statistics
 */
export function getInvoiceStats(clientId?: string): {
  totalInvoices: number
  totalAmount: number
  paidAmount: number
  unpaidAmount: number
  overdue: number
  byStatus: Record<InvoiceHistoryItem['status'], number>
} {
  let invoices = getAllInvoices()
  
  if (clientId) {
    invoices = invoices.filter(inv => inv.clientId === clientId)
  }
  
  const totalInvoices = invoices.length
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const paidAmount = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)
  const unpaidAmount = totalAmount - paidAmount
  
  // Count overdue invoices
  const today = new Date().toISOString().split('T')[0]
  const overdue = invoices.filter(inv => 
    inv.status !== 'paid' && 
    inv.status !== 'cancelled' &&
    inv.dueDate < today
  ).length
  
  // Count by status
  const byStatus: Record<InvoiceHistoryItem['status'], number> = {
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
    cancelled: 0
  }
  
  invoices.forEach(inv => {
    byStatus[inv.status]++
  })
  
  return {
    totalInvoices,
    totalAmount,
    paidAmount,
    unpaidAmount,
    overdue,
    byStatus
  }
}

/**
 * Mark invoice as paid
 */
export function markInvoiceAsPaid(invoiceId: string, paidAmount?: number): InvoiceHistoryItem | null {
  const invoice = getInvoiceById(invoiceId)
  if (!invoice) {
    console.error("Invoice not found:", invoiceId)
    return null
  }
  
  const finalPaidAmount = paidAmount !== undefined ? paidAmount : invoice.total
  
  return updateInvoice(invoiceId, {
    status: 'paid',
    paidAmount: finalPaidAmount,
    paidAt: new Date().toISOString(),
    dueAmount: invoice.total - finalPaidAmount
  })
}

/**
 * Search invoices by invoice number or client info
 */
export function searchInvoices(query: string, clientId?: string): InvoiceHistoryItem[] {
  let invoices = getAllInvoices()
  
  if (clientId) {
    invoices = invoices.filter(inv => inv.clientId === clientId)
  }
  
  const lowercaseQuery = query.toLowerCase()
  
  return invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
    invoice.billTo.toLowerCase().includes(lowercaseQuery) ||
    invoice.purchaseOrder.toLowerCase().includes(lowercaseQuery) ||
    invoice.notes.toLowerCase().includes(lowercaseQuery)
  )
}