"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, X, FileText, Settings, Eye, Download } from "lucide-react"

interface FeatureWalkthroughProps {
  onComplete: () => void
  onSkip: () => void
}

interface WalkthroughStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  highlightSelector?: string
  position: "top" | "bottom" | "left" | "right" | "center"
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "invoice-form-section",
    title: "Fill Your Invoice Details",
    description: "Start by entering your company information, client details, and invoice items. All calculations are automatic!",
    icon: <FileText className="h-5 w-5" />,
    highlightSelector: "#invoice-form-section",
    position: "right"
  },
  {
    id: "invoice-preview-section", 
    title: "Real-time Preview",
    description: "Watch your invoice update instantly as you type. What you see is exactly what you'll get in the PDF.",
    icon: <Eye className="h-5 w-5" />,
    highlightSelector: "#invoice-preview-section",
    position: "left"
  },
  {
    id: "customize-button",
    title: "Customize Your Style",
    description: "Click here to choose from beautiful themes and templates that match your brand perfectly.",
    icon: <Settings className="h-5 w-5" />,
    highlightSelector: "#customize-button",
    position: "bottom"
  },
  {
    id: "download-button",
    title: "Download Your Invoice",
    description: "When you're ready, click this button to generate and download your professional PDF invoice.",
    icon: <Download className="h-5 w-5" />,
    highlightSelector: "#download-button",
    position: "top"
  }
]

export function FeatureWalkthrough({ onComplete, onSkip }: FeatureWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
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

  const currentStepData = walkthroughSteps[currentStep]

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
            default:
              top = window.innerHeight / 2 - cardHeight / 2
              left = window.innerWidth / 2 - cardWidth / 2
          }
          
          // Ensure card stays within viewport
          top = Math.max(20, Math.min(top, window.innerHeight - cardHeight - 20))
          left = Math.max(20, Math.min(left, window.innerWidth - cardWidth - 20))
          
          setCardPosition({ top, left })
        }, 300) // Wait for smooth scroll to complete

        return () => clearTimeout(timer)
      }
    }
  }, [currentStep, currentStepData])

  if (!isVisible) return null

  return (
    <>
      {/* Less intrusive overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-300" />
      
      {/* Element highlighting */}
      {currentStepData.highlightSelector && (
        <style jsx global>{`
          ${currentStepData.highlightSelector} {
            position: relative !important;
            z-index: 45 !important;
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4) !important;
            border-radius: 12px !important;
            background-color: rgba(255, 255, 255, 0.95) !important;
          }
          
          ${currentStepData.highlightSelector}::before {
            content: '';
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            background: linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
            border-radius: 16px;
            z-index: -1;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
        `}</style>
      )}
      
      {/* Walkthrough Card */}
      <div 
        className="fixed z-50 transition-all duration-300"
        style={{
          top: cardPosition.top,
          left: cardPosition.left,
        }}
      >
        <Card className="max-w-sm bg-white/98 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="pb-4 relative">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Skip walkthrough"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                {currentStepData.icon}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  {currentStepData.title}
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Step {currentStep + 1} of {walkthroughSteps.length}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              {currentStepData.description}
            </p>
            
            {/* Progress Indicator */}
            <div className="flex space-x-2">
              {walkthroughSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                    index <= currentStep 
                      ? "bg-gradient-to-r from-violet-500 to-blue-500" 
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center pt-2">
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="sm"
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white flex items-center space-x-2"
              >
                {currentStep === walkthroughSteps.length - 1 ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Finish</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            
            {currentStep === walkthroughSteps.length - 1 && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-center text-slate-500">
                  You&apos;re all set! Start creating your first invoice.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}