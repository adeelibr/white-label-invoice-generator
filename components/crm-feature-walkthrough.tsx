"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, X, Users, FileText, TrendingUp, Settings } from "lucide-react"

interface CRMFeatureWalkthroughProps {
  onComplete: () => void
  onSkip: () => void
}

interface CRMWalkthroughStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  highlightSelector?: string
  position: "top" | "bottom" | "left" | "right" | "center"
}

const crmWalkthroughSteps: CRMWalkthroughStep[] = [
  {
    id: "clients-header",
    title: "Welcome to CRM Dashboard",
    description: "Manage all your clients and their invoices in one place. This is your central hub for client relationship management.",
    icon: <Users className="h-5 w-5" />,
    highlightSelector: "[data-tour='crm-header']",
    position: "bottom"
  },
  {
    id: "add-client-button",
    title: "Add New Clients",
    description: "Click here to add new clients. You can store their contact information, addresses, and notes for future reference.",
    icon: <Users className="h-5 w-5" />,
    highlightSelector: "[data-tour='add-client']",
    position: "bottom"
  },
  {
    id: "generate-demo-button", 
    title: "Try Demo Data",
    description: "Want to explore? Generate sample clients and invoices to see how everything works before adding your real data.",
    icon: <Settings className="h-5 w-5" />,
    highlightSelector: "[data-tour='generate-demo']",
    position: "bottom"
  },
  {
    id: "client-cards",
    title: "Client Overview Cards",
    description: "Each client card shows their basic information and invoice count. Click 'View Details' to manage their invoices and see financial summaries.",
    icon: <FileText className="h-5 w-5" />,
    highlightSelector: "[data-tour='client-card']",
    position: "top"
  },
  {
    id: "invoice-management",
    title: "Invoice Status Management",
    description: "Inside each client's page, you can create new invoices and change their status (Draft → Sent → Paid/Overdue) to track your business flow.",
    icon: <TrendingUp className="h-5 w-5" />,
    highlightSelector: "[data-tour='invoice-status']",
    position: "center"
  }
]

export function CRMFeatureWalkthrough({ onComplete, onSkip }: CRMFeatureWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })

  const handleNext = () => {
    if (currentStep < crmWalkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(onComplete, 300)
  }

  const handleSkip = () => {
    setIsVisible(false)
    setTimeout(onSkip, 300)
  }

  const currentStepData = crmWalkthroughSteps[currentStep]

  // Calculate position based on highlighted element and auto-scroll
  useEffect(() => {
    if (currentStepData.highlightSelector) {
      const element = document.querySelector(currentStepData.highlightSelector)
      if (element) {
        // Auto-scroll to the element smoothly
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest' 
        })
        
        // Small delay to ensure scroll is complete before calculating position
        const timer = setTimeout(() => {
          const rect = element.getBoundingClientRect()
          const cardWidth = 384 // max-w-sm = 24rem = 384px
          const cardHeight = 300 // approximate height
          
          let top = 0
          let left = 0
          
          switch (currentStepData.position) {
            case "top":
              top = rect.top - cardHeight - 20
              left = rect.left + (rect.width / 2) - (cardWidth / 2)
              break
            case "bottom":
              top = rect.bottom + 20
              left = rect.left + (rect.width / 2) - (cardWidth / 2)
              break
            case "left":
              top = rect.top + (rect.height / 2) - (cardHeight / 2)
              left = rect.left - cardWidth - 20
              break
            case "right":
              top = rect.top + (rect.height / 2) - (cardHeight / 2)
              left = rect.right + 20
              break
            case "center":
              top = window.innerHeight / 2 - cardHeight / 2
              left = window.innerWidth / 2 - cardWidth / 2
              break
          }
          
          // Ensure the card stays within viewport bounds
          top = Math.max(20, Math.min(top, window.innerHeight - cardHeight - 20))
          left = Math.max(20, Math.min(left, window.innerWidth - cardWidth - 20))
          
          setCardPosition({ top, left })
        }, 300)

        return () => clearTimeout(timer)
      } else {
        // If element not found, center the card
        setCardPosition({ 
          top: window.innerHeight / 2 - 150, 
          left: window.innerWidth / 2 - 192 
        })
      }
    } else {
      // Center the card when no selector is provided
      setCardPosition({ 
        top: window.innerHeight / 2 - 150, 
        left: window.innerWidth / 2 - 192 
      })
    }
  }, [currentStep, currentStepData])

  if (!isVisible) {
    return null
  }

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Highlight overlay - creates a "hole" around the highlighted element */}
      {currentStepData.highlightSelector && (
        <div 
          className="fixed inset-0 z-45 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 70%)`
          }}
        />
      )}
      
      {/* Walkthrough card */}
      <div
        className="fixed z-50 transition-all duration-300"
        style={{
          top: cardPosition.top,
          left: cardPosition.left,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          opacity: isVisible ? 1 : 0
        }}
      >
        <Card className="max-w-sm bg-white shadow-2xl border-2 border-blue-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {currentStepData.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    {currentStepData.title}
                  </CardTitle>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-slate-400 hover:text-slate-600 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-600 leading-relaxed">
              {currentStepData.description}
            </p>
            
            {/* Progress indicators */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs text-slate-500">
                Step {currentStep + 1} of {crmWalkthroughSteps.length}
              </span>
            </div>
            
            <div className="flex justify-center space-x-1">
              {crmWalkthroughSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep
                      ? "bg-blue-500"
                      : index < currentStep
                      ? "bg-blue-300"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-slate-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
              >
                {currentStep === crmWalkthroughSteps.length - 1 ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Done
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
            
            {currentStep === crmWalkthroughSteps.length - 1 && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-center text-slate-500">
                  You&apos;re ready to start managing your clients and invoices!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}