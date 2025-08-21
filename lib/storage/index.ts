/**
 * Storage utilities index
 * Centralized exports for all localStorage operations
 */

// Invoice data operations
export {
  saveInvoice,
  getInvoice,
  clearInvoice,
  hasInvoiceData,
  type InvoiceData,
  type LineItem
} from './invoiceStorage'

// Settings and theme operations
export {
  saveTheme,
  getTheme,
  clearTheme,
  hasThemeConfig,
  getDefaultTheme,
  savePreferences,
  getPreferences,
  clearPreferences,
  type ThemeConfig,
  type AppPreferences
} from './settingsStorage'

// User and session operations
export {
  saveOnboardingCompleted,
  hasCompletedOnboarding,
  setShowOnboardingAgain,
  shouldShowOnboardingAgain,
  clearShowOnboardingAgain,
  resetOnboardingState,
  getOnboardingState,
  triggerOnboarding,
  saveUserSession,
  getUserSession,
  clearUserSession,
  type OnboardingState,
  type UserSession
} from './userStorage'