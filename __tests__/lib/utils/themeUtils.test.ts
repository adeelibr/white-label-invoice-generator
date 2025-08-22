/**
 * Tests for theme utilities
 */

import { getThemeClasses, handleThemeChange, initializeTheme } from '../../../lib/utils/themeUtils'
import type { ThemeConfig } from '@/lib/storage'

// Mock dependencies
jest.mock('@/lib/storage', () => ({
  getTheme: jest.fn(),
  getDefaultTheme: jest.fn(() => ({ colorScheme: 'violet-blue', fontPair: 'modern' })),
  saveTheme: jest.fn(),
}))

import { getTheme, getDefaultTheme, saveTheme } from '@/lib/storage'

const mockGetTheme = getTheme as jest.MockedFunction<typeof getTheme>
const mockGetDefaultTheme = getDefaultTheme as jest.MockedFunction<typeof getDefaultTheme>
const mockSaveTheme = saveTheme as jest.MockedFunction<typeof saveTheme>

describe('themeUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getThemeClasses', () => {
    it('should return correct classes for violet-blue theme', () => {
      const theme: ThemeConfig = { colorScheme: 'violet-blue', fontPair: 'modern' }
      const classes = getThemeClasses(theme)
      
      expect(classes.primary).toBe('from-violet-600 to-blue-600')
      expect(classes.primaryHover).toBe('from-violet-700 to-blue-700')
      expect(classes.accent).toBe('violet-500')
    })

    it('should return correct classes for emerald-teal theme', () => {
      const theme: ThemeConfig = { colorScheme: 'emerald-teal', fontPair: 'classic' }
      const classes = getThemeClasses(theme)
      
      expect(classes.primary).toBe('from-emerald-600 to-teal-600')
      expect(classes.primaryHover).toBe('from-emerald-700 to-teal-700')
      expect(classes.accent).toBe('emerald-500')
    })

    it('should return correct classes for all supported color schemes', () => {
      const colorSchemes: Array<ThemeConfig['colorScheme']> = [
        'violet-blue', 'emerald-teal', 'rose-pink', 'orange-amber', 'indigo-purple'
      ]

      colorSchemes.forEach(colorScheme => {
        const theme: ThemeConfig = { colorScheme, fontPair: 'modern' }
        const classes = getThemeClasses(theme)
        
        expect(classes).toHaveProperty('primary')
        expect(classes).toHaveProperty('primaryHover')
        expect(classes).toHaveProperty('secondary')
        expect(classes).toHaveProperty('accent')
        expect(classes).toHaveProperty('accentLight')
        expect(classes).toHaveProperty('accentBorder')
        expect(classes).toHaveProperty('accentText')
      })
    })
  })

  describe('handleThemeChange', () => {
    it('should call setTheme and saveTheme with new theme', () => {
      const mockSetTheme = jest.fn()
      const newTheme: ThemeConfig = { colorScheme: 'rose-pink', fontPair: 'elegant' }
      
      handleThemeChange(newTheme, mockSetTheme)
      
      expect(mockSetTheme).toHaveBeenCalledWith(newTheme)
      expect(mockSaveTheme).toHaveBeenCalledWith(newTheme)
    })
  })

  describe('initializeTheme', () => {
    it('should return saved theme when available', () => {
      const savedTheme: ThemeConfig = { colorScheme: 'orange-amber', fontPair: 'minimal' }
      mockGetTheme.mockReturnValue(savedTheme)
      
      const result = initializeTheme()
      
      expect(result).toEqual(savedTheme)
      expect(mockGetTheme).toHaveBeenCalled()
    })

    it('should return default theme when no saved theme', () => {
      const defaultTheme: ThemeConfig = { colorScheme: 'violet-blue', fontPair: 'modern' }
      mockGetTheme.mockReturnValue(null)
      mockGetDefaultTheme.mockReturnValue(defaultTheme)
      
      const result = initializeTheme()
      
      expect(result).toEqual(defaultTheme)
      expect(mockGetTheme).toHaveBeenCalled()
      expect(mockGetDefaultTheme).toHaveBeenCalled()
    })
  })
})