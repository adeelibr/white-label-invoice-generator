/**
 * Invoice Storage Utilities
 * Handles localStorage operations for invoice data (customer info, line items, totals)
 */

export interface LineItem {
  id: string
  description: string
  unitCost: string
  quantity: string
  amount: number
}

export interface InvoiceData {
  invoiceNumber: string
  purchaseOrder: string
  logo: string
  companyDetails: string
  billTo: string
  currency: string
  invoiceDate: string
  dueDate: string
  lineItems: LineItem[]
  notes: string
  bankDetails: string
  subtotal: number
  taxRate: string
  discount: string
  shippingFee: string
  total: number
}

const INVOICE_DATA_KEY = "invoiceGeneratorData"

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

/**
 * Save invoice data to localStorage
 */
export function saveInvoice(invoiceData: InvoiceData): void {
  if (!isBrowser()) {
    console.warn("saveInvoice: localStorage not available")
    return
  }

  try {
    localStorage.setItem(INVOICE_DATA_KEY, JSON.stringify(invoiceData))
  } catch (error) {
    console.error("Failed to save invoice data:", error)
  }
}

/**
 * Get invoice data from localStorage
 */
export function getInvoice(): InvoiceData | null {
  if (!isBrowser()) {
    console.warn("getInvoice: localStorage not available")
    return null
  }

  try {
    const savedData = localStorage.getItem(INVOICE_DATA_KEY)
    if (savedData) {
      return JSON.parse(savedData) as InvoiceData
    }
  } catch (error) {
    console.error("Failed to load invoice data:", error)
  }

  return null
}

/**
 * Clear invoice data from localStorage
 */
export function clearInvoice(): void {
  if (!isBrowser()) {
    console.warn("clearInvoice: localStorage not available")
    return
  }

  try {
    localStorage.removeItem(INVOICE_DATA_KEY)
  } catch (error) {
    console.error("Failed to clear invoice data:", error)
  }
}

/**
 * Check if invoice data exists in localStorage
 */
export function hasInvoiceData(): boolean {
  if (!isBrowser()) {
    return false
  }

  return localStorage.getItem(INVOICE_DATA_KEY) !== null
}