/**
 * Tests for client operations utilities
 */

import {
  deleteClientWithConfirmation,
  deleteInvoiceWithConfirmation,
  getInvoiceStatusBadge
} from '../../../lib/utils/clientOperations'

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  }
}))

jest.mock('@/lib/storage', () => ({
  deleteClient: jest.fn(),
  deleteInvoice: jest.fn(),
}))

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn()
})

import { toast } from 'sonner'
import { deleteClient, deleteInvoice } from '@/lib/storage'

const mockToast = toast as jest.Mocked<typeof toast>
const mockDeleteClient = deleteClient as jest.MockedFunction<typeof deleteClient>
const mockDeleteInvoice = deleteInvoice as jest.MockedFunction<typeof deleteInvoice>
const mockConfirm = window.confirm as jest.MockedFunction<typeof window.confirm>

describe('clientOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('deleteClientWithConfirmation', () => {
    it('should delete client when confirmed', async () => {
      mockConfirm.mockReturnValue(true)
      mockDeleteClient.mockReturnValue(true)
      
      const result = await deleteClientWithConfirmation('client-1')
      
      expect(result).toBe(true)
      expect(mockConfirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this client? This will also delete all their invoices.'
      )
      expect(mockDeleteClient).toHaveBeenCalledWith('client-1')
      expect(mockToast.success).toHaveBeenCalledWith('Client deleted successfully')
    })

    it('should not delete client when not confirmed', async () => {
      mockConfirm.mockReturnValue(false)
      
      const result = await deleteClientWithConfirmation('client-1')
      
      expect(result).toBe(false)
      expect(mockDeleteClient).not.toHaveBeenCalled()
      expect(mockToast.success).not.toHaveBeenCalled()
      expect(mockToast.error).not.toHaveBeenCalled()
    })

    it('should handle delete failure', async () => {
      mockConfirm.mockReturnValue(true)
      mockDeleteClient.mockReturnValue(false)
      
      const result = await deleteClientWithConfirmation('client-1')
      
      expect(result).toBe(false)
      expect(mockDeleteClient).toHaveBeenCalledWith('client-1')
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete client')
    })

    it('should handle delete errors', async () => {
      mockConfirm.mockReturnValue(true)
      mockDeleteClient.mockImplementation(() => {
        throw new Error('Delete failed')
      })
      
      const result = await deleteClientWithConfirmation('client-1')
      
      expect(result).toBe(false)
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete client')
    })
  })

  describe('deleteInvoiceWithConfirmation', () => {
    it('should delete invoice when confirmed', async () => {
      mockConfirm.mockReturnValue(true)
      mockDeleteInvoice.mockReturnValue(true)
      
      const result = await deleteInvoiceWithConfirmation('invoice-1')
      
      expect(result).toBe(true)
      expect(mockConfirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this invoice?'
      )
      expect(mockDeleteInvoice).toHaveBeenCalledWith('invoice-1')
      expect(mockToast.success).toHaveBeenCalledWith('Invoice deleted successfully')
    })

    it('should not delete invoice when not confirmed', async () => {
      mockConfirm.mockReturnValue(false)
      
      const result = await deleteInvoiceWithConfirmation('invoice-1')
      
      expect(result).toBe(false)
      expect(mockDeleteInvoice).not.toHaveBeenCalled()
      expect(mockToast.success).not.toHaveBeenCalled()
      expect(mockToast.error).not.toHaveBeenCalled()
    })

    it('should handle delete failure', async () => {
      mockConfirm.mockReturnValue(true)
      mockDeleteInvoice.mockReturnValue(false)
      
      const result = await deleteInvoiceWithConfirmation('invoice-1')
      
      expect(result).toBe(false)
      expect(mockDeleteInvoice).toHaveBeenCalledWith('invoice-1')
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete invoice')
    })

    it('should handle delete errors', async () => {
      mockConfirm.mockReturnValue(true)
      mockDeleteInvoice.mockImplementation(() => {
        throw new Error('Delete failed')
      })
      
      const result = await deleteInvoiceWithConfirmation('invoice-1')
      
      expect(result).toBe(false)
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete invoice')
    })
  })

  describe('getInvoiceStatusBadge', () => {
    it('should return correct classes for draft status', () => {
      const classes = getInvoiceStatusBadge('draft')
      expect(classes).toBe('bg-gray-100 text-gray-800')
    })

    it('should return correct classes for sent status', () => {
      const classes = getInvoiceStatusBadge('sent')
      expect(classes).toBe('bg-blue-100 text-blue-800')
    })

    it('should return correct classes for paid status', () => {
      const classes = getInvoiceStatusBadge('paid')
      expect(classes).toBe('bg-green-100 text-green-800')
    })

    it('should return correct classes for overdue status', () => {
      const classes = getInvoiceStatusBadge('overdue')
      expect(classes).toBe('bg-red-100 text-red-800')
    })

    it('should return draft classes for unknown status', () => {
      const classes = getInvoiceStatusBadge('unknown')
      expect(classes).toBe('bg-gray-100 text-gray-800')
    })
  })
})