"use client"

import React, { useState, useEffect } from "react"
import { WelcomeScreen } from "./welcome-screen"
import { FeatureWalkthrough } from "./feature-walkthrough"

type OnboardingStage = "welcome" | "walkthrough" | "completed"

interface OnboardingFlowProps {
  onComplete?: () => void
}

const ONBOARDING_STORAGE_KEY = "invoice-generator-onboarding-completed"
const ONBOARDING_SHOW_AGAIN_KEY = "invoice-generator-show-onboarding-again"

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStage, setCurrentStage] = useState<OnboardingStage>("welcome")
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true"
    const shouldShowAgain = localStorage.getItem(ONBOARDING_SHOW_AGAIN_KEY) === "true"
    
    // Show onboarding if it's a first-time user or they explicitly requested to see it again
    if (!hasCompletedOnboarding || shouldShowAgain) {
      setShouldShowOnboarding(true)
      // Clear the "show again" flag
      if (shouldShowAgain) {
        localStorage.removeItem(ONBOARDING_SHOW_AGAIN_KEY)
      }
    }
  }, [])

  const handleWelcomeComplete = () => {
    setCurrentStage("walkthrough")
  }

  const handleWalkthroughComplete = () => {
    setCurrentStage("completed")
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
    setShouldShowOnboarding(false)
    onComplete?.()
  }

  const handleSkip = () => {
    setCurrentStage("completed")
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
    setShouldShowOnboarding(false)
    onComplete?.()
  }

  // Don't render anything if onboarding shouldn't be shown
  if (!shouldShowOnboarding) {
    return null
  }

  return (
    <>
      {currentStage === "welcome" && (
        <WelcomeScreen 
          onGetStarted={handleWelcomeComplete}
          onSkip={handleSkip}
        />
      )}
      
      {currentStage === "walkthrough" && (
        <FeatureWalkthrough
          onComplete={handleWalkthroughComplete}
          onSkip={handleSkip}
        />
      )}
    </>
  )
}

// Utility function to manually trigger onboarding (for testing or "Show Tour" button)
export function triggerOnboarding() {
  localStorage.setItem(ONBOARDING_SHOW_AGAIN_KEY, "true")
  // Reload the page to trigger onboarding
  window.location.reload()
}

// Utility function to reset onboarding state (for development/testing)
export function resetOnboardingState() {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY)
  localStorage.removeItem(ONBOARDING_SHOW_AGAIN_KEY)
}

// Check if user has completed onboarding
export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true"
}