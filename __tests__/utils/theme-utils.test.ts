/**
 * Tests for theme utilities
 */
import {
  getThemeClasses,
  generateThemeCSS,
  detectSystemTheme,
  applyTheme,
  saveTheme,
  loadTheme,
  getDefaultTheme,
  getAnimationClasses,
  getGlassmorphismClasses,
  getResponsiveClasses,
  getShadowClasses,
  type ModernThemeConfig
} from '../../lib/theme-utils'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
})

describe('theme-utils', () => {
  const mockTheme: ModernThemeConfig = {
    colorScheme: 'violet-blue',
    fontPair: 'modern',
    mode: 'light',
    animations: true,
    glassmorphism: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getThemeClasses', () => {
    it('should return correct theme classes for violet-blue scheme', () => {
      const classes = getThemeClasses(mockTheme)
      
      expect(classes.primary).toBe('from-violet-600 to-blue-600')
      expect(classes.accent).toBe('violet-500')
      expect(classes.heading).toBe('font-inter font-bold tracking-tight')
      expect(classes.body).toBe('font-inter font-normal')
    })

    it('should return correct classes for different color schemes', () => {
      const emeraldTheme: ModernThemeConfig = {
        ...mockTheme,
        colorScheme: 'emerald-teal'
      }
      
      const classes = getThemeClasses(emeraldTheme)
      expect(classes.primary).toBe('from-emerald-600 to-teal-600')
      expect(classes.accent).toBe('emerald-500')
    })

    it('should return correct classes for different font pairs', () => {
      const classicTheme: ModernThemeConfig = {
        ...mockTheme,
        fontPair: 'classic'
      }
      
      const classes = getThemeClasses(classicTheme)
      expect(classes.heading).toBe('font-playfair font-bold tracking-tight')
      expect(classes.body).toBe('font-opensans font-normal')
    })
  })

  describe('generateThemeCSS', () => {
    it('should generate CSS custom properties', () => {
      const css = generateThemeCSS(mockTheme)
      
      expect(css['--theme-primary']).toBe('from-violet-600 to-blue-600')
      expect(css['--theme-accent']).toBe('violet-500')
      expect(css['--theme-accent-text']).toBe('violet-600')
    })
  })

  describe('detectSystemTheme', () => {
    it('should detect light theme when media query does not match', () => {
      (window.matchMedia as jest.Mock).mockImplementation(() => ({
        matches: false
      }))
      
      expect(detectSystemTheme()).toBe('light')
    })

    it('should detect dark theme when media query matches', () => {
      (window.matchMedia as jest.Mock).mockImplementation(() => ({
        matches: true
      }))
      
      expect(detectSystemTheme()).toBe('dark')
    })

    it('should return light theme in server environment', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window
      
      expect(detectSystemTheme()).toBe('light')
      
      global.window = originalWindow
    })
  })

  describe('applyTheme', () => {
    let mockDocumentElement: {
      style: { setProperty: jest.Mock }
      classList: { remove: jest.Mock; add: jest.Mock }
    }

    beforeEach(() => {
      mockDocumentElement = {
        style: { setProperty: jest.fn() },
        classList: { remove: jest.fn(), add: jest.fn() }
      }
      
      Object.defineProperty(document, 'documentElement', {
        value: mockDocumentElement,
        configurable: true
      })
    })

    it('should apply theme CSS properties', () => {
      applyTheme(mockTheme)
      
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--theme-primary',
        'from-violet-600 to-blue-600'
      )
    })

    it('should apply light mode class', () => {
      applyTheme(mockTheme)
      
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('light')
    })

    it('should apply system theme when mode is system', () => {
      const systemTheme: ModernThemeConfig = { ...mockTheme, mode: 'system' }
      
      ;(window.matchMedia as jest.Mock).mockImplementation(() => ({
        matches: true // dark mode
      }))
      
      applyTheme(systemTheme)
      
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark')
    })

    it('should handle animation preferences', () => {
      const noAnimationTheme: ModernThemeConfig = { ...mockTheme, animations: false }
      
      applyTheme(noAnimationTheme)
      
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('reduce-motion')
    })
  })

  describe('saveTheme', () => {
    it('should save theme to localStorage', () => {
      saveTheme(mockTheme)
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'invoice-theme',
        JSON.stringify(mockTheme)
      )
    })

    it('should handle server environment gracefully', () => {
      const originalLocalStorage = global.localStorage
      // @ts-ignore
      delete global.localStorage
      
      expect(() => saveTheme(mockTheme)).not.toThrow()
      
      global.localStorage = originalLocalStorage
    })
  })

  describe('loadTheme', () => {
    it('should load theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTheme))
      
      const loaded = loadTheme()
      
      expect(loaded).toEqual(mockTheme)
    })

    it('should return default theme if localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const loaded = loadTheme()
      
      expect(loaded).toEqual(getDefaultTheme())
    })

    it('should handle JSON parse errors gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json')
      
      const loaded = loadTheme()
      
      expect(loaded).toEqual(getDefaultTheme())
    })

    it('should return default theme in server environment', () => {
      const originalLocalStorage = global.localStorage
      // @ts-ignore
      delete global.localStorage
      
      const loaded = loadTheme()
      
      expect(loaded).toEqual(getDefaultTheme())
      
      global.localStorage = originalLocalStorage
    })
  })

  describe('getDefaultTheme', () => {
    it('should return correct default theme', () => {
      const defaultTheme = getDefaultTheme()
      
      expect(defaultTheme).toEqual({
        colorScheme: 'violet-blue',
        fontPair: 'modern',
        mode: 'system',
        animations: true,
        glassmorphism: true
      })
    })
  })

  describe('getAnimationClasses', () => {
    it('should return animation classes when enabled', () => {
      const classes = getAnimationClasses(true)
      
      expect(classes).toContain('transition-all')
      expect(classes).toContain('duration-300')
      expect(classes).toContain('ease-in-out')
    })

    it('should return empty string when disabled', () => {
      const classes = getAnimationClasses(false)
      
      expect(classes).toBe('')
    })
  })

  describe('getGlassmorphismClasses', () => {
    it('should return glassmorphism classes when enabled', () => {
      const classes = getGlassmorphismClasses(true, 'medium')
      
      expect(classes).toContain('backdrop-blur-md')
      expect(classes).toContain('bg-white/20')
      expect(classes).toContain('border-white/30')
    })

    it('should return different classes for different variants', () => {
      const light = getGlassmorphismClasses(true, 'light')
      const heavy = getGlassmorphismClasses(true, 'heavy')
      
      expect(light).toContain('backdrop-blur-sm')
      expect(heavy).toContain('backdrop-blur-lg')
    })

    it('should return solid background when disabled', () => {
      const classes = getGlassmorphismClasses(false)
      
      expect(classes).toBe('bg-white border border-gray-200')
    })
  })

  describe('getResponsiveClasses', () => {
    it('should return responsive grid classes', () => {
      const classes = getResponsiveClasses()
      
      expect(classes).toContain('grid')
      expect(classes).toContain('grid-cols-1')
      expect(classes).toContain('lg:grid-cols-2')
    })
  })

  describe('getShadowClasses', () => {
    it('should return shadow classes with theme awareness', () => {
      const classes = getShadowClasses(mockTheme, 'md')
      
      expect(classes).toContain('shadow-lg')
      expect(classes).toContain('shadow-violet-500/10')
    })

    it('should return different sizes', () => {
      const small = getShadowClasses(mockTheme, 'sm')
      const large = getShadowClasses(mockTheme, 'xl')
      
      expect(small).toContain('shadow-sm')
      expect(large).toContain('shadow-2xl')
    })
  })
})