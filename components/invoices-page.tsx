"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter,
  FileText,
  Edit,
  Copy,
  Trash2,
  Download,
  Eye,
  Calendar,
  DollarSign,
  ChevronUp,
  ChevronDown,
  Plus,
  Users
} from "lucide-react"
import { 
  getFilteredInvoices,
  getInvoiceStats,
  deleteInvoice,
  duplicateInvoice,
  markInvoiceAsPaid,
  searchInvoices,
  getAllClients,
  type InvoiceHistoryItem,
  type InvoiceFilter,
  type InvoiceSortOptions
} from "@/lib/storage"
import { format } from "date-fns"
import { NavigationMenu } from "./navigation-menu"

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600"
}

type SortField = 'date' | 'dueDate' | 'amount' | 'invoiceNumber' | 'client'
type SortDirection = 'asc' | 'desc'

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceHistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [clientFilter, setClientFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0, 
    paid: 0,
    overdue: 0,
    cancelled: 0,
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0
  })
  const [clients, setClients] = useState<Array<{id: string, name: string}>>([])

  // Load data
  useEffect(() => {
    const loadData = () => {
      const filter: InvoiceFilter = {
        status: statusFilter === 'all' ? undefined : statusFilter as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
        clientId: clientFilter === 'all' ? undefined : clientFilter
      }
      
      const sortOptions: InvoiceSortOptions = {
        field: sortField,
        direction: sortDirection
      }
      
      const allInvoices = getFilteredInvoices(filter, sortOptions)
      const invoiceStats = getInvoiceStats()
      const allClients = getAllClients()
      
      setInvoices(allInvoices)
      setStats(invoiceStats)
      setClients(allClients.map(c => ({id: c.id, name: c.name})))
    }
    loadData()
  }, [statusFilter, clientFilter, sortField, sortDirection])

  // Search functionality
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices
    return searchInvoices(searchQuery)
  }, [invoices, searchQuery])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleDelete = (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(invoiceId)
      // Refresh data
      const filter: InvoiceFilter = {
        status: statusFilter === 'all' ? undefined : statusFilter as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
        clientId: clientFilter === 'all' ? undefined : clientFilter
      }
      const sortOptions: InvoiceSortOptions = {
        field: sortField,
        direction: sortDirection
      }
      const allInvoices = getFilteredInvoices(filter, sortOptions)
      const invoiceStats = getInvoiceStats()
      setInvoices(allInvoices)
      setStats(invoiceStats)
    }
  }

  const handleDuplicate = (invoiceId: string) => {
    duplicateInvoice(invoiceId)
    // Refresh data
    const filter: InvoiceFilter = {
      status: statusFilter === 'all' ? undefined : statusFilter as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
      clientId: clientFilter === 'all' ? undefined : clientFilter
    }
    const sortOptions: InvoiceSortOptions = {
      field: sortField,
      direction: sortDirection
    }
    const allInvoices = getFilteredInvoices(filter, sortOptions)
    const invoiceStats = getInvoiceStats()
    setInvoices(allInvoices)
    setStats(invoiceStats)
  }

  const handleMarkAsPaid = (invoiceId: string) => {
    markInvoiceAsPaid(invoiceId)
    // Refresh data
    const filter: InvoiceFilter = {
      status: statusFilter === 'all' ? undefined : statusFilter as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
      clientId: clientFilter === 'all' ? undefined : clientFilter
    }
    const sortOptions: InvoiceSortOptions = {
      field: sortField,
      direction: sortDirection
    }
    const allInvoices = getFilteredInvoices(filter, sortOptions)
    const invoiceStats = getInvoiceStats()
    setInvoices(allInvoices)
    setStats(invoiceStats)
  }

  const SortButton = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-2 font-medium hover:bg-muted/50"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </Button>
  )

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-2">View and manage all your invoices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.paidAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${stats.unpaidAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Invoices Table */}
        {filteredInvoices.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">
                        <SortButton field="invoiceNumber">Invoice #</SortButton>
                      </th>
                      <th className="text-left p-4">
                        <SortButton field="date">Date</SortButton>
                      </th>
                      <th className="text-left p-4">
                        <SortButton field="dueDate">Due Date</SortButton>
                      </th>
                      <th className="text-left p-4">
                        <SortButton field="client">Client</SortButton>
                      </th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-right p-4">
                        <SortButton field="amount">Amount</SortButton>
                      </th>
                      <th className="text-center p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{invoice.invoiceNumber}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {format(new Date(invoice.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM dd, yyyy') : '-'}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="truncate max-w-[200px]" title={invoice.clientName}>
                            {invoice.clientName}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant="secondary" 
                            className={statusColors[invoice.status]}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 text-right font-medium">
                          ${invoice.total.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="View Invoice"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Edit Invoice"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDuplicate(invoice.id)}
                              title="Duplicate Invoice"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {invoice.status !== 'paid' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                                title="Mark as Paid"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(invoice.id)}
                              title="Delete Invoice"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || statusFilter !== 'all' || clientFilter !== 'all' 
                  ? "No invoices found" 
                  : "No invoices yet"
                }
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || statusFilter !== 'all' || clientFilter !== 'all'
                  ? "Try adjusting your search criteria or filters"
                  : "Create your first invoice to get started"
                }
              </p>
              {!searchQuery && statusFilter === 'all' && clientFilter === 'all' && (
                <Button asChild>
                  <Link href="/">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Invoice
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}