import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import type { InvoiceTemplateProps } from "./template-types"

export function ModernTemplate({ data, theme }: InvoiceTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "2-digit",
    })
  }

  const taxAmount = (data.subtotal * (Number.parseFloat(data.taxRate) || 0)) / 100
  const discountAmount = Number.parseFloat(data.discount) || 0
  const shippingAmount = Number.parseFloat(data.shippingFee) || 0

  const getColorClasses = () => {
    if (!theme) return { primary: "bg-slate-900 text-white", secondary: "bg-slate-50", accent: "text-slate-600" }
    
    const colorMap = {
      "violet-blue": { primary: "bg-violet-600 text-white", secondary: "bg-violet-50", accent: "text-violet-600" },
      "emerald-teal": { primary: "bg-emerald-600 text-white", secondary: "bg-emerald-50", accent: "text-emerald-600" },
      "rose-pink": { primary: "bg-rose-600 text-white", secondary: "bg-rose-50", accent: "text-rose-600" },
      "orange-amber": { primary: "bg-orange-600 text-white", secondary: "bg-orange-50", accent: "text-orange-600" },
      "indigo-purple": { primary: "bg-indigo-600 text-white", secondary: "bg-indigo-50", accent: "text-indigo-600" },
    }
    
    return colorMap[theme.colorScheme] || { primary: "bg-slate-900 text-white", secondary: "bg-slate-50", accent: "text-slate-600" }
  }

  const colorClasses = getColorClasses()

  return (
    <Card className="w-full max-w-2xl overflow-hidden">
      {/* Header Section with Color */}
      <div className={`${colorClasses.primary} p-8`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {data.logo ? (
              <img
                src={data.logo || "/placeholder.svg"}
                alt="Company Logo"
                className="h-10 w-auto max-w-[100px] object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <FileText className="h-10 w-10" />
            )}
            <div>
              <h2 className="text-3xl font-bold tracking-wider">INVOICE</h2>
              <p className="text-sm opacity-90">Professional Invoice</p>
            </div>
          </div>
          {data.invoiceNumber && (
            <div className="text-right">
              <div className="text-2xl font-bold">#{data.invoiceNumber}</div>
              <div className="text-sm opacity-90">Invoice Number</div>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-8 space-y-8">
        {/* Invoice Details Row */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Bill From</h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                {data.companyDetails || "Your Company Name\\nAddress Line 1\\nCity, State ZIP\\nCountry"}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Bill To</h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                {data.billTo || "Client Name\\nAddress Line 1\\nCity, State ZIP\\nCountry"}
              </div>
            </div>
          </div>
        </div>

        {/* Date and Details */}
        <div className={`grid grid-cols-3 gap-6 p-6 ${colorClasses.secondary} rounded-lg`}>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Invoice Date</div>
            <div className="font-semibold">{formatDate(data.invoiceDate)}</div>
          </div>
          {data.dueDate && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Due Date</div>
              <div className="font-semibold">{formatDate(data.dueDate)}</div>
            </div>
          )}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Currency</div>
            <div className="font-semibold">{data.currency}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Items & Services</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className={`grid grid-cols-5 gap-4 p-4 ${colorClasses.secondary} font-semibold text-sm`}>
              <div className="col-span-2">Description</div>
              <div className="text-center">Qty</div>
              <div className="text-center">Rate</div>
              <div className="text-center">Amount</div>
            </div>
            {data.lineItems.map((item, index) => (
              <div key={item.id} className={`grid grid-cols-5 gap-4 p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-t border-gray-200`}>
                <div className="col-span-2 font-medium">{item.description || "Service/Product"}</div>
                <div className="text-center">{item.quantity}</div>
                <div className="text-center">{data.currency === "USD" ? "$" : data.currency}{Number.parseFloat(item.unitCost || "0").toFixed(2)}</div>
                <div className="text-center font-semibold">{data.currency === "USD" ? "$" : data.currency}{item.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className="space-y-3 p-6 border border-gray-200 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Subtotal:</span>
                <span>{data.currency === "USD" ? "$" : data.currency} {data.subtotal.toFixed(2)}</span>
              </div>
              {Number.parseFloat(data.taxRate) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Tax ({data.taxRate}%):</span>
                  <span>{data.currency === "USD" ? "$" : data.currency} {taxAmount.toFixed(2)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Discount:</span>
                  <span className="text-green-600">-{data.currency === "USD" ? "$" : data.currency} {discountAmount.toFixed(2)}</span>
                </div>
              )}
              {shippingAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Shipping:</span>
                  <span>{data.currency === "USD" ? "$" : data.currency} {shippingAmount.toFixed(2)}</span>
                </div>
              )}
              <div className={`flex justify-between text-lg font-bold pt-3 border-t ${colorClasses.accent}`}>
                <span>Total:</span>
                <span>{data.currency === "USD" ? "$" : data.currency} {data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Payment Details */}
        {(data.notes || data.bankDetails) && (
          <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-200">
            {data.notes && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {data.notes}
                </p>
              </div>
            )}
            {data.bankDetails && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Payment Information</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
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