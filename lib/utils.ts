import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export all utility functions from utils subdirectory
export {
  getThemeClasses,
  handleThemeChange,
  initializeTheme,
  type ThemeClasses
} from "./utils/themeUtils"

export {
  getEmptyClientForm,
  populateClientForm,
  validateClientForm,
  saveNewClient,
  updateExistingClient,
  type ClientFormData
} from "./utils/clientFormUtils"

export {
  deleteClientWithConfirmation,
  deleteInvoiceWithConfirmation,
  getInvoiceStatusBadge
} from "./utils/clientOperations"
