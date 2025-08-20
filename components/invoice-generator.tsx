"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, FileText, Download, Upload, X, Sparkles, Zap, Shield, Settings } from "lucide-react"
import { InvoicePreview } from "./invoice-preview"
import { ThemeSettings, type ThemeConfig } from "./theme-settings"

interface LineItem {
  id: string
  description: string
  unitCost: string
  quantity: string
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
  purchaseOrder: string
  logo: string
  companyDetails: string
  billTo: string
  currency: string
  invoiceDate: string
  dueDate: string
  lineItems: LineItem[]
  notes: string
  bankDetails: string
  subtotal: number
  taxRate: string
  discount: string
  shippingFee: string
  total: number
}

export function InvoiceGenerator() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const invoicePreviewRef = useRef<HTMLDivElement>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [showThemeSettings, setShowThemeSettings] = useState(false)

  const [theme, setTheme] = useState<ThemeConfig>({
    colorScheme: "violet-blue",
    fontPair: "classic",
  })

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
    const savedTheme = localStorage.getItem("invoiceGeneratorTheme")
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme))
      } catch (error) {
        console.error("Failed to load saved theme:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("invoiceGeneratorTheme", JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    const savedData = localStorage.getItem("invoiceGeneratorData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setInvoiceData(parsedData)
        if (parsedData.logo) {
          setLogoPreview(parsedData.logo)
        }
      } catch (error) {
        console.error("Failed to load saved invoice data:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("invoiceGeneratorData", JSON.stringify(invoiceData))
  }, [invoiceData])

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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeClasses.secondary}`}>
      {/* Header */}
      <header
        className={`bg-white/80 backdrop-blur-md border-b border-${theme.colorScheme.split("-")[0]}-200/50 sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-gradient-to-br ${themeClasses.primary} rounded-xl`}>
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${themeClasses.primary} bg-clip-text text-transparent`}
              >
                Invoice Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeSettings(true)}
                className={`border-${themeClasses.accentBorder} text-${themeClasses.accentText} hover:bg-${themeClasses.accentLight}`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
              <div className="flex items-center space-x-2 text-slate-600">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-r ${themeClasses.primary} text-white py-20`}>
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">Free Forever</span>
            </div>
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Create Stunning Invoices
            <span className="block text-cyan-200">In Seconds</span>
          </h2>
          <p className="text-xl mb-4 text-blue-100">
            Professional invoice generator with real-time preview and automatic calculations
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span>Instant PDF Download</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-300" />
              <span>Data Saved Locally</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Form */}
          <div className="space-y-6">
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
              onClick={handleCreateInvoice}
              className={`w-full bg-gradient-to-r ${themeClasses.primary} hover:${themeClasses.primaryHover} text-white font-bold py-4 text-lg shadow-xl`}
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Create & Download Invoice
            </Button>
          </div>

          {/* Invoice Preview */}
          <div className="lg:sticky lg:top-8">
            <div ref={invoicePreviewRef}>
              <InvoicePreview data={invoiceData} theme={theme} />
            </div>
          </div>
        </div>
      </div>

      {/* How to Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-4">
              How to create an invoice online
            </h3>
            <p className="text-xl text-slate-600">Follow these simple steps to create professional invoices</p>
          </div>

          <div className="space-y-12">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                1
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800">
                  Fill in your company and contact information, date and invoice number.
                </h4>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Create a professional first impression and make it easy for your client to see all your company and
                  contact details. Using sequential invoice numbers also makes it easier to track and reconcile
                  paperwork and payments.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                2
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800">
                  Include line items with descriptions of billable work, and agreed rates.
                </h4>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Enter all the details of the work you're invoicing. Add line by line details of billable work,
                  including a clear description, price or hourly rate, and quantity.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-violet-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                3
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800">
                  Add tax and calculate the amount due, noting payment terms.
                </h4>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Include client as your invoice recipient. Important payment details like the company and requested
                  payment timeline. Make sure you've included all your bank details so your customer can settle up.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                4
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-800">Download your invoice as PDF.</h4>
                <p className="text-slate-600 text-lg leading-relaxed">
                  You're ready to download your completed document as a professional-looking PDF, adding password
                  protection if you want. Send it to your client via email or post banking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThemeSettings
        isOpen={showThemeSettings}
        onClose={() => setShowThemeSettings(false)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  )
}
