import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import type { ThemeConfig } from "./theme-settings"

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

interface InvoicePreviewProps {
  data: InvoiceData
  theme?: ThemeConfig
}

export function InvoicePreview({ data, theme }: InvoicePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const taxAmount = (data.subtotal * (Number.parseFloat(data.taxRate) || 0)) / 100
  const discountAmount = Number.parseFloat(data.discount) || 0
  const shippingAmount = Number.parseFloat(data.shippingFee) || 0

  const getFontClasses = () => {
    if (!theme) return { heading: "font-serif", body: "font-sans" }

    const fontMap = {
      modern: { heading: "font-sans", body: "font-sans" },
      classic: { heading: "font-serif", body: "font-sans" },
      elegant: { heading: "font-serif", body: "font-sans" },
      minimal: { heading: "font-sans", body: "font-sans" },
      creative: { heading: "font-sans", body: "font-sans" },
    }

    return fontMap[theme.fontPair] || { heading: "font-serif", body: "font-sans" }
  }

  const fontClasses = getFontClasses()

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            {data.logo ? (
              <img
                src={data.logo || "/placeholder.svg"}
                alt="Company Logo"
                className="h-12 w-auto max-w-[120px] object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <FileText className="h-8 w-8 text-primary" />
            )}
            <h2 className={`text-2xl font-bold ${fontClasses.heading}`}>INVOICE</h2>
          </div>
          {data.invoiceNumber && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Invoice Number</div>
              <div className="font-semibold">{data.invoiceNumber}</div>
            </div>
          )}
        </div>

        {/* Company and Client Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className={`font-semibold mb-2 ${fontClasses.heading}`}>From:</h3>
            <div className={`text-sm whitespace-pre-line text-muted-foreground ${fontClasses.body}`}>
              {data.companyDetails || "Your Company Name\nAddress Line 1\nCity, State ZIP\nCountry"}
            </div>
          </div>
          <div>
            <h3 className={`font-semibold mb-2 ${fontClasses.heading}`}>Bill To:</h3>
            <div className={`text-sm whitespace-pre-line text-muted-foreground ${fontClasses.body}`}>
              {data.billTo || "Client Name\nAddress Line 1\nCity, State ZIP\nCountry"}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            {data.purchaseOrder && (
              <div className="mb-2">
                <span className={`text-sm text-muted-foreground ${fontClasses.body}`}>Purchase Order: </span>
                <span className={`font-medium ${fontClasses.body}`}>{data.purchaseOrder}</span>
              </div>
            )}
            <div className="mb-2">
              <span className={`text-sm text-muted-foreground ${fontClasses.body}`}>Currency: </span>
              <span className={`font-medium ${fontClasses.body}`}>{data.currency}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className={`text-sm text-muted-foreground ${fontClasses.body}`}>Invoice Date: </span>
              <span className={`font-medium ${fontClasses.body}`}>{formatDate(data.invoiceDate)}</span>
            </div>
            {data.dueDate && (
              <div className="mb-2">
                <span className={`text-sm text-muted-foreground ${fontClasses.body}`}>Due Date: </span>
                <span className={`font-medium ${fontClasses.body}`}>{formatDate(data.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <div className="border-t border-b border-border">
            <div className={`grid grid-cols-12 gap-2 py-3 text-sm font-medium bg-muted/50 ${fontClasses.body}`}>
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-right">Unit Cost</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-3 text-right">Amount</div>
            </div>
            {data.lineItems.map((item) => (
              <div
                key={item.id}
                className={`grid grid-cols-12 gap-2 py-3 text-sm border-b border-border/50 ${fontClasses.body}`}
              >
                <div className="col-span-5">{item.description || "Service or product description"}</div>
                <div className="col-span-2 text-right">
                  {item.unitCost ? `$${Number.parseFloat(item.unitCost).toFixed(2)}` : "$0.00"}
                </div>
                <div className="col-span-2 text-right">{item.quantity || "1"}</div>
                <div className="col-span-3 text-right font-medium">${item.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className={`space-y-2 mb-8 ${fontClasses.body}`}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>${data.subtotal.toFixed(2)}</span>
          </div>
          {data.taxRate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({data.taxRate}%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
          )}
          {data.discount && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount:</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          {data.shippingFee && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping:</span>
              <span>${shippingAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span>Total:</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes and Bank Details */}
        {(data.notes || data.bankDetails) && (
          <div className="space-y-4">
            {data.notes && (
              <div>
                <h4 className={`font-semibold mb-2 ${fontClasses.heading}`}>Notes / Payment Terms:</h4>
                <p className={`text-sm text-muted-foreground whitespace-pre-line ${fontClasses.body}`}>{data.notes}</p>
              </div>
            )}
            {data.bankDetails && (
              <div>
                <h4 className={`font-semibold mb-2 ${fontClasses.heading}`}>Bank Account Details:</h4>
                <p className={`text-sm text-muted-foreground whitespace-pre-line ${fontClasses.body}`}>
                  {data.bankDetails}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
