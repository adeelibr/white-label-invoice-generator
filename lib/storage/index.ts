/**
 * Storage utilities index
 * Centralized exports for all localStorage operations
 */

// Invoice data operations (legacy - single invoice)
export {
  saveInvoice,
  getInvoice,
  clearInvoice,
  hasInvoiceData,
  type InvoiceData,
  type LineItem
} from './invoiceStorage'

// Client management operations
export {
  getAllClients,
  addClient,
  updateClient,
  deleteClient,
  getClientById,
  searchClients,
  incrementClientInvoiceCount,
  getClientStats,
  type Client
} from './clientStorage'

// Invoice history operations
export {
  getAllInvoices,
  addInvoiceToHistory,
  updateInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoicesByClient,
  getFilteredInvoices,
  duplicateInvoice,
  getInvoiceStats,
  markInvoiceAsPaid,
  searchInvoices,
  getNextInvoiceNumber,
  type InvoiceHistoryItem,
  type InvoiceFilter,
  type InvoiceSortOptions
} from './invoiceHistoryStorage'

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