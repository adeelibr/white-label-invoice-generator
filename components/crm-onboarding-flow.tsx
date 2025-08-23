"use client"

import React, { useState, useEffect } from "react"
import { CRMWelcomeScreen } from "./crm-welcome-screen"
import { CRMFeatureWalkthrough } from "./crm-feature-walkthrough"
import { 
  saveCRMOnboardingCompleted, 
  hasCompletedCRMOnboarding, 
  shouldShowCRMOnboardingAgain, 
  clearShowCRMOnboardingAgain
} from "@/lib/storage"

type CRMOnboardingStage = "welcome" | "walkthrough" | "completed"

interface CRMOnboardingFlowProps {
  onComplete?: () => void
}

export function CRMOnboardingFlow({ onComplete }: CRMOnboardingFlowProps) {
  const [currentStage, setCurrentStage] = useState<CRMOnboardingStage>("welcome")
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed CRM onboarding
    const completedCRMOnboarding = hasCompletedCRMOnboarding()
    const showAgain = shouldShowCRMOnboardingAgain()
    
    // Show onboarding if it's a first-time CRM user or they explicitly requested to see it again
    if (!completedCRMOnboarding || showAgain) {
      setShouldShowOnboarding(true)
      // Clear the "show again" flag
      if (showAgain) {
        clearShowCRMOnboardingAgain()
      }
    }
  }, [])

  const handleWelcomeComplete = () => {
    setCurrentStage("walkthrough")
  }

  const handleWalkthroughComplete = () => {
    setCurrentStage("completed")
    saveCRMOnboardingCompleted()
    setShouldShowOnboarding(false)
    onComplete?.()
  }

  const handleSkip = () => {
    setCurrentStage("completed")
    saveCRMOnboardingCompleted()
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
        <CRMWelcomeScreen 
          onGetStarted={handleWelcomeComplete}
          onSkip={handleSkip}
        />
      )}
      
      {currentStage === "walkthrough" && (
        <CRMFeatureWalkthrough
          onComplete={handleWalkthroughComplete}
          onSkip={handleSkip}
        />
      )}
    </>
  )
}