/**
 * Tests for useTheme hook using React Testing Library renderHook
 */

import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../../../lib/hooks/useTheme'

// Mock the storage and utils modules
jest.mock('../../../lib/storage', () => ({
  getTheme: jest.fn(),
  getDefaultTheme: jest.fn(() => ({ colors: ['violet', 'blue'], name: 'violet-blue' })),
  getTemplate: jest.fn(),
  getDefaultTemplate: jest.fn(() => 'elegant'),
}))

jest.mock('../../../lib/utils', () => ({
  handleThemeChange: jest.fn((theme, setter) => setter(theme)),
  handleTemplateChange: jest.fn((template, setter) => setter(template)),
  getThemeClasses: jest.fn(() => 'mocked-theme-classes'),
}))

describe('useTheme hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.theme).toEqual({ colors: ['violet', 'blue'], name: 'violet-blue' })
    expect(result.current.selectedTemplate).toBe('elegant')
    expect(result.current.showThemeSettings).toBe(false)
    expect(result.current.showTemplateSelection).toBe(false)
    expect(result.current.themeClasses).toBe('mocked-theme-classes')
  })

  test('should handle theme change', () => {
    const { result } = renderHook(() => useTheme())
    
    const newTheme = { colors: ['emerald', 'teal'], name: 'emerald-teal' }
    
    act(() => {
      result.current.onThemeChange(newTheme)
    })
    
    expect(result.current.theme).toEqual(newTheme)
  })

  test('should handle template change', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.onTemplateChange('modern')
    })
    
    expect(result.current.selectedTemplate).toBe('modern')
  })

  test('should toggle theme settings visibility', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.showThemeSettings).toBe(false)
    
    act(() => {
      result.current.setShowThemeSettings(true)
    })
    
    expect(result.current.showThemeSettings).toBe(true)
    
    act(() => {
      result.current.setShowThemeSettings(false)
    })
    
    expect(result.current.showThemeSettings).toBe(false)
  })

  test('should toggle template selection visibility', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.showTemplateSelection).toBe(false)
    
    act(() => {
      result.current.setShowTemplateSelection(true)
    })
    
    expect(result.current.showTemplateSelection).toBe(true)
    
    act(() => {
      result.current.setShowTemplateSelection(false)
    })
    
    expect(result.current.showTemplateSelection).toBe(false)
  })
})