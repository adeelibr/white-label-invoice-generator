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

// Client and CRM operations
export {
  getAllClients,
  getClient,
  saveClient,
  updateClient,
  deleteClient,
  getClientInvoices,
  getAllInvoices,
  getClientInvoiceById,
  saveClientInvoice,
  updateClientInvoice,
  deleteInvoice,
  deleteAllClientInvoices,
  getClientInvoiceCount,
  searchClients,
  type Client,
  type ClientInvoice
} from './clientStorage'

// Client operations with UI feedback
export {
  getEmptyClientForm,
  populateClientForm,
  validateClientForm,
  saveNewClient,
  updateExistingClient,
  deleteClientWithConfirmation,
  deleteInvoiceWithConfirmation,
  getInvoiceStatusBadge,
  type ClientFormData
} from './clientOperations'