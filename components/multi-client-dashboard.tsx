"use client"

import React, { useState, useEffect } from "react"
import { ClientSidebar, MobileSidebarToggle } from "./client-sidebar"
import { InvoiceHistory } from "./invoice-history"
import { ClientManagementDialog } from "./client-management-dialog"
import { InvoiceGenerator } from "./invoice-generator"
import { DynamicInvoicePreview } from "./dynamic-invoice-preview"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { 
  getAllClients, 
  getClientById,
  addInvoiceToHistory,
  getInvoiceById,
  updateInvoice,
  getNextInvoiceNumber,
  type Client,
  type InvoiceHistoryItem,
  type InvoiceData 
} from "@/lib/storage"

type ViewMode = 'dashboard' | 'invoice-form' | 'invoice-view'

interface DashboardState {
  selectedClientId: string | null
  sidebarOpen: boolean
  viewMode: ViewMode
  showClientDialog: boolean
  clientDialogMode: 'add' | 'edit'
  editingClient: Client | null
  editingInvoice: InvoiceHistoryItem | null
  viewingInvoice: InvoiceHistoryItem | null
}

export function MultiClientDashboard() {
  const [state, setState] = useState<DashboardState>({
    selectedClientId: null,
    sidebarOpen: false,
    viewMode: 'dashboard',
    showClientDialog: false,
    clientDialogMode: 'add',
    editingClient: null,
    editingInvoice: null,
    viewingInvoice: null
  })

  const [clients, setClients] = useState<Client[]>([])
  const selectedClient = state.selectedClientId ? clients.find(c => c.id === state.selectedClientId) : null

  // Load clients
  useEffect(() => {
    const loadClients = () => {
      setClients(getAllClients())
    }
    loadClients()
    // Refresh periodically
    const interval = setInterval(loadClients, 5000)
    return () => clearInterval(interval)
  }, [])

  // Handle client selection
  const handleClientSelect = (clientId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedClientId: clientId,
      sidebarOpen: false, // Close sidebar on mobile after selection
      viewMode: 'dashboard'
    }))
  }

  // Handle new client dialog
  const handleNewClientClick = () => {
    setState(prev => ({
      ...prev,
      showClientDialog: true,
      clientDialogMode: 'add',
      editingClient: null
    }))
  }

  const handleEditClientClick = (client: Client) => {
    setState(prev => ({
      ...prev,
      showClientDialog: true,
      clientDialogMode: 'edit',
      editingClient: client
    }))
  }

  const handleClientDialogClose = () => {
    setState(prev => ({
      ...prev,
      showClientDialog: false,
      editingClient: null
    }))
  }

  const handleClientSaved = (client: Client) => {
    setClients(getAllClients())
    // If we're adding a new client, select it
    if (state.clientDialogMode === 'add') {
      setState(prev => ({
        ...prev,
        selectedClientId: client.id
      }))
    }
  }

  const handleClientDeleted = (clientId: string) => {
    setClients(getAllClients())
    // If the deleted client was selected, unselect it
    if (state.selectedClientId === clientId) {
      setState(prev => ({
        ...prev,
        selectedClientId: null
      }))
    }
  }

  // Handle new invoice
  const handleNewInvoiceClick = (clientId?: string) => {
    const targetClientId = clientId || state.selectedClientId
    setState(prev => ({
      ...prev,
      viewMode: 'invoice-form',
      editingInvoice: null,
      selectedClientId: targetClientId
    }))
  }

  // Handle edit invoice
  const handleEditInvoiceClick = (invoice: InvoiceHistoryItem) => {
    setState(prev => ({
      ...prev,
      viewMode: 'invoice-form',
      editingInvoice: invoice,
      selectedClientId: invoice.clientId
    }))
  }

  // Handle view invoice
  const handleViewInvoiceClick = (invoice: InvoiceHistoryItem) => {
    setState(prev => ({
      ...prev,
      viewMode: 'invoice-view',
      viewingInvoice: invoice,
      selectedClientId: invoice.clientId
    }))
  }

  // Handle invoice form submission
  const handleInvoiceSave = (invoiceData: InvoiceData) => {
    if (!state.selectedClientId) {
      console.error("No client selected for invoice")
      return
    }

    try {
      if (state.editingInvoice) {
        // Update existing invoice
        updateInvoice(state.editingInvoice.id, invoiceData)
      } else {
        // Create new invoice
        // Auto-generate invoice number if not provided
        if (!invoiceData.invoiceNumber) {
          invoiceData.invoiceNumber = getNextInvoiceNumber(state.selectedClientId)
        }
        addInvoiceToHistory(invoiceData, state.selectedClientId, 'draft')
      }
      
      // Return to dashboard
      setState(prev => ({
        ...prev,
        viewMode: 'dashboard',
        editingInvoice: null
      }))
    } catch (error) {
      console.error("Failed to save invoice:", error)
    }
  }

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setState(prev => ({
      ...prev,
      viewMode: 'dashboard',
      editingInvoice: null,
      viewingInvoice: null
    }))
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))
  }

  // Render based on view mode
  const renderMainContent = () => {
    switch (state.viewMode) {
      case 'invoice-form':
        return (
          <div className="flex-1 flex">
            <div className="flex-1 p-6">
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold">
                  {state.editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h1>
                {selectedClient && (
                  <p className="text-gray-600">for {selectedClient.name}</p>
                )}
              </div>
              <InvoiceGenerator
                initialData={state.editingInvoice || undefined}
                clientId={state.selectedClientId}
                onSave={handleInvoiceSave}
                hideHeader={true}
              />
            </div>
          </div>
        )

      case 'invoice-view':
        return (
          <div className="flex-1 flex">
            <div className="flex-1 p-6">
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold">Invoice Preview</h1>
                {state.viewingInvoice && selectedClient && (
                  <p className="text-gray-600">
                    {state.viewingInvoice.invoiceNumber} • {selectedClient.name}
                  </p>
                )}
              </div>
              {state.viewingInvoice && (
                <div className="max-w-4xl">
                  <DynamicInvoicePreview 
                    data={state.viewingInvoice}
                    template="classic"
                    theme={{ colorScheme: "violet-blue", fontPair: "modern" }}
                  />
                </div>
              )}
            </div>
          </div>
        )

      default: // dashboard
        return (
          <div className="flex-1">
            <MobileSidebarToggle
              isOpen={state.sidebarOpen}
              onToggle={toggleSidebar}
              selectedClient={selectedClient}
            />
            <div className="p-6">
              <InvoiceHistory
                clientId={state.selectedClientId}
                onNewInvoiceClick={handleNewInvoiceClick}
                onEditInvoiceClick={handleEditInvoiceClick}
                onViewInvoiceClick={handleViewInvoiceClick}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen pt-0">
        <ClientSidebar
          selectedClientId={state.selectedClientId}
          onClientSelect={handleClientSelect}
          onNewClientClick={handleNewClientClick}
          isOpen={state.sidebarOpen}
          onToggle={toggleSidebar}
        />
        
        {renderMainContent()}
      </div>

      <ClientManagementDialog
        isOpen={state.showClientDialog}
        onClose={handleClientDialogClose}
        onClientSaved={handleClientSaved}
        onClientDeleted={handleClientDeleted}
        editingClient={state.editingClient}
        mode={state.clientDialogMode}
      />
    </div>
  )
}