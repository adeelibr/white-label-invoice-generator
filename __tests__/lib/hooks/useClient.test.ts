/**
 * Tests for useClient hook using React Testing Library renderHook
 */

import { renderHook, act } from '@testing-library/react'
import { useClient } from '../../../lib/hooks/useClient'

// Mock the storage and utils modules
jest.mock('../../../lib/storage', () => ({
  getClient: jest.fn(),
  getClientInvoices: jest.fn(() => []),
  getAllClients: jest.fn(() => []),
}))

jest.mock('../../../lib/utils', () => ({
  getEmptyClientForm: jest.fn(() => ({ 
    name: '', 
    email: '', 
    phone: '',
    address: '' 
  })),
  populateClientForm: jest.fn((client) => ({
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address || ''
  })),
  saveNewClient: jest.fn(),
  updateExistingClient: jest.fn(),
  deleteClientWithConfirmation: jest.fn(),
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  }
}))

describe('useClient hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useClient())
    
    expect(result.current.client).toBeNull()
    expect(result.current.clients).toEqual([])
    expect(result.current.clientForm).toEqual({
      name: '', 
      email: '', 
      phone: '',
      address: ''
    })
    expect(result.current.invoices).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  test('should load client data', async () => {
    const mockClient = { id: '1', name: 'Test Client', email: 'test@example.com' }
    const mockInvoices = [{ id: '1', clientId: '1', amount: 100 }]
    
    const { getClient, getClientInvoices } = require('../../../lib/storage')
    getClient.mockReturnValue(mockClient)
    getClientInvoices.mockReturnValue(mockInvoices)

    const { result } = renderHook(() => useClient())
    
    await act(async () => {
      await result.current.loadClient('1')
    })
    
    expect(result.current.client).toEqual(mockClient)
    expect(result.current.invoices).toEqual(mockInvoices)
  })

  test('should load all clients', async () => {
    const mockClients = [
      { id: '1', name: 'Client 1', email: 'client1@example.com' },
      { id: '2', name: 'Client 2', email: 'client2@example.com' }
    ]
    
    const { getAllClients } = require('../../../lib/storage')
    getAllClients.mockReturnValue(mockClients)

    const { result } = renderHook(() => useClient())
    
    await act(async () => {
      await result.current.loadAllClients()
    })
    
    expect(result.current.clients).toEqual(mockClients)
  })

  test('should update client form', () => {
    const { result } = renderHook(() => useClient())
    
    const newFormData = {
      name: 'Updated Client',
      email: 'updated@example.com',
      phone: '555-0123',
      address: '123 Main St'
    }

    act(() => {
      result.current.setClientForm(newFormData)
    })
    
    expect(result.current.clientForm).toEqual(newFormData)
  })

  test('should reset client form', () => {
    const { result } = renderHook(() => useClient())
    
    // First update the form
    act(() => {
      result.current.setClientForm({
        name: 'Test Client',
        email: 'test@example.com',
        phone: '555-0123',
        address: '123 Test St'
      })
    })
    
    expect(result.current.clientForm.name).toBe('Test Client')
    
    // Then reset it
    act(() => {
      result.current.resetClientForm()
    })
    
    expect(result.current.clientForm).toEqual({
      name: '', 
      email: '', 
      phone: '',
      address: ''
    })
  })

  test('should save a new client', async () => {
    const { saveNewClient } = require('../../../lib/utils')
    saveNewClient.mockResolvedValue({ success: true, client: { id: '1', name: 'New Client' } })

    const { result } = renderHook(() => useClient())
    
    const saveResult = await act(async () => {
      return await result.current.saveClient()
    })
    
    expect(saveResult.success).toBe(true)
    expect(saveNewClient).toHaveBeenCalled()
  })

  test('should handle edit client', () => {
    const mockClient = {
      id: '1',
      name: 'Edit Client',
      email: 'edit@example.com',
      phone: '555-9999',
      address: '999 Edit St'
    }

    const { result } = renderHook(() => useClient())
    
    act(() => {
      result.current.handleEditClient(mockClient)
    })
    
    const { populateClientForm } = require('../../../lib/utils')
    expect(populateClientForm).toHaveBeenCalledWith(mockClient)
  })
})