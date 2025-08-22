/**
 * Tests for useInvoice hook using React Testing Library renderHook
 */

import { renderHook, act } from '@testing-library/react'
import { useInvoice } from '../../../lib/hooks/useInvoice'

// Mock the storage and utils modules
jest.mock('../../../lib/storage', () => ({
  saveInvoice: jest.fn(),
  getInvoice: jest.fn(),
  getClientInvoiceById: jest.fn(),
  saveClientInvoice: jest.fn(),
  updateClientInvoice: jest.fn(),
}))

jest.mock('../../../lib/utils', () => ({
  deleteInvoiceWithConfirmation: jest.fn(),
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  }
}))

describe('useInvoice hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should initialize with empty invoice data', () => {
    const { result } = renderHook(() => useInvoice())
    
    expect(result.current.invoiceData.invoiceNumber).toBe('')
    expect(result.current.invoiceData.companyDetails).toBe('')
    expect(result.current.invoiceData.billTo).toBe('')
    expect(result.current.invoiceData.lineItems).toHaveLength(1)
    expect(result.current.invoiceData.subtotal).toBe(0)
    expect(result.current.invoiceData.total).toBe(0)
    expect(result.current.isLoading).toBe(false)
  })

  test('should load invoice data from storage', () => {
    const mockInvoiceData = {
      invoiceNumber: 'INV-001',
      purchaseOrder: '',
      logo: '',
      companyDetails: 'Test Company',
      billTo: 'Test Client',
      currency: 'USD',
      invoiceDate: '2023-01-01',
      dueDate: '',
      lineItems: [{ id: '1', description: 'Test Item', unitCost: '100', quantity: '2', amount: 200 }],
      notes: '',
      bankDetails: '',
      subtotal: 200,
      taxRate: '',
      discount: '',
      shippingFee: '',
      total: 200,
    }
    
    const { getInvoice } = require('../../../lib/storage')
    getInvoice.mockReturnValue(mockInvoiceData)

    const { result } = renderHook(() => useInvoice())
    
    act(() => {
      result.current.loadInvoice()
    })
    
    expect(result.current.invoiceData.invoiceNumber).toBe('INV-001')
    expect(result.current.invoiceData.companyDetails).toBe('Test Company')
    expect(result.current.invoiceData.billTo).toBe('Test Client')
  })

  test('should update invoice data', () => {
    const { result } = renderHook(() => useInvoice())
    
    const newData = {
      invoiceNumber: 'INV-002',
      companyDetails: 'Updated Company',
      billTo: 'Updated Client'
    }

    act(() => {
      result.current.setInvoiceData(prev => ({
        ...prev,
        ...newData
      }))
    })
    
    expect(result.current.invoiceData.invoiceNumber).toBe('INV-002')
    expect(result.current.invoiceData.companyDetails).toBe('Updated Company')
    expect(result.current.invoiceData.billTo).toBe('Updated Client')
  })

  test('should add a line item', () => {
    const { result } = renderHook(() => useInvoice())
    
    const initialItemsCount = result.current.invoiceData.lineItems.length

    act(() => {
      result.current.addLineItem()
    })
    
    expect(result.current.invoiceData.lineItems).toHaveLength(initialItemsCount + 1)
    
    const newItem = result.current.invoiceData.lineItems[result.current.invoiceData.lineItems.length - 1]
    expect(newItem.description).toBe('')
    expect(newItem.unitCost).toBe('')
    expect(newItem.quantity).toBe('1')
    expect(newItem.amount).toBe(0)
  })

  test('should remove a line item', () => {
    const { result } = renderHook(() => useInvoice())
    
    // Add an item first
    act(() => {
      result.current.addLineItem()
    })
    
    const itemsCount = result.current.invoiceData.lineItems.length
    const itemToRemove = result.current.invoiceData.lineItems[0]

    act(() => {
      result.current.removeLineItem(itemToRemove.id)
    })
    
    expect(result.current.invoiceData.lineItems).toHaveLength(itemsCount - 1)
  })

  test('should calculate totals', () => {
    const { result } = renderHook(() => useInvoice())
    
    // Set some line items with amounts
    act(() => {
      result.current.setInvoiceData(prev => ({
        ...prev,
        lineItems: [
          { id: '1', description: 'Item 1', unitCost: '100', quantity: '2', amount: 200 },
          { id: '2', description: 'Item 2', unitCost: '50', quantity: '3', amount: 150 }
        ]
      }))
    })

    act(() => {
      result.current.calculateTotals()
    })
    
    expect(result.current.invoiceData.subtotal).toBe(350)
  })

  test('should generate unique invoice number', () => {
    const { result } = renderHook(() => useInvoice())
    
    const invoiceNumber1 = result.current.generateInvoiceNumber()
    const invoiceNumber2 = result.current.generateInvoiceNumber()
    
    expect(invoiceNumber1).toMatch(/^INV-\d+-[A-Z0-9]+$/)
    expect(invoiceNumber2).toMatch(/^INV-\d+-[A-Z0-9]+$/)
    expect(invoiceNumber1).not.toBe(invoiceNumber2)
  })

  test('should save client invoice', async () => {
    const mockInvoice = { id: '1', clientId: '1', invoiceData: {} }
    const { saveClientInvoice } = require('../../../lib/storage')
    saveClientInvoice.mockReturnValue(mockInvoice)

    const { result } = renderHook(() => useInvoice())
    
    const saveResult = await act(async () => {
      return await result.current.saveClientInvoiceData('client-1', 'sent')
    })
    
    expect(saveResult.success).toBe(true)
    expect(saveResult.invoice).toEqual(mockInvoice)
    expect(saveClientInvoice).toHaveBeenCalledWith('client-1', expect.any(Object), 'sent')
  })

  test('should load client invoice', async () => {
    const mockClientInvoice = {
      id: '1',
      clientId: '1',
      invoiceData: {
        invoiceNumber: 'INV-001',
        purchaseOrder: '',
        logo: '',
        companyDetails: 'Test Company',
        billTo: '',
        currency: 'USD',
        invoiceDate: '2023-01-01',
        dueDate: '',
        lineItems: [{ id: '1', description: 'Test Item', unitCost: '100', quantity: '1', amount: 100 }],
        notes: '',
        bankDetails: '',
        subtotal: 100,
        taxRate: '',
        discount: '',
        shippingFee: '',
        total: 100,
      }
    }

    const { getClientInvoiceById } = require('../../../lib/storage')
    getClientInvoiceById.mockReturnValue(mockClientInvoice)

    const { result } = renderHook(() => useInvoice())
    
    const loadResult = await act(async () => {
      return await result.current.loadClientInvoice('1')
    })
    
    expect(loadResult).toEqual(mockClientInvoice)
    expect(result.current.invoiceData.invoiceNumber).toBe('INV-001')
    expect(result.current.invoiceData.companyDetails).toBe('Test Company')
  })

  test('should delete invoice', async () => {
    const { deleteInvoiceWithConfirmation } = require('../../../lib/utils')
    deleteInvoiceWithConfirmation.mockResolvedValue(true)

    const { result } = renderHook(() => useInvoice())
    
    const deleteResult = await act(async () => {
      return await result.current.deleteInvoice('1')
    })
    
    expect(deleteResult).toBe(true)
    expect(deleteInvoiceWithConfirmation).toHaveBeenCalledWith('1')
  })
})