'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import {
  type ModernThemeConfig,
  getDefaultTheme,
  loadTheme,
  saveTheme,
  applyTheme,
  detectSystemTheme
} from '@/lib/theme-utils'

interface ModernThemeContextType {
  theme: ModernThemeConfig
  setTheme: (theme: ModernThemeConfig) => void
  toggleMode: () => void
  toggleAnimations: () => void
  toggleGlassmorphism: () => void
}

const ModernThemeContext = createContext<ModernThemeContextType | undefined>(undefined)

export function ModernThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ModernThemeConfig>(getDefaultTheme())
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = loadTheme()
    setThemeState(savedTheme)
    applyTheme(savedTheme)
    setMounted(true)
  }, [])

  // Apply theme changes and save to localStorage
  const setTheme = (newTheme: ModernThemeConfig) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    saveTheme(newTheme)
  }

  // Toggle between light, dark, and system modes
  const toggleMode = () => {
    const modes: ModernThemeConfig['mode'][] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(theme.mode)
    const nextIndex = (currentIndex + 1) % modes.length
    const newMode = modes[nextIndex]
    
    setTheme({ ...theme, mode: newMode })
  }

  // Toggle animations on/off
  const toggleAnimations = () => {
    setTheme({ ...theme, animations: !theme.animations })
  }

  // Toggle glassmorphism effects
  const toggleGlassmorphism = () => {
    setTheme({ ...theme, glassmorphism: !theme.glassmorphism })
  }

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme.mode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applyTheme(theme) // Re-apply theme to update based on system preference
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  if (!mounted) {
    // Prevent hydration mismatch
    return null
  }

  const value = {
    theme,
    setTheme,
    toggleMode,
    toggleAnimations,
    toggleGlassmorphism
  }

  return (
    <ModernThemeContext.Provider value={value}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={theme.mode === 'system' ? detectSystemTheme() : theme.mode}
        enableSystem={true}
        disableTransitionOnChange={!theme.animations}
      >
        {children}
      </NextThemesProvider>
    </ModernThemeContext.Provider>
  )
}

export function useModernTheme() {
  const context = useContext(ModernThemeContext)
  if (context === undefined) {
    throw new Error('useModernTheme must be used within a ModernThemeProvider')
  }
  return context
}

// Legacy provider for backward compatibility
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ModernThemeProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ModernThemeProvider>
  )
}
