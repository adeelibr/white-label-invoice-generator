"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  Users, 
  FileText, 
  Edit2,
  Trash2,
  Mail,
  Phone,
  Globe,
  MapPin
} from "lucide-react"
import { 
  getAllClients, 
  searchClients, 
  getClientStats,
  deleteClient,
  type Client 
} from "@/lib/storage"
import { ClientManagementDialog } from "./client-management-dialog"
import { NavigationMenu } from "./navigation-menu"

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [stats, setStats] = useState({ totalClients: 0, totalInvoices: 0, averageInvoicesPerClient: 0 })
  const [showClientDialog, setShowClientDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  // Load clients and stats
  useEffect(() => {
    const loadData = () => {
      const allClients = getAllClients()
      const clientStats = getClientStats()
      setClients(allClients)
      setStats(clientStats)
    }
    loadData()
  }, [])

  // Filter clients based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(clients)
    } else {
      const filtered = searchClients(searchQuery)
      setFilteredClients(filtered)
    }
  }, [searchQuery, clients])

  const handleAddClient = () => {
    setDialogMode('add')
    setEditingClient(null)
    setShowClientDialog(true)
  }

  const handleEditClient = (client: Client) => {
    setDialogMode('edit')
    setEditingClient(client)
    setShowClientDialog(true)
  }

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This will also delete all associated invoices.')) {
      deleteClient(clientId)
      const updatedClients = getAllClients()
      setClients(updatedClients)
      const updatedStats = getClientStats()
      setStats(updatedStats)
    }
  }

  const handleClientSaved = () => {
    const updatedClients = getAllClients()
    setClients(updatedClients)
    const updatedStats = getClientStats()
    setStats(updatedStats)
    setShowClientDialog(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-2">Manage your client relationships and information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Invoices/Client</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageInvoicesPerClient}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddClient} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Client
          </Button>
        </div>

        {/* Clients Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {client.invoices?.length || 0} invoices
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span className="truncate">{client.website}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-xs leading-relaxed">{client.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : "Add your first client to get started with invoice management"
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleAddClient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Client
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Client Dialog */}
      <ClientManagementDialog
        open={showClientDialog}
        onOpenChange={setShowClientDialog}
        mode={dialogMode}
        client={editingClient}
        onClientSaved={handleClientSaved}
      />
    </div>
  )
}