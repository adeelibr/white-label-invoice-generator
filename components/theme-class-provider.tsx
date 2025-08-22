"use client"

import { useEffect } from 'react'
import { useTheme } from '@/lib/hooks/useTheme'

export function ThemeClassProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  useEffect(() => {
    const documentElement = document.documentElement
    
    // Remove all theme classes
    documentElement.classList.remove('premium-dark', 'dark')
    
    // Apply the appropriate theme class
    if (theme.colorScheme === 'premium-dark') {
      documentElement.classList.add('premium-dark')
    }
  }, [theme.colorScheme])

  return <>{children}</>
}