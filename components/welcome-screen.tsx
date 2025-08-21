"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Shield, Download, Zap, ArrowRight, X } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
  onSkip: () => void
}

export function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6 relative">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Welcome to Invoice Generator
          </CardTitle>
          <p className="text-lg text-slate-600 leading-relaxed">
            The easiest way to create professional invoices online. 
            Let&apos;s get you started in just a few steps!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100">
              <div className="flex-shrink-0">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Instant Creation</h4>
                <p className="text-sm text-slate-600">Create and download invoices in minutes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Privacy First</h4>
                <p className="text-sm text-slate-600">Your data never leaves your browser</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
              <div className="flex-shrink-0">
                <Download className="h-5 w-5 text-purple-600 mt-0.5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">PDF Download</h4>
                <p className="text-sm text-slate-600">Professional PDF invoices ready to send</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100">
              <div className="flex-shrink-0">
                <Sparkles className="h-5 w-5 text-orange-600 mt-0.5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Beautiful Themes</h4>
                <p className="text-sm text-slate-600">Multiple templates and customization</p>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span>Take the Quick Tour</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              onClick={onSkip}
              variant="outline" 
              size="lg"
              className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50 py-3 font-medium"
            >
              Skip Tour
            </Button>
          </div>
          
          <p className="text-xs text-center text-slate-500 pt-2">
            This tour takes less than 30 seconds and will help you get the most out of the tool
          </p>
        </CardContent>
      </Card>
    </div>
  )
}