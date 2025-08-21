"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  Upload, 
  Sparkles, 
  Zap, 
  Shield, 
  Settings, 
  Eye,
  Palette
} from "lucide-react"
import { DynamicInvoicePreview } from "./dynamic-invoice-preview"
import { EnhancedThemeSettings } from "./enhanced-theme-settings"
import { TemplateSelection } from "./template-selection"
import type { TemplateType } from "./templates"
import { useModernTheme } from "./theme-provider"
import { 
  getThemeClasses, 
  getAnimationClasses, 
  getGlassmorphismClasses,
  getShadowClasses
} from "@/lib/theme-utils"
import { 
  calculateInvoiceTotals, 
  calculateLineItemAmount, 
  formatCurrency,
  type LineItem
} from "@/lib/calculations"
import { validateInvoiceForm } from "@/lib/validation"
import { exportInvoice, generateFilename } from "@/lib/export"

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

export function ModernInvoiceGenerator() {
  const { theme } = useModernTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const invoicePreviewRef = useRef<HTMLDivElement>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [showTemplateSelection, setShowTemplateSelection] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("modern")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isExporting, setIsExporting] = useState(false)
  
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
    total: 0
  })

  // Get theme classes
  const themeClasses = getThemeClasses(theme)
  const animationClasses = getAnimationClasses(theme.animations)
  const glassClasses = getGlassmorphismClasses(theme.glassmorphism, 'medium')
  const shadowClasses = getShadowClasses(theme, 'lg')

  // Calculate totals when relevant data changes
  useEffect(() => {
    const totals = calculateInvoiceTotals(
      invoiceData.lineItems,
      invoiceData.taxRate,
      invoiceData.discount,
      invoiceData.shippingFee
    )
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal: totals.subtotal,
      total: totals.total
    }))
  }, [invoiceData.lineItems, invoiceData.taxRate, invoiceData.discount, invoiceData.shippingFee])

  // Real-time validation
  useEffect(() => {
    const validation = validateInvoiceForm(invoiceData)
    setValidationErrors(validation.errors)
  }, [invoiceData])

  // Update line item amounts when unit cost or quantity changes
  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === 'unitCost' || field === 'quantity') {
            updated.amount = calculateLineItemAmount(updated.unitCost, updated.quantity)
          }
          return updated
        }
        return item
      })
    }))
  }

  const addLineItem = () => {
    const newId = String(invoiceData.lineItems.length + 1)
    setInvoiceData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: newId, description: "", unitCost: "", quantity: "1", amount: 0 }]
    }))
  }

  const removeLineItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setInvoiceData(prev => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExport = async (format: 'pdf' | 'png' | 'html' = 'pdf') => {
    if (!invoicePreviewRef.current) return
    
    setIsExporting(true)
    try {
      const filename = generateFilename(invoiceData, format)
      await exportInvoice(invoicePreviewRef.current, { format, filename })
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`min-h-screen ${themeClasses.backgroundPattern} animate-fade-in`}>
      {/* Modern Header */}
      <header className={`${glassClasses} ${shadowClasses} sticky top-0 z-40 border-b border-white/20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${animationClasses}`}>
              <div className={`p-3 bg-gradient-to-br ${themeClasses.primary} rounded-xl ${shadowClasses}`}>
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold text-gradient ${themeClasses.heading}`}>
                  Invoice Studio
                </h1>
                <p className="text-sm text-muted-foreground">Professional invoice generation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateSelection(true)}
                className={`${glassClasses} hover-lift ${animationClasses}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeSettings(true)}
                className={`${glassClasses} hover-lift ${animationClasses}`}
              >
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </Button>
              <div className={`flex items-center space-x-2 ${glassClasses} px-3 py-2 rounded-lg text-sm`}>
                <Shield className="h-4 w-4 text-green-500" />
                <span className="font-medium">Secure & Private</span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-cyan-600/10" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className={`inline-flex items-center space-x-2 ${glassClasses} rounded-full px-4 py-2 mb-6 ${animationClasses}`}>
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-medium">Free Forever • No Sign-up Required</span>
          </div>
          
          <h2 className={`text-6xl font-bold mb-6 leading-tight ${themeClasses.heading}`}>
            Create Professional Invoices
            <span className="block text-gradient bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              In Minutes
            </span>
          </h2>
          
          <p className="text-xl mb-8 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The most modern invoice generator with real-time preview, automatic calculations, 
            and beautiful themes. Trusted by freelancers and businesses worldwide.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Zap, title: "Instant PDF", desc: "Download immediately" },
              { icon: Shield, title: "Privacy First", desc: "No data stored" },
              { icon: Sparkles, title: "Modern Design", desc: "Professional templates" }
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className={`${glassClasses} p-4 rounded-xl hover-lift ${animationClasses}`}>
                <Icon className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Invoice Form */}
          <div className="space-y-6">
            
            {/* Invoice Details */}
            <Card className={`${glassClasses} ${shadowClasses} hover-lift ${animationClasses}`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-xl ${themeClasses.heading} flex items-center space-x-2`}>
                  <FileText className="h-5 w-5" />
                  <span>Invoice Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Invoice Number *</Label>
                    <Input
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-001"
                      className={`${validationErrors.invoiceNumber ? 'border-red-500' : ''} ${animationClasses}`}
                    />
                    {validationErrors.invoiceNumber && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.invoiceNumber}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Purchase Order</Label>
                    <Input
                      value={invoiceData.purchaseOrder}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, purchaseOrder: e.target.value }))}
                      placeholder="PO-001 (Optional)"
                      className={animationClasses}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Company Logo</Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full justify-start ${animationClasses} hover-lift`}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">JPG, PNG (max 5MB)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company & Client Details */}
            <Card className={`${glassClasses} ${shadowClasses} hover-lift ${animationClasses}`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-xl ${themeClasses.heading} flex items-center space-x-2`}>
                  <Settings className="h-5 w-5" />
                  <span>Company & Client Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Your Company Details *</Label>
                    <Textarea
                      value={invoiceData.companyDetails}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, companyDetails: e.target.value }))}
                      placeholder="Your Company Name&#10;Address Line 1&#10;City, State ZIP&#10;Country&#10;Phone & Email"
                      rows={5}
                      className={`${validationErrors.companyDetails ? 'border-red-500' : ''} ${animationClasses}`}
                    />
                    {validationErrors.companyDetails && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.companyDetails}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Bill To *</Label>
                    <Textarea
                      value={invoiceData.billTo}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, billTo: e.target.value }))}
                      placeholder="Client Name&#10;Address Line 1&#10;City, State ZIP&#10;Country&#10;Phone & Email"
                      rows={5}
                      className={`${validationErrors.billTo ? 'border-red-500' : ''} ${animationClasses}`}
                    />
                    {validationErrors.billTo && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.billTo}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Currency</Label>
                    <Select value={invoiceData.currency} onValueChange={(value) => setInvoiceData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger className={animationClasses}>
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
                    <Label className="text-sm font-medium mb-2 block">Invoice Date</Label>
                    <Input
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                      className={animationClasses}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Due Date</Label>
                    <Input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className={`${validationErrors.dueDate ? 'border-red-500' : ''} ${animationClasses}`}
                    />
                    {validationErrors.dueDate && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.dueDate}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card className={`${glassClasses} ${shadowClasses} hover-lift ${animationClasses}`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-xl ${themeClasses.heading} flex items-center justify-between`}>
                  <div className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Line Items</span>
                  </div>
                  <Button
                    onClick={addLineItem}
                    size="sm"
                    className={`${animationClasses} hover-lift`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Unit Cost</div>
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
                        placeholder="Service or product description"
                        className={animationClasses}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.unitCost}
                        onChange={(e) => updateLineItem(item.id, "unitCost", e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className={animationClasses}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                        placeholder="1"
                        min="1"
                        step="1"
                        className={animationClasses}
                      />
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="col-span-1">
                      {invoiceData.lineItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Details & Export */}
            <Card className={`${glassClasses} ${shadowClasses} hover-lift ${animationClasses}`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-xl ${themeClasses.heading} flex items-center space-x-2`}>
                  <FileText className="h-5 w-5" />
                  <span>Additional Details & Export</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Notes / Payment Terms</Label>
                    <Textarea
                      value={invoiceData.notes}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Payment terms, thank you note, or additional details"
                      rows={3}
                      className={animationClasses}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Bank Account Details</Label>
                    <Textarea
                      value={invoiceData.bankDetails}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, bankDetails: e.target.value }))}
                      placeholder="Bank name, account number, routing number, etc."
                      rows={3}
                      className={animationClasses}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Tax (%)</Label>
                    <Input
                      type="number"
                      value={invoiceData.taxRate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: e.target.value }))}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.01"
                      className={animationClasses}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Discount ($)</Label>
                    <Input
                      type="number"
                      value={invoiceData.discount}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, discount: e.target.value }))}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={animationClasses}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Shipping Fee</Label>
                    <Input
                      type="number"
                      value={invoiceData.shippingFee}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, shippingFee: e.target.value }))}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={animationClasses}
                    />
                  </div>
                </div>
                
                <div className={`p-4 ${glassClasses} rounded-lg ${shadowClasses}`}>
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className={themeClasses.heading}>Total Amount:</span>
                    <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {formatCurrency(invoiceData.total)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                    size="lg"
                    className={`flex-1 bg-gradient-to-r ${themeClasses.primary} hover:${themeClasses.primaryHover} text-white font-bold py-4 text-lg ${shadowClasses} hover-lift ${animationClasses}`}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {isExporting ? 'Creating...' : 'Create PDF Invoice'}
                  </Button>
                  <Button
                    onClick={() => handleExport('png')}
                    disabled={isExporting}
                    variant="outline"
                    size="lg"
                    className={`${glassClasses} hover-lift ${animationClasses}`}
                  >
                    PNG
                  </Button>
                  <Button
                    onClick={() => handleExport('html')}
                    disabled={isExporting}
                    variant="outline"
                    size="lg"
                    className={`${glassClasses} hover-lift ${animationClasses}`}
                  >
                    HTML
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Preview */}
          <div className="lg:sticky lg:top-8">
            <div ref={invoicePreviewRef} className={`${animationClasses}`}>
              <DynamicInvoicePreview 
                data={invoiceData} 
                theme={{ colorScheme: theme.colorScheme, fontPair: theme.fontPair }} 
                template={selectedTemplate} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <EnhancedThemeSettings
        isOpen={showThemeSettings}
        onClose={() => setShowThemeSettings(false)}
      />

      <TemplateSelection
        isOpen={showTemplateSelection}
        onClose={() => setShowTemplateSelection(false)}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
      />
    </div>
  )
}