/**
 * useModal Hook
 * 
 * Generic modal state management hook to reduce repetitive modal state logic.
 * Handles opening, closing, and managing multiple modal states.
 */

import { useState, useCallback } from "react"

export interface UseModalReturn<T extends string = string> {
  // State
  isOpen: (modalName: T) => boolean
  openModals: Set<T>
  
  // Actions
  openModal: (modalName: T) => void
  closeModal: (modalName: T) => void
  toggleModal: (modalName: T) => void
  closeAllModals: () => void
}

/**
 * Custom hook for managing modal states
 */
export function useModal<T extends string = string>(): UseModalReturn<T> {
  const [openModals, setOpenModals] = useState<Set<T>>(new Set())

  // Check if a specific modal is open
  const isOpen = useCallback((modalName: T): boolean => {
    return openModals.has(modalName)
  }, [openModals])

  // Open a specific modal
  const openModal = useCallback((modalName: T) => {
    setOpenModals(prev => new Set([...prev, modalName]))
  }, [])

  // Close a specific modal
  const closeModal = useCallback((modalName: T) => {
    setOpenModals(prev => {
      const newSet = new Set(prev)
      newSet.delete(modalName)
      return newSet
    })
  }, [])

  // Toggle a specific modal
  const toggleModal = useCallback((modalName: T) => {
    if (isOpen(modalName)) {
      closeModal(modalName)
    } else {
      openModal(modalName)
    }
  }, [isOpen, openModal, closeModal])

  // Close all modals
  const closeAllModals = useCallback(() => {
    setOpenModals(new Set())
  }, [])

  return {
    isOpen,
    openModals,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
  }
}

/**
 * Typed version of useModal for specific modal names
 * Usage: const modal = useTypedModal<'theme' | 'template' | 'client'>()
 */
export function useTypedModal<T extends string>(): UseModalReturn<T> {
  return useModal<T>()
}