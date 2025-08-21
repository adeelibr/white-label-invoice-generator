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
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { 
  getAllClients, 
  saveClient, 
  updateClient, 
  deleteClient, 
  searchClients, 
  getClientInvoiceCount,
  type Client 
} from "@/lib/storage"

export function ClientsDirectory() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showAddClient, setShowAddClient] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  
  // Form states
  const [clientForm, setClientForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  })

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
    if (!clientForm.name.trim()) {
      toast.error("Client name is required")
      return
    }

    try {
      if (editingClient) {
        // Update existing client
        const updated = updateClient(editingClient.id, clientForm)
        if (updated) {
          toast.success("Client updated successfully")
        } else {
          toast.error("Failed to update client")
        }
      } else {
        // Create new client
        saveClient(clientForm)
        toast.success("Client added successfully")
      }
      
      // Reset form and close dialog
      setClientForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        notes: ""
      })
      setShowAddClient(false)
      setEditingClient(null)
      loadClients()
    } catch (error) {
      console.error("Failed to save client:", error)
      toast.error("Failed to save client")
    }
  }

  const handleEditClient = (client: Client) => {
    setClientForm({
      name: client.name,
      company: client.company || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      notes: client.notes || ""
    })
    setEditingClient(client)
    setShowAddClient(true)
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client? This will also delete all their invoices.")) {
      return
    }

    try {
      const success = deleteClient(clientId)
      if (success) {
        toast.success("Client deleted successfully")
        loadClients()
      } else {
        toast.error("Failed to delete client")
      }
    } catch (error) {
      console.error("Failed to delete client:", error)
      toast.error("Failed to delete client")
    }
  }

  const getClientInvoicesCount = (clientId: string): number => {
    try {
      return getClientInvoiceCount(clientId)
    } catch {
      return 0
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
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
            <Button onClick={() => setShowAddClient(true)} className="shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
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
              <Button onClick={() => setShowAddClient(true)} size="lg">
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
          setClientForm({
            name: "",
            company: "",
            email: "",
            phone: "",
            address: "",
            notes: ""
          })
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
    </div>
  )
}