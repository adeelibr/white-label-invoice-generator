/**
 * User Storage Utilities
 * Handles localStorage operations for user/session-related data (onboarding, preferences, etc.)
 */

export interface OnboardingState {
  completed: boolean
  showAgain: boolean
  completedAt?: string // ISO date string
}

const ONBOARDING_STORAGE_KEY = "invoice-generator-onboarding-completed"
const ONBOARDING_SHOW_AGAIN_KEY = "invoice-generator-show-onboarding-again"

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

/**
 * Save onboarding completion state
 */
export function saveOnboardingCompleted(): void {
  if (!isBrowser()) {
    console.warn("saveOnboardingCompleted: localStorage not available")
    return
  }

  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
  } catch (error) {
    console.error("Failed to save onboarding state:", error)
  }
}

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true"
  } catch (error) {
    console.error("Failed to check onboarding state:", error)
    return false
  }
}

/**
 * Set flag to show onboarding again
 */
export function setShowOnboardingAgain(): void {
  if (!isBrowser()) {
    console.warn("setShowOnboardingAgain: localStorage not available")
    return
  }

  try {
    localStorage.setItem(ONBOARDING_SHOW_AGAIN_KEY, "true")
  } catch (error) {
    console.error("Failed to set show onboarding again flag:", error)
  }
}

/**
 * Check if onboarding should be shown again
 */
export function shouldShowOnboardingAgain(): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    return localStorage.getItem(ONBOARDING_SHOW_AGAIN_KEY) === "true"
  } catch (error) {
    console.error("Failed to check show onboarding again flag:", error)
    return false
  }
}

/**
 * Clear the "show onboarding again" flag
 */
export function clearShowOnboardingAgain(): void {
  if (!isBrowser()) {
    console.warn("clearShowOnboardingAgain: localStorage not available")
    return
  }

  try {
    localStorage.removeItem(ONBOARDING_SHOW_AGAIN_KEY)
  } catch (error) {
    console.error("Failed to clear show onboarding again flag:", error)
  }
}

// CRM-specific onboarding functions
const CRM_ONBOARDING_STORAGE_KEY = "invoice-generator-crm-onboarding-completed"
const CRM_ONBOARDING_SHOW_AGAIN_KEY = "invoice-generator-show-crm-onboarding-again"

/**
 * Save CRM onboarding completion state
 */
export function saveCRMOnboardingCompleted(): void {
  if (!isBrowser()) {
    console.warn("saveCRMOnboardingCompleted: localStorage not available")
    return
  }

  try {
    localStorage.setItem(CRM_ONBOARDING_STORAGE_KEY, "true")
  } catch (error) {
    console.error("Failed to save CRM onboarding state:", error)
  }
}

/**
 * Check if user has completed CRM onboarding
 */
export function hasCompletedCRMOnboarding(): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    return localStorage.getItem(CRM_ONBOARDING_STORAGE_KEY) === "true"
  } catch (error) {
    console.error("Failed to check CRM onboarding state:", error)
    return false
  }
}

/**
 * Set flag to show CRM onboarding again
 */
export function setShowCRMOnboardingAgain(): void {
  if (!isBrowser()) {
    console.warn("setShowCRMOnboardingAgain: localStorage not available")
    return
  }

  try {
    localStorage.setItem(CRM_ONBOARDING_SHOW_AGAIN_KEY, "true")
  } catch (error) {
    console.error("Failed to set show CRM onboarding again flag:", error)
  }
}

/**
 * Check if CRM onboarding should be shown again
 */
export function shouldShowCRMOnboardingAgain(): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    return localStorage.getItem(CRM_ONBOARDING_SHOW_AGAIN_KEY) === "true"
  } catch (error) {
    console.error("Failed to check show CRM onboarding again flag:", error)
    return false
  }
}

/**
 * Clear the "show CRM onboarding again" flag
 */
export function clearShowCRMOnboardingAgain(): void {
  if (!isBrowser()) {
    console.warn("clearShowCRMOnboardingAgain: localStorage not available")
    return
  }

  try {
    localStorage.removeItem(CRM_ONBOARDING_SHOW_AGAIN_KEY)
  } catch (error) {
    console.error("Failed to clear show CRM onboarding again flag:", error)
  }
}

/**
 * Reset all onboarding state (for development/testing)
 */
export function resetOnboardingState(): void {
  if (!isBrowser()) {
    console.warn("resetOnboardingState: localStorage not available")
    return
  }

  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    localStorage.removeItem(ONBOARDING_SHOW_AGAIN_KEY)
  } catch (error) {
    console.error("Failed to reset onboarding state:", error)
  }
}

/**
 * Get complete onboarding state
 */
export function getOnboardingState(): OnboardingState {
  return {
    completed: hasCompletedOnboarding(),
    showAgain: shouldShowOnboardingAgain(),
  }
}

/**
 * Utility function to manually trigger onboarding (for testing or "Show Tour" button)
 */
export function triggerOnboarding(): void {
  setShowOnboardingAgain()
  // Reload the page to trigger onboarding
  if (isBrowser()) {
    window.location.reload()
  }
}

/**
 * User session utilities (can be extended for other session data)
 */
export interface UserSession {
  // Add other session data here in the future
  lastVisit?: string // ISO date string
  sessionCount?: number
}

const USER_SESSION_KEY = "invoiceGeneratorUserSession"

/**
 * Save user session data
 */
export function saveUserSession(session: UserSession): void {
  if (!isBrowser()) {
    console.warn("saveUserSession: localStorage not available")
    return
  }

  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session))
  } catch (error) {
    console.error("Failed to save user session:", error)
  }
}

/**
 * Get user session data
 */
export function getUserSession(): UserSession | null {
  if (!isBrowser()) {
    console.warn("getUserSession: localStorage not available")
    return null
  }

  try {
    const savedSession = localStorage.getItem(USER_SESSION_KEY)
    if (savedSession) {
      return JSON.parse(savedSession) as UserSession
    }
  } catch (error) {
    console.error("Failed to load user session:", error)
  }

  return null
}

/**
 * Clear user session data
 */
export function clearUserSession(): void {
  if (!isBrowser()) {
    console.warn("clearUserSession: localStorage not available")
    return
  }

  try {
    localStorage.removeItem(USER_SESSION_KEY)
  } catch (error) {
    console.error("Failed to clear user session:", error)
  }
}