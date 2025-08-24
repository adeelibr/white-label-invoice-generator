"use client"

import React from "react"
import { Users, FileText, TrendingUp, Settings } from "lucide-react"
import { BaseWalkthrough, type WalkthroughStep } from "./base-walkthrough"

interface CRMFeatureWalkthroughProps {
  onComplete: () => void
  onSkip: () => void
}

const crmWalkthroughSteps: WalkthroughStep[] = [
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
  return (
    <BaseWalkthrough
      steps={crmWalkthroughSteps}
      onComplete={onComplete}
      onSkip={onSkip}
    />
  )
}