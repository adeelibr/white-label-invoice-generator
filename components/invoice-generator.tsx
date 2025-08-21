"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Download, Upload, X, Users } from "lucide-react"
import { DynamicInvoicePreview } from "./dynamic-invoice-preview"
import { ThemeSettings, type ThemeConfig } from "./theme-settings"
import { TemplateSelection } from "./template-selection"
import { OnboardingFlow } from "./onboarding-flow" 
import { Header } from "./header"
import { HeroSection } from "./hero-section"
import { ClientManagementDialog } from "./client-management-dialog"
import type { TemplateType } from "./templates"
import { saveInvoice, getInvoice, saveTheme, getTheme, getDefaultTheme, triggerOnboarding, getClientById, getNextInvoiceNumber, getAllClients, addInvoiceToHistory, type InvoiceData, type LineItem, type Client, type InvoiceHistoryItem } from "@/lib/storage"

export interface InvoiceGeneratorProps {
  initialData?: InvoiceHistoryItem
  clientId?: string | null
  onSave?: (invoiceData: InvoiceData) => void
  hideHeader?: boolean
  hideHeroSection?: boolean
}

export function InvoiceGenerator({ 
  initialData, 
  clientId, 
  onSave,
  hideHeader = false,
  hideHeroSection = false 
}: InvoiceGeneratorProps = {}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const invoicePreviewRef = useRef<HTMLDivElement>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [showTemplateSelection, setShowTemplateSelection] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("classic")

  const [theme, setTheme] = useState<ThemeConfig>(getDefaultTheme())
  
  // Client management state
  const [allClients, setAllClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("none")
  const [showClientDialog, setShowClientDialog] = useState(false)
  const [clientDialogInitialData, setClientDialogInitialData] = useState<Partial<{ name: string; email: string; address: string }> | undefined>()

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
    const savedTheme = getTheme()
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    saveTheme(theme)
  }, [theme])

  // Initialize with client data or provided data
  useEffect(() => {
    if (initialData) {
      // Load from provided initial data (editing mode)
      setInvoiceData({
        invoiceNumber: initialData.invoiceNumber,
        purchaseOrder: initialData.purchaseOrder,
        logo: initialData.logo,
        companyDetails: initialData.companyDetails,
        billTo: initialData.billTo,
        currency: initialData.currency,
        invoiceDate: initialData.invoiceDate,
        dueDate: initialData.dueDate,
        lineItems: initialData.lineItems,
        notes: initialData.notes,
        bankDetails: initialData.bankDetails,
        subtotal: initialData.subtotal,
        taxRate: initialData.taxRate,
        discount: initialData.discount,
        shippingFee: initialData.shippingFee,
        total: initialData.total,
      })
      if (initialData.logo) {
        setLogoPreview(initialData.logo)
      }
    } else if (clientId) {
      // Initialize for new invoice with client context
      const client = getClientById(clientId)
      const newInvoiceData = {
        invoiceNumber: getNextInvoiceNumber(clientId),
        purchaseOrder: "",
        logo: "",
        companyDetails: "",
        billTo: client ? client.address : "",
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
      }
      setInvoiceData(newInvoiceData)
    } else {
      // Legacy mode: load from localStorage
      const savedData = getInvoice()
      if (savedData) {
        setInvoiceData(savedData)
        if (savedData.logo) {
          setLogoPreview(savedData.logo)
        }
      }
    }
  }, [initialData, clientId])

  // Save to localStorage only in legacy mode (when no onSave callback)
  useEffect(() => {
    if (!onSave) {
      saveInvoice(invoiceData)
    }
  }, [invoiceData, onSave])

  // Load clients
  useEffect(() => {
    const clients = getAllClients()
    setAllClients(clients)
  }, [])

  // Handle client selection
  useEffect(() => {
    if (selectedClientId && selectedClientId !== "new" && selectedClientId !== "none") {
      const client = getClientById(selectedClientId)
      if (client) {
        setInvoiceData(prev => ({
          ...prev,
          billTo: `${client.name}\n${client.address}${client.phone ? `\nPhone: ${client.phone}` : ''}${client.email ? `\nEmail: ${client.email}` : ''}`
        }))
      }
    }
  }, [selectedClientId])

  const getThemeClasses = () => {
    const colorSchemes = {
      "violet-blue": {
        primary: "from-violet-600 to-blue-600",
        primaryHover: "from-violet-700 to-blue-700",
        secondary: "from-violet-50 via-blue-50 to-cyan-50",
        accent: "violet-500",
        accentLight: "violet-50",
        accentBorder: "violet-300",
        accentText: "violet-600",
      },
      "emerald-teal": {
        primary: "from-emerald-600 to-teal-600",
        primaryHover: "from-emerald-700 to-teal-700",
        secondary: "from-emerald-50 via-teal-50 to-cyan-50",
        accent: "emerald-500",
        accentLight: "emerald-50",
        accentBorder: "emerald-300",
        accentText: "emerald-600",
      },
      "rose-pink": {
        primary: "from-rose-600 to-pink-600",
        primaryHover: "from-rose-700 to-pink-700",
        secondary: "from-rose-50 via-pink-50 to-fuchsia-50",
        accent: "rose-500",
        accentLight: "rose-50",
        accentBorder: "rose-300",
        accentText: "rose-600",
      },
      "orange-amber": {
        primary: "from-orange-600 to-amber-600",
        primaryHover: "from-orange-700 to-amber-700",
        secondary: "from-orange-50 via-amber-50 to-yellow-50",
        accent: "orange-500",
        accentLight: "orange-50",
        accentBorder: "orange-300",
        accentText: "orange-600",
      },
      "indigo-purple": {
        primary: "from-indigo-600 to-purple-600",
        primaryHover: "from-indigo-700 to-purple-700",
        secondary: "from-indigo-50 via-purple-50 to-violet-50",
        accent: "indigo-500",
        accentLight: "indigo-50",
        accentBorder: "indigo-300",
        accentText: "indigo-600",
      },
    }
    return colorSchemes[theme.colorScheme]
  }

  const themeClasses = getThemeClasses()

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        alert("Please upload a JPG, JPEG, or PNG file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setInvoiceData((prev) => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview("")
    setInvoiceData((prev) => ({ ...prev, logo: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      unitCost: "",
      quantity: "1",
      amount: 0,
    }
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }))
  }

  const removeLineItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "unitCost" || field === "quantity") {
            const unitCost = Number.parseFloat(updatedItem.unitCost) || 0
            const quantity = Number.parseFloat(updatedItem.quantity) || 0
            updatedItem.amount = unitCost * quantity
          }
          return updatedItem
        }
        return item
      }),
    }))
  }

  const calculateTotals = () => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = (subtotal * (Number.parseFloat(invoiceData.taxRate) || 0)) / 100
    const discountAmount = Number.parseFloat(invoiceData.discount) || 0
    const shippingAmount = Number.parseFloat(invoiceData.shippingFee) || 0
    const total = subtotal + taxAmount - discountAmount + shippingAmount

    setInvoiceData((prev) => ({
      ...prev,
      subtotal,
      total,
    }))
  }

  // Recalculate totals when line items or rates change
  useEffect(() => {
    calculateTotals()
  }, [invoiceData.lineItems, invoiceData.taxRate, invoiceData.discount, invoiceData.shippingFee])

  const handleCreateInvoice = async () => {
    calculateTotals()
    
    // If onSave is provided (multi-client mode), save and return
    if (onSave) {
      onSave(invoiceData)
      return
    }

    // For regular home page usage, save to invoice history if client is selected
    if (selectedClientId && selectedClientId !== "new" && selectedClientId !== "none") {
      try {
        // Ensure invoice has a number
        const finalInvoiceData = {
          ...invoiceData,
          invoiceNumber: invoiceData.invoiceNumber || getNextInvoiceNumber(selectedClientId)
        }
        
        // Add to invoice history
        addInvoiceToHistory(finalInvoiceData, selectedClientId, 'sent')
        
        // Update local state
        setInvoiceData(finalInvoiceData)
        
        alert("Invoice saved successfully! You can view it in the Invoices page.")
      } catch (error) {
        console.error("Failed to save invoice:", error)
        alert("Failed to save invoice. Please try again.")
        return
      }
    }

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
            // Handle cross-origin stylesheets
            return ""
          }
        })
        .join("\n")

      const invoiceHtml = invoicePreviewRef.current.innerHTML

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoiceData.invoiceNumber || "Draft"}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              ${stylesheets}
              
              body { 
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: white;
                color: #1e293b;
                line-height: 1.6;
              }
              
              @media print {
                body { 
                  margin: 0; 
                  padding: 0.5in; 
                }
                @page { 
                  margin: 0.5in; 
                  size: A4;
                }
              }
              
              /* Ensure proper styling for invoice elements */
              .bg-gradient-to-br { background: white !important; }
              .backdrop-blur-sm { backdrop-filter: none !important; }
              .shadow-xl, .shadow-lg { box-shadow: none !important; }
              .border { border: 1px solid #e2e8f0 !important; }
              .rounded-lg { border-radius: 0.5rem; }
              .text-slate-800 { color: #1e293b !important; }
              .text-slate-600 { color: #475569 !important; }
              .text-slate-500 { color: #64748b !important; }
              .font-bold { font-weight: 700 !important; }
              .font-semibold { font-weight: 600 !important; }
              .text-right { text-align: right !important; }
              .text-center { text-align: center !important; }
              .mb-2 { margin-bottom: 0.5rem !important; }
              .mb-4 { margin-bottom: 1rem !important; }
              .mb-6 { margin-bottom: 1.5rem !important; }
              .mb-8 { margin-bottom: 2rem !important; }
              .mt-4 { margin-top: 1rem !important; }
              .mt-8 { margin-top: 2rem !important; }
              .p-6 { padding: 1.5rem !important; }
              .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
              .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
              .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
              .grid { display: grid !important; }
              .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
              .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
              .gap-4 { gap: 1rem !important; }
              .flex { display: flex !important; }
              .items-center { align-items: center !important; }
              .justify-between { justify-content: space-between !important; }
              .space-y-2 > * + * { margin-top: 0.5rem !important; }
              .space-y-4 > * + * { margin-top: 1rem !important; }
              .w-full { width: 100% !important; }
              .h-16 { height: 4rem !important; }
              .text-sm { font-size: 0.875rem !important; }
              .text-lg { font-size: 1.125rem !important; }
              .text-xl { font-size: 1.25rem !important; }
              .text-2xl { font-size: 1.5rem !important; }
              .text-3xl { font-size: 1.875rem !important; }
              .bg-slate-50 { background-color: #f8fafc !important; }
              .border-t { border-top: 1px solid #e2e8f0 !important; }
              .pt-4 { padding-top: 1rem !important; }
              .whitespace-pre-line { white-space: pre-line !important; }
            </style>
          </head>
          <body>
            <div class="max-w-4xl mx-auto">
              ${invoiceHtml}
            </div>
          </body>
        </html>
      `)

      printWindow.document.close()

      // Wait for content and styles to load, then print
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 1000)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  // Client management handlers
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId)
    if (clientId === "new") {
      setClientDialogInitialData(undefined)
      setShowClientDialog(true)
    }
  }

  const handleClientSaved = (client: Client) => {
    // Refresh client list
    const updatedClients = getAllClients()
    setAllClients(updatedClients)
    
    // Select the newly created client
    setSelectedClientId(client.id)
    setShowClientDialog(false)
    setClientDialogInitialData(undefined)
  }

  const extractClientFromBillTo = (): { name: string; email: string; address: string } | null => {
    const billTo = invoiceData.billTo.trim()
    if (!billTo) return null
    
    const lines = billTo.split('\n')
    const name = lines[0]?.trim() || ""
    
    // Look for email pattern
    const emailMatch = billTo.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
    const email = emailMatch ? emailMatch[0] : ""
    
    // Remove email and phone from address
    let address = billTo
    if (email) {
      address = address.replace(/Email:\s*[^\n]+/gi, '')
    }
    address = address.replace(/Phone:\s*[^\n]+/gi, '')
    address = address.replace(/\n+/g, '\n').trim()
    
    return { name, email, address }
  }

  const handleCreateClientFromBillTo = () => {
    const clientData = extractClientFromBillTo()
    if (clientData && clientData.name) {
      setClientDialogInitialData(clientData)
      setShowClientDialog(true)
    } else {
      alert("Please enter client information in the 'Bill to' field first")
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeClasses.secondary}`}>
      {/* Onboarding Flow */}
      <OnboardingFlow />
      
      {/* Enhanced Header */}
      {!hideHeader && (
        <Header
          theme={theme}
          themeClasses={themeClasses}
          onShowThemeSettings={() => setShowThemeSettings(true)}
          onShowTemplateSelection={() => setShowTemplateSelection(true)}
        />
      )}

      {/* Enhanced Hero Section */}
      {!hideHeroSection && <HeroSection themeClasses={themeClasses} />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Form */}
          <div id="invoice-form-section" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className={`bg-gradient-to-r from- bg-transparent${themeClasses.accent}/10 to-blue-500/10 rounded-t-lg`}>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                  <div className={`w-2 h-2 bg-${themeClasses.accent} rounded-full`}></div>
                  <span>Invoice Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber" className="text-slate-700 font-medium">
                      Invoice number
                    </Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-001"
                      className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchaseOrder" className="text-slate-700 font-medium">
                      Purchase order
                    </Label>
                    <Input
                      id="purchaseOrder"
                      value={invoiceData.purchaseOrder}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, purchaseOrder: e.target.value }))}
                      placeholder="PO-001"
                      className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo" className="text-slate-700 font-medium">
                    Company Logo
                  </Label>
                  <div className="mt-2">
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="h-20 w-auto rounded-lg border-2 border-slate-200"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Input
                          ref={fileInputRef}
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-dashed border-2 border-${themeClasses.accentBorder} text-${themeClasses.accentText} hover:bg-${themeClasses.accentLight}`}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                        <span className="text-sm text-slate-500">JPG, JPEG, PNG (max 5MB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className={`bg-gradient-to-r from- bg-transparent${themeClasses.accent}/10 to-blue-500/10 rounded-t-lg`}>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                  <div className={`w-2 h-2 bg-${themeClasses.accent} rounded-full`}></div>
                  <span>Company & Client Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="companyDetails" className="text-slate-700 font-medium">
                    Your company details
                  </Label>
                  <Textarea
                    id="companyDetails"
                    value={invoiceData.companyDetails}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, companyDetails: e.target.value }))}
                    placeholder="Company Name&#10;Address Line 1&#10;City, State ZIP&#10;Country"
                    rows={4}
                    className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                  />
                </div>

                {/* Client Selection Section */}
                <div>
                  <Label htmlFor="clientSelect" className="text-slate-700 font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Select Client (Optional)
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={selectedClientId}
                      onValueChange={handleClientSelect}
                    >
                      <SelectTrigger
                        className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                      >
                        <SelectValue placeholder="Choose existing client or create new" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No client selected</SelectItem>
                        {allClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="new" className="text-blue-600 font-medium">
                          + Create New Client
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {invoiceData.billTo && (!selectedClientId || selectedClientId === "none") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCreateClientFromBillTo}
                        className="whitespace-nowrap"
                      >
                        Create from Bill To
                      </Button>
                    )}
                  </div>
                  {(!selectedClientId || selectedClientId === "none") && (
                    <p className="text-xs text-slate-500 mt-1">
                      💡 Select a client to save this invoice to your history and manage it from the Invoices page
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="billTo" className="text-slate-700 font-medium">
                    Bill to
                  </Label>
                  <Textarea
                    id="billTo"
                    value={invoiceData.billTo}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, billTo: e.target.value }))}
                    placeholder="Client Name&#10;Address Line 1&#10;City, State ZIP&#10;Country"
                    rows={4}
                    className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currency" className="text-slate-700 font-medium">
                      Currency
                    </Label>
                    <Select
                      value={invoiceData.currency}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger
                        className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">🇺🇸 USD</SelectItem>
                        <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                        <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                        <SelectItem value="CAD">🇨🇦 CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="invoiceDate" className="text-slate-700 font-medium">
                      Invoice date
                    </Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, invoiceDate: e.target.value }))}
                      className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate" className="text-slate-700 font-medium">
                      Due date
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, dueDate: e.target.value }))}
                      className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className={`bg-gradient-to-r from- bg-transparent${themeClasses.accent}/10 to-blue-500/10 rounded-t-lg`}>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                  <div className={`w-2 h-2 bg-${themeClasses.accent} rounded-full`}></div>
                  <span>Line Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-slate-600">
                    <div className="col-span-5">Item description</div>
                    <div className="col-span-2">Unit cost</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-1"></div>
                  </div>

                  {invoiceData.lineItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                          placeholder="Description of service or product"
                          className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateLineItem(item.id, "unitCost", e.target.value)}
                          placeholder="0"
                          step="0.01"
                          className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                          placeholder="1"
                          step="1"
                          className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="px-3 py-2 text-right font-bold text-slate-700 bg-slate-50 rounded-md">
                          ${item.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        {invoiceData.lineItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addLineItem}
                    className="w-full border-dashed border-2 border-cyan-300 text-cyan-600 hover:bg-cyan-50 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className={`bg-gradient-to-r from- bg-transparent${themeClasses.accent}/10 to-blue-500/10 rounded-t-lg`}>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                  <div className={`w-2 h-2 bg-${themeClasses.accent} rounded-full`}></div>
                  <span>Additional Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="notes" className="text-slate-700 font-medium">
                    Notes / payment terms
                  </Label>
                  <Textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Payment is due within 15 days"
                    rows={3}
                    className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                  />
                </div>

                <div>
                  <Label htmlFor="bankDetails" className="text-slate-700 font-medium">
                    Bank account details
                  </Label>
                  <Textarea
                    id="bankDetails"
                    value={invoiceData.bankDetails}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, bankDetails: e.target.value }))}
                    placeholder="Bank Name&#10;Account Number&#10;Routing Number"
                    rows={3}
                    className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxRate" className="text-slate-700 font-medium">
                      Tax (%)
                    </Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={invoiceData.taxRate}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, taxRate: e.target.value }))}
                      placeholder="0"
                      step="0.01"
                      className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount" className="text-slate-700 font-medium">
                      Discount ($)
                    </Label>
                    <Input
                      id="discount"
                      type="number"
                      value={invoiceData.discount}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, discount: e.target.value }))}
                      placeholder="0"
                      step="0.01"
                      className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shippingFee" className="text-slate-700 font-medium">
                    Shipping fee
                  </Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    value={invoiceData.shippingFee}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, shippingFee: e.target.value }))}
                    placeholder="0"
                    step="0.01"
                    className={`border-slate-200 focus:border-${themeClasses.accentText.split("-")[0]}-400 focus:ring-${themeClasses.accentText.split("-")[0]}-400`}
                  />
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-slate-700">Total Amount</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                      ${invoiceData.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              id="download-button"
              onClick={handleCreateInvoice}
              className={`w-full bg-gradient-to-r ${themeClasses.primary} hover:${themeClasses.primaryHover} text-white font-bold py-4 text-lg shadow-xl`}
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              {onSave 
                ? 'Save Invoice' 
                : (selectedClientId && selectedClientId !== "none")
                  ? 'Save Invoice & Download PDF' 
                  : 'Create & Download Invoice'
              }
            </Button>
          </div>

          {/* Invoice Preview */}
          <div id="invoice-preview-section" className="lg:sticky lg:top-8">
            <div ref={invoicePreviewRef}>
              <DynamicInvoicePreview data={invoiceData} theme={theme} template={selectedTemplate} />
            </div>
          </div>
        </div>
      </div>

      {/* How to Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20" aria-labelledby="how-to-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h3 id="how-to-heading" className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-4">
              How to Create Professional Invoices Online in 4 Simple Steps
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our free invoice generator makes it easy to create professional invoices for your small business or freelance work. No signup required - start generating invoices immediately.
            </p>
          </header>

          <div className="space-y-12" role="list">
            <article className="flex items-start space-x-6" role="listitem">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg" aria-hidden="true">
                1
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800">
                  Add Your Business Information and Invoice Details
                </h4>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Start by entering your business name, address, and contact information. Add your company logo to create a professional branded invoice. Include the invoice number, date, and due date to establish clear payment terms with your clients.
                </p>
              </div>
            </article>

            <article className="flex items-start space-x-6" role="listitem">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg" aria-hidden="true">
                2
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800">
                  Add Line Items with Product or Service Details
                </h4>
                <p className="text-slate-600 text-lg leading-relaxed">
                  List each product or service you&apos;re billing for. Include detailed descriptions, quantities, unit prices, and rates. Our invoice maker automatically calculates line totals, making it perfect for hourly billing, project-based work, or product sales.
                </p>
              </div>
            </article>

            <article className="flex items-start space-x-6" role="listitem">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-violet-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg" aria-hidden="true">
                3
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800">
                  Configure Tax Rates, Discounts, and Payment Terms
                </h4>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Set up tax calculations, apply discounts, and add shipping fees as needed. Include your bank details and payment terms to make it easy for clients to pay. Our calculator automatically computes the final total amount due.
                </p>
              </div>
            </article>

            <article className="flex items-start space-x-6" role="listitem">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg" aria-hidden="true">
                4
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800">Download Your Professional Invoice as PDF</h4>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Preview your completed invoice and download it as a high-quality PDF file. Your professional invoice is ready to send to clients via email or print for physical delivery. All data stays private in your browser - no account required.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <ThemeSettings
        isOpen={showThemeSettings}
        onClose={() => setShowThemeSettings(false)}
        theme={theme}
        onThemeChange={setTheme}
      />
      
      <TemplateSelection
        isOpen={showTemplateSelection}
        onClose={() => setShowTemplateSelection(false)}
        currentTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />

      {/* Client Management Dialog */}
      <ClientManagementDialog
        isOpen={showClientDialog}
        onClose={() => {
          setShowClientDialog(false)
          setClientDialogInitialData(undefined)
        }}
        mode="add"
        editingClient={null}
        onClientSaved={handleClientSaved}
        initialData={clientDialogInitialData}
      />
    </div>
  )
}
