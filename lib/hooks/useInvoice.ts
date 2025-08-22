/**
 * useInvoice Hook
 * 
 * Centralizes invoice CRUD operations and calculations that's repeated across components.
 * Handles invoice data state, persistence, calculations, and CRUD operations.
 */

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { 
  saveInvoice, 
  getInvoice, 
  getClientInvoiceById,
  saveClientInvoice,
  updateClientInvoice,
  type InvoiceData, 
  type ClientInvoice
} from "@/lib/storage"
import { deleteInvoiceWithConfirmation } from "@/lib/utils"

export interface UseInvoiceReturn {
  // State
  invoiceData: InvoiceData
  isLoading: boolean
  
  // Actions
  setInvoiceData: (data: InvoiceData | ((prev: InvoiceData) => InvoiceData)) => void
  loadInvoice: () => void
  loadClientInvoice: (invoiceId: string) => Promise<ClientInvoice | null>
  saveInvoiceData: () => void
  saveClientInvoiceData: (clientId: string, status?: string) => Promise<{ success: boolean; invoice?: ClientInvoice }>
  updateClientInvoiceData: (invoiceId: string, clientId: string) => Promise<{ success: boolean; invoice?: ClientInvoice }>
  deleteInvoice: (invoiceId: string) => Promise<boolean>
  calculateTotals: () => void
  addLineItem: () => void
  removeLineItem: (id: string) => void
  generateInvoiceNumber: () => string
}

/**
 * Get initial empty invoice data
 */
const getEmptyInvoiceData = (): InvoiceData => ({
  invoiceNumber: "",
  purchaseOrder: "",
  logo: "",
  companyDetails: "",
  billTo: "",
  currency: "USD",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  lineItems: [{ id: "1", description: "", unitCost: "", quantity: "1", amount: 0 }],
  notes: "",
  bankDetails: "",
  subtotal: 0,
  taxRate: "",
  discount: "",
  shippingFee: "",
  total: 0,
})

/**
 * Custom hook for managing invoice operations
 */
export function useInvoice(): UseInvoiceReturn {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(getEmptyInvoiceData())
  const [isLoading, setIsLoading] = useState(false)

  // Load invoice data from localStorage
  const loadInvoice = useCallback(() => {
    const savedData = getInvoice()
    if (savedData) {
      setInvoiceData(savedData)
    }
  }, [])

  // Load specific client invoice
  const loadClientInvoice = useCallback(async (invoiceId: string): Promise<ClientInvoice | null> => {
    setIsLoading(true)
    try {
      const invoice = getClientInvoiceById(invoiceId)
      if (invoice) {
        setInvoiceData(invoice.invoiceData)
        return invoice
      }
      return null
    } catch (error) {
      console.error("Failed to load invoice:", error)
      toast.error("Failed to load invoice")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save invoice data to localStorage
  const saveInvoiceData = useCallback(() => {
    saveInvoice(invoiceData)
  }, [invoiceData])

  // Save client invoice with error handling
  const saveClientInvoiceData = useCallback(async (
    clientId: string, 
    status: string = "draft"
  ): Promise<{ success: boolean; invoice?: ClientInvoice }> => {
    try {
      const invoice = saveClientInvoice(clientId, invoiceData, status)
      toast.success("Invoice saved successfully")
      return { success: true, invoice }
    } catch (error) {
      console.error("Failed to save invoice:", error)
      toast.error("Failed to save invoice")
      return { success: false }
    }
  }, [invoiceData])

  // Update existing client invoice
  const updateClientInvoiceData = useCallback(async (
    invoiceId: string,
    clientId: string
  ): Promise<{ success: boolean; invoice?: ClientInvoice }> => {
    try {
      const updated = updateClientInvoice(invoiceId, clientId, invoiceData)
      if (updated) {
        toast.success("Invoice updated successfully")
        return { success: true, invoice: updated }
      } else {
        toast.error("Failed to update invoice")
        return { success: false }
      }
    } catch (error) {
      console.error("Failed to update invoice:", error)
      toast.error("Failed to update invoice")
      return { success: false }
    }
  }, [invoiceData])

  // Delete invoice with confirmation
  const deleteInvoice = useCallback(async (invoiceId: string) => {
    return await deleteInvoiceWithConfirmation(invoiceId)
  }, [])

  // Calculate totals based on line items, tax, discount, shipping
  const calculateTotals = useCallback(() => {
    setInvoiceData(prev => {
      // Calculate subtotal from line items
      const subtotal = prev.lineItems.reduce((sum, item) => sum + (item.amount || 0), 0)
      
      // Calculate tax amount
      const taxRate = parseFloat(prev.taxRate) || 0
      const taxAmount = subtotal * (taxRate / 100)
      
      // Calculate discount amount
      const discountRate = parseFloat(prev.discount) || 0
      const discountAmount = subtotal * (discountRate / 100)
      
      // Calculate shipping fee
      const shippingFee = parseFloat(prev.shippingFee) || 0
      
      // Calculate total
      const total = subtotal + taxAmount - discountAmount + shippingFee
      
      return {
        ...prev,
        subtotal,
        total: Math.max(0, total) // Ensure total is not negative
      }
    })
  }, [])

  // Add new line item
  const addLineItem = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9)
    setInvoiceData(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: newId, description: "", unitCost: "", quantity: "1", amount: 0 }
      ]
    }))
  }, [])

  // Remove line item
  const removeLineItem = useCallback((id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }))
  }, [])

  // Generate unique invoice number
  const generateInvoiceNumber = useCallback(() => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 3).toUpperCase()
    return `INV-${timestamp}-${random}`
  }, [])

  // Auto-save invoice data when it changes
  useEffect(() => {
    saveInvoiceData()
  }, [invoiceData, saveInvoiceData])

  // Recalculate totals when line items, tax, discount, or shipping changes
  useEffect(() => {
    calculateTotals()
  }, [invoiceData.lineItems, invoiceData.taxRate, invoiceData.discount, invoiceData.shippingFee, calculateTotals])

  return {
    invoiceData,
    isLoading,
    setInvoiceData,
    loadInvoice,
    loadClientInvoice,
    saveInvoiceData,
    saveClientInvoiceData,
    updateClientInvoiceData,
    deleteInvoice,
    calculateTotals,
    addLineItem,
    removeLineItem,
    generateInvoiceNumber,
  }
}