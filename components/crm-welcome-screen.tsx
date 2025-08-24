"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  Clock,
  X 
} from "lucide-react"

interface CRMWelcomeScreenProps {
  onGetStarted: () => void
  onSkip: () => void
}

export function CRMWelcomeScreen({ onGetStarted, onSkip }: CRMWelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mb-6">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-3">
                Welcome to Your CRM Dashboard
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Manage all your clients and invoices in one organized, secure place. 
                Track payments, update invoice status, and grow your business efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Client Management</h3>
                  <p className="text-sm text-slate-600">
                    Store client information, contact details, and notes in one place
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Invoice Tracking</h3>
                  <p className="text-sm text-slate-600">
                    Create, manage, and track invoice status from draft to paid
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Financial Overview</h3>
                  <p className="text-sm text-slate-600">
                    See total revenue, pending payments, and business insights
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Privacy First</h3>
                  <p className="text-sm text-slate-600">
                    All your data stays in your browser - completely private and secure
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium"
              >
                <Clock className="h-4 w-4 mr-2" />
                Take the Quick Tour
              </Button>
              <Button 
                variant="outline" 
                onClick={onSkip}
                className="px-6 py-3 text-base"
              >
                Skip Tour
              </Button>
            </div>
            
            <p className="text-center text-xs text-slate-500 mt-4">
              This tour takes less than 30 seconds and will help you get the most out of the CRM
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}