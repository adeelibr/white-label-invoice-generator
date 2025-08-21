/**
 * Settings Storage Utilities
 * Handles localStorage operations for app settings, preferences, and themes
 */

export interface ThemeConfig {
  colorScheme: "violet-blue" | "emerald-teal" | "rose-pink" | "orange-amber" | "indigo-purple"
  fontPair: "modern" | "classic" | "elegant" | "minimal" | "creative"
}

const THEME_SETTINGS_KEY = "invoiceGeneratorTheme"

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

/**
 * Save theme configuration to localStorage
 */
export function saveTheme(theme: ThemeConfig): void {
  if (!isBrowser()) {
    console.warn("saveTheme: localStorage not available")
    return
  }

  try {
    localStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(theme))
  } catch (error) {
    console.error("Failed to save theme settings:", error)
  }
}

/**
 * Get theme configuration from localStorage
 */
export function getTheme(): ThemeConfig | null {
  if (!isBrowser()) {
    console.warn("getTheme: localStorage not available")
    return null
  }

  try {
    const savedTheme = localStorage.getItem(THEME_SETTINGS_KEY)
    if (savedTheme) {
      return JSON.parse(savedTheme) as ThemeConfig
    }
  } catch (error) {
    console.error("Failed to load theme settings:", error)
  }

  return null
}

/**
 * Clear theme configuration from localStorage
 */
export function clearTheme(): void {
  if (!isBrowser()) {
    console.warn("clearTheme: localStorage not available")
    return
  }

  try {
    localStorage.removeItem(THEME_SETTINGS_KEY)
  } catch (error) {
    console.error("Failed to clear theme settings:", error)
  }
}

/**
 * Check if theme configuration exists in localStorage
 */
export function hasThemeConfig(): boolean {
  if (!isBrowser()) {
    return false
  }

  return localStorage.getItem(THEME_SETTINGS_KEY) !== null
}

/**
 * Get default theme configuration
 */
export function getDefaultTheme(): ThemeConfig {
  return {
    colorScheme: "violet-blue",
    fontPair: "modern"
  }
}

/**
 * Save app preferences (can be extended for other settings)
 */
export interface AppPreferences {
  // Add other app preferences here in the future
  autoSave?: boolean
  defaultCurrency?: string
}

const APP_PREFERENCES_KEY = "invoiceGeneratorPreferences"

/**
 * Save app preferences to localStorage
 */
export function savePreferences(preferences: AppPreferences): void {
  if (!isBrowser()) {
    console.warn("savePreferences: localStorage not available")
    return
  }

  try {
    localStorage.setItem(APP_PREFERENCES_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.error("Failed to save app preferences:", error)
  }
}

/**
 * Get app preferences from localStorage
 */
export function getPreferences(): AppPreferences | null {
  if (!isBrowser()) {
    console.warn("getPreferences: localStorage not available")
    return null
  }

  try {
    const savedPreferences = localStorage.getItem(APP_PREFERENCES_KEY)
    if (savedPreferences) {
      return JSON.parse(savedPreferences) as AppPreferences
    }
  } catch (error) {
    console.error("Failed to load app preferences:", error)
  }

  return null
}

/**
 * Clear app preferences from localStorage
 */
export function clearPreferences(): void {
  if (!isBrowser()) {
    console.warn("clearPreferences: localStorage not available")
    return
  }

  try {
    localStorage.removeItem(APP_PREFERENCES_KEY)
  } catch (error) {
    console.error("Failed to clear app preferences:", error)
  }
}