/**
 * useTheme Hook
 * 
 * Centralizes theme management logic that's repeated across components.
 * Handles theme state, persistence, initialization, and UI control states.
 */

import { useState, useEffect } from "react"
import { 
  getTheme, 
  getDefaultTheme, 
  getTemplate,
  getDefaultTemplate,
  type ThemeConfig, 
  type TemplateType 
} from "@/lib/storage"
import { 
  handleThemeChange, 
  handleTemplateChange, 
  getThemeClasses,
  type ThemeClasses 
} from "@/lib/utils"

export interface UseThemeReturn {
  // Theme state
  theme: ThemeConfig
  selectedTemplate: TemplateType
  themeClasses: ThemeClasses
  
  // UI control states
  showThemeSettings: boolean
  showTemplateSelection: boolean
  
  // Actions
  onThemeChange: (newTheme: ThemeConfig) => void
  onTemplateChange: (newTemplate: TemplateType) => void
  setShowThemeSettings: (show: boolean) => void
  setShowTemplateSelection: (show: boolean) => void
}

/**
 * Custom hook for managing theme state and related UI controls
 */
export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<ThemeConfig>(getDefaultTheme())
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(getDefaultTemplate())
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [showTemplateSelection, setShowTemplateSelection] = useState(false)

  // Initialize theme and template from storage on mount
  useEffect(() => {
    const savedTheme = getTheme()
    const savedTemplate = getTemplate()
    
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate)
    }
  }, [])

  // Get theme classes
  const themeClasses = getThemeClasses(theme)

  // Theme change handler
  const onThemeChange = (newTheme: ThemeConfig) => {
    handleThemeChange(newTheme, setTheme)
  }

  // Template change handler
  const onTemplateChange = (newTemplate: TemplateType) => {
    handleTemplateChange(newTemplate, setSelectedTemplate)
  }

  return {
    theme,
    selectedTemplate,
    themeClasses,
    showThemeSettings,
    showTemplateSelection,
    onThemeChange,
    onTemplateChange,
    setShowThemeSettings,
    setShowTemplateSelection,
  }
}