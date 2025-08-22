import { Card, CardContent } from "@/components/ui/card"
import { FileText, Building2 } from "lucide-react"
import type { InvoiceTemplateProps } from "./template-types"

export function ProfessionalTemplate({ data, theme }: InvoiceTemplateProps) {
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

  const getColorClasses = () => {
    if (!theme) return { primary: "bg-slate-800 text-white", accent: "text-slate-700", light: "bg-slate-100" }
    
    const colorMap = {
      "violet-blue": { primary: "bg-slate-800 text-white", accent: "text-violet-700", light: "bg-violet-50" },
      "emerald-teal": { primary: "bg-slate-800 text-white", accent: "text-emerald-700", light: "bg-emerald-50" },
      "rose-pink": { primary: "bg-slate-800 text-white", accent: "text-rose-700", light: "bg-rose-50" },
      "orange-amber": { primary: "bg-slate-800 text-white", accent: "text-orange-700", light: "bg-orange-50" },
      "indigo-purple": { primary: "bg-slate-800 text-white", accent: "text-indigo-700", light: "bg-indigo-50" },
      "premium-dark": { primary: "bg-gray-900 text-lime-400", accent: "text-lime-400", light: "bg-gray-800" },
    }
    
    return colorMap[theme.colorScheme] || { primary: "bg-slate-800 text-white", accent: "text-slate-700", light: "bg-slate-100" }
  }

  const colorClasses = getColorClasses()

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardContent className="p-0">
        {/* Corporate Header */}
        <div className={`${colorClasses.primary} px-8 py-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {data.logo ? (
                <img
                  src={data.logo || "/placeholder.svg"}
                  alt="Company Logo"
                  className="h-12 w-auto max-w-[120px] object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <Building2 className="h-12 w-12" />
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-wide">INVOICE</h1>
                <p className="text-sm opacity-90">Business Document</p>
              </div>
            </div>
            {data.invoiceNumber && (
              <div className="text-right">
                <div className="text-xs opacity-75">INVOICE NO.</div>
                <div className="text-xl font-bold tracking-wider">#{data.invoiceNumber}</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Document Details Bar */}
          <div className={`grid grid-cols-3 gap-4 p-4 ${colorClasses.light} rounded-lg`}>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Issue Date</div>
              <div className="font-bold text-gray-900">{formatDate(data.invoiceDate)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Due Date</div>
              <div className="font-bold text-gray-900">{data.dueDate ? formatDate(data.dueDate) : "Upon Receipt"}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Currency</div>
              <div className="font-bold text-gray-900">{data.currency}</div>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-4">
                <div className={`w-1 h-6 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full mr-3`}></div>
                <h3 className="text-lg font-bold text-gray-900">Service Provider</h3>
              </div>
              <div className="ml-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {data.companyDetails || "Your Company Name\\nAddress Line 1\\nCity, State ZIP\\nCountry\\nPhone & Email"}
              </div>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <div className={`w-1 h-6 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full mr-3`}></div>
                <h3 className="text-lg font-bold text-gray-900">Bill To</h3>
              </div>
              <div className="ml-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {data.billTo || "Client Company Name\\nContact Person\\nAddress Line 1\\nCity, State ZIP\\nCountry"}
              </div>
            </div>
          </div>

          {/* Professional Services Table */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Services</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-300">
                <div className="grid grid-cols-6 gap-4 p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  <div className="col-span-3">Service Description</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-center">Unit Price</div>
                  <div className="text-center">Total Amount</div>
                </div>
              </div>
              {/* Table Body */}
              {data.lineItems.map((item, index) => (
                <div key={item.id} className={`grid grid-cols-6 gap-4 p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200 last:border-b-0`}>
                  <div className="col-span-3 text-sm font-medium text-gray-900">
                    {item.description || "Professional Service"}
                  </div>
                  <div className="text-center text-sm text-gray-700">{item.quantity}</div>
                  <div className="text-center text-sm text-gray-700">
                    {data.currency === "USD" ? "$" : data.currency} {Number.parseFloat(item.unitCost || "0").toFixed(2)}
                  </div>
                  <div className="text-center text-sm font-semibold text-gray-900">
                    {data.currency === "USD" ? "$" : data.currency} {item.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                  <h4 className="font-bold text-gray-900">Financial Summary</h4>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Subtotal:</span>
                    <span className="text-gray-900">{data.currency === "USD" ? "$" : data.currency} {data.subtotal.toFixed(2)}</span>
                  </div>
                  {Number.parseFloat(data.taxRate) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Tax ({data.taxRate}%):</span>
                      <span className="text-gray-900">{data.currency === "USD" ? "$" : data.currency} {taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Discount:</span>
                      <span className="text-green-600">-{data.currency === "USD" ? "$" : data.currency} {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {shippingAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Shipping:</span>
                      <span className="text-gray-900">{data.currency === "USD" ? "$" : data.currency} {shippingAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={`flex justify-between text-lg font-bold pt-4 border-t border-gray-300 ${colorClasses.accent}`}>
                    <span>Total Amount Due:</span>
                    <span>{data.currency === "USD" ? "$" : data.currency} {data.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Payment Information */}
          {(data.notes || data.bankDetails) && (
            <div className="space-y-6 pt-6 border-t border-gray-300">
              {data.bankDetails && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <div className={`w-1 h-5 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full mr-2`}></div>
                    Payment Instructions
                  </h4>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {data.bankDetails}
                    </p>
                  </div>
                </div>
              )}
              {data.notes && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <div className={`w-1 h-5 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full mr-2`}></div>
                    Terms & Conditions
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                    {data.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}