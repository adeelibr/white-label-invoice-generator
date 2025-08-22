/**
 * Tests for useModal hook using React Testing Library renderHook
 */

import { renderHook, act } from '@testing-library/react'
import { useModal, useTypedModal } from '../../../lib/hooks/useModal'

describe('useModal hook', () => {
  test('should initialize with no modals open', () => {
    const { result } = renderHook(() => useModal())
    
    expect(result.current.openModals.size).toBe(0)
    expect(result.current.isOpen('test-modal')).toBe(false)
  })

  test('should open a modal', () => {
    const { result } = renderHook(() => useModal())
    
    act(() => {
      result.current.openModal('test-modal')
    })
    
    expect(result.current.isOpen('test-modal')).toBe(true)
    expect(result.current.openModals.has('test-modal')).toBe(true)
    expect(result.current.openModals.size).toBe(1)
  })

  test('should close a modal', () => {
    const { result } = renderHook(() => useModal())
    
    // First open a modal
    act(() => {
      result.current.openModal('test-modal')
    })
    
    expect(result.current.isOpen('test-modal')).toBe(true)
    
    // Then close it
    act(() => {
      result.current.closeModal('test-modal')
    })
    
    expect(result.current.isOpen('test-modal')).toBe(false)
    expect(result.current.openModals.has('test-modal')).toBe(false)
    expect(result.current.openModals.size).toBe(0)
  })

  test('should toggle a modal', () => {
    const { result } = renderHook(() => useModal())
    
    // Toggle to open
    act(() => {
      result.current.toggleModal('test-modal')
    })
    
    expect(result.current.isOpen('test-modal')).toBe(true)
    
    // Toggle to close
    act(() => {
      result.current.toggleModal('test-modal')
    })
    
    expect(result.current.isOpen('test-modal')).toBe(false)
  })

  test('should handle multiple modals', () => {
    const { result } = renderHook(() => useModal())
    
    act(() => {
      result.current.openModal('modal-1')
      result.current.openModal('modal-2')
      result.current.openModal('modal-3')
    })
    
    expect(result.current.openModals.size).toBe(3)
    expect(result.current.isOpen('modal-1')).toBe(true)
    expect(result.current.isOpen('modal-2')).toBe(true)
    expect(result.current.isOpen('modal-3')).toBe(true)
    
    // Close one modal
    act(() => {
      result.current.closeModal('modal-2')
    })
    
    expect(result.current.openModals.size).toBe(2)
    expect(result.current.isOpen('modal-1')).toBe(true)
    expect(result.current.isOpen('modal-2')).toBe(false)
    expect(result.current.isOpen('modal-3')).toBe(true)
  })

  test('should close all modals', () => {
    const { result } = renderHook(() => useModal())
    
    // Open multiple modals
    act(() => {
      result.current.openModal('modal-1')
      result.current.openModal('modal-2')
      result.current.openModal('modal-3')
    })
    
    expect(result.current.openModals.size).toBe(3)
    
    // Close all modals
    act(() => {
      result.current.closeAllModals()
    })
    
    expect(result.current.openModals.size).toBe(0)
    expect(result.current.isOpen('modal-1')).toBe(false)
    expect(result.current.isOpen('modal-2')).toBe(false)
    expect(result.current.isOpen('modal-3')).toBe(false)
  })

  test('should not error when closing non-existent modal', () => {
    const { result } = renderHook(() => useModal())
    
    // Should not error when closing a modal that was never opened
    act(() => {
      result.current.closeModal('non-existent-modal')
    })
    
    expect(result.current.openModals.size).toBe(0)
  })
})

describe('useTypedModal hook', () => {
  type ModalNames = 'theme' | 'template' | 'client'
  
  test('should work with typed modal names', () => {
    const { result } = renderHook(() => useTypedModal<ModalNames>())
    
    act(() => {
      result.current.openModal('theme')
      result.current.openModal('client')
    })
    
    expect(result.current.isOpen('theme')).toBe(true)
    expect(result.current.isOpen('client')).toBe(true)
    expect(result.current.openModals.size).toBe(2)
  })

  test('should toggle typed modals correctly', () => {
    const { result } = renderHook(() => useTypedModal<ModalNames>())
    
    // Toggle theme modal open
    act(() => {
      result.current.toggleModal('theme')
    })
    
    expect(result.current.isOpen('theme')).toBe(true)
    
    // Toggle theme modal closed
    act(() => {
      result.current.toggleModal('theme')
    })
    
    expect(result.current.isOpen('theme')).toBe(false)
  })
})