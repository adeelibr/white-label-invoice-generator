"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Download, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DynamicInvoicePreview } from "@/components/dynamic-invoice-preview"
import { ThemeSettings, type ThemeConfig } from "@/components/theme-settings"
import {
  getClient,
  getClientInvoiceById,
  saveClientInvoice,
  updateClientInvoice,
  getTheme,
  getDefaultTheme,
  type Client,
  type ClientInvoice,
  type InvoiceData,
  type LineItem
} from "@/lib/storage"

interface CRMInvoiceGeneratorProps {
  clientId: string
  invoiceId?: string
}

export function CRMInvoiceGenerator({ clientId, invoiceId }: CRMInvoiceGeneratorProps) {
  const router = useRouter()
  const invoicePreviewRef = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  
  const [theme, setTheme] = useState<ThemeConfig>(getDefaultTheme())

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    purchaseOrder: "",
    logo: "",
    companyDetails: "",
    billTo: "",
    currency: "USD",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    lineItems: [{ id: "1", description: "", unitCost: "", quantity: "1", amount: 0 }],
    notes: "",
    bankDetails: "",
    subtotal: 0,
    taxRate: "",
    discount: "",
    shippingFee: "",
    total: 0,
  })

  useEffect(() => {
    loadData()
  }, [clientId, invoiceId])

  useEffect(() => {
    calculateTotals()
  }, [invoiceData.lineItems, invoiceData.taxRate, invoiceData.discount, invoiceData.shippingFee])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load client data
      const clientData = getClient(clientId)
      if (!clientData) {
        toast.error("Client not found")
        router.push("/crm")
        return
      }
      setClient(clientData)

      // Load theme
      const savedTheme = getTheme()
      if (savedTheme) {
        setTheme(savedTheme)
      }

      // If editing existing invoice, load invoice data
      if (invoiceId) {
        const existingInvoice = getClientInvoiceById(invoiceId)
        if (existingInvoice && existingInvoice.clientId === clientId) {
          setInvoiceData(existingInvoice.invoiceData)
        } else {
          toast.error("Invoice not found")
          router.push(`/crm/clients/${clientId}`)
          return
        }
      } else {
        // For new invoice, pre-populate client data
        setInvoiceData(prev => ({
          ...prev,
          billTo: `${clientData.name}${clientData.company ? '\n' + clientData.company : ''}${clientData.address ? '\n' + clientData.address : ''}`,
          invoiceNumber: generateInvoiceNumber()
        }))
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const generateInvoiceNumber = (): string => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const timestamp = Date.now().toString().slice(-4)
    return `INV-${year}${month}${day}-${timestamp}`
  }

  const calculateTotals = () => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => {
      const unitCost = parseFloat(item.unitCost) || 0
      const quantity = parseFloat(item.quantity) || 0
      return sum + (unitCost * quantity)
    }, 0)

    const taxRate = parseFloat(invoiceData.taxRate) || 0
    const discount = parseFloat(invoiceData.discount) || 0
    const shippingFee = parseFloat(invoiceData.shippingFee) || 0

    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount + shippingFee - discount

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      total: Math.max(0, total),
      lineItems: prev.lineItems.map(item => ({
        ...item,
        amount: (parseFloat(item.unitCost) || 0) * (parseFloat(item.quantity) || 0)
      }))
    }))
  }

  const handleSaveInvoice = async () => {
    if (!invoiceData.invoiceNumber.trim()) {
      toast.error("Invoice number is required")
      return
    }

    if (invoiceData.lineItems.length === 0 || !invoiceData.lineItems.some(item => item.description.trim())) {
      toast.error("At least one line item with description is required")
      return
    }

    setIsSaving(true)
    try {
      const invoicePayload = {
        clientId,
        invoiceNumber: invoiceData.invoiceNumber,
        date: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        status: 'draft' as const,
        total: invoiceData.total,
        currency: invoiceData.currency,
        invoiceData
      }

      if (invoiceId) {
        // Update existing invoice
        const updated = updateClientInvoice(invoiceId, invoicePayload)
        if (updated) {
          toast.success("Invoice updated successfully")
        } else {
          toast.error("Failed to update invoice")
        }
      } else {
        // Create new invoice
        const newInvoice = saveClientInvoice(invoicePayload)
        toast.success("Invoice saved successfully")
        router.push(`/crm/clients/${clientId}/invoices/${newInvoice.id}`)
      }
    } catch (error) {
      console.error("Failed to save invoice:", error)
      toast.error("Failed to save invoice")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreatePDF = async () => {
    calculateTotals()

    if (!invoicePreviewRef.current) {
      console.error("Invoice preview not found")
      return
    }

    try {
      // Create a new window with just the invoice content
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("Please allow popups to download the invoice")
        return
      }

      // Get all stylesheets from the current document
      const stylesheets = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n")
          } catch (e) {
            return ""
          }
        })
        .join("\n")

      const invoiceHtml = invoicePreviewRef.current.innerHTML
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoiceData.invoiceNumber}</title>
            <style>
              ${stylesheets}
              body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
              @media print {
                body { margin: 0; padding: 0; }
                @page { margin: 0.5in; }
              }
            </style>
          </head>
          <body>
            ${invoiceHtml}
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 250);
              };
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      toast.error("Failed to generate PDF")
    }
  }

  const addLineItem = () => {
    const newId = Date.now().toString()
    setInvoiceData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: newId, description: "", unitCost: "", quantity: "1", amount: 0 }]
    }))
  }

  const removeLineItem = (id: string) => {
    if (invoiceData.lineItems.length === 1) return
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href={`/crm/clients/${clientId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {client.name}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {invoiceId ? 'Edit Invoice' : 'New Invoice'}
                </h1>
                <p className="text-slate-600 mt-1">
                  for {client.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!showPreview && (
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="hidden lg:flex"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              )}
              <Button
                onClick={handleSaveInvoice}
                disabled={isSaving}
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={handleCreatePDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'}`}>
          {/* Invoice Form */}
          <div>
            <Card className="shadow-md border-0 bg-gradient-to-br from-white to-slate-50/50">
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchaseOrder">Purchase Order</Label>
                    <Input
                      id="purchaseOrder"
                      value={invoiceData.purchaseOrder}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, purchaseOrder: e.target.value }))}
                      placeholder="PO-001"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Company Details */}
                <div>
                  <Label htmlFor="companyDetails">Your Company Details</Label>
                  <Textarea
                    id="companyDetails"
                    value={invoiceData.companyDetails}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, companyDetails: e.target.value }))}
                    placeholder="Company Name&#10;Address Line 1&#10;City, State ZIP&#10;Country"
                    rows={4}
                  />
                </div>

                {/* Bill To */}
                <div>
                  <Label htmlFor="billTo">Bill To</Label>
                  <Textarea
                    id="billTo"
                    value={invoiceData.billTo}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, billTo: e.target.value }))}
                    rows={4}
                  />
                </div>

                {/* Currency */}
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={invoiceData.currency} onValueChange={(value) => setInvoiceData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Line Items</Label>
                    <Button onClick={addLineItem} size="sm">
                      Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {invoiceData.lineItems.map((item, index) => (
                      <div key={item.id} className="grid gap-3 md:grid-cols-6 p-4 border border-border rounded-lg bg-white/50">
                        <div className="md:col-span-2">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Unit Cost"
                            value={item.unitCost}
                            onChange={(e) => updateLineItem(item.id, 'unitCost', e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Quantity"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Amount"
                            value={`$${item.amount.toFixed(2)}`}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        <div>
                          {invoiceData.lineItems.length > 1 && (
                            <Button
                              onClick={() => removeLineItem(item.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-500"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      placeholder="0"
                      value={invoiceData.taxRate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount ($)</Label>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="0"
                      value={invoiceData.discount}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, discount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingFee">Shipping ($)</Label>
                    <Input
                      id="shippingFee"
                      type="number"
                      placeholder="0"
                      value={invoiceData.shippingFee}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, shippingFee: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes / Payment Terms</Label>
                  <Textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Payment terms, additional notes..."
                    rows={3}
                  />
                </div>

                {/* Bank Details */}
                <div>
                  <Label htmlFor="bankDetails">Bank Account Details</Label>
                  <Textarea
                    id="bankDetails"
                    value={invoiceData.bankDetails}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, bankDetails: e.target.value }))}
                    placeholder="Bank name, account details for payment..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowThemeSettings(true)}
                  >
                    Customize
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                    className="lg:hidden"
                  >
                    Hide
                  </Button>
                </div>
              </div>
              <div ref={invoicePreviewRef}>
                <DynamicInvoicePreview 
                  data={invoiceData} 
                  theme={theme}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme Settings */}
      <ThemeSettings
        isOpen={showThemeSettings}
        onClose={() => setShowThemeSettings(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
      />
    </div>
  )
}