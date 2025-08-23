"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Calendar,
  DollarSign,
  Building,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Header } from "@/components/header"
import { ThemeSettings } from "@/components/theme-settings"
import { TemplateSelection } from "@/components/template-selection"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { deleteInvoiceWithConfirmation, getInvoiceStatusBadge } from "@/lib/utils"
import { updateClientInvoice } from "@/lib/storage/clientStorage"
import { useTheme, useClient, useTypedModal } from "@/lib/hooks"

interface ClientOverviewProps {
  clientId: string
}

export function ClientOverview({ clientId }: ClientOverviewProps) {
  // Use custom hooks instead of individual state management
  const { 
    theme, 
    themeClasses, 
    showThemeSettings, 
    showTemplateSelection,
    selectedTemplate,
    onThemeChange,
    onTemplateChange,
    setShowThemeSettings,
    setShowTemplateSelection 
  } = useTheme()
  
  const {
    client,
    clientForm,
    invoices,
    isLoading,
    loadClient,
    setClientForm,
    updateClient,
    handleEditClient
  } = useClient()
  
  const modal = useTypedModal<'editClient'>()

  // Load client data on mount
  useEffect(() => {
    loadClient(clientId)
  }, [clientId, loadClient])

  const handleSaveClient = async () => {
    const result = await updateClient(clientId)
    if (result.success) {
      modal.closeModal('editClient')
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    const success = await deleteInvoiceWithConfirmation(invoiceId)
    if (success) {
      // Reload client data to reflect changes
      loadClient(clientId)
    }
  }

  const handleStatusChange = async (invoiceId: string, newStatus: 'draft' | 'sent' | 'paid' | 'overdue') => {
    const updatedInvoice = updateClientInvoice(invoiceId, { status: newStatus })
    if (updatedInvoice) {
      // Reload client data to reflect changes
      loadClient(clientId)
    }
  }

  const getStatusBadge = (status: string) => (
    <Badge className={getInvoiceStatusBadge(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )

  const getTotalRevenue = () => {
    return invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0)
  }

  const getPendingAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'sent' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.total, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Client Not Found</h3>
          <p className="text-muted-foreground mb-6">The client you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/crm">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeClasses.secondary}`}>
      {/* Onboarding Flow */}
      <OnboardingFlow />
      
      {/* Enhanced Header */}
      <Header
        theme={theme}
        themeClasses={themeClasses}
        onShowThemeSettings={() => setShowThemeSettings(true)}
        onShowTemplateSelection={() => setShowTemplateSelection(true)}
      />

      {/* Client Page Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/crm">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Clients
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{client.name}</h1>
                <p className="text-slate-600 mt-1">
                  {client.company ? client.company : 'Client Details'}
                </p>
              </div>
            </div>
            <Link href={`/crm/clients/${clientId}/invoices/new`}>
              <Button className={`shadow-md bg-gradient-to-r ${themeClasses.primary} hover:${themeClasses.primaryHover} text-white`}>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Client Information */}
          <div className="lg:col-span-1">
            <Card className="shadow-md border-0 bg-gradient-to-br from-white to-slate-50/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Client Information
                  <Button variant="ghost" size="sm" onClick={() => {
                    handleEditClient(client)
                    modal.openModal('editClient')
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{client.name}</h3>
                  {client.company && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Building className="h-3 w-3 mr-2" />
                      {client.company}
                    </div>
                  )}
                </div>
                
                {client.email && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3 w-3 mr-2" />
                    <a href={`mailto:${client.email}`} className="hover:text-primary">
                      {client.email}
                    </a>
                  </div>
                )}
                
                {client.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-3 w-3 mr-2" />
                    <a href={`tel:${client.phone}`} className="hover:text-primary">
                      {client.phone}
                    </a>
                  </div>
                )}
                
                {client.address && (
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-2 mt-0.5" />
                    <span className="whitespace-pre-line">{client.address}</span>
                  </div>
                )}
                
                {client.notes && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-sm text-slate-600 mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {client.notes}
                    </p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                  <p>Added: {format(new Date(client.createdAt), 'MMM d, yyyy')}</p>
                  {client.updatedAt !== client.createdAt && (
                    <p>Updated: {format(new Date(client.updatedAt), 'MMM d, yyyy')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoices and Stats */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card className="shadow-md border-0 bg-gradient-to-br from-white to-blue-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                      <p className="text-2xl font-bold">{invoices.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-0 bg-gradient-to-br from-white to-green-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">${getTotalRevenue().toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-0 bg-gradient-to-br from-white to-orange-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">${getPendingAmount().toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoices List */}
            <Card className="shadow-md border-0 bg-gradient-to-br from-white to-slate-50/50">
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first invoice for {client.name}
                    </p>
                    <Link href={`/crm/clients/${clientId}/invoices/new`}>
                      <Button className={`bg-gradient-to-r ${themeClasses.primary} hover:${themeClasses.primaryHover} text-white shadow-lg`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Invoice
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-white/50">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">
                              Invoice #{invoice.invoiceNumber || invoice.id}
                            </h4>
                            <div className="flex items-center space-x-3" data-tour="invoice-status">
                              {getStatusBadge(invoice.status)}
                              <Select 
                                value={invoice.status} 
                                onValueChange={(value) => handleStatusChange(invoice.id, value as 'draft' | 'sent' | 'paid' | 'overdue')}
                              >
                                <SelectTrigger className="w-[120px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="sent">Sent</SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="overdue">Overdue</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(invoice.date), 'MMM d, yyyy')}
                            </div>
                            {invoice.dueDate && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                              </div>
                            )}
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {invoice.currency} {invoice.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/crm/clients/${clientId}/invoices/${invoice.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Theme Settings Modal */}
      <ThemeSettings
        isOpen={showThemeSettings}
        onClose={() => setShowThemeSettings(false)}
        theme={theme}
        onThemeChange={onThemeChange}
      />

      {/* Template Selection Modal */}
      <TemplateSelection
        isOpen={showTemplateSelection}
        onClose={() => setShowTemplateSelection(false)}
        currentTemplate={selectedTemplate}
        onTemplateChange={onTemplateChange}
      />

      {/* Edit Client Dialog */}
      <Dialog open={modal.isOpen('editClient')} onOpenChange={(open) => {
        if (!open) {
          modal.closeModal('editClient')
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={clientForm.name}
                onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter client name"
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={clientForm.company}
                onChange={(e) => setClientForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={clientForm.phone}
                onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={clientForm.address}
                onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={clientForm.notes}
                onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes about this client"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => modal.closeModal('editClient')}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>
              Update Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}