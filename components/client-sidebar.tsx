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
  Menu,
  X,
  ChevronRight,
  Filter
} from "lucide-react"
import { 
  getAllClients, 
  searchClients, 
  getClientStats,
  type Client 
} from "@/lib/storage"

interface ClientSidebarProps {
  selectedClientId: string | null
  onClientSelect: (clientId: string | null) => void
  onNewClientClick: () => void
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function ClientSidebar({
  selectedClientId,
  onClientSelect,
  onNewClientClick,
  isOpen,
  onToggle,
  className = ""
}: ClientSidebarProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [stats, setStats] = useState({ totalClients: 0, totalInvoices: 0, averageInvoicesPerClient: 0 })

  // Load clients and stats
  useEffect(() => {
    const loadData = () => {
      const allClients = getAllClients()
      const clientStats = getClientStats()
      setClients(allClients)
      setStats(clientStats)
    }

    loadData()
    // Set up interval to refresh data periodically
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Filter clients based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredClients(searchClients(searchQuery.trim()))
    } else {
      setFilteredClients(clients)
    }
  }, [searchQuery, clients])

  const selectedClient = selectedClientId ? clients.find(c => c.id === selectedClientId) : null

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-80 md:w-72 lg:w-80
        ${className}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Clients
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="md:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.totalClients}</div>
              <div className="text-xs text-gray-500">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.totalInvoices}</div>
              <div className="text-xs text-gray-500">Invoices</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{stats.averageInvoicesPerClient}</div>
              <div className="text-xs text-gray-500">Avg/Client</div>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-2">
            <Button 
              onClick={onNewClientClick}
              className="w-full justify-start"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Client
            </Button>
            <Button 
              variant="outline"
              onClick={() => onClientSelect(null)}
              className={`w-full justify-start ${!selectedClientId ? 'bg-blue-50 border-blue-200' : ''}`}
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              All Invoices
            </Button>
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
          {filteredClients.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? "No clients found" : "No clients yet"}
              <div className="text-sm mt-1">
                {!searchQuery && "Click 'Add New Client' to get started"}
              </div>
            </div>
          ) : (
            <div className="p-2">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => onClientSelect(client.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    hover:bg-gray-50 border border-transparent
                    ${selectedClientId === client.id ? 'bg-blue-50 border-blue-200' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {client.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {client.email}
                      </div>
                      {client.invoiceCount > 0 && (
                        <div className="mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {client.invoiceCount} invoice{client.invoiceCount !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

interface MobileSidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
  selectedClient?: Client | null
}

export function MobileSidebarToggle({ isOpen, onToggle, selectedClient }: MobileSidebarToggleProps) {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="flex items-center"
        >
          <Menu className="w-4 h-4 mr-2" />
          {selectedClient ? selectedClient.name : 'All Clients'}
        </Button>
        <Badge variant="secondary">
          {selectedClient ? `${selectedClient.invoiceCount} invoices` : 'All Invoices'}
        </Badge>
      </div>
    </div>
  )
}