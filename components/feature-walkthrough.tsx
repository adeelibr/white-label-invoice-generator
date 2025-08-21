"use client"

import React, { useState } from "react"
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
    id: "form-section",
    title: "Fill Your Invoice Details",
    description: "Start by entering your company information, client details, and invoice items. All calculations are automatic!",
    icon: <FileText className="h-5 w-5" />,
    position: "right"
  },
  {
    id: "preview-section", 
    title: "Real-time Preview",
    description: "Watch your invoice update instantly as you type. What you see is exactly what you'll get in the PDF.",
    icon: <Eye className="h-5 w-5" />,
    position: "left"
  },
  {
    id: "customize-button",
    title: "Customize Your Style",
    description: "Click here to choose from beautiful themes and templates that match your brand perfectly.",
    icon: <Settings className="h-5 w-5" />,
    position: "bottom"
  },
  {
    id: "download-button",
    title: "Download Your Invoice",
    description: "When you're ready, click this button to generate and download your professional PDF invoice.",
    icon: <Download className="h-5 w-5" />,
    position: "top"
  }
]

export function FeatureWalkthrough({ onComplete, onSkip }: FeatureWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

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

  if (!isVisible) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />
      
      {/* Walkthrough Card */}
      <div className={`fixed z-50 transition-all duration-300 ${
        currentStepData.position === "center" ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" :
        currentStepData.position === "top" ? "top-4 left-1/2 transform -translate-x-1/2" :
        currentStepData.position === "bottom" ? "bottom-4 left-1/2 transform -translate-x-1/2" :
        currentStepData.position === "left" ? "top-1/2 left-4 transform -translate-y-1/2" :
        "top-1/2 right-4 transform -translate-y-1/2"
      }`}>
        <Card className="max-w-sm bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
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
      
      {/* Highlight overlay for specific elements */}
      {currentStepData.highlightSelector && (
        <style jsx global>{`
          ${currentStepData.highlightSelector} {
            position: relative;
            z-index: 45;
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2);
            border-radius: 8px;
          }
        `}</style>
      )}
    </>
  )
}