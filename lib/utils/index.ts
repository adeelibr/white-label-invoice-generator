/**
 * Utilities index
 * Centralized exports for all reusable utility functions
 */

// Theme utilities
export {
  getThemeClasses,
  handleThemeChange,
  initializeTheme,
  type ThemeClasses
} from './themeUtils'

// Client form utilities
export {
  getEmptyClientForm,
  populateClientForm,
  validateClientForm,
  saveNewClient,
  updateExistingClient,
  type ClientFormData
} from './clientFormUtils'

// Client operations utilities
export {
  deleteClientWithConfirmation,
  deleteInvoiceWithConfirmation,
  getInvoiceStatusBadge
} from './clientOperations'