"use client"

import React, { useState, useEffect, useMemo } from "react"
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
  Plus
} from "lucide-react"
import { 
  getFilteredInvoices,
  getInvoiceStats,
  deleteInvoice,
  duplicateInvoice,
  markInvoiceAsPaid,
  searchInvoices,
  type InvoiceHistoryItem,
  type InvoiceFilter,
  type InvoiceSortOptions
} from "@/lib/storage"
import { format } from "date-fns"

interface InvoiceHistoryProps {
  clientId: string | null
  onNewInvoiceClick: (clientId?: string) => void
  onEditInvoiceClick: (invoice: InvoiceHistoryItem) => void
  onViewInvoiceClick: (invoice: InvoiceHistoryItem) => void
  className?: string
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600"
}

const statusLabels = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled"
}

export function InvoiceHistory({ 
  clientId, 
  onNewInvoiceClick, 
  onEditInvoiceClick,
  onViewInvoiceClick,
  className = "" 
}: InvoiceHistoryProps) {
  const [invoices, setInvoices] = useState<InvoiceHistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<InvoiceFilter>({})
  const [sort, setSort] = useState<InvoiceSortOptions>({ field: 'createdAt', direction: 'desc' })
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    overdue: 0,
    byStatus: { draft: 0, sent: 0, paid: 0, overdue: 0, cancelled: 0 }
  })

  // Load invoices and stats
  const refreshData = () => {
    const currentFilter = { ...filter }
    if (clientId) {
      currentFilter.clientId = clientId
    }
    
    const filteredInvoices = searchQuery 
      ? searchInvoices(searchQuery, clientId || undefined)
      : getFilteredInvoices(currentFilter, sort)
    
    const invoiceStats = getInvoiceStats(clientId || undefined)
    
    setInvoices(filteredInvoices)
    setStats(invoiceStats)
  }

  useEffect(() => {
    refreshData()
  }, [clientId, filter, sort, searchQuery])

  // Reset filters when clientId changes
  useEffect(() => {
    setFilter({})
    setSearchQuery("")
  }, [clientId])

  const handleSort = (field: InvoiceSortOptions['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleDuplicate = (invoice: InvoiceHistoryItem) => {
    try {
      const duplicated = duplicateInvoice(invoice.id, clientId || undefined)
      if (duplicated) {
        refreshData()
      }
    } catch (error) {
      console.error("Failed to duplicate invoice:", error)
    }
  }

  const handleDelete = (invoice: InvoiceHistoryItem) => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      try {
        const success = deleteInvoice(invoice.id)
        if (success) {
          refreshData()
        }
      } catch (error) {
        console.error("Failed to delete invoice:", error)
      }
    }
  }

  const handleMarkAsPaid = (invoice: InvoiceHistoryItem) => {
    try {
      const updated = markInvoiceAsPaid(invoice.id)
      if (updated) {
        refreshData()
      }
    } catch (error) {
      console.error("Failed to mark invoice as paid:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const SortableHeader = ({ field, children }: { field: InvoiceSortOptions['field'], children: React.ReactNode }) => (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sort.field === field && (
          sort.direction === 'asc' ? 
            <ChevronUp className="w-3 h-3" /> : 
            <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </th>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {clientId ? "Client Invoices" : "All Invoices"}
          </h1>
          <p className="text-gray-600">
            {stats.totalInvoices} invoice{stats.totalInvoices !== 1 ? 's' : ''} • {formatCurrency(stats.totalAmount)} total
          </p>
        </div>
        <Button onClick={() => onNewInvoiceClick(clientId || undefined)}>
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalInvoices}</div>
            <div className="text-sm text-gray-500">Total Invoices</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</div>
            <div className="text-sm text-gray-500">Paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.unpaidAmount)}</div>
            <div className="text-sm text-gray-500">Unpaid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-500">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Select value={filter.status || "all"} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value === "all" ? undefined : value as any }))}>
                <SelectTrigger className="w-[140px]">
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
              
              <Input
                type="date"
                placeholder="From date"
                value={filter.dateFrom || ""}
                onChange={(e) => setFilter(prev => ({ ...prev, dateFrom: e.target.value || undefined }))}
                className="w-[150px]"
              />
              
              <Input
                type="date"
                placeholder="To date"
                value={filter.dateTo || ""}
                onChange={(e) => setFilter(prev => ({ ...prev, dateTo: e.target.value || undefined }))}
                className="w-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || Object.keys(filter).length > 0
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first invoice"
                }
              </p>
              <Button onClick={() => onNewInvoiceClick(clientId || undefined)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableHeader field="invoiceNumber">Invoice #</SortableHeader>
                    <SortableHeader field="invoiceDate">Date</SortableHeader>
                    <SortableHeader field="dueDate">Due Date</SortableHeader>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Client
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <SortableHeader field="total">Amount</SortableHeader>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {formatDate(invoice.invoiceDate)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                        {invoice.billTo.split('\n')[0]}
                      </td>
                      <td className="px-3 py-4">
                        <Badge className={statusColors[invoice.status]}>
                          {statusLabels[invoice.status]}
                        </Badge>
                      </td>
                      <td className="px-3 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewInvoiceClick(invoice)}
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditInvoiceClick(invoice)}
                            title="Edit Invoice"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicate(invoice)}
                            title="Duplicate Invoice"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          {invoice.status !== 'paid' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsPaid(invoice)}
                              title="Mark as Paid"
                            >
                              <DollarSign className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(invoice)}
                            title="Delete Invoice"
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}