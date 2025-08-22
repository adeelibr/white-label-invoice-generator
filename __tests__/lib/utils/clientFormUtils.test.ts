/**
 * Tests for client form utilities
 */

import {
  getEmptyClientForm,
  populateClientForm,
  validateClientForm,
  saveNewClient,
  updateExistingClient
} from '../../../lib/utils/clientFormUtils'
import type { Client } from '@/lib/storage'

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  }
}))

jest.mock('@/lib/storage', () => ({
  updateClient: jest.fn(),
  saveClient: jest.fn(),
}))

import { toast } from 'sonner'
import { updateClient, saveClient } from '@/lib/storage'

const mockToast = toast as jest.Mocked<typeof toast>
const mockUpdateClient = updateClient as jest.MockedFunction<typeof updateClient>
const mockSaveClient = saveClient as jest.MockedFunction<typeof saveClient>

describe('clientFormUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getEmptyClientForm', () => {
    it('should return empty form data', () => {
      const formData = getEmptyClientForm()
      
      expect(formData).toEqual({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        notes: ""
      })
    })
  })

  describe('populateClientForm', () => {
    it('should populate form data from client', () => {
      const client: Client = {
        id: '1',
        name: 'Test Client',
        company: 'Test Company',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Test St',
        notes: 'Test notes',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
      
      const formData = populateClientForm(client)
      
      expect(formData).toEqual({
        name: 'Test Client',
        company: 'Test Company',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Test St',
        notes: 'Test notes'
      })
    })

    it('should handle missing optional fields', () => {
      const client: Client = {
        id: '1',
        name: 'Test Client',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
      
      const formData = populateClientForm(client)
      
      expect(formData).toEqual({
        name: 'Test Client',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      })
    })
  })

  describe('validateClientForm', () => {
    it('should return valid for form with name', () => {
      const formData = {
        name: 'Test Client',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      }
      
      const result = validateClientForm(formData)
      
      expect(result).toEqual({ isValid: true })
    })

    it('should return invalid for form without name', () => {
      const formData = {
        name: '',
        company: 'Test Company',
        email: 'test@example.com',
        phone: '',
        address: '',
        notes: ''
      }
      
      const result = validateClientForm(formData)
      
      expect(result).toEqual({
        isValid: false,
        error: 'Client name is required'
      })
    })

    it('should return invalid for form with whitespace-only name', () => {
      const formData = {
        name: '   ',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      }
      
      const result = validateClientForm(formData)
      
      expect(result).toEqual({
        isValid: false,
        error: 'Client name is required'
      })
    })
  })

  describe('saveNewClient', () => {
    it('should save client successfully', async () => {
      const formData = {
        name: 'Test Client',
        company: 'Test Company',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Test St',
        notes: 'Test notes'
      }
      
      const savedClient: Client = {
        id: '1',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        ...formData
      }
      
      mockSaveClient.mockReturnValue(savedClient)
      
      const result = await saveNewClient(formData)
      
      expect(result).toEqual({ success: true, client: savedClient })
      expect(mockSaveClient).toHaveBeenCalledWith(formData)
      expect(mockToast.success).toHaveBeenCalledWith('Client added successfully')
    })

    it('should handle validation errors', async () => {
      const formData = {
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      }
      
      const result = await saveNewClient(formData)
      
      expect(result).toEqual({ success: false })
      expect(mockToast.error).toHaveBeenCalledWith('Client name is required')
      expect(mockSaveClient).not.toHaveBeenCalled()
    })

    it('should handle save errors', async () => {
      const formData = {
        name: 'Test Client',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      }
      
      mockSaveClient.mockImplementation(() => {
        throw new Error('Save failed')
      })
      
      const result = await saveNewClient(formData)
      
      expect(result).toEqual({ success: false })
      expect(mockToast.error).toHaveBeenCalledWith('Failed to save client')
    })
  })

  describe('updateExistingClient', () => {
    it('should update client successfully', async () => {
      const formData = {
        name: 'Updated Client',
        company: 'Updated Company',
        email: 'updated@example.com',
        phone: '+0987654321',
        address: '456 Updated St',
        notes: 'Updated notes'
      }
      
      const updatedClient: Client = {
        id: '1',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        ...formData
      }
      
      mockUpdateClient.mockReturnValue(updatedClient)
      
      const result = await updateExistingClient('1', formData)
      
      expect(result).toEqual({ success: true, client: updatedClient })
      expect(mockUpdateClient).toHaveBeenCalledWith('1', formData)
      expect(mockToast.success).toHaveBeenCalledWith('Client updated successfully')
    })

    it('should handle validation errors', async () => {
      const formData = {
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      }
      
      const result = await updateExistingClient('1', formData)
      
      expect(result).toEqual({ success: false })
      expect(mockToast.error).toHaveBeenCalledWith('Client name is required')
      expect(mockUpdateClient).not.toHaveBeenCalled()
    })

    it('should handle update failure', async () => {
      const formData = {
        name: 'Test Client',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      }
      
      mockUpdateClient.mockReturnValue(null)
      
      const result = await updateExistingClient('1', formData)
      
      expect(result).toEqual({ success: false })
      expect(mockToast.error).toHaveBeenCalledWith('Failed to update client')
    })

    it('should handle update errors', async () => {
      const formData = {
        name: 'Test Client',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      }
      
      mockUpdateClient.mockImplementation(() => {
        throw new Error('Update failed')
      })
      
      const result = await updateExistingClient('1', formData)
      
      expect(result).toEqual({ success: false })
      expect(mockToast.error).toHaveBeenCalledWith('Failed to update client')
    })
  })
})