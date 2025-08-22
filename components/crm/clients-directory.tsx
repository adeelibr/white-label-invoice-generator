"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  Search, 
  Plus, 
  Building, 
  Mail, 
  Phone, 
  FileText,
  ArrowLeft,
  Edit,
  Trash2,
  Database
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Header } from "@/components/header"
import { ThemeSettings, type ThemeConfig } from "@/components/theme-settings"
import { TemplateSelection } from "@/components/template-selection"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { 
  getAllClients, 
  searchClients, 
  getClientInvoiceCount,
  saveClientInvoice,
  saveClient,
  getTheme,
  getDefaultTheme,
  type Client,
  type InvoiceData
} from "@/lib/storage"
import {
  getThemeClasses,
  handleThemeChange,
  getEmptyClientForm,
  populateClientForm,
  saveNewClient,
  updateExistingClient,
  deleteClientWithConfirmation,
  type ClientFormData,
  type ThemeClasses
} from "@/lib/utils"

export function ClientsDirectory() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showAddClient, setShowAddClient] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  
  // Theme states
  const [theme, setTheme] = useState<ThemeConfig>(getDefaultTheme())
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [showTemplateSelection, setShowTemplateSelection] = useState(false)
  
  // Form states
  const [clientForm, setClientForm] = useState<ClientFormData>(getEmptyClientForm())

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setClients(searchClients(searchQuery))
    } else {
      setClients(getAllClients())
    }
  }, [searchQuery])

  useEffect(() => {
    const savedTheme = getTheme()
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Get theme classes using the utility function
  const themeClasses: ThemeClasses = getThemeClasses(theme)

  // Theme change handler using utility
  const onThemeChange = (newTheme: ThemeConfig) => {
    handleThemeChange(newTheme, setTheme)
  }

  const loadClients = () => {
    setIsLoading(true)
    try {
      const allClients = getAllClients()
      setClients(allClients)
    } catch (error) {
      console.error("Failed to load clients:", error)
      toast.error("Failed to load clients")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveClient = async () => {
    let result
    if (editingClient) {
      // Update existing client
      result = await updateExistingClient(editingClient.id, clientForm)
    } else {
      // Create new client
      result = await saveNewClient(clientForm)
    }
    
    if (result.success) {
      // Reset form and close dialog
      setClientForm(getEmptyClientForm())
      setShowAddClient(false)
      setEditingClient(null)
      loadClients()
    }
  }

  const handleEditClient = (client: Client) => {
    setClientForm(populateClientForm(client))
    setEditingClient(client)
    setShowAddClient(true)
  }

  const handleDeleteClient = async (clientId: string) => {
    const success = await deleteClientWithConfirmation(clientId)
    if (success) {
      loadClients()
    }
  }

  const getClientInvoicesCount = (clientId: string): number => {
    try {
      return getClientInvoiceCount(clientId)
    } catch {
      return 0
    }
  }

  const generateDummyData = async () => {
    try {
      // Dummy client data
      const dummyClients = [
        {
          name: "Acme Corporation",
          company: "Acme Corp",
          email: "contact@acmecorp.com",
          phone: "+1 (555) 123-4567",
          address: "123 Business Ave\nNew York, NY 10001\nUnited States",
          notes: "Fortune 500 company, requires NET 30 payment terms"
        },
        {
          name: "Tech Innovations LLC",
          company: "Tech Innovations",
          email: "hello@techinnovations.com",
          phone: "+1 (555) 987-6543",
          address: "456 Silicon Valley Blvd\nSan Francisco, CA 94105\nUnited States",
          notes: "Startup focused on AI and machine learning solutions"
        },
        {
          name: "Global Marketing Solutions",
          company: "GMS Agency",
          email: "info@gmsagency.com",
          phone: "+1 (555) 246-8135",
          address: "789 Marketing Plaza\nChicago, IL 60601\nUnited States",
          notes: "Full-service marketing agency, prefers quarterly billing"
        }
      ]

      const savedClients = []

      // Create clients
      for (const clientData of dummyClients) {
        const newClient = saveClient(clientData)
        savedClients.push(newClient)
      }

      // Generate invoices for each client
      for (const client of savedClients) {
        const invoiceCount = Math.floor(Math.random() * 3) + 3 // 3-5 invoices per client
        
        for (let i = 0; i < invoiceCount; i++) {
          const invoiceDate = new Date()
          invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 90)) // Random date in last 90 days
          
          const dueDate = new Date(invoiceDate)
          dueDate.setDate(dueDate.getDate() + 30) // 30 days payment terms
          
          const services = [
            { description: "Web Development", unitCost: "150.00" },
            { description: "UI/UX Design", unitCost: "120.00" },
            { description: "Consulting Services", unitCost: "200.00" },
            { description: "Project Management", unitCost: "100.00" },
            { description: "Content Creation", unitCost: "80.00" },
            { description: "SEO Optimization", unitCost: "90.00" }
          ]

          const randomServices = services.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
          
          const lineItems = randomServices.map((service, index) => {
            const quantity = Math.floor(Math.random() * 10) + 1
            const unitCost = parseFloat(service.unitCost)
            return {
              id: (index + 1).toString(),
              description: service.description,
              unitCost: service.unitCost,
              quantity: quantity.toString(),
              amount: unitCost * quantity
            }
          })

          const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
          const taxRate = Math.random() > 0.5 ? "10" : "0"
          const taxAmount = subtotal * (parseFloat(taxRate) / 100)
          const total = subtotal + taxAmount

          const invoiceNumber = `INV-${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, '0')}${String(invoiceDate.getDate()).padStart(2, '0')}-${Date.now().toString().slice(-4)}`

          const invoiceData: InvoiceData = {
            invoiceNumber,
            purchaseOrder: Math.random() > 0.5 ? `PO-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}` : "",
            logo: "",
            companyDetails: "Your Business Name\n123 Your Address\nYour City, State 12345\nPhone: (555) 123-4567\nEmail: hello@yourbusiness.com",
            billTo: `${client.name}${client.company ? '\n' + client.company : ''}${client.address ? '\n' + client.address : ''}`,
            currency: "USD",
            invoiceDate: invoiceDate.toISOString().split("T")[0],
            dueDate: dueDate.toISOString().split("T")[0],
            lineItems,
            notes: Math.random() > 0.5 ? "Thank you for your business!" : "Payment is due within 30 days.",
            bankDetails: "Bank: Your Bank Name\nAccount: 1234567890\nRouting: 987654321",
            subtotal,
            taxRate,
            discount: "",
            shippingFee: "",
            total
          }

          const statuses: ('draft' | 'sent' | 'paid' | 'overdue')[] = ['draft', 'sent', 'paid', 'overdue']
          const status = statuses[Math.floor(Math.random() * statuses.length)]

          saveClientInvoice({
            clientId: client.id,
            invoiceNumber,
            date: invoiceData.invoiceDate,
            dueDate: invoiceData.dueDate,
            status,
            total,
            currency: "USD",
            invoiceData
          })
        }
      }

      toast.success(`Generated ${savedClients.length} clients with ${savedClients.length * 4} invoices on average`)
      loadClients()
    } catch (error) {
      console.error("Failed to generate dummy data:", error)
      toast.error("Failed to generate dummy data")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading clients...</p>
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

      {/* CRM Page Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Clients & Invoices</h1>
                <p className="text-slate-600 mt-1">Manage your clients and their invoices</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={generateDummyData}
                variant="outline"
                className="text-muted-foreground hover:text-foreground"
              >
                <Database className="h-4 w-4 mr-2" />
                Generate Demo Data
              </Button>
              <Button onClick={() => setShowAddClient(true)} className={`shadow-md bg-gradient-to-r ${themeClasses.primary} hover:${themeClasses.primaryHover} text-white`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search clients by name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {clients.length} client{clients.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Clients Grid */}
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-24 w-24 mx-auto mb-6 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms to find the client you&apos;re looking for.'
                : 'Get started by adding your first client. You can then create and manage invoices for each client.'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setShowAddClient(true)} 
                size="lg"
                className={`bg-gradient-to-r ${themeClasses.primary} hover:${themeClasses.primaryHover} text-white shadow-lg`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clients.map((client) => {
              const invoiceCount = getClientInvoicesCount(client.id)
              return (
                <Card 
                  key={client.id} 
                  className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-gradient-to-br from-white to-slate-50/50 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-800 mb-1 line-clamp-1">
                          {client.name}
                        </CardTitle>
                        {client.company && (
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Building className="h-3 w-3 mr-1" />
                            <span className="line-clamp-1">{client.company}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditClient(client)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      {client.email && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-2" />
                          <span className="line-clamp-1">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-2" />
                          <span className="line-clamp-1">{client.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 mr-1" />
                        <span>{invoiceCount} invoice{invoiceCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <Link href={`/crm/clients/${client.id}`}>
                      <Button className="w-full" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Client Dialog */}
      <Dialog open={showAddClient} onOpenChange={(open) => {
        setShowAddClient(open)
        if (!open) {
          setEditingClient(null)
          setClientForm(getEmptyClientForm())
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={clientForm.name}
                onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Client name"
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={clientForm.company}
                onChange={(e) => setClientForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Company name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={clientForm.phone}
                onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={clientForm.address}
                onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Client address"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={clientForm.notes}
                onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this client"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowAddClient(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>
              {editingClient ? 'Update Client' : 'Add Client'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
        selectedTemplate="classic"
        onTemplateSelect={() => {}}
      />
    </div>
  )
}