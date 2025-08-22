/**
 * Theme utilities for consistent theme handling across components
 */

import { getTheme, getDefaultTheme, saveTheme, getTemplate, getDefaultTemplate, saveTemplate, type ThemeConfig, type TemplateType } from "@/lib/storage"

export interface ThemeClasses {
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  accentLight: string
  accentBorder: string
  accentText: string
}

/**
 * Get theme CSS classes for a given theme configuration
 */
export function getThemeClasses(theme: ThemeConfig): ThemeClasses {
  const colorSchemes = {
    "violet-blue": {
      primary: "from-violet-600 to-blue-600",
      primaryHover: "from-violet-700 to-blue-700",
      secondary: "from-violet-50 via-blue-50 to-cyan-50",
      accent: "violet-500",
      accentLight: "violet-50",
      accentBorder: "violet-300",
      accentText: "violet-600",
    },
    "emerald-teal": {
      primary: "from-emerald-600 to-teal-600",
      primaryHover: "from-emerald-700 to-teal-700",
      secondary: "from-emerald-50 via-teal-50 to-cyan-50",
      accent: "emerald-500",
      accentLight: "emerald-50",
      accentBorder: "emerald-300",
      accentText: "emerald-600",
    },
    "rose-pink": {
      primary: "from-rose-600 to-pink-600",
      primaryHover: "from-rose-700 to-pink-700",
      secondary: "from-rose-50 via-pink-50 to-fuchsia-50",
      accent: "rose-500",
      accentLight: "rose-50",
      accentBorder: "rose-300",
      accentText: "rose-600",
    },
    "orange-amber": {
      primary: "from-orange-600 to-amber-600",
      primaryHover: "from-orange-700 to-amber-700",
      secondary: "from-orange-50 via-amber-50 to-yellow-50",
      accent: "orange-500",
      accentLight: "orange-50",
      accentBorder: "orange-300",
      accentText: "orange-600",
    },
    "indigo-purple": {
      primary: "from-indigo-600 to-purple-600",
      primaryHover: "from-indigo-700 to-purple-700",
      secondary: "from-indigo-50 via-purple-50 to-violet-50",
      accent: "indigo-500",
      accentLight: "indigo-50",
      accentBorder: "indigo-300",
      accentText: "indigo-600",
    },
    "premium-dark": {
      primary: "from-lime-400 to-lime-500",
      primaryHover: "from-lime-500 to-lime-600",
      secondary: "from-gray-900 via-gray-800 to-gray-900",
      accent: "lime-400",
      accentLight: "lime-950/20",
      accentBorder: "lime-600/30",
      accentText: "lime-400",
    },
  } as const
  
  return colorSchemes[theme.colorScheme]
}

/**
 * Handle theme changes and persistence
 */
export function handleThemeChange(newTheme: ThemeConfig, setTheme: (theme: ThemeConfig) => void): void {
  setTheme(newTheme)
  saveTheme(newTheme)
}

/**
 * Initialize theme from storage
 */
export function initializeTheme(): ThemeConfig {
  const savedTheme = getTheme()
  return savedTheme || getDefaultTheme()
}

/**
 * Handle template changes and persistence
 */
export function handleTemplateChange(newTemplate: TemplateType, setTemplate: (template: TemplateType) => void): void {
  setTemplate(newTemplate)
  saveTemplate(newTemplate)
}

/**
 * Initialize template from storage
 */
export function initializeTemplate(): TemplateType {
  const savedTemplate = getTemplate()
  return savedTemplate || getDefaultTemplate()
}