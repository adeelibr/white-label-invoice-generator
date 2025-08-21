"use client"

import React, { useState, useEffect } from "react"
import { WelcomeScreen } from "./welcome-screen"
import { FeatureWalkthrough } from "./feature-walkthrough"
import { 
  saveOnboardingCompleted, 
  hasCompletedOnboarding, 
  shouldShowOnboardingAgain, 
  clearShowOnboardingAgain
} from "@/lib/storage"

type OnboardingStage = "welcome" | "walkthrough" | "completed"

interface OnboardingFlowProps {
  onComplete?: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStage, setCurrentStage] = useState<OnboardingStage>("welcome")
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const completedOnboarding = hasCompletedOnboarding()
    const showAgain = shouldShowOnboardingAgain()
    
    // Show onboarding if it's a first-time user or they explicitly requested to see it again
    if (!completedOnboarding || showAgain) {
      setShouldShowOnboarding(true)
      // Clear the "show again" flag
      if (showAgain) {
        clearShowOnboardingAgain()
      }
    }
  }, [])

  const handleWelcomeComplete = () => {
    setCurrentStage("walkthrough")
  }

  const handleWalkthroughComplete = () => {
    setCurrentStage("completed")
    saveOnboardingCompleted()
    setShouldShowOnboarding(false)
    onComplete?.()
  }

  const handleSkip = () => {
    setCurrentStage("completed")
    saveOnboardingCompleted()
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

// Re-export utility functions from storage layer for backward compatibility
export { triggerOnboarding, resetOnboardingState, hasCompletedOnboarding } from "@/lib/storage"