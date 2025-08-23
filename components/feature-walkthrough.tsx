"use client"

import React from "react"
import { FileText, Settings, Eye, Download, Users } from "lucide-react"
import { BaseWalkthrough, type WalkthroughStep } from "./base-walkthrough"

interface FeatureWalkthroughProps {
  onComplete: () => void
  onSkip: () => void
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
    id: "crm-navigation",
    title: "Manage Clients with CRM",
    description: "Need to manage multiple clients? Click 'CRM' in the header to access your client management dashboard where you can store client info and track all their invoices!",
    icon: <Users className="h-5 w-5" />,
    highlightSelector: "[href='/crm']",
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
  return (
    <BaseWalkthrough
      steps={walkthroughSteps}
      onComplete={onComplete}
      onSkip={onSkip}
    />
  )
}