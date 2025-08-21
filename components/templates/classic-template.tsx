import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import type { InvoiceTemplateProps } from "./template-types"

export function ClassicTemplate({ data, theme }: InvoiceTemplateProps) {
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
              {data.companyDetails || "Your Company Name\\nAddress Line 1\\nCity, State ZIP\\nCountry"}
            </div>
          </div>
          <div>
            <h3 className={`font-semibold mb-2 ${fontClasses.heading}`}>To:</h3>
            <div className={`text-sm whitespace-pre-line text-muted-foreground ${fontClasses.body}`}>
              {data.billTo || "Client Name\\nAddress Line 1\\nCity, State ZIP\\nCountry"}
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
              <div>
                <span className={`text-sm text-muted-foreground ${fontClasses.body}`}>Due Date: </span>
                <span className={`font-medium ${fontClasses.body}`}>{formatDate(data.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4 mb-4 font-semibold text-sm border-b pb-2">
            <div>Description</div>
            <div className="text-right">Unit Cost</div>
            <div className="text-right">Quantity</div>
            <div className="text-right">Total</div>
          </div>
          {data.lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-4 gap-4 py-2 text-sm border-b">
              <div className={fontClasses.body}>{item.description || "Service/Product"}</div>
              <div className={`text-right ${fontClasses.body}`}>
                {data.currency === "USD" ? "$" : data.currency} {Number.parseFloat(item.unitCost || "0").toFixed(2)}
              </div>
              <div className={`text-right ${fontClasses.body}`}>{item.quantity}</div>
              <div className={`text-right font-medium ${fontClasses.body}`}>
                {data.currency === "USD" ? "$" : data.currency} {item.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`font-medium ${fontClasses.body}`}>Subtotal:</span>
            <span className={fontClasses.body}>
              {data.currency === "USD" ? "$" : data.currency} {data.subtotal.toFixed(2)}
            </span>
          </div>
          {Number.parseFloat(data.taxRate) > 0 && (
            <div className="flex justify-between">
              <span className={`font-medium ${fontClasses.body}`}>Tax ({data.taxRate}%):</span>
              <span className={fontClasses.body}>
                {data.currency === "USD" ? "$" : data.currency} {taxAmount.toFixed(2)}
              </span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <span className={`font-medium ${fontClasses.body}`}>Discount:</span>
              <span className={fontClasses.body}>
                -{data.currency === "USD" ? "$" : data.currency} {discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          {shippingAmount > 0 && (
            <div className="flex justify-between">
              <span className={`font-medium ${fontClasses.body}`}>Shipping:</span>
              <span className={fontClasses.body}>
                {data.currency === "USD" ? "$" : data.currency} {shippingAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span className={fontClasses.heading}>Total:</span>
            <span className={fontClasses.heading}>
              {data.currency === "USD" ? "$" : data.currency} {data.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notes and Bank Details */}
        {(data.notes || data.bankDetails) && (
          <div className="mt-8 space-y-4">
            {data.notes && (
              <div>
                <h4 className={`font-semibold mb-2 ${fontClasses.heading}`}>Notes:</h4>
                <p className={`text-sm text-muted-foreground whitespace-pre-line ${fontClasses.body}`}>
                  {data.notes}
                </p>
              </div>
            )}
            {data.bankDetails && (
              <div>
                <h4 className={`font-semibold mb-2 ${fontClasses.heading}`}>Payment Details:</h4>
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