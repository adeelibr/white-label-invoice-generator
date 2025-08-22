import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export theme utilities
export {
  getThemeClasses,
  handleThemeChange,
  initializeTheme,
  type ThemeClasses
} from "./utils/themeUtils"

// Re-export client operations from storage (moved from utils for better organization)
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
} from "./storage"
